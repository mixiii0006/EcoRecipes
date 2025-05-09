<template>
  <div class="profile-view">
    <Navbar />
    <main class="main-content">
      <h2>Your Profile</h2>
      <div v-if="user">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <!-- Additional profile fields can be added here -->
      </div>
      <p v-else>Loading profile...</p>
      <Button @click="handleLogout" class="logout-btn">Logout</Button>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/navbar.vue';
import Footer from '../components/footer.vue';
import Button from '../components/Button.vue';
import axios from 'axios';

export default {
  name: 'ProfileView',
  components: {
    Navbar,
    Footer,
    Button
  },
  data() {
    return {
      user: null
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.user = response.data;
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        this.$router.push('/login');
      }
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  color: #2e7d32;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  flex: 1;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
  text-align: center;
}

.logout-btn {
  margin-top: 1.5rem;
}
</style>
