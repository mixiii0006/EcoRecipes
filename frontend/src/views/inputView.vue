<template>
  <div class="input-ingredients">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="header-section">
        <h2 class="input-title">Please Input your Ingredients</h2>
        <button class="scan-btn" @click="scanIngredients">Scan</button>
      </div>

      <!-- Ingredients Input Section -->
      <div class="input-section">
        <textarea placeholder="ex : I have one and a half kilos of chicken, ... " rows="5" class="ingredients-input"></textarea>
        <button class="submit-btn">Submit</button>
      </div>

      <!-- Recommendations + Right Section -->
      <section class="combined-section">
        <!-- Recommendations Section -->
        <div class="recommendations-wrapper">
          <section class="recommendations">
            <h3>Recommendations</h3>
            <div class="recipe-grid">
              <div class="card-link">
                <RecipeCard image="https://via.placeholder.com/150" name="Siomay Bandung" duration="15" carbon="25" rating="4" />
              </div>
              <div class="card-link">
                <RecipeCard image="https://via.placeholder.com/150" name="Sop Ikan" duration="30" carbon="20" rating="5" />
              </div>
              <div class="card-link">
                <RecipeCard image="https://via.placeholder.com/150" name="Nasi Goreng" duration="20" carbon="15" rating="3" />
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
                <div class="recent-search-item">
                  <span>Siomay Bandung</span>
                  <button class="delete-btn">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <div class="recent-search-item">
                  <span>Sop Ikan</span>
                  <button class="delete-btn">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <div class="recent-search-item">
                  <span>Nasi Goreng</span>
                  <button class="delete-btn">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <div class="card1">
            <section class="statistics">
              <h3>Statistic</h3>
              <div>Jejak Karbon: 25%</div>
            </section>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard.vue";
import Sidebar from "../components/Sidebar.vue";

export default {
  name: "InputIngredients",
  components: {
    RecipeCard,
    Sidebar,
  },
  methods: {
    scanIngredients() {
      this.$router.push("/scan-ingredients");
    }
  },
};
</script>

<style scoped>
.input-ingredients {
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

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.input-title {
  font-size: 1.6rem;
}

.scan-btn {
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
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
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
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

@media (max-width: 600px) {
  .input-section {
    padding: 1rem;
  }
}
</style>