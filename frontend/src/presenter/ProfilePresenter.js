export default class ProfilePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.toggleContent = this.toggleContent.bind(this);
    this.view.goToDashboard = this.goToDashboard.bind(this);
    this.view.logout = this.logout.bind(this);
  }

  async loadProfileData() {
    await this.model.getUserProfile();

    await this.model.getFavorites();
    // Directly use favorites data as returned by API
    this.model.setFavorites(this.model.favorites);

    await this.model.getCooks();
    // Directly use cooks data as returned by API
    this.model.setCooks(this.model.cooks);

    this.view.update();
  }

  async getRecipeDetails(recipeId) {
    try {
      const recipe = await this.model.getRecipeById(recipeId);
      this.view.selectedFood = recipe;
      this.view.showModal = true;
      this.view.$forceUpdate();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("Recipe not found.");
      } else {
        alert("Failed to get recipe details.");
      }
      console.error("Failed to get recipe details:", error);
    }
  }

  async addCook(recipess_id) {
    try {
      // Check if recipe is already in cooks
      const isAlreadyCook = this.model.cooks.some(cook => cook.recipess_id === recipess_id);
      if (isAlreadyCook) {
        return false; // Indicate duplicate
      }

      await this.model.addCook(recipess_id);
      await this.model.getCooks();
      this.view.update();
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to add cook:", error);
      return false;
    }
  }

  async addFavorite(recipess_id) {
    try {
      // Check if recipe is already in favorites
      const isAlreadyFavorite = this.model.favorites.some(fav => fav.recipess_id === recipess_id);
      if (isAlreadyFavorite) {
        return false; // Indicate duplicate
      }

      await this.model.addFavorite(recipess_id);
      await this.model.getFavorites();
      this.view.update();
      return true; // Indicate success
    } catch (error) {
      console.error("Failed to add favorite:", error);
      return false;
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
