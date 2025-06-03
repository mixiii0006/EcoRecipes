import axios from "axios";

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

  addRecentSearch(search) {
    this.model.addRecentSearch(search);
    this.view.update();
  }

  deleteRecentSearch(index) {
    this.model.deleteRecentSearch(index);
    this.view.update();
  }

  async goToRecipe(recipe) {
    const recipeId = recipe.id || recipe._id;
    console.log("Fetching recipe details for ID:", recipeId);
    if (recipeId) {
      const resp = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
      const detail = resp.data;
      this.model.setSelectedRecipe(detail);
      this.model.setShowModal(true);
      this.view.update();
    } else {
      alert("Detail resep tidak ditemukan di database.");
    }
  }

  closeModal() {
    this.model.setShowModal(false);
    this.model.setSelectedRecipe(null);
    this.view.update();
  }
}
