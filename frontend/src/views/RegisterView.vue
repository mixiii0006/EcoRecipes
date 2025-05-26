<template>
  <div class="auth-container">
    <div class="left-panel">
      <h1>One Recipe, One step for the Earth.</h1>
      <p>
        Input the ingredients you have and discover low-emission recipes that help protect the earth.
      </p>
    </div>
    <div class="right-panel">
      <div class="form-card">
        <button class="close-btn" @click="$router.push('/')">×</button>

        <h2>Create Account</h2>
        <p>Register to get started!</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <form @submit.prevent="handleRegister">
          <FormInput
            id="name"
            label="Name"
            v-model="name"
            placeholder="Enter your name"
            required
          />
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
          <FormInput
            id="confirm-password"
            label="Confirm Password"
            type="password"
            v-model="confirmPassword"
            placeholder="Re-enter your password"
            required
          />
          <Button type="submit">Register</Button>
        </form>
        <p class="login-link">
          Already have an account?
          <router-link to="/login">Login Here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import FormInput from "../components/FormInput.vue";
import Button from "../components/Button.vue";
import axios from "axios";

export default {
  name: "RegisterView",
  components: {
    FormInput,
    Button,
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      try {
        await axios.post("http://localhost:3000/api/register", {
          name: this.name,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword,
        });
        alert("Registration successful! Please login.");
        this.$router.push("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "Registration failed. Please try again.";
        }
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

.left-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65); /* overlay gelap */
  z-index: 0;
}

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

.right-panel {
  flex: 1;
  background: #f9f5f0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  box-sizing: border-box;
}

.form-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
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

.btn {
  width: 100%;
  background: linear-gradient(to right, #235f3a, #73b06f);
  margin-top: 5px;
}

.btn:hover {
  transform: scale(1.05);
  background: linear-gradient(to right, #1b4727, #549c4a);
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

.login-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #2e7d32;
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 1rem;
  font-weight: 500;
}

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

/* Responsive */
@media (max-width: 1024px) {
  .left-panel {
    display: none;
  }
  .auth-container {
    flex-direction: column;
    height: 100vh;
    margin: 0;
  }

  .right-panel {
    flex: none;
    width: 100%;
    height: 100vh;
    padding: 1rem 1rem; /* padding lebih kecil */
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
  }

  .form-card {
    max-width: 400px;
    width: 100%;
    margin: 0 auto; /* pastikan center horizontal */
    padding: 2rem;
    box-sizing: border-box;
  }
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .left-panel {
    display: none;
  }

  .right-panel {
    order: 2;
    padding: 2rem 1.5rem;       /* padding kiri kanan agak besar tapi pas */
    justify-content: center;    /* horizontal center */
    align-items: center;        /* vertical center */
    display: flex;
    min-height: 100vh;          /* agar tinggi penuh layar */
    box-sizing: border-box;
  }

  .form-card {
    max-width: 400px;           /* batas maksimal */
    width: 100%;                /* agar responsif */
    padding: 1.75rem;           /* padding nyaman */
    margin: 0 auto;             /* center horizontal */
    box-sizing: border-box;
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
}
</style>