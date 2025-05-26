<template>
  <div class="profile-container">
    <!-- Header Section with Background and Profile Picture -->
    <div class="profile-header">
      <!-- Background dengan overlay dan konten -->
      <div class="profile-background">
        <img
          src="/images/bg-profil.jpg"
          alt="beautiful background"
          class="profile-bg"
        />
        <div class="overlay"></div>

        <!-- Tombol Dashboard -->
        <div class="dashboard-controls">
          <button @click="goToDashboard">Dashboard</button>
          <button @click="logout" class="logout">Logout</button>
        </div>

        <!-- Konten kiri bawah -->
        <div class="profile-overlay-left">
          <img
            src="/images/profile.jpg"
            alt="Profile Picture"
            class="profile-img"
          />
          <h2 class="profile-name">Natasya salsabilla</h2>
        </div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="profile-content">
      <!-- Information Section with Form -->
      <div class="information">
        <div class="highlighted-karmon">
          Total Amount of Carmon Successfully Reduced: {{ user.totalKarmonReduced }}
        </div>
        <h3>Information</h3>
        <form class="info-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="user.name" readonly />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" readonly />
          </div>
          <div class="form-group">
            <label for="gender">Gender:</label>
            <input type="text" id="gender" v-model="user.gender" readonly />
          </div>
          <div class="form-group">
            <label for="favoriteFoodCount">Number of Favorite Foods:</label>
            <input
              type="number"
              id="favoriteFoodCount"
              v-model="user.favoriteFoodCount"
              readonly
            />
          </div>
          <div class="form-group">
            <label for="cookedFoodCount"
              >Amount of Food Cooked:</label
            >
            <input
              type="number"
              id="cookedFoodCount"
              v-model="user.cookedFoodCount"
              readonly
            />
          </div>
        </form>
      </div>

      <!-- Food and Favorite Section -->
      <div class="food-favorite-section">
        <!-- Toggle buttons for switching between food list and favorite -->
        <div class="toggle-buttons">
          <button
            :class="{ active: isFoodList }"
            @click="toggleContent('food')"
          >
            Food List
          </button>
          <button
            :class="{ active: !isFoodList }"
            @click="toggleContent('favorite')"
          >
            Favorite
          </button>
        </div>

        <section class="food-favorite-section">
          <div class="food-list-grid">
            <div class="food-card" v-for="index in 6" :key="index">
              <img
                src="/images/bg-profil.jpg"
                alt="Food Image"
                class="food-img"
              />
              <div class="food-name">grilled</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      isFoodList: true, // Determines which content (food list or favorite) is active
      user: {
        name: "Natasya Salsabilla",
        email: "natasya@example.com",
        gender: "Perempuan",
        favoriteFoodCount: 8,
        cookedFoodCount: 5,
        totalKarmonReduced: 12, // example value for total karmon reduced
      }, // User data
    };
  },
  methods: {
    // Toggle between food list and favorite content
    toggleContent(section) {
      this.isFoodList = section === "food";
    },
    goToDashboard() {
      // Arahkan ke halaman dashboard (ubah sesuai route-mu)
      this.$router.push("/home");
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.profile-container {
  font-family: "Poppins", sans-serif;
  background-color: #f1f1f1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.highlight input {
  background-color: #d1ffd6;
  border: 2px solid #4caf50;
  font-weight: bold;
}

.highlighted-karmon {
  position: relative;
  background:  #4caf50;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  padding: 15px 30px 15px 50px;
  margin-bottom: 20px;
  border-radius: 10px;
  letter-spacing: 1.2px;
  text-align: center;
  user-select: none;
}

.highlighted-karmon::before {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.8rem;
  filter: drop-shadow(0 0 2px white);
}

/* Header Section */
.profile-header {
  position: relative;
  margin-bottom: 30px;
  border-radius: 10px;
  z-index: 1;
}

.profile-background {
  position: relative;
  height: 250px;
  border-radius: 10px;
  overflow: hidden;
}

.profile-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.profile-overlay-left {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
}

.profile-name {
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
  margin: 0;
}

/* Main Content Section */
.profile-content {
  display: flex;
  gap: 30px;
  justify-content: space-between;
}

/* Information Section */
.information {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  transition: box-shadow 0.3s ease;
}

.information:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-form {
  gap: 12px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.form-group input {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input[readonly] {
  background-color: #f9f9f9;
  cursor: default;
  color: #666;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 0;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  text-align: center;
  width: 100%;
}

.form-group input {
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  transition: border-color 0.3s ease;
  text-align: center;
}

.form-group input:focus {
  border-color: #1976d2;
  outline: none;
  background-color: white;
}

.form-group input[readonly] {
  background-color: #f0f0f0;
  cursor: default;
  color: #888;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #f7f7f7;
}

input[readonly] {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

/* Food and Favorite Section */
.food-favorite-section {
  flex: 2;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.food-favorite-section:hover {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
}

.toggle-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.toggle-buttons button {
  background-color: transparent;
  color: #4caf50;
  border: 2px solid #4caf50;
  border-radius: 30px;
  font-weight: 700;
  padding: 10px 24px;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: none;
}

.toggle-buttons button.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.toggle-buttons button:hover {
  background-color: #66bb6a;
  color: white;
  border-color: #66bb6a;
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
}

.food-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
}

.food-card {
  background-color: white;
  border-radius: 20px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.food-card:hover {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);
  transform: translateY(-6px);
}

.food-img {
  border-radius: 16px;
  height: 140px;
  width: 140px;
  object-fit: cover;
  margin-bottom: 12px;
}

.food-name {
  font-weight: 700;
  color: #388e3c;
  font-size: 1.2rem;
  margin-top: 0;
  user-select: none;
}

.toggle-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
}

.toggle-buttons button {
  padding: 10px 20px;
  background-color: #73b06f;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.toggle-buttons button.active {
  background-color: #2e7d32;
}

.food-list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.food-card {
  background-color: #f7f7f7;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}

.food-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.food-name {
  margin-top: 10px;
  font-weight: bold;
}

.dashboard-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 2;
  display: flex;
  gap: 10px;
}

.dashboard-controls button {
  padding: 8px 16px;
  background-color: #ffffffcc;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  color: #2e7d32;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dashboard-controls button.logout {
  color: #b71c1c;
}

.dashboard-controls button:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    gap: 20px;
  }

  .dashboard-controls {
    position: absolute;
    top: 20px;
    left: 50%; /* posisikan titik awal di tengah */
    transform: translateX(-50%); /* geser ke kiri setengah lebar elemen */
    z-index: 2;
    display: flex;
    gap: 10px;
  }

  .information,
  .food-favorite-section {
    width: 100%;
    margin-left: -20px;
  }

  .profile-overlay-left {
    left: 50%;
    bottom: 10px;
    transform: translateX(-50%);
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .profile-name {
    font-size: 1.5rem;
    text-align: center;
  }

  .food-list-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
  }

  .form-group input {
    width: 100%;
  }

  .toggle-buttons {
    justify-content: center;
  }
}
</style>
