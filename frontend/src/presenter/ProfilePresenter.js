export default class ProfilePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.toggleContent = this.toggleContent.bind(this);
    this.view.goToDashboard = this.goToDashboard.bind(this);
    this.view.logout = this.logout.bind(this);
  }

  async loadProfileData() {
    await this.model.fetchUserProfile();
    await this.model.fetchFavorites();
    await this.model.fetchCooks();
    this.view.update();
  }

  async addCook(recipess_id) {
    try {
      await this.model.addCook(recipess_id);
      await this.model.fetchCooks();
      this.view.update();
    } catch (error) {
      console.error("Failed to add cook:", error);
    }
  }

  toggleContent(section) {
    this.model.setIsFoodList(section === "food");
    this.view.update();
  }

  goToDashboard() {
    this.view.$router.push("/home");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.view.$router.push("/");
  }
}
