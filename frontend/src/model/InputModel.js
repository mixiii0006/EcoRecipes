export default class InputModel {
  constructor() {
    this.ingredients = "";
    this.recommendations = [];
    this.recentSearches = [];
    this.loading = false;
    this.showModal = false;
    this.selectedRecipe = null;
    this.totalCarbon = 0;  // Add totalCarbon property
    this.leftovers = [];
    this.missing = [];
    this.parsedIngredients = [];

    this.favorites = [];
    this.cooks = [];
  }

  setIngredients(ingredients) {
    this.ingredients = ingredients || "";
  }

  setRecommendations(recommendations) {
    this.recommendations = Array.isArray(recommendations) ? recommendations : [];
  }

  setRecentSearches(recentSearches) {
    this.recentSearches = Array.isArray(recentSearches) ? recentSearches : [];
  }

  setLoading(loading) {
    this.loading = !!loading;
  }

  setShowModal(showModal) {
    this.showModal = !!showModal;
  }

  setSelectedRecipe(selectedRecipe) {
    this.selectedRecipe = selectedRecipe || null;
  }

  setTotalCarbon(totalCarbon) {
    this.totalCarbon = totalCarbon;
  }

  setLeftovers(leftovers) {
    this.leftovers = Array.isArray(leftovers) ? leftovers : [];
  }

  setMissing(missing) {
    this.missing = Array.isArray(missing) ? missing : [];
  }

  setParsedIngredients(parsedIngredients) {
    this.parsedIngredients = Array.isArray(parsedIngredients) ? parsedIngredients : [];
  }

  setFavorites(favorites) {
    this.favorites = Array.isArray(favorites) ? favorites : [];
  }

  setCooks(cooks) {
    this.cooks = Array.isArray(cooks) ? cooks : [];
  }

  addRecentSearch(search) {
    if (typeof search !== "string" || !search.trim()) return;

    // Cegah duplikasi
    const index = this.recentSearches.indexOf(search);
    if (index !== -1) {
      this.recentSearches.splice(index, 1); // hapus dulu
    }

    this.recentSearches.unshift(search.trim());
    if (this.recentSearches.length > 5) {
      this.recentSearches.pop();
    }
  }

  deleteRecentSearch(index) {
    if (index >= 0 && index < this.recentSearches.length) {
      this.recentSearches.splice(index, 1);
    }
  }
}
