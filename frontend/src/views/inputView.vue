<template>
  <div class="input-ingredients">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Section Header Baris: Judul kiri, Tombol kanan -->
      <div class="section-header">
        <h2 class="section-title">Please Input your Ingredients</h2>
        <button class="scan-btn-bar" @click="scanIngredients">Scan</button>
      </div>

      <!-- Ingredients Input Section -->
      <div class="input-section">
        <textarea v-model="ingredients" @input="onIngredientsInput" placeholder="ex : I have one and a half kilos of chicken, ... " rows="5" class="ingredients-input"></textarea>
        <button class="submit-btn" @click="submitIngredients">
          <i class="fa-solid fa-paper-plane"></i>
          Submit
        </button>
      </div>

      <!-- Recommendations + Right Section -->
      <section class="combined-section">
        <!-- Recommendations Section -->
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
              <div v-else-if="recommendations.length === 0">No recommendations yet.</div>
              <!-- HAS DATA -->
              <div v-else v-for="(rec, index) in recommendations" :key="index" class="card-link">
                <RecipeCard
                  :recipess_id="rec.id || rec._id || ''"
                  :image="normalizeImagePath(rec.image || rec.Image_Name) || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?fit=crop&w=200&q=80'"
                  :name="rec.title || rec.title_cleaned || rec.name || 'No Title'"
                  :carbon="rec.carbon || rec.carbon_score || rec.total_recipe_carbon || 25"
                  :favorites="model.favorites"
                  :cooks="model.cooks"
                  @open="goToRecipe"
                  @favorite="handleToggleFavorite"
                  @cook="handleToggleCook"
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
    <RecipeModal v-if="showModal" :food="selectedRecipe" @close="closeModal" />
  </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard.vue";
import Sidebar from "../components/Sidebar.vue";
import RecipeModal from "../components/RecipeModal.vue";
import InputModel from "../model/InputModel";
import InputPresenter from "../presenter/InputPresenter";

export default {
  name: "InputIngredients",
  components: {
    RecipeCard,
    Sidebar,
    RecipeModal,
  },
  data() {
    return {
      model: new InputModel(),
      presenter: null,
      ingredients: "",
      recommendations: [],
      totalCarbon: 0,
      recentSearches: [],
      loading: false,
      showModal: false,
      selectedRecipe: null,
      leftovers: [],
      missing: [],
    };
  },
  async created() {
    this.presenter = new InputPresenter(this.model, this);
    await this.presenter.getFavorites();
    await this.presenter.getCooks();
    this.ingredients = this.model.ingredients;
    this.recommendations = this.model.recommendations;
    this.totalCarbon = this.model.totalCarbon;
    this.recentSearches = this.model.recentSearches;
    this.loading = this.model.loading;
    this.showModal = this.model.showModal;
    this.selectedRecipe = this.model.selectedRecipe;
    this.leftovers = this.model.leftovers;
    this.missing = this.model.missing;
    console.log("Initial recommendations:", this.recommendations);
  },
  methods: {
    normalizeImagePath(img) {
      if (!img) return "";
      if (img.startsWith("/foodImages/")) {
        return img.slice("/foodImages/".length);
      }
      return img;
    },
    goToRecipe(payload) {
      console.log("goToRecipe dipanggil dengan payload:", payload);
      if (payload && payload.id) {
        this.presenter.goToRecipe({ id: payload.id });
      } else {
        alert("Detail resep tidak ditemukan di database.");
      }
    },
    closeModal() {
      console.log("closeModal dipanggil");
      this.presenter.closeModal();
    },
    onIngredientsInput(event) {
      this.model.setIngredients(this.ingredients);
    },

    async handleToggleFavorite(recipeId) {
      try {
        await this.presenter.handleToggleFavorite(recipeId);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },

    async handleToggleCook(recipeId) {
      try {
        await this.presenter.handleToggleCook(recipeId);
      } catch (error) {
        console.error("Failed to toggle cook:", error);
      }
    },

    handleClick() {
      if (!this.recipess_id) {
        this.$toast.error("Resep ini belum tersedia di database");
        return;
      }
      this.$emit("open");
    },

    update() {
      this.ingredients = this.model.ingredients;
      this.recommendations = this.model.recommendations;
      this.totalCarbon = this.model.totalCarbon;
      this.recentSearches = this.model.recentSearches;
      this.loading = this.model.loading;
      this.showModal = this.model.showModal;
      this.selectedRecipe = this.model.selectedRecipe;
      this.leftovers = this.model.leftovers;
      this.missing = this.model.missing;
      this.$forceUpdate();
      this.model.setLoading(true);
      this.model.setLoading(false);
    },
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

.input-ingredients {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f8f8;
}

/* ---- JUDUL UTAMA, seperti Home ---- */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  background: transparent;
}
.section-title {
  font-family: "Poppins", "Segoe UI", Arial, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2e7d32;
  margin: 0;
  letter-spacing: 0.01em;
  line-height: 1.2;
  flex: 1;
  text-align: justify;
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

/* Responsive: tombol di bawah judul di mobile */
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
    justify-content: center;
    font-size: 1.12rem;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.22rem;
    text-align: center;
  }
}

/* ---- Tombol Scan ---- */
.scan-btn-home {
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  font-weight: 600;
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.scan-btn-home:hover {
  background: #388e3c;
}
@media (max-width: 600px) {
  .scan-btn-home {
    width: 100%;
    justify-content: center;
    margin-bottom: 1rem;
  }
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-left: 270px;
}

.input-section {
  width: 100%;
  padding: 1.5rem;
  margin-inline: auto;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  box-sizing: border-box;
}

.ingredients-input {
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
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
.submit-btn:hover {
  opacity: 0.9;
}

.combined-section {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.recommendations-wrapper {
  flex: 3;
}

.recommendations {
  background-color: #fff;
  padding: 0.5rem 1rem 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.card1 {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  color: white;
}

.recent-search h3 {
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-family: "Poppins", sans-serif;
}

.recent-search-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-search-item {
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
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.statistics div {
  font-size: 0.8rem;
  font-weight: bold;
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
}

@media (max-width: 900px) {
  .combined-section {
    flex-direction: column;
    gap: 1rem;
  }
  .recommendations-wrapper,
  .right-section {
    width: 100%;
    flex: unset;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 0.5rem;
  }
  .input-section {
    padding: 1rem;
    gap: 0.7rem;
    margin-bottom: 1rem;
  }
  .ingredients-input {
    font-size: 0.95rem;
    padding: 0.7rem;
  }
  .recipe-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .recent-search-item {
    padding: 0.5rem 0.7rem;
    font-size: 0.95rem;
  }
  .card,
  .card1 {
    padding: 0.7rem;
  }
 
}
</style>
