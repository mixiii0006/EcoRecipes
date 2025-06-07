// file: src/presenter/ScanPresenter.js

import stringSimilarity from "string-similarity";

export default class ScanPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.onFileChange = this.onFileChange.bind(this);
    this.view.openCamera = this.openCamera.bind(this);
    this.view.capturePhoto = this.capturePhoto.bind(this);
    this.view.closeCamera = this.closeCamera.bind(this);
    this.view.submitImages = this.submitImages.bind(this);
    this.view.goToRecipe = this.goToRecipe.bind(this);
    this.view.closeModal = this.closeModal.bind(this);
    this.view.deleteRecentSearch = this.deleteRecentSearch.bind(this);

    this.cachedRecipeData = [];
    // threshold untuk fuzzy matching: 0.6 (bisa disesuaikan)
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

  async submitImages() {
    const imagesToSubmit = this.model.images.filter((img) => img.file);
    if (!imagesToSubmit.length) {
      alert("Silakan upload atau capture minimal satu gambar!");
      return;
    }

    // Kirim ke backend CNN
    const formData = new FormData();
    formData.append("file", imagesToSubmit[0].file);

    try {
      const response = await fetch("http://localhost:3000/api/ml/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Scan gagal");
      const data = await response.json();
      console.log("Raw CNN data:", data);

      // Fetch resep list sekali saja
      if (!this.cachedRecipeData.length) {
        const recipeResp = await fetch("http://localhost:3000/api/recipes");
        if (!recipeResp.ok) throw new Error("Gagal fetch recipes");
        this.cachedRecipeData = await recipeResp.json();
      }

      const recommendations = (data.results || []).map((rec) => {
        const recFilenameNorm = this.stripExtensionAndNormalize(rec.filename || "");
        console.log("[DEBUG] normalized CNN filename:", recFilenameNorm);

        // 1) Exact-match image_name
        let matchedRecipe = this.cachedRecipeData.find((recipe) => {
          const imgRaw = recipe.image_name || recipe.Image_Name || "";
          const imgNorm = this.stripExtensionAndNormalize(imgRaw);
          return imgNorm === recFilenameNorm;
        });

      // 2) Exact-match title_cleaned
      if (!matchedRecipe) {
        // Skip this step to only match by image_name
        // matchedRecipe = this.cachedRecipeData.find((recipe) => {
        //   const titleRaw = recipe.title_cleaned || recipe.title || recipe.name || "";
        //   const titleNorm = this.stripExtensionAndNormalize(titleRaw);
        //   return titleNorm === recFilenameNorm;
        // });
      }

      // 3) Partial-keyword matching
      if (!matchedRecipe) {
        // Skip this step to only match by image_name
        // const keywords = recFilenameNorm.split("-");
        // for (const recipe of this.cachedRecipeData) {
        //   const titleRaw = recipe.title_cleaned || recipe.title || recipe.name || "";
        //   const titleNorm = this.stripExtensionAndNormalize(titleRaw);

        //   let count = 0;
        //   keywords.forEach((w) => {
        //     if (w && titleNorm.includes(w)) count++;
        //   });
        //   const ratio = count / keywords.length;
        //   if (ratio >= 0.4) {
        //     matchedRecipe = recipe;
        //     console.log("[DEBUG] match partial-keyword:", recFilenameNorm, "<–> DB:", titleNorm, `(ratio: ${ratio.toFixed(2)})`);
        //     break;
        //   }
        // }
      }

      // 4) Fuzzy matching via title_cleaned
      if (!matchedRecipe) {
        // Skip this step to only match by image_name
        // let bestMatch = null;
        // let highestScore = 0;
        // for (const recipe of this.cachedRecipeData) {
        //   const titleRaw = recipe.title_cleaned || recipe.title || recipe.name || "";
        //   const titleNorm = this.stripExtensionAndNormalize(titleRaw);
        //   if (!titleNorm) continue;

        //   const score = stringSimilarity.compareTwoStrings(recFilenameNorm, titleNorm);
        //   if (score > highestScore) {
        //     highestScore = score;
        //     bestMatch = recipe;
        //   }
        // }
        // if (bestMatch && highestScore >= this.SIMILARITY_THRESHOLD) {
        //   matchedRecipe = bestMatch;
        //   console.log(`[DEBUG] match fuzzy: "${recFilenameNorm}" → "${this.stripExtensionAndNormalize(bestMatch.title_cleaned || bestMatch.title || bestMatch.name || "")}" (score: ${highestScore.toFixed(3)})`);
        // }
      }

        // 5) Buat objek rekomendasi
        if (matchedRecipe) {
          let imageName = matchedRecipe.image_name || matchedRecipe.Image_Name || rec.filename || "";
          imageName = imageName.replace(/\.(jpe?g|png)$/i, "");
          imageName = imageName.toLowerCase().replace(/\s+/g, "-");

          return {
            id: matchedRecipe._id || matchedRecipe.id || "",
            image_name: imageName,
            name: matchedRecipe.title_cleaned || matchedRecipe.name || imageName,
            image: imageName,
            duration: matchedRecipe.duration || 0,
            carbon: matchedRecipe.total_recipe_carbon || 0,
            rating: matchedRecipe.rating || 0,
            instructions_cleaned: matchedRecipe.instructions_cleaned || matchedRecipe.Instructions_Cleaned || matchedRecipe.instructions || "",
            cleaned_ingredients: matchedRecipe.cleaned_ingredients || matchedRecipe.Cleaned_Ingredients || matchedRecipe.ingredients || [],
            url: rec.url,
          };
        } else {
          console.warn("[DEBUG] Tidak ditemukan recipe untuk:", rec.filename);
          let imageName = rec.filename?.replace(/\.(jpe?g|png)$/i, "") || "";
          const imageNorm = imageName.toLowerCase().trim().replace(/\s+/g, "-");
          // fallback: assign first recipe id to avoid empty id
          const fallbackId = this.cachedRecipeData.length > 0 ? (this.cachedRecipeData[0]._id || this.cachedRecipeData[0].id || "") : "";
          return {
            id: fallbackId,
            name: imageNorm,
            image: imageNorm,
            url: rec.url,
            duration: 0,
            carbon: 0,
            rating: 0,
            instructions_cleaned: "",
            cleaned_ingredients: [],
          };
        }
      });

      console.log("Mapped Recommendations:", recommendations);
      recommendations.forEach((rec, idx) => {
        console.log(`Recommendation[${idx}]: id=${rec.id}, name=${rec.name}`);
      });

      // Check for duplicate IDs
      const idSet = new Set();
      const duplicates = [];
      recommendations.forEach((rec) => {
        if (idSet.has(rec.id)) {
          duplicates.push(rec.id);
        } else {
          idSet.add(rec.id);
        }
      });
      if (duplicates.length > 0) {
        console.warn("Duplicate recommendation IDs found:", duplicates);
      }

      this.model.setRecommendations(recommendations);
      this.view.update();
    } catch (error) {
      console.error("Error di submitImages():", error);
      alert("Gagal mendapatkan rekomendasi: " + error.message);
    }
  }

  async goToRecipe(recipe) {
    try {
      console.log("ScanPresenter.goToRecipe called with recipe:", recipe);
      const recipeId = recipe.id || recipe.recipess_id || recipe._id;
      if (!recipeId) {
        alert("Recipe ID is missing.");
        return;
      }
      console.log("Mengambil detail recipe ID:", recipeId);

      // Use cachedRecipeData to find recipeData
      const recipeData = this.cachedRecipeData.find((r) => r._id === recipeId || r.id === recipeId || r.recipess_id === recipeId);
      if (!recipeData) {
        alert("Detail resep tidak ditemukan di database.");
        return;
      }

      const resp = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
      if (!resp.ok) {
        alert("Gagal mengambil detail resep.");
        return;
      }
      const detail = await resp.json();

      console.log("Fetched detail for recipeId:", recipeId, detail);

      // Mapping data untuk RecipeModal
      const mappedData = {
        ...detail,
        name: detail.title || detail.name || "",
        image: (detail.image || "").replace(/^\/foodImages\//, "").replace(/\.(jpe?g|png)$/i, ""),
        instructions_cleaned: detail.instructions_cleaned || detail.Instructions_Cleaned || detail.instructions || "",
        cleaned_ingredients: detail.cleaned_ingredients || detail.Cleaned_Ingredients || detail.ingredients || [],
        total_recipe_carbon: detail.total_recipe_carbon || 0,
        duration: detail.duration || 0,
        rating: detail.rating || 0,
      };

      console.log("Mapped recipe untuk modal:", mappedData);
      // Clone object to force Vue reactivity
      const clonedData = JSON.parse(JSON.stringify(mappedData));
      this.model.setSelectedRecipe(clonedData);
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
}
