<template>
  <div class="scan-ingredients">
    <Sidebar />

    <main class="main-content">
      <div class="section-header">
        <h2 class="section-title">Please Scan your Food</h2>
        <button class="scan-btn-bar" @click="inputIngredients">Input</button>
      </div>

      <div class="scan-section">
        <!-- IMAGE PREVIEW / UPLOAD -->
        <div class="image-card">
          <img v-if="images[0]?.preview" :src="images[0].preview" alt="Uploaded" class="preview-img" />

          <div v-else class="placeholder">
            <i class="fa-solid fa-file-image fa-3x"></i>
            <p>No image chosen</p>
          </div>
        </div>

        <!-- CHOOSE / CHANGE BUTTON -->
        <div class="image-controls">
          <label class="upload-btn">
            <input type="file" accept="image/*" class="hidden-input" @change="onFileChange($event, 0)" />
            <span v-if="!images[0]?.preview"> <i class="fa-solid fa-file-image"></i> Choose Image </span>
            <span v-else> <i class="fa-solid fa-repeat"></i> Change Image </span>
          </label>
        </div>

        <!-- SUBMIT -->
        <button class="submit-btn" @click="submitImages">
          <i class="fa-solid fa-paper-plane"></i>
          Submit
        </button>
      </div>

      <!-- Recommendations + Right Section -->
      <section class="combined-section">
        <div class="recommendations-wrapper">
      <section class="recommendations">
        <h3>Recommendations</h3>
        <div class="total-carbon" v-if="recommendations.length > 0" style="margin-bottom: 1rem; font-weight: 600; color: #2e7d32;">
          Total Carbon Footprint: {{ totalCarbon.toFixed(2) }}
        </div>
        <div class="recipe-grid">
          <!-- LOADING STATE -->
          <div v-if="loading" class="loading-container">
            <div class="spinner"></div>
            <div>Loading recommendations, please wait...</div>
          </div>

              <!-- EMPTY STATE -->
              <div v-else-if="recommendations.length === 0">No recommendations yet.</div>

              <!-- HAS DATA -->
              <div v-else v-for="(rec, index) in recommendations" :key="index" class="card-link">
                <RecipeCard
                  :recipess_id="rec.id || rec._id || ''"
                  :image="normalizeImagePath(rec.image || rec.Image_Name) || 'default'"
                  :name="rec.name || rec.title || rec.title_cleaned || 'No Title'"
                  :duration="rec.duration || 15"
                  :totalRecipeCarbon="rec.carbon || rec.carbon_score || rec.total_recipe_carbon || 0"
                  :ingredients="rec.cleaned_ingredients || []"
                  :instructions="rec.instructions_cleaned || ''"
                  :favorites="model.favorites"
                  :cooks="model.cooks"
                  @open="
                    () => {
                      if (rec.id) goToRecipe(rec);
                    }
                  "
                  @cook="handleCook"
                  @favorite="handleFavorite"
                  :class="{ 'disabled-card': !rec.id }"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>

    <!-- Recipe Modal -->
    <RecipeModal v-if="showModal" :key="selectedRecipe ? selectedRecipe.id : 'modal'" :food="selectedRecipe" @close="closeModal" />
  </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard.vue";
import Sidebar from "../components/Sidebar.vue";
import RecipeModal from "../components/RecipeModal.vue";
import ScanModel from "../model/ScanModel";
import ScanPresenter from "../presenter/ScanPresenter";

export default {
  name: "ScanIngredients",
  components: { RecipeCard, Sidebar, RecipeModal },
  data() {
    return {
      model: new ScanModel(),
      presenter: null,
      images: [],
      recommendations: [],
      loading: false,
      showModal: false,
      selectedRecipe: null,
      recentSearches: [],
      totalCarbon: 0,
    };
  },
  created() {
    this.presenter = new ScanPresenter(this.model, this);
    // sync initial state
    this.images = this.model.images;
    this.recommendations = this.model.recommendations;
    this.totalCarbon = this.model.totalCarbon;
    console.log("Initial recommendations:", this.recommendations);
    this.showModal = this.model.showModal;
    this.selectedRecipe = this.model.selectedRecipe;
    this.recentSearches = this.model.recentSearches;
  },
  methods: {
    normalizeImagePath(img) {
      if (!img) return "";
      if (img.startsWith("/foodImages/")) {
        img = img.slice("/foodImages/".length);
      }
      return img.toLowerCase().replace(/\s+/g, "-");
    },
    update() {
      this.images = this.model.images;
      this.recommendations = this.model.recommendations;
      this.totalCarbon = this.model.totalCarbon;
      this.loading = this.model.loading;
      this.showModal = this.model.showModal;
      this.selectedRecipe = this.model.selectedRecipe ? JSON.parse(JSON.stringify(this.model.selectedRecipe)) : null;
      this.recentSearches = this.model.recentSearches;
      this.$forceUpdate();
    },
    onFileChange(e, idx) {
      this.presenter.onFileChange(e, idx);
    },
    openCamera(idx) {
      this.presenter.openCamera(idx);
    },
    capturePhoto(idx) {
      this.presenter.capturePhoto(idx);
    },
    closeCamera(idx) {
      this.presenter.closeCamera(idx);
    },
    submitImages() {
      this.presenter.submitImages();
    },
    goToRecipe(rec) {
      console.log("ScanView.goToRecipe called with rec:", rec);
      this.presenter.goToRecipe(rec);
    },
    closeModal() {
      this.presenter.closeModal();
    },
    deleteRecentSearch(idx) {
      this.presenter.deleteRecentSearch(idx);
    },
    handleCook(recipess_id) {
      console.log("handleCook called with id:", recipess_id);
      // Implement cook logic here, e.g., call presenter method
      this.presenter.handleCook(recipess_id);
    },
    handleFavorite(recipess_id) {
      console.log("handleFavorite called with id:", recipess_id);
      // Implement favorite logic here, e.g., call presenter method
      this.presenter.handleFavorite(recipess_id);
    },
    setVideoStream(idx, str) {
      /* existing code */
    },
    captureVideoFrame(idx) {
      /* existing code */
    },
    inputIngredients() {
      this.$router.push("/input-ingredients");
    },
  },
  beforeUnmount() {
    this.presenter.stopCamera();
  },
};
</script>

<style scoped>
/* Loading Spinner */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #b2ddb8;
  border-top: 4px solid #39914a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Layout */
.scan-ingredients {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f8f8;
}
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-left: 270px;
}

/* Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}
.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2e7d32;
  margin: 0;
  flex: 1;
}
.scan-btn-bar {
 align-self: center;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 2.5rem;
  border-radius: 18px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 1.5rem;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}
.scan-btn-bar:hover {
  background: #388e3c;
}

/* Scan Section */
.scan-section {
  width: 100%;
  max-width: 700px;
  margin: 0 auto 1rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  box-sizing: border-box;
}

/* Image Grid – single card */
.image-grid {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  width: 100%;
  max-width: 1000px;
}

.image-card {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16/9;
  border: 1px solid #ccc;
  border-radius: 18px;
  overflow: hidden;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  
  box-shadow: 0 2px 6px rgba(80,120,80,0.03);
}
.image-card:hover {
  border-color: #73b06f;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== IMAGE CONTROLS (Choose / Change) ===== */


.upload-btn {
  display: inline-flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #73b06f;       /* → tambahkan ini untuk border yang terlihat */
  color: #110101;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.upload-btn:hover {
  background: #f0f9f3;
}
/* Choose File Block */
.choose-block {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.choose-file-label {
  cursor: pointer;
}
.choose-file-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  color: #2e7d32;
  border: 1px solid #04702a;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: background 0.15s;
}
.choose-file-btn:hover {
  background: #2e7d32;
  color: #fff;
}

.change-block {
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  background: #fafafa;
}

/* Hidden File Input */
.hidden-input {
  display: none;
}

/* Submit Button */
.submit-btn {
  align-self: center;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 2.5rem;
  border-radius: 18px;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}
.submit-btn:hover {
  opacity: 0.9;
}

/* Recommendations & Recipe Grid – unchanged */
.combined-section {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.recommendations-wrapper {
  flex: 3;
}
.recommendations {
  background: #fff;
  padding: 0.5rem 1rem 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .image-grid {
    max-width: 670px;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 1100px) {
  .main-content {
    margin-left: 0 !important;
    margin-top: 75px;
    padding: 1rem;
  }
  .input-ingredients {
    flex-direction: column;
  }
   .scan-btn-bar {
    width: 90%;
    margin-right: 30px;
    margin-left: 30px;
  }

  .submit-btn {
    width: 94%;
  }
  .scan-ingredients {
    flex-direction: column;
  }
}

@media (max-width: 900px) {
  .recipe-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 700px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }
  .section-title {
    font-size: 1.22rem;
    text-align: center;
  }
  .scan-btn-bar {
    width: 90%;
    justify-content: center;
    font-size: 1.12rem;
  }
  .main-content {
    padding: 0.5rem;
  }
  .scan-section {
    padding: 0.5rem;
    gap: 1rem;
    border-radius: 10px;
  }
  .image-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.1rem;
    max-width: 360px;
  }
  .recipe-grid {
    grid-template-columns: 1fr !important;
    gap: 1.1rem;
  }
  .image-card {
    width: 120px;
    height: 130px;
    border-radius: 10px;
  }
  .choose-file-btn {
    padding: 0.4rem 0.7rem;
    font-size: 0.88rem;
    border-radius: 8px;
    margin-top: 32%;
  }
 
}

</style>
