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
          username: this.name,
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
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.form-card h2 {
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.form-card p {
  margin-bottom: 2rem;
  color: #666;
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
</style>
