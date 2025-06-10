import axios from "axios";

export default class ProfileModel {
  constructor() {
    this.isFoodList = true;
    this.user = null;
    this.favorites = [];
    this.cooks = [];
  }

  setIsFoodList(isFoodList) {
    this.isFoodList = isFoodList;
  }

  setUser(user) {
    this.user = user;
  }

  setFavorites(favorites) {
    this.favorites = favorites;
  }

  setCooks(cooks) {
    this.cooks = cooks;
  }

  async getUserProfile() {
    try {
      const token = localStorage.getItem("token");
const response = await axios.get("https://ecorecipes-production.up.railway.app/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
userData.totalCarbonReduced = userData.total_user_carbon ? Number(userData.total_user_carbon.toFixed(3)) : 0 ; 
      this.setUser(userData);
    } catch (error) {
      console.error("Failed to get user profile:", error);
    }
  }

  async getFavorites() {
    try {
      const token = localStorage.getItem("token");
const response = await axios.get("https://ecorecipes-production.up.railway.app/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setFavorites(response.data);
    } catch (error) {
      console.error("Failed to get favorites:", error);
    }
  }

  async getCooks() {
    try {
      const token = localStorage.getItem("token");
const response = await axios.get("https://ecorecipes-production.up.railway.app/api/cooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setCooks(response.data);
    } catch (error) {
      console.error("Failed to get cooks:", error);
    }
  }

  async addFavorite(recipess_id) {
    try {
      // Check if favorite already exists
      if (this.favorites.some(fav => fav.recipess_id === recipess_id)) {
        throw new Error("Recipe already in favorites list");
      }
      const token = localStorage.getItem("token");
const response = await axios.post(
        "https://ecorecipes-production.up.railway.app/api/favorites",
        { recipess_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  }

  async addCook(recipess_id) {
    try {
      // Check if cook already exists
      if (this.cooks.some(cook => cook.recipess_id === recipess_id)) {
        throw new Error("Recipe already in cooks list");
      }
      const token = localStorage.getItem("token");
const response = await axios.post(
        "https://ecorecipes-production.up.railway.app/api/cooks",
        { recipess_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add cook:", error);
      throw error;
    }
  }

  async getRecipeById(recipeId) {
    try {
      const token = localStorage.getItem("token");
const response = await axios.get(`https://ecorecipes-production.up.railway.app/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get recipe by id:", error);
      throw error;
    }
  }
}
