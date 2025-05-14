<template>
  <header>
    <nav class="navbar">
      <div class="navbar-brand">
        <h1 class="logo-text">EcoRecipes</h1>
      </div>

      <button class="burger" @click="toggleMenu" aria-label="Toggle navigation">
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
      </button>

      <ul class="navbar-actions" :class="{ open: isMenuOpen }">
        <li>
          <router-link to="/login" class="btn login-btn">Login</router-link>
        </li>
        <li>
          <router-link to="/register" class="btn register-btn">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
/* Navbar wrapper */
.navbar {
  background: linear-gradient(to right, #235f3a, #73b06f); /* hijau */
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px 20px; /* Tambahkan padding untuk navbar */
}

/* Brand/Logo */
.logo-text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.navbar-brand {
  margin-left: 20px;
}

/* Nav Actions */
.navbar-actions {
  display: flex;
  list-style: none;
  gap: 1rem;
  margin: 0;
  padding: 0;
  margin-right: 60px;
  height: 60px; /* Tetapkan tinggi tetap */
  align-items: center; /* Rata tengah vertikal */
}

/* Buttons */
.btn {
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  transition: all 0.3s ease; /* Tambahkan transisi untuk efek yang lebih halus */
}

.login-btn, .register-btn {
  background-color: white;
  color: #2e7d32;
  padding: 8px 16px; /* Tetapkan padding awal */
  font-size: 16px; /* Tetapkan ukuran font awal */
  position: relative; /* Tambahkan position relative */
  justify-content: center; /* Rata tengah horizontal */
  width: 100px; /* Lebar tetap untuk tombol */
  box-sizing: border-box; /* Pastikan padding tidak mengubah ukuran total */
}

.login-btn:hover, .register-btn:hover {
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Tambahkan bayangan saat hover */
  /* Hapus perubahan padding agar ukuran tidak berubah */
  transform: scale(1.05); /* Efek sedikit membesar tanpa mengubah dimensi navbar */
}

/* Burger menu default hidden */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}

.burger span {
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.burger span.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Responsive */
@media (max-width: 768px) {
  .burger {
    display: flex;
    margin-right: 50px;
  }

  .navbar {
    padding: 1.5rem;
  }

  .navbar-actions {
    display: none;
    flex-direction: column;
    background-color: #2e7d32;
    position: absolute;
    top: 100%;
    right: 0;
    width: 100%;
    padding: 1rem;
  }

  .navbar-actions.open {
    display: flex;
  }

  .navbar-actions li {
    margin: 0.5rem 0;
  }
}
</style>
