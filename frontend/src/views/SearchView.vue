<template>
  <div class="eco-recipes">
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
      <!-- Top Search Bar & Buttons -->
      <div class="top-bar">
        <input
          type="text"
          v-model="query"
          @input="handleSearch"
          placeholder="search the menu"
          class="search-input"
        />
        <div class="top-buttons">
          <!-- Button Input -->
          <button class="action-btn" @click="handleInputClick">📤 Input</button>
          <!-- Button Scan -->
          <button class="action-btn" @click="handleScanClick">📷 Scan</button>
        </div>
      </div>

      <!-- Dish Hero Section -->
      <section class="hero-section">
        <img :src="dishImage" alt="Dish" class="hero-image" />
        <div class="hero-text">
          <h2>Makan Apa Hari Ini??</h2>
          <p class="desc">{{ dishDescription }}</p>
          <div class="ingredients-footprint">
            <div>
              <h4>Main Ingredients</h4>
              <ul>
                <li v-for="ingredient in dishIngredients" :key="ingredient">
                  {{ ingredient }}
                </li>
              </ul>
            </div>
            <div>
              <h4>Carbon Percentage</h4>
              <div class="stars">
                <span v-for="(star, index) in carbonStars" :key="index">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recipe Recommendations -->
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
        <p v-if="searched && results.length === 0" class="no-results">No results found.</p>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import RecipeCard from "../components/RecipeCard.vue";

export default {
  name: "SearchView",
  components: {
    RecipeCard,
  },
  data() {
    return {
      query: "",
      results: [],
      searched: false,
      dishImage: "/path/to/dish-image.jpg",
      dishDescription: "Sop ala western dengan bahan lokal...",
      dishIngredients: ["Shrimp", "Garlic", "Onion"],
      carbonStars: [1, 1],
    };
  },
  methods: {
    async handleSearch() {
      if (!this.query) {
        this.results = [];
        this.searched = false;
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/search?q=${encodeURIComponent(this.query)}`
        );
        this.results = response.data;
        this.searched = true;
      } catch (error) {
        console.error("Search failed:", error);
        this.results = [];
        this.searched = true;
      }
    },

    // Handle the "Input" button click
    handleInputClick() {
      // Redirect to the input ingredients page or process input data
      this.$router.push("/input-ingredients"); // Assuming you're using Vue Router
    },

    // Handle the "Scan" button click
    handleScanClick() {
      // You can implement scan functionality here if needed
      this.$router.push("/scan-ingredients");
    },
  },
};
</script>

<style scoped>
/* Layout & Sidebar */
.eco-recipes {
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
  background-color: #2e7d32;
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
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-input {
  width: 60%;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #ccc;
}
.top-buttons {
  display: flex;
  gap: 1rem;
} 

.action-btn {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
}

/* Hero */
.hero-section {
  display: flex;
  background: linear-gradient(to right, #256d39, #71c77f);
  border-radius: 20px;
  margin: 2rem 0;
  padding: 2rem;
  color: white;
  align-items: center;
}
.hero-image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 2rem;
}
.hero-text h2 {
  font-size: 1.8rem;
}
.desc {
  margin: 0.8rem 0;
  font-size: 0.95rem;
}
.ingredients-footprint {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.ingredients-footprint h4 {
  margin-bottom: 0.3rem;
}
.ingredients-footprint ul {
  padding-left: 1rem;
}
.stars span {
  font-size: 1.2rem;
  color: gold;
}

/* Recipe Cards */
.recommendations h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
.no-results {
  text-align: center;
  margin-top: 2rem;
  color: #999;
}
</style>
