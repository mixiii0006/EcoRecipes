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

  async fetchUserProfile() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Map total_user_carbon to totalKarmonReduced for frontend display with formatting
      const userData = response.data;
      userData.totalKarmonReduced = userData.total_user_carbon ? Number(userData.total_user_carbon.toFixed(3).replace(/(\d)(?=(\d{2})+\.)/g, '$1,')) : 0;
      this.setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }

  async fetchFavorites() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setFavorites(response.data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  }

  async fetchCooks() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/cooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setCooks(response.data);
    } catch (error) {
      console.error("Failed to fetch cooks:", error);
    }
  }

  async addFavorite(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/favorites",
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

  async removeFavorite(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/favorites/${recipess_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  }

  async addCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/cooks",
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

  async removeCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/cooks/${recipess_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to remove cook:", error);
      throw error;
    }
  }

  async fetchRecipeById(recipeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch recipe by id:", error);
      throw error;
    }
  }
}
