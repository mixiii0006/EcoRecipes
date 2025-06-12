import axios from "axios";

export default class SearchModel {
  constructor() {
    this.username = "";
    this.query = "";
    this.searchText = "";
    this.currentIndex = 0;
    this.isMobile = false;
    this.recommendations = [];
    this.loadingRecommendations = false;
    this.showModal = false;
    this.selectedFood = null;
    this.carouselItems = [
      {
        title: "Makan Apa Hari Ini??",
        description: "Pilih makanan lokal, kurangi jejak karbon! Menggunakan bahan dari sekitar membantu mengurangi emisi transportasi.",
        image: "/foodImages/-candy-corn-pumpkin-blondies-51254510.jpg",
      },
      {
        title: "Jejak Karbon di Meja Makan",
        description: "Tahukah kamu? Daging merah punya jejak karbon lebih tinggi dari sayuran dan biji-bijian. Kurangi sedikit, bantu selamatkan bumi!",
        image: "/foodImages/-carbonnade-a-la-flamande-short-ribs-358557.jpg",
      },
      {
        title: "Masak Bijak, Bumi Terjaga",
        description: "Gunakan bahan musiman dan minim olahan. Selain sehat, ini juga mengurangi energi produksi dan distribusi.",
        image: "/foodImages/-fried-chicken-51238060.jpg",
      },
      {
        title: "Piringmu, Pilihanmu",
        description: "Makanan nabati meninggalkan jejak karbon lebih rendah. Ganti satu porsi dagingmu dengan alternatif nabati, yuk!",
        image: "/foodImages/-hazelnut-butter-and-coffee-meringues-51260360.jpg",
      },
      {
        title: "Masakan Hemat Emisi",
        description: "Kurangi makanan terbuang! Sisa bahan bisa jadi sup, tumisan, atau kaldu—hemat uang dan bantu bumi.",
        image: "/foodImages/-pumpkin-gruyere-gratin-with-thyme-51252910.jpg",
      },
    ];
    this.favorites = [];
    this.cooks = [];
  }

  setQuery(query) {
    this.query = query;
  }

  setSearchText(text) {
    this.searchText = text;
  }

  setCurrentIndex(index) {
    this.currentIndex = index;
  }

  setIsMobile(isMobile) {
    this.isMobile = isMobile;
  }

  setRecommendations(recommendations) {
    this.recommendations = recommendations;
  }

  setLoadingRecommendations(loading) {
    this.loadingRecommendations = loading;
  }

  setShowModal(show) {
    this.showModal = show;
  }

  setSelectedFood(food) {
    this.selectedFood = food;
  }

  setFavorites(favorites) {
    this.favorites = favorites;
  }

  setCooks(cooks) {
    this.cooks = cooks;
  }

  async getFavorites() {
    try {
      const token = localStorage.getItem("token");
const response = await axios.get("https://ecorecipes-production.up.railway.app/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setFavorites(response.data);
    } catch (error) {
      console.error("Failed to get favorites:", error);
    }
  }

  async getCooks() {
    try {
      const token = localStorage.getItem("token");
const response = await axios.get("https://ecorecipes-production.up.railway.app/api/cooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.setCooks(response.data);
    } catch (error) {
      console.error("Failed to get cooks:", error);
    }
  }

  async addCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
const response = await axios.post("https://ecorecipes-production.up.railway.app/api/cooks",
        { recipess_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add cook:", error);

      let errorMessage = "Failed to add cook";

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  async addFavorite(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("https://ecorecipes-production.up.railway.app/api/favorites",
        { recipess_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add favorite:", error);

      let errorMessage = "Failed to add favorite";

      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }
}
