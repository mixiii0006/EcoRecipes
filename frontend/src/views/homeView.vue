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
                  <p><strong>Main Ingredients:</strong> {{ item.ingredients }}</p>
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
              <p><strong>Total Amount of Carbon</strong><br />Successfully Reduced: {{ model.user ? model.user.totalKarmonReduced : 0 }}</p>
            </div>

            <section class="food-category-list">
              <h3>Favorite Food</h3>
              <div class="food-category-scroll">
                <div class="food-category-card" v-for="index in 2" :key="index">
                  <div class="food-category-icon">
                    <router-link to="/recipe-detail">
                      <img src="/images/bg-profil.jpg" alt="Food Image" />
                    </router-link>
                  </div>
                  <div class="food-category-label">Grilled</div>
                </div>
              </div>
              <span>
                <router-link to="/profile">See All</router-link>
              </span>
            </section>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import HomeModel from "../model/HomeModel";
import HomePresenter from "../presenter/HomePresenter";

export default {
  name: "HomeView",
  components: {
    Sidebar,
  },
  data() {
    return {
      model: new HomeModel(),
      presenter: null,
      carouselItems: [],
      currentIndex: 0,
      isMobile: null,
      isMenuOpen: false,
    };
  },
  async created() {
    this.presenter = new HomePresenter(this.model, this);
    this.model.setUsername(localStorage.getItem("username") || "");
    await this.presenter.loadUserData();
    this.carouselItems = this.model.carouselItems;
    this.currentIndex = this.model.currentIndex;
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
      this.carouselItems = this.model.carouselItems;
      this.currentIndex = this.model.currentIndex;
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
  align-items: flex-start;
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
    max-height: 200px;
    border-radius: 10px;
  }

  .hero-text {
    max-width: 100%;
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

.food-category-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 0;
}

.food-category-card {
  min-width: 100px;
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
  font-size: 13px;
  font-weight: 600;
  color: #2e7d32;
  margin-top: 4px;
  line-height: 1.2;
}

.food-category-list span {
  margin-left: 8px;
}

.food-category-list span a {
  font-size: 13px;
  color: #2e7d32;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .right-sidebar {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1.25rem;
    background-color: #eaf5eb;
    border-radius: 12px;
    order: 2;
  }

  .feature-section {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .feature-card {
    padding: 2rem;
  }
}
</style>
