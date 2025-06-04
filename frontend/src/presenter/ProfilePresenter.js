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

  async fetchRecipeDetails(recipeId) {
    try {
      const recipe = await this.model.fetchRecipeById(recipeId);
      this.view.selectedFood = recipe;
      this.view.showModal = true;
      this.view.$forceUpdate();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Recipe not found.");
      } else {
        alert("Failed to fetch recipe details.");
      }
      console.error("Failed to fetch recipe details:", error);
    }
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

  async removeCook(recipess_id) {
    try {
      await this.model.removeCook(recipess_id);
      await this.model.fetchCooks();
      this.view.update();
    } catch (error) {
      console.error("Failed to remove cook:", error);
    }
  }

  async addFavorite(recipess_id) {
    try {
      await this.model.addFavorite(recipess_id);
      await this.model.fetchFavorites();
      this.view.update();
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  }

  async removeFavorite(recipess_id) {
    try {
      await this.model.removeFavorite(recipess_id);
      await this.model.fetchFavorites();
      this.view.update();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
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
