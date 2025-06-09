import axios from "axios";
export default class HomeModel {
  constructor() {
    this.username = "";
    this.user = {};
    this.currentIndex = 0;
    this.carouselItems = [
      {
        title: "Makan Apa Hari Ini??",
        description: "Pilih makanan lokal, kurangi jejak karbon! Menggunakan bahan dari sekitar membantu mengurangi emisi transportasi.",
        ingredients: "Ayam Lokal, Sayur Organik, Cabai, Bawang",
        image: "/foodImages/-candy-corn-pumpkin-blondies-51254510.jpg",
      },
      {
        title: "Jejak Karbon di Meja Makan",
        description: "Tahukah kamu? Daging merah punya jejak karbon lebih tinggi dari sayuran dan biji-bijian. Kurangi sedikit, bantu selamatkan bumi!",
        ingredients: "Daging Sapi, Kentang, Bayam, Tomat",
        image: "/foodImages/-carbonnade-a-la-flamande-short-ribs-358557.jpg",
      },
      {
        title: "Masak Bijak, Bumi Terjaga",
        description: "Gunakan bahan musiman dan minim olahan. Selain sehat, ini juga mengurangi energi produksi dan distribusi.",
        ingredients: "Tempe, Labu Siam, Jagung, Kemangi",
        image: "/foodImages/-fried-chicken-51238060.jpg",
      },
      {
        title: "Piringmu, Pilihanmu",
        description: "Makanan nabati meninggalkan jejak karbon lebih rendah. Ganti satu porsi dagingmu dengan alternatif nabati, yuk!",
        ingredients: "Tahu, Jamur, Kacang Merah, Paprika",
        image: "/foodImages/-hazelnut-butter-and-coffee-meringues-51260360.jpg",
      },
      {
        title: "Masakan Hemat Emisi",
        description: "Kurangi makanan terbuang! Sisa bahan bisa jadi sup, tumisan, atau kaldu—hemat uang dan bantu bumi.",
        ingredients: "Sisa Sayur, Nasi, Daun Bawang, Telur",
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
      const response = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`, {
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
