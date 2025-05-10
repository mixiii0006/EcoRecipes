<template>
  <div class="scan-ingredients">
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
      <h1 class="logo">EcoRecipes</h1>
      <nav class="menu">
        <ul>
          <li><i class="icon">🏠</i> Dashboard</li>
          <li><i class="icon">🔍</i> Search</li>
          <li><i class="icon">📋</i> Recipes</li>
        </ul>
      </nav>
      <button class="logout-btn"><i>⬅</i> Logout</button>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <div class="header-section">
        <h2 class="scan-title">Please Scan your Ingredients</h2>
        <button class="input-btn" @click="handleInputClick">Input</button>
      </div>

      <!-- Ingredients Scan Section -->
      <div class="scan-section">
        <textarea
          v-model="ingredients"
          placeholder="Scan your ingredients here"
          rows="5"
          class="ingredients-scan"
        ></textarea>
        <button class="submit-btn">Submit</button>
      </div>

      <!-- Combined Section (3:1 Ratio for Recommendations and Right Section) -->
      <section class="combined-section">
        <!-- Recommendations Section (3 Parts) -->
        <div class="recommendations-wrapper">
          <section class="recommendations">
            <h3>Recommendations</h3>
            <div class="recipe-grid">
              <RecipeCard
                v-for="item in results"
                :key="item.id"
                :image="item.image"
                :name="item.name"
                :duration="item.duration"
                :carbon="item.carbon"
                :rating="item.rating"
              />
            </div>
          </section>
        </div>

        <!-- Right Section (1 Part) - Card for Recent Search & Statistics -->
        <section class="right-section">
          <div class="card">
            <section class="recent-search">
              <h4>Recent Search</h4>
              <div class="recent-search-list">
                <button v-for="search in recentSearches" :key="search" class="recent-search-item">
                  {{ search }}
                </button>
              </div>
            </section>
          </div>

          <div class="card1">
            <section class="statistics">
              <h4>Statistic</h4>
              <div>Jejak Karbon: {{ carbonStats }}%</div>
            </section>
          </div>
        </section>
      </section>
    </main>
  </div>
</template>

<script>
import RecipeCard from "../components/RecipeCard.vue";

export default {
  name: "ScanIngredients",
  components: {
    RecipeCard,
  },
  data() {
    return {
      ingredients: "", // Text Scan for ingredients
      results: [], // Array of recipe results (to be filled by API call or dummy data)
      recentSearches: ["Siomay Bandung", "Sop Ikan", "Nasi Goreng"], // Recent searches
      carbonStats: 25, // Example carbon stats
    };
  },
  methods: {
    // Simulate fetching recommendations
    fetchRecommendations() {
      this.results = [
        {
          id: 1,
          image: "https://via.placeholder.com/150",
          name: "Siomay Bandung",
          duration: 15,
          carbon: 25,
          rating: 4,
        },
        {
          id: 2,
          image: "https://via.placeholder.com/150",
          name: "Sop Ikan",
          duration: 30,
          carbon: 20,
          rating: 5,
        },
        {
          id: 3,
          image: "https://via.placeholder.com/150",
          name: "Nasi Goreng",
          duration: 20,
          carbon: 15,
          rating: 3,
        },
      ];
    },
    handleInputClick() {
      this.$router.push("/input-ingredients");
    }
  },
  created() {
    // Simulate fetching data when the page is created
    this.fetchRecommendations();
  },
};
</script>

<style scoped>
/* Layout */
.scan-ingredients {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f8f8;
}

.sidebar {
  background-color: #ffffff;
  border-right: 2px solid #e0e0e0;
  width: 220px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  font-family: "Georgia", serif;
  font-size: 1.6rem;
  margin-bottom: 2rem;
}

.menu ul {
  list-style: none;
  padding: 0;
}

.menu li {
  margin: 1rem 0;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  width: 75%; /* Adjust width for the main content */
  display: flex;
  flex-direction: column;
}

.scan-title {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}

.scan-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.ingredients-scan {
  width: 98%;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.input-btn {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
}

/* Header Section for h2 and scan button */
.header-section {
  display: flex;
  align-items: center; /* Align items vertically */
  justify-content: space-between; /* Space between h2 and button */
}

.header-section .scan-title {
  margin-right: 20px; /* Space between h2 and button */
}

/* Combined Section (3:1 Ratio for Recommendations and Right Section) */
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
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); /* Adjust size of cards */
  gap: 1.5rem;
}

/* Right Section (1 Part) - Card for Recent Search & Statistics */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.card1 {
  background-color:#2e7d32;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.recent-search h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.recent-search-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.recent-search-item {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
}

.statistics {
  margin-top: 1rem;
  color: white;
  
}

.statistics div {
  font-size: 1rem;
  font-weight: bold;
  color: #2e7d32;
}

.submit-btn {
   background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
}

</style>
