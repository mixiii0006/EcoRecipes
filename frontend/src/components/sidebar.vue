<template>
  <aside class="sidebar">
    <h1 class="logo">EcoRecipes</h1>

    <nav class="menu">
      <router-link to="/home" class="menu-item" exact-active-class="active">
        <i class="fas fa-home"></i>
        Dashboard
      </router-link>
      <router-link to="/search" class="menu-item" exact-active-class="active">
        <i class="fas fa-search"></i>
        Recipes
      </router-link>
    </nav>

    <button class="logout-btn" @click="handleLogout"><i class="fas fa-sign-out-alt"></i> Logout</button>
  </aside>
</template>

<script>
export default {
  name: "Sidebar",
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
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 222px;
  height: 93%;
  background-color: #f9f9f9;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top-right-radius: 30px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  font-family: "Poppins", sans-serif;
  border-right: 2px solid #e0e0e0;
}

.logo {
  font-family: "Georgia", serif;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
}

.menu {
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
  align-self: center;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  border: none;
  margin-bottom: 10px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}
</style>
