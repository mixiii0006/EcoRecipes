<template>
  <div class="home-view">
    <main class="main-content">
      <h2>Welcome, {{ username }}</h2>
      <nav class="nav-links">
        <router-link to="/search" class="nav-link">Search</router-link>
        <a href="#" @click.prevent="handleLogout" class="nav-link">Logout</a>
      </nav>
      <section class="content-placeholder">
        <p>This is your home page. Use the search or logout options above.</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      username: ''
    };
  },
  created() {
    this.username = localStorage.getItem('username') || '';
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #2e7d32;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  justify-content: flex-start;
  align-items: stretch;
  text-align: left;
  padding: 2rem;
}

.main-content {
  /* max-width: 400px; Removed to allow full width */
  width: 100%;
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
}

h2 {
  margin-bottom: 1rem;
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #2e7d32;
  color: white;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: #1b5e20;
}

.content-placeholder {
  font-size: 1.1rem;
  color: #555;
}
</style>
