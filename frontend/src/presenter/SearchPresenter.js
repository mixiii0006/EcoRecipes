export default class SearchPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.handleSearch = this.handleSearch.bind(this);
    this.view.handleInputClick = this.handleInputClick.bind(this);
    this.view.handleScanClick = this.handleScanClick.bind(this);
    this.view.startCarousel = this.startCarousel.bind(this);
    this.view.checkMobile = this.checkMobile.bind(this);
    this.view.openModal = this.openModal.bind(this);
  }

  async fetchRecommendations(searchText) {
    try {
      this.model.setLoadingRecommendations(true);
      const response = await fetch("http://localhost:3000/api/recipes?limit=200");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Failed to get recipes from backend.");
        this.model.setRecommendations([]);
        this.model.setLoadingRecommendations(false);
        this.view.update();
        return;
      }
      const data = await response.json();
      console.log("Fetched recipes data:", data);

      // Filter recipes by searchText matching title_cleaned or name (case-insensitive)
      const filteredData = data.filter(recipe => {
        const name = (recipe.title_cleaned || recipe.name || "").toLowerCase();
        return name.includes(searchText.toLowerCase());
      });

      // Group filtered recipes by title_cleaned
      const grouped = filteredData.reduce((acc, recipe) => {
        const key = recipe.title_cleaned;
        if (!acc[key]) {
          acc[key] = {
            ...recipe,
            image: recipe.image || recipe.Image_Name || '',  // Ensure image field
            combined_ingredients: new Set(recipe.total_recipe_ingredients || []),
            total_carbon: recipe.carbon_score || 0,
          };
        } else {
          // Merge ingredients
          (recipe.total_recipe_ingredients || []).forEach(ing => acc[key].combined_ingredients.add(ing));
          // Sum carbon
          acc[key].total_carbon += recipe.carbon_score || 0;
        }
        return acc;
      }, {});

      // Convert grouped object to array and map combined_ingredients set to array
      let mergedRecipes = Object.values(grouped).map(item => ({
        ...item,
        total_recipe_ingredients: Array.from(item.combined_ingredients),
        carbon_score: item.total_carbon,
      }));

      // Shuffle merged recipes to make recommendations change each fetch
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      shuffleArray(mergedRecipes);

      // Limit to 20 recipes, but if less than 20 unique, fill with ungrouped recipes
      let limited = mergedRecipes.slice(0, 20);
      if (searchText.trim() !== '') {
        // If searching, only show filtered results without adding ungrouped recipes
        limited = mergedRecipes;
      } else if (limited.length < 20) {
        const existingTitles = new Set(limited.map(r => r.title_cleaned));
        const additional = data.filter(r => !existingTitles.has(r.title_cleaned));
        limited = limited.concat(additional.slice(0, 20 - limited.length));
      }
      this.model.setRecommendations(limited);
      this.model.setLoadingRecommendations(false);
      this.view.update();
    } catch (error) {
      alert("Error connecting to backend: " + error.message);
      this.model.setRecommendations([]);
      this.model.setLoadingRecommendations(false);
      this.view.update();
    }
  }

  handleSearch(event) {
    clearTimeout(this.searchTimeout);
    const searchText = event.target.value;
    this.searchTimeout = setTimeout(() => {
      this.model.setSearchText(searchText);
      this.fetchRecommendations(searchText);
    }, 300);
  }

  handleInputClick() {
    this.view.$router.push("/input-ingredients");
  }

  handleScanClick() {
    this.view.$router.push("/scan-ingredients");
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.model.setCurrentIndex((this.model.currentIndex + 1) % this.model.carouselItems.length);
      this.view.update();
    }, 4000);
  }

  checkMobile() {
    this.model.setIsMobile(window.innerWidth <= 768);
    this.view.update();
  }

  async openModal(index) {
    try {
      const recipe = this.model.recommendations[index];
      if (!recipe || !recipe.id) {
        alert("Recipe data is invalid.");
        return;
      }
      const response = await fetch(`http://localhost:3000/api/recipes/${recipe.id}`);
      if (!response.ok) {
        alert("Failed to fetch recipe details.");
        return;
      }
      const data = await response.json();

      // Map fields to expected names for RecipeModal
      const mappedData = {
        ...data,
        name: data.title_cleaned || data.name,
        image: data.image || data.Image_Name || '',
        Instructions_Cleaned: data.instructions_cleaned || data.Instructions_Cleaned || data.instructions || '',
        Cleaned_Ingredients: data.cleaned_ingredients || data.Cleaned_Ingredients || data.ingredients || [],
        carbon_score: data.carbon_score || 0,
        total_recipe_ingredients: data.total_recipe_ingredients || [],
      };

      this.model.setSelectedFood(mappedData);
      this.model.setShowModal(true);
      this.view.update();
    } catch (error) {
      alert("Error fetching recipe details: " + error.message);
    }
  }

  async fetchRecipeById(id) {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
      if (!response.ok) {
        alert("Failed to fetch recipe details.");
        return null;
      }
      const data = await response.json();
      this.model.setSelectedFood(data);
      this.view.update();
      return data;
    } catch (error) {
      alert("Error fetching recipe details: " + error.message);
      return null;
    }
  }

  async addFavorite(recipess_id) {
    try {
      // Import ProfileModel here to call addFavorite
      const ProfileModel = (await import("../model/ProfileModel")).default;
      const profileModel = new ProfileModel();
      await profileModel.addFavorite(recipess_id);
      this.view.$toast.success("Recipe added to favorites");
    } catch (error) {
      this.view.$toast.error("Failed to add recipe to favorites");
    }
  }

  async addCook(recipess_id) {
    try {
      const response = await this.model.addCook(recipess_id);
      this.view.$toast.success("Recipe added to cooks");
      // Optionally, refresh profile or cooks data here if needed
    } catch (error) {
      this.view.$toast.error("Failed to add recipe to cooks");
      throw error;
    }
  }
}
