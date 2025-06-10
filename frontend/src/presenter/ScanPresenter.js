import ProfileModel from "../model/ProfileModel";
import axios from "axios";

export default class ScanPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.profileModel = new ProfileModel();

    this.view.onFileChange = this.onFileChange.bind(this);
    this.view.openCamera = this.openCamera.bind(this);
    this.view.capturePhoto = this.capturePhoto.bind(this);
    this.view.closeCamera = this.closeCamera.bind(this);
    this.view.submitImages = this.submitImages.bind(this);
    this.view.goToRecipe = this.goToRecipe.bind(this);
    this.view.closeModal = this.closeModal.bind(this);
    this.view.deleteRecentSearch = this.deleteRecentSearch.bind(this);

    this.cachedRecipeData = [];
    // threshold for fuzzy matching: 0.6 (adjustable)
    this.SIMILARITY_THRESHOLD = 0.6;
  }

  // … metode onFileChange, openCamera, capturePhoto, closeCamera, stopCamera, dataURLtoFile … //
  // Saya omit di sini untuk ringkas, karena inti error biasanya pada bagian submitImages dan stripExtension.

  onFileChange(event, idx) {
    const file = event.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    this.model.setImage(idx, file, preview);
    this.model.setShowCamera(idx, false);
    this.stopCamera();
    this.view.update();
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
      alert("Tidak dapat mengakses kamera. Mohon izinkan akses kamera.");
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

  /**
   * Hapus ekstensi .jpg/.jpeg/.png, lowercase, ganti spasi/underscore jadi dash,
   * hapus karakter selain a-z0-9- , lalu gabungkan dash ganda jadi satu.
   */
  stripExtensionAndNormalize(name) {
    if (!name) return "";
    const withoutExt = name.replace(/\.(jpe?g|png)$/i, "");
    return withoutExt
      .trim()
      .toLowerCase()
      .replace(/[_\s]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }

  // … bagian import, constructor, etc. sama seperti sebelumnya …

  // Utility to naturalize recipe names by replacing dashes with spaces and capitalizing words
  naturalizeName(name) {
    if (!name) return "";
    // Remove trailing numbers and spaces
    let cleaned = name.replace(/\s*\d+$/, "");
    return cleaned.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  async submitImages() {
    this.model.setLoading(true);
    this.view.update();
    console.log("[DEBUG] Loading set to true");
    const imagesToSubmit = this.model.images.filter((img) => img.file);
    if (!imagesToSubmit.length) {
      alert("Silakan upload atau capture minimal satu gambar!");
      this.model.setLoading(false);
      this.view.update();
      console.log("[DEBUG] Loading set to false due to no images");
      return;
    }

    // Kirim ke backend CNN
    const formData = new FormData();
    formData.append("file", imagesToSubmit[0].file);

    try {
      const response = await axios.post("http://localhost:3000/api/ml/findSimilarImages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data;
      console.log("Raw CNN data:", data);

      // Use raw CNN data results directly for recommendations
      const recommendations = (data.results || []).map((rec, index) => {
        let imageName = rec.filename || "";
        imageName = imageName.replace(/\.(jpe?g|png)$/i, "");
        imageName = imageName.toLowerCase().replace(/\s+/g, "-");
        const naturalName = this.naturalizeName(imageName);

        return {
          id: `temp-id-${index}`, // assign unique non-empty id
          image_name: imageName,
          name: naturalName,
          image: imageName,
          duration: 0,
          carbon: rec.total_recipe_carbon || 0,
          rating: 0,
          instructions_cleaned: rec.instructions_cleaned || "",
          cleaned_ingredients: rec.cleaned_ingredients || [],
          url: rec.url || "",
        };
      });

      console.log("Mapped Recommendations:", recommendations);
      recommendations.forEach((rec, idx) => {
        console.log(`Recommendation[${idx}]: id=${rec.id}, name=${rec.name}`);
      });

      this.model.setLoading(false);
      this.view.update();
      this.model.setRecommendations(recommendations);
      this.view.update();
    } catch (error) {
      console.error("Error di submitImages():", error);
      alert("Gagal mendapatkan rekomendasi: " + error.message);
      this.model.setLoading(false);
      this.view.update();
    }
  }

  async goToRecipe(recipe) {
    try {
      console.log("ScanPresenter.goToRecipe called with recipe:", recipe);
      if (!recipe.id) {
        alert("Recipe ID not found or unavailable.");
        return;
      }
      // Handle temporary IDs gracefully
      if (recipe.id.startsWith("temp-id-")) {
        this.model.setSelectedRecipe({
          id: recipe.id,
          name: recipe.name,
          image: recipe.image,
          instructions_cleaned: recipe.instructions_cleaned || "",
          cleaned_ingredients: recipe.cleaned_ingredients || [],
          total_recipe_carbon: recipe.carbon || 0,
          duration: recipe.duration || 0,
          rating: recipe.rating || 0,
          url: recipe.url || "",
        });
        this.model.setShowModal(true);
        this.view.update();
        return;
      }

      const response = await axios.get(`http://localhost:3000/api/recipes/${recipe.id}`);
      const data = response.data;
      console.log("Get recipe details:", data);

      // Convert instructions and ingredients to strings if they are arrays
      let instructions = data.instructions_cleaned || data.Instructions_Cleaned || data.instructions || "";
      if (Array.isArray(instructions)) {
        instructions = instructions.join(". ");
      }

      let ingredients = data.cleaned_ingredients || data.Cleaned_Ingredients || data.ingredients || [];
      if (Array.isArray(ingredients)) {
        ingredients = ingredients.join(", ");
      }

      const mappedData = {
        ...data,
        name: data.name || data.title || "",
        image: data.image || data.image_name || "",
        instructions_cleaned: instructions,
        cleaned_ingredients: ingredients,
        total_recipe_carbon: data.total_recipe_carbon || 0,
        duration: data.duration || 0,
        rating: data.rating || 0,
      };
      this.model.setSelectedRecipe(mappedData);
      this.model.setShowModal(true);
      this.view.update();
    } catch (err) {
      console.error("Error di goToRecipe():", err);
      alert("Error mengambil detail resep: " + err.message);
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

  handleCook(recipeId) {
    console.log("ScanPresenter.handleCook called with id:", recipeId);
    try {
      // Update backend via ProfileModel
      this.profileModel.addCook(recipeId);
      // Update local state for immediate UI feedback
      this.model.addCook(recipeId);
      this.view.update();
    } catch (error) {
      console.error("Error adding cook in ScanPresenter:", error);
      alert("Gagal menambahkan cooked recipe: " + error.message);
    }
  }

  handleFavorite(recipeId) {
    console.log("ScanPresenter.handleFavorite called with id:", recipeId);
    try {
      // Update backend via ProfileModel
      this.profileModel.addFavorite(recipeId);
      // Update local state for immediate UI feedback
      this.model.addFavorite(recipeId);
      this.view.update();
    } catch (error) {
      console.error("Error adding favorite in ScanPresenter:", error);
      alert("Gagal menambahkan favorite recipe: " + error.message);
    }
  }
}
