<template>
  <div>
    <!-- Tombol Burger -->
    <button v-if="!isMenuOpen && isMobile" class="burger-icon" @click="toggleMenu">
      <i class="fa-solid fa-bars"></i>
    </button>

    <!-- Konten utama yang dapat menutup sidebar -->
    <div v-if="isMenuOpen && isMobile" class="overlay" @click="toggleMenu"></div>

    <!-- Sidebar -->
    <aside v-show="!isMobile || isMenuOpen" class="sidebar">
      <button v-if="isMenuOpen && isMobile" class="close-btn" @click="toggleMenu" aria-label="Close sidebar">×</button>
      <h1 class="logo">EcoRecipes</h1>

      <nav class="menu">
        <router-link to="/home" class="menu-item" exact-active-class="active">
          <i class="fa-solid fa-home"></i>
          Home
        </router-link>
        <router-link to="/search" class="menu-item" exact-active-class="active">
          <i class="fa-solid fa-book"></i>
          Recipes
        </router-link>
      </nav>

      <button class="logout-btn" @click="handleLogout">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </aside>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isMenuOpen: false,
      isMobile: false,
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.$router.push("/");
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) this.isMenuOpen = false;
    },
  },
};
</script>

<style scoped>
/* Tombol burger */
.burger-icon {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #2e7d32; /* Hijau */
  cursor: pointer;
  display: block;
}

/* Overlay untuk menutup sidebar */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;                
  width: 222px;
  background-color: #f9f9f9;
  padding: 2rem 1rem; 
  display: flex;
  flex-direction: column;
  border-top-right-radius: 30px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  font-family: "Poppins", sans-serif;
  border-right: 2px solid #e0e0e0;
  z-index: 1000;
}

.logo {
  font-family: "Georgia", serif;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
}

.menu {
  flex: 1 1 auto;        
  overflow-y: auto;     
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: #2e7d32;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.menu-item:hover,
.menu-item.active {
  background-color: #e6f4ea;
}

.logout-btn {
  margin-top: auto;       
  margin-bottom: 1rem;   
  align-self: center;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .sidebar {
    z-index: 1000;
    background-color: #f9f9f9;
    width: 222px;
    position: fixed;
    top: 0;
    left: 0;
    border-top-right-radius: 30px;
    transition: transform 0.3s ease-in-out;
  }

  .overlay {
    display: block;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #2e7d32;
    cursor: pointer;
    font-weight: bold;
    line-height: 1;
  }
}
</style>
