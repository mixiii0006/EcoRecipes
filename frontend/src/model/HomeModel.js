export default class HomeModel {
  constructor() {
    this.username = "";
    this.user = {};
    this.currentIndex = 0;
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
}
