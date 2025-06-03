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
        <button class="submit-btn" @click="submitIngredients">Submit</button>
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
                  :image="rec.image || rec.Image_Name || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?fit=crop&w=200&q=80'"
                  :name="rec.title || rec.title_cleaned || rec.name || 'No Title'"
                  :carbon="rec.carbon || rec.carbon_score || rec.total_recipe_carbon || 25"
                  @open="goToRecipe(rec)"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- Right Section -->
        <section class="right-section">
          <div class="card">
            <section class="recent-search">
              <h3>Recent Search</h3>
              <div class="recent-search-list">
                <div class="recent-search-item" v-for="(search, idx) in recentSearches" :key="idx">
                  <span>{{ search }}</span>
                  <button class="delete-btn" @click="deleteRecentSearch(idx)">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div class="card1">
            <section class="statistics">
              <h3>Statistic</h3>
              <div>Jejak Karbon: {{ (totalCarbon * 100).toFixed(2) }}%</div>
            </section>
          </div>

          <div class="card">
            <section class="leftovers">
              <h3>Leftovers</h3>
              <ul v-if="leftovers.length > 0">
                <li v-for="(item, index) in leftovers" :key="index">{{ item }}</li>
              </ul>
              <div v-else>No leftovers</div>
            </section>
          </div>

          <div class="card">
            <section class="missing">
              <h3>Missing Ingredients</h3>
              <ul v-if="missing.length > 0">
                <li v-for="(item, index) in missing" :key="index">{{ item }}</li>
              </ul>
              <div v-else>No missing ingredients</div>
            </section>
          </div>

          <div class="card">
            <section class="parsed-ingredients">
              <h3>Parsed Ingredients</h3>
              <ul v-if="parsedIngredients.length > 0">
                <li v-for="(item, index) in parsedIngredients" :key="index">{{ item.text || JSON.stringify(item) }}</li>
              </ul>
              <div v-else>No parsed ingredients</div>
            </section>
          </div>

          <div class="card" v-if="selectedRecipe">
            <section class="selected-recipe">
              <h3>Selected Recipe</h3>
              <div><strong>Title:</strong> {{ selectedRecipe.title || "N/A" }}</div>
              <div>
                <strong>Ingredients:</strong>
                <ul>
                  <li v-for="(ing, idx) in selectedRecipe.ingredients" :key="idx">{{ ing }}</li>
                </ul>
              </div>
              <div>
                <strong>Instructions:</strong>
                <ol>
                  <li v-for="(step, idx) in selectedRecipe.instructions" :key="idx">{{ step }}</li>
                </ol>
              </div>
            </section>
          </div>
        </section>
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
      parsedIngredients: [],
    };
  },
  created() {
    this.presenter = new InputPresenter(this.model, this);
    this.ingredients = this.model.ingredients;
    this.recommendations = this.model.recommendations;
    this.totalCarbon = this.model.totalCarbon;
    this.recentSearches = this.model.recentSearches;
    this.loading = this.model.loading;
    this.showModal = this.model.showModal;
    this.selectedRecipe = this.model.selectedRecipe;
    this.leftovers = this.model.leftovers;
    this.missing = this.model.missing;
    this.parsedIngredients = this.model.parsedIngredients;
  },
  methods: {
    goToRecipe(rec) {
      console.log("goToRecipe dipanggil dengan:", rec);
      this.presenter.goToRecipe(rec);
    },
    closeModal() {
      console.log("closeModal dipanggil");
      this.presenter.closeModal();
    },
    onIngredientsInput(event) {
      this.model.setIngredients(this.ingredients);
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
      this.parsedIngredients = this.model.parsedIngredients;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
    padding: 1rem;
  }
  .input-ingredients {
    flex-direction: column;
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
  .submit-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
