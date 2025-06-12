<template>
  <div class="home-container">
    <Sidebar />

    <!-- Konten Utama -->
    <main :class="['main-section', { 'main-section-mobile': isMobile && isMenuOpen }]">
      <div class="main-layout">
        <!-- Konten Tengah -->
        <div class="main-content">
          <!-- Hero Carousel -->
          <section class="hero-carousel">
            <div class="carousel-container">
              <div class="carousel-slide" v-for="(item, index) in carouselItems" :key="index" :class="{ active: currentIndex === index }">
                <img :src="item.image" alt="Dish Image" class="carousel-image" />
                <div class="carousel-overlay">
                  <h2 class="carousel-title">{{ item.title }}</h2>
                  <p class="carousel-desc">{{ item.description }}</p>
                </div>
              </div>
              <div class="carousel-controls">
                <button @click="prevSlide" aria-label="Previous slide">‹</button>
                <button @click="nextSlide" aria-label="Next slide">›</button>
              </div>
              <div class="carousel-indicators">
                <span v-for="(_, idx) in carouselItems" :key="idx" @click="goToSlide(idx)" :class="{ active: currentIndex === idx }"></span>
              </div>
            </div>
          </section>

          <!-- Feature Section -->
          <section class="feature-section">
            <router-link to="/input-ingredients" class="feature-card">
              <div class="feature-icon">
                <i class="fa-solid fa-inbox"></i>
              </div>
              <h3 class="feature-title">Input</h3>
              <p class="feature-desc">Enter your ingredients easily</p>
            </router-link>

            <router-link to="/scan-ingredients" class="feature-card">
              <div class="feature-icon">
                <i class="fa-solid fa-camera"></i>
              </div>
              <h3 class="feature-title">Scan</h3>
              <p class="feature-desc">Scan your food with your camera</p>
            </router-link>
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
              <p>
                <strong>Total Amount of Carbon</strong><br />
                Successfully Reduced: {{ model.user ? model.user.totalCarbonReduced + ' Co2' : 0 }}
              </p>
            </div>

            <!-- Favorite Foods Slider -->
            <section class="food-category-list">
              <h3>Favorite Food</h3>
              <div class="favorite-slider-container">
                <button class="slider-btn" :disabled="favoriteSliderIndex === 0" @click="slideLeft" aria-label="Previous favorites">‹</button>
                <div class="favorite-slider">
                  <div class="food-category-card" v-for="favorite in visibleFavorites" :key="favorite.id" @click="openRecipeModal(favorite)">
                    <div class="food-category-icon">
                      <img :src="`/foodImages/${favorite.image_name}.jpg`" alt="Food Image" />
                    </div>
                    <div class="food-category-label">{{ favorite.title_cleaned }}</div>
                  </div>
                </div>
                <button class="slider-btn" :disabled="favoriteSliderIndex + favoriteVisibleCount >= model.favoriteFoods.length" @click="slideRight" aria-label="Next favorites">›</button>
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
      isMobile: false,
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
      return this.model.favoriteFoods.slice(this.favoriteSliderIndex, this.favoriteSliderIndex + this.favoriteVisibleCount);
    },
  },
  async created() {
    this.presenter = new HomePresenter(this.model, this);
    this.model.setUsername(localStorage.getItem("username") || "");
    await this.presenter.loadUserData();
    await this.presenter.loadFavoriteFoods();
    this.presenter.checkMobile();
  },
  mounted() {
    this.presenter.startCarousel();
    window.addEventListener("resize", this.presenter.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.presenter.checkMobile);
    this.presenter.clearCarouselInterval();
  },
  methods: {
    prevSlide() {
      this.model.currentIndex = (this.model.currentIndex + this.model.carouselItems.length - 1) % this.model.carouselItems.length;
    },
    nextSlide() {
      this.model.currentIndex = (this.model.currentIndex + 1) % this.model.carouselItems.length;
    },
    goToSlide(index) {
      this.model.currentIndex = index;
    },
    slideLeft() {
      if (this.favoriteSliderIndex > 0) this.favoriteSliderIndex--;
    },
    slideRight() {
      if (this.favoriteSliderIndex + this.favoriteVisibleCount < this.model.favoriteFoods.length) this.favoriteSliderIndex++;
    },
    openRecipeModal(food) {
      this.selectedRecipe = food;
      this.showRecipeModal = true;
    },
    closeRecipeModal() {
      this.showRecipeModal = false;
      this.selectedRecipe = null;
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

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .main-section {
    margin-left: 0 !important;
    padding: 1rem;
    margin-top: 75px;;
  }
  .main-layout {
    flex-direction: column;
    gap: 1rem;
  }
  .main-content {
    flex: none;
    width: 100%;
  }
  .right-sidebar {
    flex: none;
    width: 100%;
    margin-top: 1rem;
  }
  .hero-carousel {
    height: 250px;
    margin-top: 1.5rem;
  }
  .feature-section {
    flex-direction: column;
  }
  .feature-card {
    width: 100%;
    margin-bottom: 1rem;
  }
}

/* Remove margin-top on hero-carousel for normal screens */
.hero-carousel {
  margin-top: 0 !important;
}

/* ===== HERO CAROUSEL ===== */
.hero-carousel {
  position: relative;
  width: 100%;
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}
.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
}
.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}
.carousel-slide.active {
  opacity: 1;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel-overlay {
  position: absolute;
  bottom: 20px;
  left: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: #fff;
}
.carousel-title {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
}
.carousel-desc {
  margin: 0;
  font-size: 1rem;
}
.carousel-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  pointer-events: none;
}
.carousel-controls button {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background 0.3s;
}
.carousel-controls button:hover {
  background: rgba(255, 255, 255, 1);
}
.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}
.carousel-indicators span.active {
  background: rgba(255, 255, 255, 1);
}

/* ===== FEATURE SECTION ===== */
.feature-section {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}
.feature-card {
  flex: 1 1 45%;
  background: linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  min-width: 280px;
  box-sizing: border-box;
}
.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
}
.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #2e7d32;
}
.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: #1b5e20;
}
.feature-desc {
  font-size: 0.95rem;
  margin: 0;
  color: #4b4b4b;
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
  width: 100%;
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
