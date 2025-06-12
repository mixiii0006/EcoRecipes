import axios from "axios";

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
    this.view.handleToggleFavorite = this.handleToggleFavorite.bind(this);
  }

  async getRecommendations(searchText) {
    try {
      this.model.setLoadingRecommendations(true);
const response = await axios.get("https://ecorecipes-production.up.railway.app/api/recipes", {
        params: { limit: 200 },
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = response.data;
      console.log("Get recipes data:", data);

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
            image: (recipe.image || '') + '.jpg',  // Append .jpg extension to image name
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
        total_recipe_carbon: parseFloat(item.total_carbon.toFixed(3))
      }));

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
      console.error("Error get recommendations:", error);
      let errorMessage = "Error connecting to backend";

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message;
      }

      alert(errorMessage);
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
      this.getRecommendations(searchText);
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
      const response = await axios.get(`https://ecorecipes-production.up.railway.app/api/recipes/${recipe.id}`, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = response.data;

      // Map fields to expected names for RecipeModal
      const mappedData = {
        ...data,
        name: data.title_cleaned || data.name,
        image: data.image_name
          ? data.image_name.toLowerCase().replace(/\s+/g, "-")
          : data.Image_Name
            ? data.Image_Name.toLowerCase().replace(/\s+/g, "-")
            : data.image || "",
        Instructions_Cleaned: data.instructions_cleaned || data.Instructions_Cleaned || data.instructions || '',
        Cleaned_Ingredients: data.cleaned_ingredients || data.Cleaned_Ingredients || data.ingredients || [],
        total_recipe_carbon: data.total_recipe_carbon || 0,
        total_recipe_ingredients: data.total_recipe_ingredients || [],
      };

      this.model.setSelectedFood(mappedData);
      this.model.setShowModal(true);
      this.view.update();
    } catch (error) {
      console.error("Error opening modal:", error);
      let errorMessage = "Error get recipe details";

      if (error.response) {
        errorMessage = error.response.data?.error || `Failed to get recipe details: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      alert(errorMessage);
    }
  }

  async getRecipeById(id) {
    try {
      const response = await axios.get(`https://ecorecipes-production.up.railway.app/api/recipes/${id}`, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = response.data;
      this.model.setSelectedFood(data);
      this.view.update();
      return data;
    } catch (error) {
      console.error("Error get recipe by ID:", error);
      let errorMessage = "Error get recipe details";

      if (error.response) {
        errorMessage = error.response.data?.error || `Failed to get recipe details: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      alert(errorMessage);
      return null;
    }
  }

  async addFavorite(recipess_id) {
    try {
      // Use SearchModel's addFavorite instead of ProfileModel
      await this.model.addFavorite(recipess_id);
      // Refresh favorites list in SearchModel
      await this.model.getFavorites();
      this.view.update();
      return true;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw error;
      }
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  async addCook(recipess_id) {
    try {
      // Use SearchModel's addCook instead of ProfileModel
      await this.model.addCook(recipess_id);
      // Refresh cooks list in SearchModel
      await this.model.getCooks();
      this.view.update();
      return true;
    } catch (error) {
      if (error && error.response && error.response.status === 400) {
        this.view.$toast.error("Failed to add recipe to cooks");
        throw error;
      }
      this.view.$toast.error("Failed to add recipe to cooks");
      throw error;
    }
  }

  async handleToggleFavorite(recipeId) {
    try {
      await this.addFavorite(recipeId);
    } catch (error) {
      if (error && error.response && error.response.status === 400) {
        this.view.$toast.info("Recipe is already in favorites");
        return;
      }
      this.view.$toast.error("Failed to add recipe to favorites");
      console.error("Error in handleToggleFavorite:", error);
    }
  }
}
