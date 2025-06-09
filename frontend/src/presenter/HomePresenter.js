import axios from "axios";

export default class HomePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind semua handler
    this.view.handleLogout = this.handleLogout.bind(this);
    this.view.startCarousel = this.startCarousel.bind(this);
    this.view.checkMobile = this.checkMobile.bind(this);
    this.view.toggleMenu = this.toggleMenu.bind(this);
  }

  async loadUserData(retryCount = 3, delayMs = 500) {
    try {
      let token = localStorage.getItem("token");
      while (!token && retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        token = localStorage.getItem("token");
        retryCount--;
      }
      console.log("Token in loadUserData:", token);
      if (!token) {
        if (this.model && typeof this.model.setUser === 'function') this.model.setUser({});
        if (this.view && typeof this.view.update === 'function') this.view.update();
        return;
      }

      const { data } = await axios.get("http://localhost:3000/api/users/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("User data received:", data);
      const user = {
        name: data.name,
        totalCarbonReduced: data.total_user_carbon
          ? Number(data.total_user_carbon.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'))
          : 0,
      };
      if (this.model && typeof this.model.setUser === 'function') this.model.setUser(user);
      if (this.view && typeof this.view.update === 'function') this.view.update();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        if (this.view && this.view.$router) this.view.$router.push("/login");
      } else {
        console.error("Error loading user data:", error);
      }

      if (this.model && typeof this.model.setUser === 'function') this.model.setUser({});
      if (this.view && typeof this.view.update === 'function') this.view.update();
    }
  }

  async loadFavoriteFoods() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        this.model.setFavoriteFoods([]);
        if (this.view && typeof this.view.update === "function") this.view.update();
        return;
      }

      const { data } = await axios.get("http://localhost:3000/api/favorites", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Favorites loaded:", data);
      this.model.setFavoriteFoods(data);
      if (this.view && typeof this.view.update === "function") this.view.update();

    } catch (error) {
      console.error("Error loading favorite foods:", error);
      this.model.setFavoriteFoods([]);
      if (this.view && typeof this.view.update === "function") this.view.update();
    }
  }

  handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    if (this.view && this.view.$router) this.view.$router.push("/");
  }

  startCarousel() {
    if (!this.model) return;
    if (!Array.isArray(this.model.carouselItems) || !this.model.carouselItems.length) {
      console.warn('Carousel items tidak ada');
      return;
    }
    this.carouselInterval = setInterval(() => {
      if (!this.model) return;
      if (typeof this.model.setCurrentIndex === 'function') {
        this.model.setCurrentIndex((this.model.currentIndex + 1) % this.model.carouselItems.length);
      }
      if (this.view && typeof this.view.update === 'function') this.view.update();
    }, 4000);
  }

  checkMobile() {
    // Perbaiki error di sini:
    if (this.model && typeof this.model.setIsMobile === 'function') {
      this.model.setIsMobile(window.innerWidth <= 768);
    } else {
      console.warn('HomePresenter: model/setIsMobile not ready', this.model);
    }
    if (this.view && typeof this.view.update === 'function') this.view.update();
  }

  toggleMenu() {
    if (this.model && typeof this.model.setIsMenuOpen === 'function') {
      this.model.setIsMenuOpen(!this.model.isMenuOpen);
    } else {
      console.warn('toggleMenu: setIsMenuOpen not found');
    }
    if (this.view && typeof this.view.update === 'function') this.view.update();
  }

  clearCarouselInterval() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }

  async getRecipeDetails(recipeId) {
    try {
      const recipe = await this.model.getRecipeById(recipeId);
      this.view.selectedRecipe = recipe;
      this.view.showRecipeModal = true;
      this.view.$forceUpdate();
    } catch (error) {
      console.error("Failed to get recipe details:", error);
    }
  }
}
