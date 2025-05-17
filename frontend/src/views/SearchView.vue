<template>
  <div class="eco-recipes">
    <Sidebar />

    <!-- Main Content Area -->
    <main class="main-content">
      <!-- Top Search Bar & Buttons -->
      <div class="top-bar">
        <input type="text" v-model="query" @input="handleSearch" placeholder="search the menu" class="search-input" />
        <div class="top-buttons">
          <button class="action-btn" @click="handleInputClick"><i class="fa-solid fa-inbox icon"></i> Input</button>
          <button class="action-btn" @click="handleScanClick"><i class="fa-solid fa-camera icon"></i> Scan</button>
        </div>
      </div>

      <!-- Carousel Section -->
      <section class="hero-carousel">
        <div class="carousel-slide">
          <div class="carousel-item" v-for="(item, index) in carouselItems" :key="index" :class="{ active: currentIndex === index }">
            <div class="hero-text">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <p><strong>Main Ingredients:</strong> {{ item.ingredients }}</p>
            </div>
            <img :src="item.image" alt="Dish Image" class="hero-img" />
          </div>
        </div>
      </section>

      <!-- Recipe Recommendations with RecipeCard -->
      <section class="food-category-list">
        <h3>Recommendations</h3>
        <div v-if="loadingRecommendations" class="loading-message">Loading recommendations...</div>
        <div v-else class="food-category-grid">
          <RecipeCard
            v-for="(item, index) in recommendations"
            :key="item.id || item.Title_Cleaned || item.name"
            :Image_Name="item.image ? item.image + '.jpg' : ''"
            :name="item.name || item.Title_Cleaned || ''"
            :duration="parseInt(item.duration) || 0"
            :carbon="item.carbon"
            :rating="item.rating"
            @open="openModal(index)"
          />
        </div>
      </section>
      <RecipeModal v-if="showModal" :food="selectedFood" @close="showModal = false" />
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import RecipeCard from "../components/RecipeCard.vue";
import RecipeModal from "../components/RecipeModal.vue";

export default {
  name: "SearchView",
  components: {
    Sidebar,
    RecipeCard,
    RecipeModal,
  },
  data() {
    return {
      username: "",
      query: "",
      searchText: "",
      currentIndex: 0,
      carouselInterval: null,
      isMobile: false,
      recommendations: [],
      loadingRecommendations: false,
      showModal: false,
      selectedFood: null,
      carouselItems: [
        {
          title: "Makan Apa Hari Ini??",
          description: "Siap sedia wawasan dengan bahan lokal. Satu masakanmu mendekatkan keberlanjutan di setiap hidangan.",
          ingredients: "Ayam, Sayur, Cabai, Bawang",
          image: "https://source.unsplash.com/featured/?food",
        },
        {
          title: "Inspirasi Masakan Nusantara",
          description: "Ciptakan sajian lezat dari dapurmu dengan bumbu tradisional Indonesia.",
          ingredients: "Ikan, Serai, Kunyit, Daun Jeruk",
          image: "https://source.unsplash.com/featured/?indonesian-food",
        },
        {
          title: "Menu Sehat Hari Ini",
          description: "Masakan sehat dan lezat bisa dimulai dari bahan lokal berkualitas.",
          ingredients: "Tahu, Tempe, Brokoli, Wortel",
          image: "https://source.unsplash.com/featured/?healthy-food",
        },
      ],
    };
  },
  created() {
    this.username = localStorage.getItem("username") || "";
    this.fetchRecommendations();
  },
  mounted() {
    this.startCarousel();
    this.checkMobile();
  },
  methods: {
    async fetchRecommendations() {
      try {
        this.loadingRecommendations = true;
        const response = await fetch("http://localhost:3000/api/recommend/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: this.searchText.trim() || "dummy" }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          alert(errorData.error || "Failed to get recommendations from backend.");
          this.recommendations = [];
          this.loadingRecommendations = false;
          return;
        }

        const data = await response.json();
        const filtered = data.recommendations.filter((item) => item && item.name);
        this.recommendations = filtered;
        this.loadingRecommendations = false;
      } catch (error) {
        alert("Error connecting to backend: " + error.message);
        this.recommendations = [];
        this.loadingRecommendations = false;
      }
    },
    handleSearch() {
      this.searchText = this.query;
      this.fetchRecommendations();
    },
    handleInputClick() {
      this.$router.push("/input-ingredients");
    },
    handleScanClick() {
      this.$router.push("/scan-ingredients");
    },

    startCarousel() {
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
      }, 4000);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    openModal(id = null) {
      this.selectedRecipeId = id;
      this.showModal = true;
    },

    openModal(index) {
      this.selectedFood = this.recommendations[index];
      this.showModal = true;
    },
  },
};
</script>

<style scoped>
.eco-recipes {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f8f8;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  margin-left: 270px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.header-left {
  flex: 1 1 auto;
  min-width: 0;
}

.header-right {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* jarak antar tombol */
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap; /* agar bisa pindah baris di mobile */
}

.search-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  font-size: 1rem;
  min-width: 250px;
}

.top-buttons {
  display: flex;
  gap: 0.75rem;
}

/* 👇 Mobile-specific behavior */
@media (max-width: 768px) {
  .top-bar input.search-input {
    width: 100%;
    margin-bottom: 1rem;
  }

  .top-buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
  }

  .action-btn {
    flex: 1;
    width: 100%;
    text-align: center;
    padding: 0.75rem 1rem;
    font-weight: bold;
    background: linear-gradient(to right, #2e7d32, #66bb6a);
    color: white;
    border: none;
    border-radius: 12px;
  }

  .icon {
    margin-right: 6px;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Jarak antara ikon dan teks */
  background: linear-gradient(to right, #2e7d32, #66bb6a);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  text-align: center;
}

.action-btn:hover {
  background: linear-gradient(to right, #1b5e20, #4caf50); /* Gradasi hijau lebih gelap saat hover */
}

/* ===== Carousel Styles ===== */
.hero-carousel {
  position: relative;
  overflow: hidden;
  background: #4caf50;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.carousel-slide {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
  height: 100%;
  color: white;
}

.carousel-item.active {
  display: flex;
  animation: fadeIn 0.8s ease-in-out;
}

.hero-img {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.hero-text {
  max-width: 60%;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Recipe Cards */
.recommendations {
  margin-top: 2rem;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.recipe-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.recipe-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.recipe-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.recipe-info {
  font-size: 0.9rem;
  color: #555;
}

.no-results {
  text-align: center;
  margin-top: 2rem;
  color: #999;
}

.food-category-list {
  margin-top: 2rem;
}

.food-category-list h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2e7d32;
}

.food-category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.food-category-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s;
  text-align: justify;
}

.food-category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.food-category-image {
  width: 100%;
  aspect-ratio: 2 / 1; /* rasio seperti di gambar */
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.food-category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.food-category-label {
  font-weight: bold;
  color: #2e7d32;
  font-size: 1.1rem;
}

.food-category-info {
  text-align: justify;
  margin-top: 0.5rem;
}

.food-name {
  font-size: 1.1rem;
  color: #2e7d32;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.food-meta {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.75rem;
}

.food-buttons {
  display: flex;
  justify-content: left;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cook-btn {
  background: linear-gradient(to right, #2e7d32, #66bb6a);
  color: white;
}

.cook-btn:hover {
  background: linear-gradient(to right, #1b5e20, #4caf50);
}

.fav-btn {
  background: #eeeeee;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.fav-btn:hover {
  background: #dcedc8;
}

.food-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.food-actions .cook-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: linear-gradient(to right, #2e7d32, #66bb6a);
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.food-actions .fa-heart {
  font-size: 1.4rem;
  margin-left: 1rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s ease;
}

.food-actions .fa-heart.active {
  color: red;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding-top: 0;
    margin-top: 60px;
  }

  .recipe-body {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .recipe-image {
    max-height: 250px;
  }
}
</style>
