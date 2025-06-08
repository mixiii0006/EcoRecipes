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
}
