export default class LandingPageModel {
  constructor() {
    this.foodItems = [
      { name: "Beef (beef herd)", co2: "99.48 kg" },
      { name: "Poultry Meat", co2: "9.87 kg" },
      { name: "Dark Chocolate", co2: "46.65 kg" },
      { name: "Cheese", co2: "23.88 kg" },
      { name: "Fish (farmed)", co2: "13.63 kg" },
      { name: "Eggs", co2: "4.67 kg" },
      { name: "Prawns (farmed)", co2: "26.87 kg" },
    ];
    this.moreFoodItems = [
      { name: "Tomatoes",  co2: "2.09 kg" },
      { name: "Cassava",  co2: "1.32 kg" },
      { name: "Potatoes",  co2: "0.46 kg" },
      { name: "Tofu",  co2: "3.16 kg" },
      { name: "Rice", co2: "4.45 kg" },
      { name: "Apples", co2: "0.43 kg" },
      { name: "Bananas", co2: "0.86 kg" },
      { name: "Coffee", co2: "28.53 kg" },
      { name: "Milk", co2: "3.15 kg" },
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
