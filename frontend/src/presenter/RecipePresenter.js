export default class RecipePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  setRecipeId(id) {
    this.model.setRecipeId(id);
  }

  async fetchRecipeById(id) {
    try {
      const data = await this.model.fetchRecipeById(id);
      this.model.setRecipeData(data);
      if (this.view && typeof this.view.update === 'function') {
        this.view.update();
      }
      return data;
    } catch (error) {
      alert('Failed to fetch recipe details: ' + error.message);
      throw error;
    }
  }
}
