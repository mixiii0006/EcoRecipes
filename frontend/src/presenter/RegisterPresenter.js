import axios from "axios";
import Swal from "sweetalert2";

export default class RegisterPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.handleRegister = this.handleRegister.bind(this);
  }

  async handleRegister() {
    if (this.model.password !== this.model.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        name: this.model.name,
        email: this.model.email,
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
