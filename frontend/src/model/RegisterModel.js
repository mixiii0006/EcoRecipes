export default class RegisterModel {
  constructor() {
    this.name = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.errorMessage = "";
  }

  setName(name) {
    this.name = name;
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  setConfirmPassword(confirmPassword) {
    this.confirmPassword = confirmPassword;
  }

  setErrorMessage(message) {
    this.errorMessage = message;
  }
}
