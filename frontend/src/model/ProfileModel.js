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
      this.setUser(response.data);
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
}
