<template>
  <div class="home-container">
    <Sidebar />

    <!-- Konten Utama -->
    <main
      :class="[
        'main-section',
        { 'main-section-mobile': isMobile && isMenuOpen },
      ]"
    >
      <div class="main-layout">
        <!-- Konten Tengah -->
        <div class="main-content">
          <header class="header">
            <div class="header-left">
              <input
                type="text"
                placeholder="Search the menu"
                class="search-input"
              />
            </div>
          </header>

          <!-- Hero -->
          <!-- Hero Carousel -->
          <section class="hero-carousel">
            <div class="carousel-slide">
              <div
                class="carousel-item"
                v-for="(item, index) in carouselItems"
                :key="index"
                :class="{ active: currentIndex === index }"
              >
                <div class="hero-text">
                  <h2>{{ item.title }}</h2>
                  <p>{{ item.description }}</p>
                  <p>
                    <strong>Main Ingredients:</strong> {{ item.ingredients }}
                  </p>
                </div>
                <img :src="item.image" alt="Dish Image" class="hero-img" />
              </div>
            </div>
          </section>

          <section class="feature-section">
            <div class="feature-card" @click="goToInput">
              <i class="fa-solid fa-inbox icon"></i>
              <p class="feature-title">Input</p>
              <p class="feature-desc">Please Input your Ingredients</p>
            </div>
            <div class="feature-card" @click="goToScan">
              <i class="fa-solid fa-camera icon"></i>
              <p class="feature-title">Scan</p>
              <p class="feature-desc">Please Scan your Food</p>
            </div>
          </section>

          <!-- Rekomendasi -->
          <section class="recommendations">
            <h3>Recommendations</h3>
            <div class="recipe-grid">
              <div class="recipe-card" v-for="n in 6" :key="n">
                <img
                  src="https://source.unsplash.com/160x160/?indonesian-food"
                  alt="Food"
                />
                <h4>Sate Ayam</h4>
                <p>★★★★☆</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar Kanan -->
        <aside class="right-sidebar">
          <router-link to="/profile" class="user-box">
            <span class="username">{{ username }}</span>
          </router-link>

          <!-- Grafik Pie -->
          <div class="nutrition-card">
            <canvas id="nutritionChart"></canvas>
          </div>

          <!-- Top User -->
          <div class="top-users">
            <h4>Top User</h4>
            <ul>
              <li v-for="n in 4" :key="n" class="top-user">
                <img
                  src="https://source.unsplash.com/32x32/?person"
                  alt="User Avatar"
                />
                <span>Natasya Salsabila</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "HomeView",
  data() {
    return {
      username: "",
      currentIndex: 0,
      carouselInterval: null,
      isMobile: false,
      isMenuOpen: false, // Menambahkan status isMenuOpen
      chartInstance: null,
      carouselItems: [
        {
          title: "Makan Apa Hari Ini??",
          description:
            "Siap sedia wawasan dengan bahan lokal. Satu masakanmu mendekatkan keberlanjutan di setiap hidangan.",
          ingredients: "Ayam, Sayur, Cabai, Bawang",
          image: "https://source.unsplash.com/featured/?food",
        },
        {
          title: "Inspirasi Masakan Nusantara",
          description:
            "Ciptakan sajian lezat dari dapurmu dengan bumbu tradisional Indonesia.",
          ingredients: "Ikan, Serai, Kunyit, Daun Jeruk",
          image: "https://source.unsplash.com/featured/?indonesian-food",
        },
        {
          title: "Menu Sehat Hari Ini",
          description:
            "Masakan sehat dan lezat bisa dimulai dari bahan lokal berkualitas.",
          ingredients: "Tahu, Tempe, Brokoli, Wortel",
          image: "https://source.unsplash.com/featured/?healthy-food",
        },
      ],
    };
  },
  created() {
    this.username = localStorage.getItem("username") || "";
  },
  mounted() {
    this.renderPieChart();
    this.startCarousel();
    this.checkMobile();
    window.addEventListener("resize", () => {
      this.checkMobile();
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
    clearInterval(this.carouselInterval);
  },
  methods: {
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.$router.push("/");
    },
    renderPieChart() {
      const ctx = document.getElementById("nutritionChart");
      this.chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Protein", "Carbs", "Fat", "Fiber"],
          datasets: [
            {
              label: "Nutrient Composition",
              data: [30, 40, 20, 10],
              backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726", "#AB47BC"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    },
    goToInput() {
      this.$router.push("/input-ingredients");
    },
    goToScan() {
      this.$router.push("/scan-ingredients");
    },
    startCarousel() {
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
      }, 4000); // ganti slide setiap 4 detik
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  max-width: 100%;
  font-family: "Segoe UI", sans-serif;
  background-color: #f4f4f4;
}

/* Sidebar Kiri */
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
  text-decoration: none;
  text-align: center;
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

/* Main Layout */
.main-section {
  flex: 1;
  padding: 2rem;
  background-color: #f4f4f4;
  overflow-y: auto;
  margin-left: 270px;
  transition: margin-left 0.3s ease-in-out;
}

.main-layout {
  display: flex;
  gap: 1.5rem;
}

.main-content {
  flex: 3;
}

.main-section-mobile {
  margin-left: 0; /* Menghapus margin saat sidebar terbuka di mode mobile */
}

/* Responsive improvement */
@media (max-width: 768px) {
  .main-section {
    margin-left: 0; /* Menghapus margin untuk mode mobile */
  }
}

/* Header */
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

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-sizing: border-box;
  margin-right: 1rem; /* jarak dengan tombol */
}

.feature-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.feature-card {
  flex: 1;
  padding: 20px;
  background-color: #e9f7ef;
  border: 1px solid #2e7d32;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}

.feature-card:hover {
  background-color: #d4efdf;
  transform: translateY(-3px);
}

.icon {
  font-size: 48px;
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
  width: 65%;
  padding: 5px;
  border-radius: 8px;
  justify-self: center;
}

/* Responsive improvement */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-right {
    justify-content: flex-start;
  }

  .search-input {
    margin-right: 0;
  }
}

/* Additional responsiveness for homeView.vue */
@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .main-content {
    flex: none;
    width: 100%;
  }

  .right-sidebar {
    flex: none;
    width: 100%;
    order: 2;
    margin-top: 1.5rem;
  }

  .hero-carousel {
    height: auto;
    padding: 1rem;
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
}

.user-box {
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Hero Section */
.hero-carousel {
  position: relative;
  overflow: hidden;
  background: #4caf50; /* hijau */
  border-radius: 12px;
  margin-top: 2rem;
  padding: 1.5rem;
  height: 250px; /* Atur tinggi tetap */
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide {
  display: flex;
  width: 100%;
  position: relative;
  height: 100%;
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

/* Recommendations */
.recommendations {
  margin-top: 2rem;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.recipe-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recipe-card img {
  width: 100%;
  border-radius: 8px;
}

/* Sidebar Kanan */
.right-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.nutrition-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.top-users {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top-users h4 {
  margin-bottom: 0.5rem;
}

.top-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.top-user img {
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.user-box {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  font-weight: bold;
}
.user-box:hover {
  text-decoration: underline;
}
/* Additional style for nutrition-card and canvas on mobile */
@media (max-width: 768px) {
  .main-section {
    margin-top: 2rem;
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
</style>
