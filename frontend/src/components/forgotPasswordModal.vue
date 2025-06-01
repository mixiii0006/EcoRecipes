<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <button class="close-btn" @click="close">×</button>
      <h3>Forget Password</h3>
      <form @submit.prevent="sendResetLink">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          required
          placeholder="Enter your email"
        />
        <button type="submit" :disabled="loading">
          {{ loading ? "Sending..." : "Send Reset Link" }}
        </button>
      </form>
      <p v-if="message" :class="{ error: isError }">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ForgotPasswordModal",
  emits: ["close", "email-verified"],
  data() {
    return {
      email: "",
      loading: false,
      message: "",
      isError: false,
    };
  },
  methods: {
    async sendResetLink() {
      this.loading = true;
      this.message = "";
      this.isError = false;
      try {
        const res = await axios.post("http://localhost:3000/api/auth/forget-password", {
          email: this.email,
        });
        this.message = res.data.message || "Reset link sent to your email";
        // Emit event ke parent agar tampil modal reset password
        this.$emit("email-verified", this.email);
      } catch (err) {
        this.isError = true;
        if (err.response && err.response.data?.message) {
          this.message = err.response.data.message;
        } else {
          this.message = "Failed to send reset link.";
        }
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  width: 340px;
  position: relative;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #e53935;
}

h3 {
  margin-bottom: 2rem;
  font-size: 1.4rem;
  color: #2e7d32;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-size: 1rem;
  text-align: left;
  color: #2e7d32;
  font-weight: bold;
}

input {
  padding: 0.6rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus {
  border-color: #4caf50;
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type="submit"]:hover {
  background-color: #43a047;
  transform: translateY(-1px);
}

button[type="submit"]:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.error {
  color: #e53935;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>