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
          Total Amount of Carbon Successfully Reduced: {{ user.totalKarmonReduced }}
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
            <RecipeCard
              v-for="item in isFoodList ? model.cooks : model.favorites"
              :key="item._id"
              :name="item.title_cleaned || item.name"
              :image="item.image"
              :duration="item.duration || 0"
              :carbon="item.carbon_score || 'N/A'"
              @open="openModal(item)"
            />
          </div>
        </section>
      </div>
    </div>
    <RecipeModal v-if="showModal" :food="selectedFood" @close="closeModal" />
  </div>
</template>

<script>
import ProfileModel from "../model/ProfileModel";
import ProfilePresenter from "../presenter/ProfilePresenter";
import RecipeCard from "../components/RecipeCard.vue";
import RecipeModal from "../components/RecipeModal.vue";

export default {
  name: "Profile",
  components: {
    RecipeCard,
    RecipeModal,
  },
  data() {
    return {
      model: new ProfileModel(),
      presenter: null,
      user: null,
      isFoodList: true,
      showModal: false,
      selectedFood: null,
    };
  },
  async created() {
    this.presenter = new ProfilePresenter(this.model, this);
    await this.presenter.loadProfileData();
    this.user = this.model.user;
    this.isFoodList = this.model.isFoodList;
  },
  methods: {
    update() {
      this.user = this.model.user;
      this.isFoodList = this.model.isFoodList;
      this.$forceUpdate();
    },
    toggleContent(section) {
      this.presenter.toggleContent(section);
    },
    goToDashboard() {
      this.presenter.goToDashboard();
    },
    logout() {
      this.presenter.logout();
    },
    openModal(item) {
      this.selectedFood = item;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedFood = null;
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

/* FORM WRAPPER */
.info-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* FORM GROUP */
.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
  box-sizing: border-box;
}

/* LABEL */
.form-group label {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  text-align: center;
  width: 100%;
}

/* INPUT */
.form-group input {
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  color: #333;
  text-align: center;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

/* FOKUS */
.form-group input:focus {
  border-color: #1976d2;
  outline: none;
  background-color: #ffffff;
}

/* READONLY */
.form-group input[readonly] {
  background-color: #f0f0f0;
  cursor: default;
  color: #888;
}

/* GLOBAL INPUT DAN LABEL – optional kalau kamu pakai input/label di luar .form-group */
label {
  font-weight: bold;
}

input {
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #f7f7f7;
  padding: 10px;
  box-sizing: border-box;
}

input[readonly] {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .info-form {
    padding: 15px;
  }

  .form-group input {
    font-size: 0.95rem;
    padding: 8px 10px;
  }

  .form-group label {
    font-size: 0.95rem;
  }
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
    margin-left: 0; /* Changed from -20px to 0 for better alignment */
    padding: 0 15px; /* Increased padding for better spacing */
    box-sizing: border-box; /* Ensure padding doesn't cause overflow */
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

  

  .toggle-buttons {
    justify-content: center;
  }

  /* Additional improvements for mobile */
  .profile-container {
    padding: 10px 5px;
  }

  .dashboard-controls button {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .food-card {
    padding: 8px;
  }

  .food-img {
    height: 120px;
  }
}
</style>
