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
            v-for="(item, index) in model.recommendations"
            :key="item.id || item.title_cleaned || item.name"
            :image="item.Image_Name || ''"
            :name="item.title_cleaned || item.name || ''"
            :duration="parseInt(item.duration) || 0"
            :carbon="item.carbon_score ? item.carbon_score.toFixed(4) : 'N/A'"
            :rating="item.rating || 0"
            @open="openModal(index)"
            @favorite="handleFavorite(item)"
          />
        </div>
      </section>
      <RecipeModal v-if="showModal" :food="selectedFood" @close="closeModal" />
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import RecipeCard from "../components/RecipeCard.vue";
import RecipeModal from "../components/RecipeModal.vue";
import SearchModel from "../model/SearchModel";
import SearchPresenter from "../presenter/SearchPresenter";

export default {
  name: "SearchView",
  components: {
    Sidebar,
    RecipeCard,
    RecipeModal,
  },
  data() {
    return {
      model: new SearchModel(),
      presenter: null,
      query: '',
      carouselItems: [],
      loadingRecommendations: false,
      showModal: false,
      selectedFood: null,
      currentIndex: 0,
    };
  },
  created() {
    this.presenter = new SearchPresenter(this.model, this);
    this.model.username = localStorage.getItem("username") || "";
    this.presenter.fetchRecommendations('');
    this.query = this.model.searchText;  // Use searchText instead of query
    this.carouselItems = this.model.carouselItems;
    this.loadingRecommendations = this.model.loadingRecommendations;
    this.showModal = this.model.showModal;
    this.selectedFood = this.model.selectedFood;
    this.currentIndex = this.model.currentIndex;
  },
  mounted() {
    this.presenter.startCarousel();
    this.presenter.checkMobile();
  },
  methods: {
    update() {
      // Removed resetting this.query to prevent input clearing and lag
      this.carouselItems = this.model.carouselItems;
      this.loadingRecommendations = this.model.loadingRecommendations;
      this.showModal = this.model.showModal;
      this.selectedFood = this.model.selectedFood;
      this.currentIndex = this.model.currentIndex;
      this.$forceUpdate();
    },
    handleSearch(event) {
      this.presenter.handleSearch(event);
    },
    handleInputClick() {
      this.presenter.handleInputClick();
    },
    handleScanClick() {
      this.presenter.handleScanClick();
    },
    startCarousel() {
      this.presenter.startCarousel();
    },
    checkMobile() {
      this.presenter.checkMobile();
    },
    openModal(index) {
      this.presenter.openModal(index);
    },
    closeModal() {
      this.model.setShowModal(false);
      this.update();
    },
    handleFavorite(item) {
      this.presenter.addFavorite(item.id || item._id || item.recipess_id || item.title_cleaned);
    }
  }
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
