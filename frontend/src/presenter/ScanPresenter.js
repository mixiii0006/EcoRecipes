export default class ScanPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind view event handlers to presenter methods
    this.view.onFileChange = this.onFileChange.bind(this);
    this.view.openCamera = this.openCamera.bind(this);
    this.view.capturePhoto = this.capturePhoto.bind(this);
    this.view.closeCamera = this.closeCamera.bind(this);
    this.view.submitImages = this.submitImages.bind(this);
    this.view.goToRecipe = this.goToRecipe.bind(this);
    this.view.closeModal = this.closeModal.bind(this);
    this.view.deleteRecentSearch = this.deleteRecentSearch.bind(this);
  }

  onFileChange(event, idx) {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      this.model.setImage(idx, file, preview);
      this.model.setShowCamera(idx, false);
      this.stopCamera();
      this.view.update();
    }
  }

  async openCamera(idx) {
    if (this.model.currentCameraIdx !== null && this.model.currentCameraIdx !== idx) {
      this.closeCamera(this.model.currentCameraIdx);
    }
    this.model.setCurrentCameraIdx(idx);
    this.model.setShowCamera(idx, true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.model.setCameraStream(stream);
      this.view.setVideoStream(idx, stream);
      this.view.update();
    } catch (err) {
      alert("Tidak dapat mengakses kamera. Izinkan kamera di browser Anda.");
      this.model.setShowCamera(idx, false);
      this.view.update();
    }
  }

  capturePhoto(idx) {
    const dataUrl = this.view.captureVideoFrame(idx);
    if (!dataUrl) return;
    const file = this.dataURLtoFile(dataUrl, `capture-${Date.now()}.png`);
    this.model.setImage(idx, file, dataUrl);
    this.model.setShowCamera(idx, false);
    this.stopCamera();
    this.view.update();
  }

  closeCamera(idx) {
    this.model.setShowCamera(idx, false);
    this.stopCamera();
    this.view.update();
  }

  stopCamera() {
    if (this.model.cameraStream) {
      this.model.cameraStream.getTracks().forEach((track) => track.stop());
      this.model.setCameraStream(null);
      this.model.setCurrentCameraIdx(null);
    }
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async submitImages() {
    const imagesToSubmit = this.model.images.filter((img) => img.file);

    if (imagesToSubmit.length === 0) {
      alert("Please upload or capture at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", imagesToSubmit[0].file);

    try {
      const response = await fetch("http://localhost:3000/api/ml/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to scan image");
      const data = await response.json();

      console.log("Raw response data from backend:", data);

      // Fetch full recipe list from backend and cache it
      const recipeResponse = await fetch("http://localhost:3000/api/recipes?limit=200");
      if (!recipeResponse.ok) throw new Error("Failed to fetch recipes");
      this.cachedRecipeData = await recipeResponse.json();

      // Map ML results to recommendations with matched recipe data
      const recommendations = (data.results || []).map((rec) => {
        // Find matching recipe by filename matching title_cleaned or name (case-insensitive)
        const matchedRecipe = this.cachedRecipeData.find(recipe => {
          const recipeTitle = (recipe.title_cleaned || recipe.name || "").toLowerCase();
          return recipeTitle === rec.filename.toLowerCase();
        });

        if (matchedRecipe) {
          return {
            id: matchedRecipe.id || matchedRecipe._id || '',
            title_cleaned: matchedRecipe.title_cleaned || matchedRecipe.name || '',
            Image_Name: matchedRecipe.image || matchedRecipe.Image_Name || rec.filename,
            duration: matchedRecipe.duration || 0,
            total_recipe_carbon: matchedRecipe.total_recipe_carbon || 0,
            rating: matchedRecipe.rating || 0,
            instructions_cleaned: matchedRecipe.instructions_cleaned || matchedRecipe.Instructions_Cleaned || matchedRecipe.instructions || '',
            cleaned_ingredients: matchedRecipe.cleaned_ingredients || matchedRecipe.Cleaned_Ingredients || matchedRecipe.ingredients || [],
            url: rec.url,
          };
        } else {
          // If no match, fallback to ML data only
          return {
            Image_Name: rec.filename,
            url: rec.url,
            title_cleaned: rec.filename,
            duration: 0,
            total_recipe_carbon: 0,
            rating: 0,
            id: '',
          };
        }
      });

      this.model.setRecommendations(recommendations);
      this.view.update();
      console.log("Scan Recommendations:", recommendations);
    } catch (error) {
      alert("Failed to fetch recommendations.");
    }
  }

  async goToRecipe(recipe) {
    try {
      if (!recipe.title_cleaned && !recipe.name) {
        alert("Recipe name is missing.");
        return;
      }
      // Normalize recipe name by inserting spaces before capital letters (camel case split)
      let rawName = (recipe.title_cleaned || recipe.name).toLowerCase();
      // Replace concatenated words like 'parsleyred' with 'parsley red' if possible
      rawName = rawName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([a-z])([a-z])([A-Z])/g, '$1$2 $3');
      const recipeName = encodeURIComponent(rawName.trim());

      console.log("Fetching recipe with name query:", recipeName);
      const response = await fetch(`http://localhost:3000/api/recipes?name=${recipeName}`);
      if (!response.ok) {
        alert("Failed to fetch recipe details.");
        return;
      }
      const data = await response.json();
      console.log("Received recipe data:", data);

      if (!data || data.length === 0) {
        alert("Recipe not found in database.");
        return;
      }

      const matchedRecipe = data[0]; // Use first matched recipe

      // Map fields to expected names for RecipeModal
      const mappedData = {
        ...matchedRecipe,
        name: matchedRecipe.title_cleaned || matchedRecipe.name,
        image: matchedRecipe.image || matchedRecipe.Image_Name || '',
        Instructions_Cleaned: matchedRecipe.instructions_cleaned || matchedRecipe.Instructions_Cleaned || matchedRecipe.instructions || '',
        Cleaned_Ingredients: matchedRecipe.cleaned_ingredients || matchedRecipe.Cleaned_Ingredients || matchedRecipe.ingredients || [],
        total_recipe_carbon: matchedRecipe.total_recipe_carbon || 0,
        duration: matchedRecipe.duration || 0,
        rating: matchedRecipe.rating || 0,
      };

      console.log("Mapped recipe data for modal:", mappedData);
      this.model.setSelectedRecipe(mappedData);
      this.model.setShowModal(true);
      this.view.update();
    } catch (error) {
      alert("Error fetching recipe details: " + error.message);
    }
  }

  closeModal() {
    this.model.setShowModal(false);
    this.model.setSelectedRecipe(null);
    this.view.update();
  }

  deleteRecentSearch(idx) {
    this.model.deleteRecentSearch(idx);
    this.view.update();
  }
}
