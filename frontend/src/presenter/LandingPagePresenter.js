export default class LandingPagePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.goToLogin = this.goToLogin.bind(this);
    this.view.startCarouselAutoscroll = this.startCarouselAutoscroll.bind(this);
  }

  goToLogin() {
    this.view.$router.push('/login');
  }

  startCarouselAutoscroll() {
    const carousel = this.view.$refs.carouselRef;
    const track = this.view.$refs.trackRef;

    const scrollSpeed = 1;
    const intervalTime = 16;
    const halfScroll = track.scrollWidth / 2;

    this.model.setScrollInterval(setInterval(() => {
      if (!carousel || !track) return;

      if (carousel.scrollLeft >= halfScroll) {
        carousel.scrollLeft = 0;
      } else {
        carousel.scrollLeft += scrollSpeed;
      }
    }, intervalTime));
  }

  clearScrollInterval() {
    this.model.clearScrollInterval();
  }
}
