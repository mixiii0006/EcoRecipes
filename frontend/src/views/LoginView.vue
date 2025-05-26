<template>
  <div class="auth-container">
    <div class="left-panel">
      <h1>One Recipe, One step for the Earth.</h1>
      <p>
        Input the ingredients you have and discover low-emission recipes that
        help protect the earth.
      </p>
    </div>
    <div class="right-panel">
      <div class="form-card">
        <button class="close-btn" @click="$router.push('/')">×</button>

        <h2>Welcome Back</h2>
        <p>Login to your account!</p>
        <form @submit.prevent="handleLogin">
          <FormInput
            id="email"
            label="Email"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            required
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
          />

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              Remember Me
            </label>

            <button
              type="button"
              @click="showForgotModal = true"
              class="forgot-password"
            >
              Forget Password?
            </button>
          </div>

          <Button type="submit">Login</Button>
        </form>

        <p class="register-link">
          Don't have an account?
          <router-link to="/register">Register Here</router-link>
        </p>
      </div>
    </div>
  </div>
  <ForgotPasswordModal
    v-if="showForgotModal"
    @close="showForgotModal = false"
    @email-verified="handleEmailVerified"
  />

  <ResetPasswordModal
    v-if="showResetModal"
    :email="resetEmail"
    @close="showResetModal = false"
  />
</template>

<script>
import FormInput from "../components/FormInput.vue";
import Button from "../components/Button.vue";
import ForgotPasswordModal from "../components/forgotPasswordModal.vue";
import ResetPasswordModal from "../components/resetPasswordModal.vue";
import axios from "axios";

export default {
  name: "LoginView",
  components: {
    FormInput,
    Button,
    ForgotPasswordModal,
    ResetPasswordModal,
  },
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      showForgotModal: false,
      showResetModal: false,
      resetEmail: "",
    };
  },
  methods: {
    handleEmailVerified(email) {
      this.resetEmail = email;
      this.showForgotModal = false;
      this.showResetModal = true;
    },
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        this.$router.push("/home");
      } catch (error) {
        alert("Login failed. Please check your credentials.");
      }
    },
  },
};
</script>

<style scoped>
/* Container utama */
.auth-container {
  display: flex;
  min-height: 100vh;
  align-items: stretch;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Panel kiri dengan background gambar + overlay */
.left-panel {
  flex: 1;
  position: relative;
  background: url("/images/landing-bg.jpg") no-repeat center center/cover;
  color: white;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
}

/* Overlay gradasi gelap untuk kontras teks */
.left-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom right,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.6)
  );
  z-index: 0;
}

/* Pastikan konten panel kiri di atas overlay */
.left-panel > * {
  position: relative;
  z-index: 1;
}

.left-panel h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeSlideUp 1s ease forwards;
}

.left-panel p {
  font-size: 1.25rem;
  max-width: 400px;
}

/* Panel kanan form */
.right-panel {
  flex: 1;
  background: #f9f5f0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

/* Card form dengan animasi fade + slide up */
@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
  animation: fadeSlideUp 1s ease forwards;
}

.form-card h2 {
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.form-card p {
  margin-bottom: 2rem;
  color: #666;
}

/* Opsi form (remember me + forgot password) */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #333;
  cursor: pointer;
}

.remember-me input {
  accent-color: #2e7d32;
  cursor: pointer;
}

/* Tombol forgot password dan hover efek */
.forgot-password {
  background: none;
  border: none;
  color: #2e7d32;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s ease, color 0.3s ease;
}

.forgot-password:hover {
  transform: scale(1.05);
  color: #1b4727;
  text-decoration: underline;
}

/* Tombol utama login */
.btn {
  width: 100%;
  background: linear-gradient(to right, #235f3a, #73b06f);
  transition: transform 0.2s ease, background 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #1b4727, #549c4a);
}

/* Tombol close di pojok */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #2e7d32;
}

/* Link register */
.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.register-link a {
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, color 0.3s ease;
}

.register-link a:hover {
  transform: scale(1.05);
  color: #1b4727;
  text-decoration: underline;
}

/* Responsiveness */

/* Tablet besar */
@media (max-width: 1024px) {
  .left-panel {
    display: none;
  }
  /* Container flex jadi kolom, full tinggi viewport */
  .auth-container {
    flex-direction: column;
    height: 100vh;
    margin: 0;
  }

  /* Panel kanan jadi full layar, flex container center */
  .right-panel {
    flex: none;
    width: 100%;
    height: 100vh; /* penuh layar */
    padding: 1.5rem 1.5rem; /* padding kiri kanan cukup */
    display: flex;
    justify-content: center; /* horizontal center */
    align-items: center; /* vertical center */
    box-sizing: border-box;
    overflow: hidden; /* hilangkan scroll jika ada */
  }

  /* Form card muat penuh lebar dengan max 400px */
  .form-card {
    max-width: 400px;
    width: 100%;
    margin: 0; /* hilangkan margin supaya benar-benar center */
    box-sizing: border-box;
  }
}

/* Tablet kecil / mobile landscape */
@media (max-width: 768px) {
  .form-options {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: nowrap;
    width: 100%;
    box-sizing: border-box;
  }

  .remember-me {
    display: flex !important;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
    flex-shrink: 0;
    margin: 0;
  }

  /* Pastikan tombol forgot-password inline flex supaya sejajar */
  .forgot-password {
    white-space: nowrap;
    flex-shrink: 0;
    display: inline-flex; /* <- ini tambahan penting */
    align-items: center; /* vertikal rata tengah */
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
}

/* Mobile portrait kecil */
@media (max-width: 480px) {
  .left-panel h1 {
    font-size: 1.5rem;
  }

  .left-panel p {
    font-size: 0.95rem;
  }

  .form-card {
    padding: 1.5rem;
  }

  .close-btn {
    font-size: 1.2rem;
    top: 0.75rem;
    right: 0.75rem;
  }

  /* Ubah dari flex-direction: column ke row supaya tetap sejajar */
  .form-options {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 0.5rem;
  }
}
</style>
