export default class LandingPageModel {
  constructor() {
    this.foodItems = [
      { name: "Daging Sapi", image: "/images/beef.png", co2: "99,48 kg" },
      { name: "Unggas", image: "/images/chicken.png", co2: "9,87 kg" },
      { name: "Dark Chocolate", image: "/images/chocolate.png", co2: "46,65 kg" },
      { name: "Keju", image: "/images/cheese.png", co2: "23,88 kg" },
      { name: "Ikan", image: "/images/fish.png", co2: "13,63 kg" },
    ];
    this.moreFoodItems = [
      { name: "Sayur Bayam", image: "/images/spinach.png", co2: "2,0 kg" },
      { name: "Kacang Merah", image: "/images/red-beans.png", co2: "1,5 kg" },
      { name: "Beras", image: "/images/rice.png", co2: "3,2 kg" },
      { name: "Apel", image: "/images/apple.png", co2: "0,4 kg" },
      { name: "Pisang", image: "/images/banana.png", co2: "0,5 kg" },
    ];
    this.scrollInterval = null;
  }

  get allFoodItems() {
    return [...this.foodItems, ...this.moreFoodItems];
  }

  get duplicatedItems() {
    return [...this.allFoodItems, ...this.allFoodItems];
  }

  setScrollInterval(interval) {
    this.scrollInterval = interval;
  }

  clearScrollInterval() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }
}
