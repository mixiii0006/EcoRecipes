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
        description: "Siap sedia wawasan dengan bahan lokal. Satu masakanmu mendekatkan keberlanjutan di setiap hidangan.",
        ingredients: "Ayam, Sayur, Cabai, Bawang",
        image: "https://source.unsplash.com/featured/?food",
      },
      {
        title: "Inspirasi Masakan Nusantara",
        description: "Ciptakan sajian lezat dari dapurmu dengan bumbu tradisional Indonesia.",
        ingredients: "Ikan, Serai, Kunyit, Daun Jeruk",
        image: "https://source.unsplash.com/featured/?indonesian-food",
      },
      {
        title: "Menu Sehat Hari Ini",
        description: "Masakan sehat dan lezat bisa dimulai dari bahan lokal berkualitas.",
        ingredients: "Tahu, Tempe, Brokoli, Wortel",
        image: "https://source.unsplash.com/featured/?healthy-food",
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
}
