<template>
  <div class="auth-container">
    <div class="left-panel">
      <h1>Satu Resep, Satu langkah untuk Bumi.</h1>
      <p>
        Masukkan bahan makanan yang kamu miliki, dan temukan resep rendah emisi
        yang membantu melindungi bumi.
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
              Forgot Password?
            </button>
          </div>

          <Button type="submit">Login</Button>
        </form>

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
        <p class="register-link">
          Don't have an account?
          <router-link to="/register">Register Here</router-link>
        </p>
      </div>
    </div>
  </div>
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
.auth-container {
  display: flex;
  min-height: 100vh;
  align-items: stretch;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.left-panel {
  flex: 1;
  background: url("/images/landing-bg.jpg") no-repeat center center/cover;
  color: white;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.left-panel h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.left-panel p {
  font-size: 1.25rem;
  max-width: 400px;
}

.right-panel {
  flex: 1;
  background: #f9f5f0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
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
}

.form-card h2 {
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.form-card p {
  margin-bottom: 2rem;
  color: #666;
}

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

.forgot-password {
  background: none;
  border: none;
  color: #2e7d32;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn {
  width: 100%;
  background: linear-gradient(to right, #235f3a, #73b06f);
}

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

.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.register-link a {
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .left-panel {
    padding: 2rem;
  }

  .left-panel h1 {
    font-size: 2rem;
  }

  .left-panel p {
    font-size: 1.1rem;
  }

  .right-panel {
    padding: 2rem;
  }

  .form-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .left-panel {
    order: 1;
    text-align: center;
    padding: 2rem 1.5rem;
  }

  .left-panel h1 {
    font-size: 1.8rem;
  }

  .left-panel p {
    font-size: 1rem;
    max-width: 100%;
  }

  .right-panel {
    order: 2;
    padding: 2rem 1rem;
    justify-content: flex-start;
    min-height: auto;
  }

  .form-card {
    max-width: 100%;
    width: 100%;
  }
}

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

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>