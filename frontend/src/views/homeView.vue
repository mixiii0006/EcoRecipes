<template>
  <div class="home-container">
    <Sidebar />

    <!-- Konten Utama -->
    <main :class="['main-section', { 'main-section-mobile': isMobile && isMenuOpen }]">
      <div class="main-layout">
        <!-- Konten Tengah -->
        <div class="main-content">
          <section class="hero-carousel">
            <div class="carousel-slide">
              <div class="carousel-item" v-for="(item, index) in carouselItems" :key="index" :class="{ active: currentIndex === index }">
                <div class="hero-text">
                  <h2>{{ item.title }}</h2>
                  <p>{{ item.description }}</p>
                <!-- Ingredients line removed as per user request -->
                </div>
                <img :src="item.image" alt="Dish Image" class="hero-img" />
              </div>
            </div>
          </section>

          <section class="feature-section">
            <div class="feature-card">
              <router-link to="/input-ingredients" class="feature-link">
                <i class="fa-solid fa-inbox icon"></i>
                <p class="feature-title">Input</p>
                <p class="feature-desc">Please Input your Ingredients</p>
              </router-link>
            </div>

            <div class="feature-card">
              <router-link to="/scan-ingredients" class="feature-link">
                <i class="fa-solid fa-camera icon"></i>
                <p class="feature-title">Scan</p>
                <p class="feature-desc">Please Scan your Food</p>
              </router-link>
            </div>
          </section>
        </div>

        <!-- Sidebar Kanan -->
        <aside class="right-sidebar">
          <div class="sidebar-wrapper">
            <!-- Profil Card -->
            <div class="profile-card">
              <router-link to="/profile">
                <img src="/images/profile.jpg" alt="Profile Picture" class="profile-img" />
              </router-link>
              <h3 class="profile-name">{{ model.user ? model.user.name : "Loading..." }}</h3>
            </div>

            <!-- Emisi Karbon Card -->
            <div class="carbon-card">
              <p><strong>Total Amount of Carbon</strong><br />Successfully Reduced: {{ model.user ? model.user.totalCarbonReduced : 0 }}</p>
            </div>

            <section class="food-category-list">
              <h3>Favorite Food</h3>
              <div class="favorite-slider-container">
                <button
                  class="slider-btn"
                  :disabled="favoriteSliderIndex === 0"
                  @click="slideLeft"
                  aria-label="Previous favorites"
                >
                  ‹
                </button>
                <div class="favorite-slider">
                  <div
                    class="food-category-card"
                    v-for="favorite in visibleFavorites"
                    :key="favorite.id"
                    @click="openRecipeModal(favorite)"
                    style="cursor: pointer; min-width: 100px; max-width: 100px;"
                  >
                    <div class="food-category-icon">
                      <img :src="`/foodImages/${favorite.image_name}.jpg `" alt="Food Image" />
                    </div>
                    <div class="food-category-label multi-line-ellipsis small-title">{{ favorite.title_cleaned }}</div>
                  </div>
                </div>
                <button
                  class="slider-btn"
                  :disabled="favoriteSliderIndex + favoriteVisibleCount >= model.favoriteFoods.length"
                  @click="slideRight"
                  aria-label="Next favorites"
                >
                  ›
                </button>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>

    <RecipeModal v-if="showRecipeModal" :food="selectedRecipe" @close="closeRecipeModal" />
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import HomeModel from "../model/HomeModel";
import HomePresenter from "../presenter/HomePresenter";
import RecipeModal from "../components/RecipeModal.vue";

export default {
  name: "HomeView",
  components: {
    Sidebar,
    RecipeModal,
  },
  data() {
    return {
      model: new HomeModel(),
      presenter: null,
      isMobile: null,
      isMenuOpen: false,
      showRecipeModal: false,
      selectedRecipe: null,
      favoriteSliderIndex: 0,
      favoriteVisibleCount: 2,
    };
  },
  computed: {
    carouselItems() {
      return this.model.carouselItems;
    },
    currentIndex() {
      return this.model.currentIndex;
    },
    visibleFavorites() {
      return this.model.favoriteFoods.slice(
        this.favoriteSliderIndex,
        this.favoriteSliderIndex + this.favoriteVisibleCount
      );
    },
  },
  async created() {
    this.presenter = new HomePresenter(this.model, this);
    this.model.setUsername(localStorage.getItem("username") || "");
    await this.presenter.loadUserData();
    await this.presenter.loadFavoriteFoods();
    this.isMobile = this.model.isMobile === undefined ? false : this.model.isMobile;
    this.isMenuOpen = this.model.isMenuOpen;
    this.$forceUpdate();
  },
  mounted() {
    this.presenter.startCarousel();
    this.presenter.checkMobile();
    window.addEventListener("resize", this.presenter.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.presenter.checkMobile);
    this.presenter.clearCarouselInterval();
  },
  methods: {
    update() {
      this.isMobile = this.model.isMobile;
      this.isMenuOpen = this.model.isMenuOpen;
      this.$forceUpdate();
    },
    handleLogout() {
      this.presenter.handleLogout();
    },
    startCarousel() {
      this.presenter.startCarousel();
    },
    checkMobile() {
      this.presenter.checkMobile();
    },
    toggleMenu() {
      this.presenter.toggleMenu();
    },
    openRecipeModal(recipe) {
      this.selectedRecipe = recipe;
      this.showRecipeModal = true;
    },
    closeRecipeModal() {
      this.showRecipeModal = false;
      this.selectedRecipe = null;
    },
    slideLeft() {
      if (this.favoriteSliderIndex > 0) {
        this.favoriteSliderIndex--;
      }
    },
    slideRight() {
      if (this.favoriteSliderIndex + this.favoriteVisibleCount < this.model.favoriteFoods.length) {
        this.favoriteSliderIndex++;
      }
    },
    renderPieChart() {
      // Optional: isi logika chart jika dibutuhkan
    },
  },
};
</script>

<style scoped>
/* ===== CONTAINER ===== */
.home-container {
  display: flex;
  height: 100vh;
  max-width: 100%;
  font-family: "Segoe UI", sans-serif;
  background-color: #f4f4f4;
}

/* ===== SIDEBAR KIRI ===== */
.logo {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.menu {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.menu-item {
  padding: 1rem;
  margin: 0.25rem 0;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.3s;
}

.menu-item:hover {
  background-color: #1b5e20;
}

.logout {
  margin-top: auto;
  background-color: #d32f2f;
}

/* ===== MAIN SECTION ===== */
.main-section {
  flex: 1;
  padding: 2rem;
  background-color: #f4f4f4;
  overflow-y: auto;
  margin-left: 270px;
  transition: margin-left 0.3s ease-in-out;
}

.main-section-mobile {
  margin-left: 0;
}

.main-layout {
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
}

.main-content {
  flex: 3;
  width: 100%;
  height: auto;
}

  /* ===== RESPONSIVE (<=768px) ===== */
  @media (max-width: 768px) {
    .main-section {
      margin-left: 0;
      margin-top: 60px;
      padding-top: 0;
    }

    .main-layout {
      flex-direction: column;
    }

    .main-content {
      flex: none;
      width: 100%;
    }

    .right-sidebar {
      width: 100%;
      padding: 1.25rem;
      border-radius: 12px;
      background-color: #eaf5eb;
      display: flex;
      flex: none;
      margin-left: -18px;
      flex-direction: column;
    }

    .hero-carousel {
      padding: 1rem;
      height: auto;
    }

    .carousel-item {
      flex-direction: column;
      gap: 1rem;
    }

    .hero-img {
      width: 100%;
      height: auto;
      max-height: 350px; /* increased from 200px */
      border-radius: 10px;
    }

    /* Hide carousel image on mobile */
    @media (max-width: 768px) {
      .hero-img {
        display: none;
      }
    }

    .hero-text {
      max-width: 100%;
    }

    .feature-section {
      flex-direction: column; /* stack Input and Scan vertically */
      gap: 1rem; /* add spacing between cards */
      margin: 20px 0;
    }

    .action-buttons {
      flex-direction: column;
    }

    .big-btn {
      width: 100%;
    }

    .nutrition-card {
      min-height: 250px;
    }

    #nutritionChart {
      width: 100% !important;
      height: auto !important;
      max-height: 250px;
    }
  }

/* ===== HERO SECTION ===== */
.hero-carousel {
  position: relative;
  overflow: hidden;
  background: #4caf50;
  border-radius: 12px;
  padding: 1.5rem;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.hero-img {
  width: 300px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.hero-text {
  max-width: 60%;
  color: white;
}

/* ===== FEATURE SECTION ===== */
.feature-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.feature-card {
  flex: 1;
  padding: 4rem;
  background-color: #ffffff;
  border: 1px solid #d0e6d1;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}

.feature-card:hover {
  background-color: #d4efdf;
  transform: translateY(-3px);
}

.feature-link {
  text-decoration: none;
  color: inherit;
  display: block;
  flex: 1;
}

.icon {
  font-size: 40px;
  color: #2e7d32;
  margin-bottom: 10px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #2e7d32;
  margin: 8px 0 4px;
}

.feature-desc {
  font-size: 14px;
  color: #f9f9f9;
  background-color: #2e7d32;
  margin: 0 auto;
  padding: 5px;
  border-radius: 8px;
}

/* ===== RIGHT SIDEBAR ===== */
.right-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sidebar-wrapper {
  background-color: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 89%;
}

.profile-card {
  text-align: center;
}

.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
}

.profile-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2e7d32;
}

.carbon-card {
  background: #d7ecd8;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 16px;
  text-align: center;
  font-weight: bold;
  border-color: #1b5e20;
}

.carbon-card .sparkle {
  display: inline-block;
  font-size: 1.2rem;
}

/* ===== USER INFO ===== */
.user-info {
  background: #d7ecd8;
  border-radius: 12px;
  padding: 0 20px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info h4 {
  font-weight: bold;
  color: #2e7d32;
}

.info-item label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #2e7d32;
}

.info-value {
  background: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2e7d32;
}

/* ===== FOOD LIST SECTION ===== */
.food-category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.food-category-list h3 {
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
  margin-left: 8px;
}

.favorite-slider-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-slider {
  display: flex;
  gap: 10px;
  overflow: hidden;
  width: 220px; /* 2 items * 100px + gap */
}

.slider-btn {
  background-color: transparent;
  border: none;
  font-size: 2rem;
  color: #2e7d32;
  cursor: pointer;
  user-select: none;
  padding: 0 5px;
}

.slider-btn:disabled {
  color: #ccc;
  cursor: default;
}

.food-category-card {
  min-width: 100px;
  max-width: 100px;
  background-color: #fff;
  border-radius: 12px;
  padding: 12px 10px;
  text-align: center;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.food-category-card:hover {
  transform: translateY(-3px);
}

.food-category-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px; /* kecilkan agar tidak terlalu turun */
}

.food-category-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.food-category-label {
  font-size: 11px;
  font-weight: 600;
  color: #2e7d32;
  margin-top: 4px;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-food-card {
  min-width: 150px;
  max-width: 150px;
  background-color: #fff;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  flex-shrink: 0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.favorite-food-card:hover {
  transform: translateY(-5px);
}

.favorite-food-image {
  width: 100%;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
}

.favorite-food-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.favorite-food-title {
  font-size: 14px;
  font-weight: 600;
  color: #2e7d32;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-food-details {
  font-size: 12px;
  color: #4caf50;
  margin: 0;
}

</style>
