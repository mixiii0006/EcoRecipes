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
    this.view.runFullPipeline = this.runFullPipeline.bind(this);
    this.view.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.view.handleToggleCook = this.handleToggleCook.bind(this);

    this.profileModel = new ProfileModel();
    this.profilePresenter = new ProfilePresenter(this.profileModel, this.view);

    this.getFavorites();
    this.getCooks();
  }

  scanIngredients() {
    this.view.$router.push("/scan-ingredients");
  }

  async runFullPipeline(data) {
    try {
      const response = await axios.post("https://ecorecipes-production.up.railway.app/api/ml/full", data);
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
      console.log("Full pipeline response:", response);
      console.log("Recommended recipes detail:");
      response.recommended_recipes.forEach((r, idx) => {
        console.log(`Recipe ${idx}:`, {
          title: r.title,
          used: r.used,
          total_used_carbon: r.total_used_carbon,
          total_missing_carbon: r.total_missing_carbon,
          efficiency: r.efficiency,
        });
      });

      if (response && response.recommended_recipes) {
        const mappedRecommendations = response.recommended_recipes.map((r) => ({
          id: r.id,
          name: r.title,
          image: r.image,
          carbon: r.carbon,
          totalRecipeCarbon: r.total_recipe_carbon,
          totalUsedCarbon: r.total_used_carbon,
          totalMissingCarbon: r.total_missing_carbon,
          used: r.used || [],
          missing: r.missing || [],
          leftovers: r.leftovers || [],
          efficiency: r.efficiency,
        }));

        this.model.setRecommendations(mappedRecommendations);
        this.model.setTotalCarbon(response.total_carbon || 0);
        this.model.setParsedIngredients(response.parsed_ingredients || []);
      } else {
        this.model.setRecommendations([]);
        this.model.setTotalCarbon(0);
        this.model.setParsedIngredients([]);
        this.model.setSelectedRecipe(null);
      }

      this.addRecentSearch(this.model.ingredients);
    } catch (error) {
      alert("Failed to get recommendations. Please try again.");
    } finally {
      this.model.setLoading(false);
      this.view.update();
    }
  }

  async handleToggleFavorite(recipeId) {
    try {
      await this.addFavorite(recipeId);
      await this.getFavorites();
      this.view.update();
      await this.profilePresenter.loadProfileData();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  }

  async handleToggleCook(recipeId) {
    try {
      await this.addCook(recipeId);
      await this.getCooks();
      this.view.update();
      await this.profilePresenter.loadProfileData();
    } catch (error) {
      console.error("Failed to toggle cook:", error);
    }
  }

  async getFavorites() {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://ecorecipes-production.up.railway.app/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.model.setFavorites(data);
    } catch (error) {
      console.error("Failed to get favorites:", error);
    }
  }

  async getCooks() {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://ecorecipes-production.up.railway.app/api/cooks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.model.setCooks(data);
    } catch (error) {
      console.error("Failed to get cooks:", error);
    }
  }

  async addFavorite(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "https://ecorecipes-production.up.railway.app/api/favorites",
        { recipess_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await this.profilePresenter.loadProfileData();
      return data;
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  }

  async addCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "https://ecorecipes-production.up.railway.app/api/cooks",
        { recipess_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await this.profilePresenter.loadProfileData();
      return data;
    } catch (error) {
      console.error("Failed to add cook:", error);
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
    console.log("get recipe details for ID:", recipeId);
    try {
      const resp = await axios.get(`https://ecorecipes-production.up.railway.app/api/recipes/${recipeId}`);
      const detail = resp.data;
      this.model.setSelectedRecipe(detail);
      this.model.setShowModal(true);
      this.view.update();
    } catch (error) {
      alert("Failed to get recipe details.");
      console.error("Error get recipe details:", error);
    }
  }

  closeModal() {
    this.model.setShowModal(false);
    this.model.setSelectedRecipe(null);
    this.view.update();
  }
}
