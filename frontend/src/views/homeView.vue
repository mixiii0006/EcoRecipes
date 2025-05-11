<template>
  <div class="home-container">
    <Sidebar />

    <!-- Konten Utama -->
    <main class="main-section">
      <div class="main-layout">
        <!-- Konten Tengah -->
        <div class="main-content">
          <header class="header">
            <input type="text" placeholder="Search the menu" class="search-input" />
            <button class="action-btn" @click="handleInputClick">Input</button>
            <button class="action-btn" @click="handleScanClick">Scan</button>
          </header>

          <!-- Hero -->
          <section class="hero">
            <div class="hero-text">
              <h2>Makan Apa Hari Ini??</h2>
              <p>Siap sedia wawasan dengan bahan lokal. Satu masakanmu mendekatkan keberlanjutan di setiap hidangan.</p>
              <p><strong>Main Ingredients:</strong> Ayam, Sayur, Cabai, Bawang</p>
            </div>
            <img src="https://source.unsplash.com/featured/?food" alt="Dish" class="hero-img" />
          </section>

          <!-- Rekomendasi -->
          <section class="recommendations">
            <h3>Recommendations</h3>
            <div class="recipe-grid">
              <div class="recipe-card" v-for="n in 6" :key="n">
                <img src="https://source.unsplash.com/160x160/?indonesian-food" alt="Food" />
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
                <img src="https://source.unsplash.com/32x32/?person" alt="User Avatar" />
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
    };
  },
  created() {
    this.username = localStorage.getItem("username") || "";
  },
  mounted() {
    this.renderPieChart();
  },
  methods: {
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.$router.push("/");
    },
    renderPieChart() {
      const ctx = document.getElementById("nutritionChart");
      new Chart(ctx, {
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
.home-container {
  display: flex;
  height: 100vh;
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
}

.main-layout {
  display: flex;
  gap: 1.5rem;
}

.main-content {
  flex: 3;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 60%;
}

.action-btn {
  background: linear-gradient(to bottom, #235f3a, #73b06f);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
}

.user-box {
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Hero Section */
.hero {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  align-items: center;
  gap: 1.5rem;
}

.hero-img {
  width: 200px;
  border-radius: 10px;
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

</style>
