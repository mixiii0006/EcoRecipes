<template>
  <div class="profile-container">
    <!-- Header Section with Background and Profile Picture -->
    <div class="profile-header">
      <!-- Profile Background (Jumbotron) -->
      <div class="profile-background">
        <img src="/images/bg-profil.jpg" alt="beautiful background" class="profile-bg" />
      </div>

      <!-- Profile Picture -->
      <div class="profile-picture">
        <img src="/images/profile.jpg" alt="Profile Picture" class="profile-img"/>
      </div>

      <!-- Profile Info -->
      <div class="profile-info">
        <h2 class="profile-name">Natasya Salsabilla</h2>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="profile-content">
      <!-- Information Section with Form -->
      <div class="information">
        <h3>Informasi</h3>
        <form class="info-form">
          <div class="form-group">
            <label for="name">Nama:</label>
            <input type="text" id="name" v-model="user.name" readonly />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" readonly />
          </div>
          <div class="form-group">
            <label for="gender">Jenis Kelamin:</label>
            <input type="text" id="gender" v-model="user.gender" readonly />
          </div>
          <div class="form-group">
            <label for="favoriteFoodCount">Jumlah Makanan Favorit:</label>
            <input type="number" id="favoriteFoodCount" v-model="user.favoriteFoodCount" readonly />
          </div>
          <div class="form-group">
            <label for="cookedFoodCount">Jumlah Makanan yang Telah Dimasak:</label>
            <input type="number" id="cookedFoodCount" v-model="user.cookedFoodCount" readonly />
          </div>
        </form>
      </div>

      <!-- Food and Favorite Section -->
      <div class="food-favorite-section">
        <!-- Toggle buttons for switching between food list and favorite -->
        <div class="toggle-buttons">
          <button 
            :class="{'active': isFoodList}" 
            @click="toggleContent('food')">
            Daftar Makanan
          </button>
          <button 
            :class="{'active': !isFoodList}" 
            @click="toggleContent('favorite')">
            Favorit
          </button>
        </div>

        <!-- Content for Daftar Makanan or Favorite based on active tab -->
        <div class="food-list" v-if="isFoodList">
          <h3>Daftar Makanan</h3>
          <div class="food-list-grid">
            <div class="food-card" v-for="index in 6" :key="index">
              <img src="https://via.placeholder.com/100" alt="Food Image" class="food-img" />
              <div class="food-name">Bakar</div>
            </div>
          </div>
        </div>

        <div class="food-list" v-if="!isFoodList">
          <h3>Favorit</h3>
          <div class="food-list-grid">
            <div class="food-card" v-for="index in 6" :key="'favorite' + index">
              <img src="https://via.placeholder.com/100" alt="Food Image" class="food-img" />
              <div class="food-name">Bakar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      isFoodList: true, // Determines which content (food list or favorite) is active
      user: {
        name: 'Natasya Salsabilla',
        email: 'natasya@example.com',
        gender: 'Perempuan',
        favoriteFoodCount: 8,
        cookedFoodCount: 5,
      }, // User data
    };
  },
  methods: {
    // Toggle between food list and favorite content
    toggleContent(section) {
      this.isFoodList = section === 'food';
    }
  }
};
</script>

<style scoped>
.profile-container {
  font-family: 'Poppins', sans-serif;
  background-color: #f1f1f1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* Header Section */
.profile-header {
  position: relative;
  text-align: center;
  background-color: #0f790f;
  margin-bottom: 30px;
  border-radius: 10px;
}

.profile-bg {
  width: 100%;
  height: 300px; 
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

.profile-picture {
  position: relative;
  margin-top: -80px;
  justify-self: left;
  margin-left: 100px; /* To lift the profile picture above the background */
}

.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid white; /* Adds a white border around the profile image */
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-self: left;
  margin-left: 100px;
  margin-top: -20px;
}

.profile-name {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  margin-top: -20px;
  padding-left: 120px;
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
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
}

.info-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
  padding: 15px;
  border-radius: 10px;
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
</style>
