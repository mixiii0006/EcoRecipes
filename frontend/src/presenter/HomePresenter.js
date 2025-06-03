export default class HomePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

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
        this.model.setUser({});
        this.view.update();
        return;
      }
      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized, clear token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          this.view.$router.push("/login");
          return;
        }
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      console.log("User data received:", data);
      const user = {
        name: data.name,
        totalKarmonReduced: data.total_user_carbon ? Number(data.total_user_carbon.toFixed(3).replace(/(\d)(?=(\d{2})+\.)/g, '$1,')) : 0,
      };
      this.model.setUser(user);
      this.view.update();
    } catch (error) {
      console.error("Error loading user data:", error);
      this.model.setUser({});
      this.view.update();
    }
  }

  handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    this.view.$router.push("/");
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

  toggleMenu() {
    this.model.setIsMenuOpen(!this.model.isMenuOpen);
    this.view.update();
  }

  clearCarouselInterval() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }
}
