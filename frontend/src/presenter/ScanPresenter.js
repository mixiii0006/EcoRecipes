export default class ScanPresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Bind view event handlers to presenter methods
    this.view.onFileChange = this.onFileChange.bind(this);
    this.view.openCamera = this.openCamera.bind(this);
    this.view.capturePhoto = this.capturePhoto.bind(this);
    this.view.closeCamera = this.closeCamera.bind(this);
    this.view.submitImages = this.submitImages.bind(this);
    this.view.goToRecipe = this.goToRecipe.bind(this);
    this.view.closeModal = this.closeModal.bind(this);
    this.view.deleteRecentSearch = this.deleteRecentSearch.bind(this);
  }

  onFileChange(event, idx) {
    const file = event.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      this.model.setImage(idx, file, preview);
      this.model.setShowCamera(idx, false);
      this.stopCamera();
      this.view.update();
    }
  }

  async openCamera(idx) {
    if (this.model.currentCameraIdx !== null && this.model.currentCameraIdx !== idx) {
      this.closeCamera(this.model.currentCameraIdx);
    }
    this.model.setCurrentCameraIdx(idx);
    this.model.setShowCamera(idx, true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.model.setCameraStream(stream);
      this.view.setVideoStream(idx, stream);
      this.view.update();
    } catch (err) {
      alert("Tidak dapat mengakses kamera. Izinkan kamera di browser Anda.");
      this.model.setShowCamera(idx, false);
      this.view.update();
    }
  }

  capturePhoto(idx) {
    const dataUrl = this.view.captureVideoFrame(idx);
    if (!dataUrl) return;
    const file = this.dataURLtoFile(dataUrl, `capture-${Date.now()}.png`);
    this.model.setImage(idx, file, dataUrl);
    this.model.setShowCamera(idx, false);
    this.stopCamera();
    this.view.update();
  }

  closeCamera(idx) {
    this.model.setShowCamera(idx, false);
    this.stopCamera();
    this.view.update();
  }

  stopCamera() {
    if (this.model.cameraStream) {
      this.model.cameraStream.getTracks().forEach((track) => track.stop());
      this.model.setCameraStream(null);
      this.model.setCurrentCameraIdx(null);
    }
  }

  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async submitImages() {
    const imagesToSubmit = this.model.images.filter((img) => img.file);

    if (imagesToSubmit.length === 0) {
      alert("Please upload or capture at least one image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", imagesToSubmit[0].file);

    try {
    const response = await fetch("http://localhost:3000/api/scan", {
      method: "POST",
      body: formData,
    });

      if (!response.ok) throw new Error("Failed to scan image");
      const data = await response.json();

      const recommendations = (data.recommendations || []).map((rec) => ({
        ...rec,
        Image_Name: rec.Image_Name.split("/").pop().replace(".jpg", ""),
      }));

      this.model.setRecommendations(recommendations);
      this.view.update();
      console.log("Scan Recommendations:", recommendations);
    } catch (error) {
      alert("Failed to fetch recommendations.");
    }
  }

  goToRecipe(recipe) {
    this.model.setSelectedRecipe(recipe);
    this.model.setShowModal(true);
    this.view.update();
  }

  closeModal() {
    this.model.setShowModal(false);
    this.model.setSelectedRecipe(null);
    this.view.update();
  }

  deleteRecentSearch(idx) {
    this.model.deleteRecentSearch(idx);
    this.view.update();
  }
}
