<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">EcoRecipes</router-link>

      <button class="burger" @click="toggleMenu">
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
      </button>

      <ul :class="['nav-links', { open: isMenuOpen }]">
        <li v-if="isAuthenticated"><router-link to="/home">Home</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/search">Search</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/profile">Profile</router-link></li>
        <li v-if="isAuthenticated"><a href="#" @click.prevent="handleLogout">Logout</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isAuthenticated: false,
      isMenuOpen: false,
    };
  },
  created() {
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = !!localStorage.getItem('token');
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.isAuthenticated = false;
      this.$router.push('/');
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  },
  watch: {
    $route() {
      this.checkAuth();
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: #2e7d32;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  flex-wrap: wrap;
}

.logo {
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

/* Burger menu */
.burger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 18px;
  width: 25px;
  background: none;
  border: none;
  cursor: pointer;
}

.burger span {
  height: 3px;
  width: 100%;
  background: white;
  transition: 0.3s ease;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-left: auto;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.nav-links li a:hover {
  color: #a5d6a7;
}

/* Responsive */
@media (max-width: 768px) {
  .burger {
    display: flex;
  }

  .nav-links {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    background-color: #2e7d32;
    padding: 1rem;
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links li {
    width: 100%;
    margin: 0.5rem 0;
  }

  .nav-links li a {
    display: block;
    width: 100%;
  }
}
</style>
