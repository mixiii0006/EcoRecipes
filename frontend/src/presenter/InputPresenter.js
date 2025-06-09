import axios from "axios";

import ProfileModel from "../model/ProfileModel";
import ProfilePresenter from "./ProfilePresenter";

export default class InputPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.scanIngredients = this.scanIngredients.bind(this);
    this.view.submitIngredients = this.submitIngredients.bind(this);
    this.view.addRecentSearch = this.addRecentSearch.bind(this);
    this.view.deleteRecentSearch = this.deleteRecentSearch.bind(this);
    this.view.goToRecipe = this.goToRecipe.bind(this);
    this.view.closeModal = this.closeModal.bind(this);
    this.view.checkHealth = this.checkHealth.bind(this);
    this.view.predictCarbon = this.predictCarbon.bind(this);
    this.view.analyzeRecipe = this.analyzeRecipe.bind(this);
    this.view.runFullPipeline = this.runFullPipeline.bind(this);

    this.view.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.view.handleToggleCook = this.handleToggleCook.bind(this);

    this.profileModel = new ProfileModel();
    this.profilePresenter = new ProfilePresenter(this.profileModel, this.view);

    // Fetch favorites and cooks on initialization to avoid undefined errors
    this.fetchFavorites();
    this.fetchCooks();
  }

  scanIngredients() {
    this.view.$router.push("/scan-ingredients");
  }

  async checkHealth() {
    try {
      const response = await axios.get("http://localhost:3000/api/ml/health");
      alert(`ML API Health: ${response.data.status || "OK"}`);
    } catch (error) {
      alert("Failed to check ML API health.");
    }
  }

  async predictCarbon(ingredients) {
    try {
      const response = await axios.post("http://localhost:3000/api/ml/carbon", { ingredients });
      return response.data;
    } catch (error) {
      alert("Failed to predict carbon footprint.");
      return null;
    }
  }

  async analyzeRecipe(recipe) {
    try {
      // Send ingredients directly, not nested in recipe object
      const response = await axios.post("http://localhost:3000/api/ml/recipes", recipe);
      return response.data;
    } catch (error) {
      alert("Failed to analyze recipe.");
      return null;
    }
  }

  async runFullPipeline(data) {
    try {
      const response = await axios.post("http://localhost:3000/api/ml/full", data);
      return response.data;
    } catch (error) {
      alert("Failed to run full ML pipeline.");
      return null;
    }
  }

  async submitIngredients() {
    if (this.model.loading) return;

    if (!this.model.ingredients.trim()) {
      alert("Please enter some ingredients.");
      return;
    }

    this.model.setLoading(true);
    this.view.update();

    try {
      const response = await this.runFullPipeline({ text: this.model.ingredients });
      console.log("runFullPipeline response:", response);
      if (response && response.recommended_recipes) {
        console.log("Recommended recipes images:");
        response.recommended_recipes.forEach((rec, idx) => {
          console.log(`Recipe ${idx}: image = ${rec.image}`);
        });
      }

      if (response) {
        this.model.setRecommendations(response.recommended_recipes || []);
        this.model.setTotalCarbon(response.total_carbon || 0);
        this.model.setLeftovers(response.leftovers || []);
        this.model.setMissing(response.missing || []);
        this.model.setParsedIngredients(response.parsed_ingredients || []);
        this.model.setSelectedRecipe(response.selected_recipe || null);
      } else {
        this.model.setRecommendations([]);
        this.model.setTotalCarbon(0);
        this.model.setLeftovers([]);
        this.model.setMissing([]);
        this.model.setParsedIngredients([]);
        this.model.setSelectedRecipe(null);
      }

      this.addRecentSearch(this.model.ingredients);
    } catch (error) {
      alert("Failed to fetch recommendations. Please try again.");
    } finally {
      this.model.setLoading(false);
      this.view.update();
    }
  }

  async handleToggleFavorite(recipeId) {
    try {
      const isFavorite = this.model.favorites.some(
        (fav) => fav.recipess_id === recipeId
      );
      if (isFavorite) {
        await this.removeFavorite(recipeId);
      } else {
        await this.addFavorite(recipeId);
      }
      await this.fetchFavorites();
      this.view.update();
      await this.profilePresenter.loadProfileData();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  }

  async handleToggleCook(recipeId) {
    try {
      const isCook = this.model.cooks.some(
        (cook) => cook.recipess_id === recipeId
      );
      if (isCook) {
        await this.removeCook(recipeId);
      } else {
        await this.addCook(recipeId);
      }
      await this.fetchCooks();
      this.view.update();
      await this.profilePresenter.loadProfileData();
    } catch (error) {
      console.error("Failed to toggle cook:", error);
    }
  }

  async fetchFavorites() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch favorites");
      const data = await response.json();
      this.model.setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  }

  async fetchCooks() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/cooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch cooks");
      const data = await response.json();
      this.model.setCooks(data);
    } catch (error) {
      console.error("Failed to fetch cooks:", error);
    }
  }

  async addFavorite(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipess_id }),
      });
      if (!response.ok) throw new Error("Failed to add favorite");
      const result = await response.json();
      await this.profilePresenter.loadProfileData();
      return result;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  }

  async removeFavorite(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/favorites/${recipess_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to remove favorite");
      return await response.json();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  }

  async addCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/cooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipess_id }),
      });
      if (!response.ok) throw new Error("Failed to add cook");
      const result = await response.json();
      await this.profilePresenter.loadProfileData();
      return result;
    } catch (error) {
      console.error("Failed to add cook:", error);
      throw error;
    }
  }

  async removeCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/cooks/${recipess_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to remove cook");
      return await response.json();
    } catch (error) {
      console.error("Failed to remove cook:", error);
      throw error;
    }
  }

  addRecentSearch(search) {
    this.model.addRecentSearch(search);
    this.view.update();
  }

  deleteRecentSearch(index) {
    this.model.deleteRecentSearch(index);
    this.view.update();
  }

  async goToRecipe(recipe) {
    if (!recipe || (!recipe.id && !recipe._id)) {
      alert("Detail resep tidak ditemukan di database.");
      return;
    }
    const recipeId = recipe.id || recipe._id;
    console.log("Fetching recipe details for ID:", recipeId);
    try {
      const resp = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
      const detail = resp.data;
      this.model.setSelectedRecipe(detail);
      this.model.setShowModal(true);
      this.view.update();
    } catch (error) {
      alert("Failed to fetch recipe details.");
      console.error("Error fetching recipe details:", error);
    }
  }

  closeModal() {
    this.model.setShowModal(false);
    this.model.setSelectedRecipe(null);
    this.view.update();
  }
}
