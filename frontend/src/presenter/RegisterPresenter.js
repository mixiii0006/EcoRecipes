import axios from "axios";
import Swal from "sweetalert2";

export default class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.handleRegister = this.handleRegister.bind(this);
  }

  async handleRegister() {
    // Validasi kosong
    if (
      !this.model.name.trim() ||
      !this.model.email.trim() ||
      !this.model.password ||
      !this.model.confirmPassword
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all fields.",
      });
      return;
    }

    // Validasi email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.model.email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Validasi password cocok
    if (this.model.password !== this.model.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      await axios.post("https://ecorecipes-production.up.railway.app/api/auth/register", {
        name: this.model.name.trim(),
        email: this.model.email.trim(),
        password: this.model.password,
        confirmPassword: this.model.confirmPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You can now login.",
      }).then(() => {
        this.view.$router.push("/login");
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
      });
    }
  }
}
