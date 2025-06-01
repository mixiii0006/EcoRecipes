export default class ScanModel {
  constructor() {
    this.images = [
      { file: null, preview: null, showCamera: false },
      { file: null, preview: null, showCamera: false },
      { file: null, preview: null, showCamera: false },
      { file: null, preview: null, showCamera: false },
    ];
    this.cameraStream = null;
    this.currentCameraIdx = null;
    this.recommendations = [];
    this.showModal = false;
    this.selectedRecipe = null;
    this.recentSearches = [];
  }

  setImage(idx, file, preview) {
    this.images[idx].file = file;
    this.images[idx].preview = preview;
    this.images[idx].showCamera = false;
  }

  setShowCamera(idx, show) {
    this.images[idx].showCamera = show;
  }

  setCameraStream(stream) {
    this.cameraStream = stream;
  }

  setCurrentCameraIdx(idx) {
    this.currentCameraIdx = idx;
  }

  setRecommendations(recommendations) {
    this.recommendations = recommendations;
  }

  setShowModal(show) {
    this.showModal = show;
  }

  setSelectedRecipe(recipe) {
    this.selectedRecipe = recipe;
  }

  setRecentSearches(searches) {
    this.recentSearches = searches;
  }

  deleteRecentSearch(idx) {
    this.recentSearches.splice(idx, 1);
  }
}
