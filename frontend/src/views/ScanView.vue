<template>
  <div class="scan-ingredients">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Section Header Baris: Judul kiri, Tombol kanan -->
      <div class="section-header">
        <h2 class="section-title">Please Scan your Food</h2>
        <button class="scan-btn-bar" @click="inputIngredients">Input</button>
      </div>

      <!-- Scan Image Section -->
      <div class="scan-section">
        <div class="image-grid">
          <div v-for="(img, idx) in images" :key="idx" class="image-card">
            <!-- Image Preview -->
            <img v-if="img.preview" :src="img.preview" alt="Uploaded" class="preview-img" />

            <!-- File Choose / Camera Trigger -->
            <div v-else class="choose-block">
              <label class="choose-file-label">
                <span class="choose-file-btn">
                  <i class="fa-solid fa-file-image"></i>
                  Choose File
                </span>
                <input type="file" accept="image/*" class="hidden-input" @change="onFileChange($event, idx)" />
              </label>
              <button class="open-camera-btn" @click="openCamera(idx)">
                <i class="fa-solid fa-camera"></i> Open Camera
              </button>
            </div>

            <!-- Camera Preview -->
            <div v-if="img.showCamera" class="camera-modal">
              <video :ref="'videoEl' + idx" autoplay playsinline class="camera-video"></video>
              <button class="capture-btn" @click="capturePhoto(idx)">
                <i class="fa-solid fa-circle"></i> Ambil Gambar
              </button>
              <button class="close-camera-btn" @click="closeCamera(idx)">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Change File -->
            <label v-if="img.preview" class="change-btn-label">
              <span class="change-btn">Change</span>
              <input type="file" accept="image/*" class="hidden-input" @change="onFileChange($event, idx)" />
            </label>
          </div>
        </div>

        <button class="submit-btn" @click="submitImages">Submit</button>
      </div>

      <!-- Recommendations + Right Section -->
      <section class="combined-section">
        <div class="recommendations-wrapper">
          <section class="recommendations">
            <h3>Recommendations</h3>
            <div class="recipe-grid">
              <!-- LOADING STATE -->
              <div v-if="loading" class="loading-container">
                <div class="spinner"></div>
                <div>Loading recommendations, please wait...</div>
              </div>

              <!-- EMPTY STATE -->
              <div v-else-if="recommendations.length === 0">
                No recommendations yet.
              </div>

              <!-- HAS DATA -->
              <div v-else v-for="(rec, index) in recommendations" :key="index" class="card-link">
                <RecipeCard
                  :recipess_id="rec.id || rec._id || ''"
                  :image="normalizeImagePath(rec.image || rec.Image_Name) || 'default'"
                  :name="rec.name || rec.title || rec.title_cleaned || 'No Title'"
                  :duration="rec.duration || 15"
                  :carbon="rec.carbon || rec.carbon_score || rec.total_recipe_carbon || 25"
                  :ingredients="rec.cleaned_ingredients || []"
                  :instructions="rec.instructions_cleaned || ''"
                  @open="() => { if (rec.id) goToRecipe(rec); }"
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
    };
  },
  created() {
    this.presenter = new ScanPresenter(this.model, this);
    // sync initial state
    this.images = this.model.images;
    this.recommendations = this.model.recommendations;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.scan-ingredients {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f8f8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  background: transparent;
}

.section-title {
  font-family: "Poppins", "Segoe UI", sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2e7d32;
  margin: 0;
  letter-spacing: 0.01em;
  line-height: 1.2;
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

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-left: 270px;
}

.scan-section {
  width: 100%;
  padding: 1.5rem;
  margin-inline: auto;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
  align-items: center;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  justify-items: center;
}

.image-card {
  width: 180px;
  height: 220px;
  border: 1.7px solid #ccc;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 6px rgba(80, 120, 80, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: border 0.2s;
}

.image-card:hover {
  border-color: #73b06f;
}

.hidden-input {
  display: none;
}

.choose-file-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.choose-file-btn,
.open-camera-btn {
  color: black;
  padding: 0.5rem 0.5rem;
  border-radius: 10px;
  border-color: #04702a;
  font-size: 1rem;
  font-weight: 400;
  transition: background 0.15s;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(80, 120, 80, 0.09);
  border: 1px solid #466d44;
}

.choose-file-btn:hover,
.open-camera-btn:hover {
  background: #2e7d32;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-btn-label {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  text-align: center;
  cursor: pointer;
}

.change-btn {
  background: rgba(55, 140, 80, 0.92);
  color: #fff;
  padding: 0.28rem 1.05rem;
  border-radius: 8px;
  font-size: 0.98rem;
  font-weight: 500;
  transition: background 0.15s;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(80, 120, 80, 0.11);
}

.change-btn:hover {
  background: #145425;
}

.camera-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.96);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 18px;
}

.camera-video {
  width: 100%;
  height: 140px;
  border-radius: 8px;
  background: #111;
  object-fit: cover;
}

.capture-btn {
  margin: 0.7rem 0 0.2rem 0;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 0.4rem 1.2rem;
  font-size: 1.1rem;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.capture-btn i {
  font-size: 1.4em;
  margin-right: 7px;
}

.close-camera-btn {
  background: #f6f6f6;
  color: #d11a1a;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  padding: 0.1rem 0.7rem;
  cursor: pointer;
  margin-top: 0.3rem;
  margin-bottom: 0.1rem;
}

.choose-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  justify-content: center;
}

.submit-btn {
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

.combined-section {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  flex-wrap: wrap;
}

.recommendations-wrapper {
  flex: 3;
  max-width: 100%;
  min-width: 0;
}

.recommendations {
  background-color: #fff;
  padding: 0.5rem 1rem 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Default 4 kolom */
  gap: 1.5rem;
  max-width: 100%;
  width: 100%;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card, .card1 {
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card1 {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
}

.recent-search h3 {
  font-weight: bold;
  margin: 1rem 0;
  font-family: "Poppins", sans-serif;
}

.recent-search-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-search-item {
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f4f4;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
}

.delete-btn {
  background: none;
  border: none;
  color: #2e7d32;
  font-size: 1.2rem;
  cursor: pointer;
}

.delete-btn:hover {
  color: #1b5e20;
}

.statistics h3 {
  font-weight: bold;
  margin: 0.5rem 0;
}

.statistics div {
  font-size: 0.8rem;
  font-weight: bold;
}

.disabled-card {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.6;
}

.card-link {
  display: block;
  width: 100%;
  max-width: 100%;
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
    margin: 0 30px;
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
    width: 100%;
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
  .submit-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 12px;
  }
}
</style>
