<template>
  <div class="profile-view">
    <!-- Header dengan foto dan avatar -->
    <div class="profile-header">
      <img class="cover-img" src="https://source.unsplash.com/1200x300/?food" alt="Cover" />
      <div class="profile-info">
        <img class="avatar" src="https://source.unsplash.com/100x100/?person" alt="User" />
        <h2>{{ user?.username || 'Loading...' }}</h2>
      </div>
    </div>

    <!-- Konten utama -->
    <div class="profile-body">
      <!-- Sidebar kiri -->
      <aside class="left-panel">
        <h3>Informasi</h3>
        <p><strong>Email:</strong> {{ user?.email || '-' }}</p>
        <p><strong>Bergabung:</strong> {{ user?.joined || '2024' }}</p>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </aside>

      <!-- Konten kanan -->
      <section class="right-panel">
        <!-- Tab -->
        <div class="tabs">
          <button :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">Daftar makanan</button>
          <button :class="{ active: activeTab === 'fav' }" @click="activeTab = 'fav'">Favorit</button>
        </div>

        <!-- Grid makanan -->
        <div class="food-grid">
          <div class="food-card" v-for="n in 8" :key="n">
            <img src="https://source.unsplash.com/160x160/?grilled-food" alt="Food" />
            <h4>Bakar</h4>
            <p>GURIH & PEDAS</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      user: null,
      activeTab: 'list'
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
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

/* Header */
.profile-header {
  position: relative;
  text-align: center;
  background-color: #2e7d32;
  padding-bottom: 4rem;
}

.cover-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.profile-info {
  position: absolute;
  bottom: -40px;
  left: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
}

.profile-info h2 {
  color: white;
  margin: 0;
}

/* Body */
.profile-body {
  display: flex;
  margin-top: 5rem;
  padding: 2rem;
  gap: 2rem;
  background-color: #f4f4f4;
}

/* Sidebar kiri */
.left-panel {
  flex: 1;
  background: #dbe6d5;
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 200px;
}

.logout-btn {
  margin-top: 1.5rem;
  background-color: #d32f2f;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #b71c1c;
}

/* Konten kanan */
.right-panel {
  flex: 3;
  background: #eff5e9;
  border-radius: 12px;
  padding: 1.5rem;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background-color: #c5d7c2;
  cursor: pointer;
  font-weight: bold;
}

.tabs button.active {
  background-color: #2e7d32;
  color: white;
}

/* Grid */
.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
}

.food-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.food-card img {
  width: 100%;
  border-radius: 8px;
}
</style>
