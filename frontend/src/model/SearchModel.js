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

  async addCook(recipess_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/cooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipess_id }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add cook");
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to add cook:", error);
      throw error;
    }
  }
}
