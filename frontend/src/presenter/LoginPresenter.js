import axios from "axios";
import Swal from "sweetalert2";

export default class LoginPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.handleLogin = this.handleLogin.bind(this);
    this.view.handleEmailVerified = this.handleEmailVerified.bind(this);
  }

  
  async handleLogin() {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email: this.model.email,
        password: this.model.password,
      });

      localStorage.setItem("token", response.data.loginResult.token);
      localStorage.setItem("username", response.data.loginResult.name);
      console.log("Token stored in localStorage:", response.data.loginResult.token);
      this.view.$router.push("/home");
    } catch (error) {
      const message =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || "Something went wrong!";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    }
  }

  handleEmailVerified(email) {
    this.model.setResetEmail(email);
    this.model.setShowForgotModal(false);
    this.model.setShowResetModal(true);
    this.view.update();
  }
}
