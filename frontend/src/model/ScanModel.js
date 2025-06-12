import { reactive } from "vue";

const state = reactive({
  images: [
    { file: null, preview: null, showCamera: false },
    { file: null, preview: null, showCamera: false },
    { file: null, preview: null, showCamera: false },
    { file: null, preview: null, showCamera: false },
  ],
  cameraStream: null,
  currentCameraIdx: null,
  recommendations: [],
  loading: false,
  showModal: false,
  selectedRecipe: null,
  recentSearches: [],
  totalCarbon: 0,
});

export default class ScanModel {
  get images() {
    return state.images;
  }
  get cameraStream() {
    return state.cameraStream;
  }
  get currentCameraIdx() {
    return state.currentCameraIdx;
  }
  get recommendations() {
    return state.recommendations;
  }
  get loading() {
    return state.loading;
  }
  get showModal() {
    return state.showModal;
  }
  get selectedRecipe() {
    return state.selectedRecipe;
  }
  get recentSearches() {
    return state.recentSearches;
  }

  get totalCarbon() {
    return state.totalCarbon;
  }

  set totalCarbon(value) {
    state.totalCarbon = value;
  }

  // New state for cooks and favorites
  get cooks() {
    if (!state.cooks) state.cooks = [];
    return state.cooks;
  }

  get favorites() {
    if (!state.favorites) state.favorites = [];
    return state.favorites;
  }

  setImage(idx, file, preview) {
    state.images[idx].file = file;
    state.images[idx].preview = preview;
    state.images[idx].showCamera = false;
  }

  setShowCamera(idx, show) {
    state.images[idx].showCamera = show;
  }

  setCameraStream(stream) {
    state.cameraStream = stream;
  }

  setCurrentCameraIdx(idx) {
    state.currentCameraIdx = idx;
  }

  setRecommendations(recommendations) {
    state.recommendations = recommendations;
  }

  setLoading(loading) {
    state.loading = loading;
  }

  setShowModal(show) {
    state.showModal = show;
  }

  setSelectedRecipe(recipe) {
    state.selectedRecipe = recipe;
  }

  setRecentSearches(searches) {
    state.recentSearches = searches;
  }

  deleteRecentSearch(idx) {
    state.recentSearches.splice(idx, 1);
  }

  // Add cook method
  addCook(recipess_id) {
    if (!state.cooks) state.cooks = [];
    if (!state.cooks.includes(recipess_id)) {
      state.cooks.push(recipess_id);
    }
  }

  // Add favorite method
  addFavorite(recipess_id) {
    if (!state.favorites) state.favorites = [];
    if (!state.favorites.includes(recipess_id)) {
      state.favorites.push(recipess_id);
    }
  }
}
