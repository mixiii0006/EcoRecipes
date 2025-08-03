import axios from "axios";
export default class HomeModel {
  constructor() {
    this.username = "";
    this.user = {};
    this.currentIndex = 0;
    this.carouselItems = [
      {
        title: "What’s for Lunch Today??",
        description: "Choose local food, reduce carbon footprint! Using ingredients from nearby helps lower transportation emissions.",
        ingredients: "Local Chicken, Organic Vegetables, Chili, Onion",
        image: "/foodImages/-candy-corn-pumpkin-blondies-51254510.jpg",
      },
      {
        title: "Carbon Footprint on the Dining Table",
        description: "Did you know? Red meat has a higher carbon footprint than vegetables and grains. Cut back a little, help save the Earth!",
        ingredients: "Beef, Potatoes, Spinach, Tomato",
        image: "/foodImages/-carbonnade-a-la-flamande-short-ribs-358557.jpg",
      },
      {
        title: "Cook Smart, Save the Earth",
        description: "Use seasonal and minimally processed ingredients. Not only healthier, this also reduces energy for production and distribution.",
        ingredients: "Tempeh, Chayote, Corn, Basil",
        image: "/foodImages/-fried-chicken-51238060.jpg",
      },
      {
        title: "Your Plate, Your Choice",
        description: "Plant-based foods leave a lower carbon footprint. Replace one meat portion with a plant-based alternative, let’s go!",
        ingredients: "Tofu, Mushrooms, Kidney Beans, Bell Peppers",
        image: "/foodImages/-hazelnut-butter-and-coffee-meringues-51260360.jpg",
      },
      {
        title: "Low-Emission Cooking",
        description: "Reduce food waste! Leftover ingredients can be made into soup, stir-fry, or broth—save money and help the planet.",
        ingredients: "Leftover Veggies, Rice, Green Onion, Egg",
        image: "/foodImages/-pumpkin-gruyere-gratin-with-thyme-51252910.jpg",
      },
    ];

    this.isMobile = false;
    this.isMenuOpen = false;
    this.favoriteFoods = [];
  }

  setUsername(username) {
    this.username = username;
  }

  setUser(user) {
    this.user = user;
  }

  setCurrentIndex(index) {
    this.currentIndex = index;
  }

  setIsMobile(isMobile) {
    this.isMobile = isMobile;
  }

  setIsMenuOpen(isOpen) {
    this.isMenuOpen = isOpen;
  }

  setFavoriteFoods(favorites) {
    this.favoriteFoods = favorites;
  }

  async getRecipeById(recipeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://ecorecipes-production-e306.up.railway.app/api/recipes/${recipeId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error get recipe by ID:", error);
      throw error;
    }
  }
}
