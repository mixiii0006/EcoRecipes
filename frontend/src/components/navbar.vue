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
          <router-link to="/login" class="btn login-btn"><i class="fa-solid fa-right-to-bracket"></i> Login</router-link>
        </li>
        <li>
          <router-link to="/register" class="btn register-btn"><i class="fa-solid fa-user-plus"></i> Register</router-link>
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
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px 20px;
}

/* Logo */
.logo-text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.navbar-brand {
  margin-left: 20px;
}

/* Desktop Nav Actions */
.navbar-actions {
  display: flex;
  list-style: none;
  gap: 1rem;
  margin: 0;
  padding: 0;
  margin-right: 60px;
  height: 60px;
  align-items: center;
  transition: none;
}

/* Buttons */
.btn {
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  transition: all 0.3s ease;
}

.login-btn, .register-btn {
  background-color: white;
  color: #2e7d32;
  padding: 8px 16px;
  font-size: 16px;
  width: 130px;
  box-sizing: border-box;
}

.login-btn:hover, .register-btn:hover {
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

/* Burger Button */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1100;
}

.burger span {
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
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

/* Responsive - Mobile / Tablet */
@media (max-width: 768px) {
  .burger {
    display: flex;
    margin-right: 40px;
  }

  .navbar {
  height: 50px; 
}

  .navbar-actions {
  display: flex;
  flex-direction: column;
  background-color: rgba(37, 89, 40, 0.75); /* hijau dengan transparansi 95% */
  position: fixed;
  top: 0;
  margin: 0;
  padding: 0;
  right: -100%; /* awalnya di luar layar */
  width: 70%;
  height: 100vh;
  padding-top: 80px;
  transition: right 0.3s ease;
  box-shadow: -2px 0 8px rgba(0,0,0,0.2);
  z-index: 1050;
}

  .navbar-actions.open {
    right: 0;
  }

  .navbar-actions li {
    margin: 1rem 0;
    width: 100%;
    text-align: center;
  }

  .login-btn, .register-btn {
    width: 80%;
    padding: 12px 16px;
    font-size: 1rem;
    border-radius: 8px;
    background-color: white;
    color: #2e7d32;
    display: block;
    margin: 0 auto;
  }

  .login-btn:hover, .register-btn:hover {
    background-color: #a5d6a7;
    color: #235f3a;
    transform: scale(1.05);
  }
}
</style>
