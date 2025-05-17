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

      <!-- Recipe Recommendations -->
      <section class="food-category-list">
        <h3>Favorite Food</h3>
        <div class="food-category-grid">
          <div class="food-category-card" v-for="(item, index) in favoriteFoods" :key="index" @click="openModal(index)">
            <div class="food-category-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="food-category-info">
              <h4 class="food-name">Ayam Bakar</h4>
              <p class="food-meta">Durasi: 30 min · Karbon: 120g</p>

              <div class="food-actions">
                <button class="btn cook-btn">Masak</button>
                <i class="fa-regular fa-heart heart-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <RecipeModal v-if="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import axios from "axios";
import RecipeCard from "../components/RecipeCard.vue";
import RecipeModal from "../components/RecipeModal.vue";

export default {
  name: "SearchView",
  components: {
    RecipeCard,
    RecipeModal,
  },
  data() {
    return {
      query: "",
      results: [],
      searched: false,
      currentIndex: 0,
      carouselInterval: null,
      showModal: false, // 👈 untuk kontrol modal
      selectedRecipeId: null, // 👈 jika kamu ingin tahu item yang dipilih
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

      favoriteFoods: [
        { name: "Ayam Bakar", duration: 40, carbon: 210, image: "/images/bg-profil.jpg" },
        { name: "Sate Lilit", duration: 30, carbon: 190, image: "/images/bg-profil.jpg" },
        { name: "Tumis Kangkung", duration: 15, carbon: 80, image: "/images/bg-profil.jpg" },
        { name: "Rendang", duration: 90, carbon: 320, image: "/images/bg-profil.jpg" },
        { name: "Pecel Lele", duration: 20, carbon: 120, image: "/images/bg-profil.jpg" },
        { name: "Gado-Gado", duration: 25, carbon: 150, image: "/images/bg-profil.jpg" },
      ],
    };
  },
  mounted() {
    this.startCarousel();
  },
  beforeDestroy() {
    clearInterval(this.carouselInterval);
  },
  methods: {
    async handleSearch() {
      if (!this.query) {
        this.results = [];
        this.searched = false;
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/search?q=${encodeURIComponent(this.query)}`);
        this.results = response.data;
        this.searched = true;
      } catch (error) {
        console.error("Search failed:", error);
        this.results = [];
        this.searched = true;
      }
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
      }, 4000);
    },
    handleInputClick() {
      this.$router.push("/input-ingredients");
    },
    handleScanClick() {
      this.$router.push("/scan-ingredients");
    },
    openModal(id = null) {
      this.selectedRecipeId = id;
      this.showModal = true;
    },

    openModal(index) {
      // Logic untuk buka modal resep
      this.selectedFood = this.favoriteFoods[index];
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
