export default class LoginModel {
  constructor() {
    this.email = "";
    this.password = "";
    this.rememberMe = false;
    this.showForgotModal = false;
    this.showResetModal = false;
    this.resetEmail = "";
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }

  setRememberMe(rememberMe) {
    this.rememberMe = rememberMe;
  }

  setShowForgotModal(show) {
    this.showForgotModal = show;
  }

  setShowResetModal(show) {
    this.showResetModal = show;
  }

  setResetEmail(email) {
    this.resetEmail = email;
  }
}
