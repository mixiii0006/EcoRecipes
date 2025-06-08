<template>
  <div class="food-category-card" @click="handleClick">
    <div class="food-category-image">
      <img :src="imageUrl" :alt="name" />
    </div>
    <div class="food-category-info">
      <h4 class="food-name">{{ name }}</h4>
      <p class="food-meta">Durasi: {{ duration }} min · Karbon: {{ carbon || "N/A" }} g</p>
      <div class="food-actions">
        <button class="btn cook-btn" :disabled="!matched" @click.stop="handleCook">Masak</button>
        <i class="fa-regular fa-heart heart-icon" @click.stop="toggleFavorite"></i>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "RecipeCard",
  props: {
    recipess_id: { type: String, required: true },
    image: { type: String, default: "" },
    name: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    carbon: { type: [Number, String], default: null },
    rating: { type: Number, default: 0 },
    matched: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    imageUrl() {
      console.log("RecipeCard image prop:", this.image);
      if (!this.image) return "";
      // If image is a full URL or starts with /, return as is
      if (this.image.startsWith("http") || this.image.startsWith("/")) {
        // Append .jpg if missing extension
        if (!this.image.match(/\.(jpg|jpeg|png|gif)$/i)) {
          const imageWithExt = this.image + ".jpg";
          console.log("RecipeCard imageUrl (full URL with appended .jpg):", imageWithExt);
          return imageWithExt;
        }
        console.log("RecipeCard imageUrl (full URL):", this.image);
        return this.image;
      }
      // Append .jpg if no extension present
      if (!/\.(jpg|jpeg|png|gif)$/i.test(this.image)) {
        const url = `/foodImages/${this.image}.jpg`;
        console.log("RecipeCard imageUrl (local with appended .jpg):", url);
        return url;
      }
      const url = `/foodImages/${this.image}`;
      console.log("RecipeCard imageUrl (local):", url);
      return url;
    },
  },
  methods: {
    onImageError(event) {
      event.target.src = "/foodImages/default.jpg";
    },
  },
  methods: {
    handleClick() {
      // Emit the open event with the recipe id
      this.$emit("open", { id: this.recipess_id });
    },
    handleCook() {
      Swal.fire({
        icon: "success",
        title: "Memasak...",
        text: `Memasak: ${this.name}`,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$emit("cook", this.recipess_id);
          this.$emit("open", { id: this.recipess_id }); // Buka modal jika user tekan OK
        }
      });
    },
toggleFavorite() {
  this.$emit("favorite", this.recipess_id);
  Swal.fire({
    icon: "success",
    title: "Ditambahkan ke Favorit",
    text: `Favorit: ${this.name}`,
    showConfirmButton: false,
    timer: 1500,
  });
},
  },
};
</script>

<style scoped>
.card-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.2rem;
  align-items: stretch;
  padding-bottom: 2rem;
}

/* CARD STYLES */
.food-category-card {
  background: #fff;
  border-radius: 16px;
  padding: 0.75rem; /* Lebih kecil */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 270px; /* Ubah sesuai keinginan, 250px - 300px oke */
  box-sizing: border-box;
}

/* Hover effect */
.food-category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* IMAGE */
.food-category-image {
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 0.7rem; /* Lebih kecil */
  flex-shrink: 0;
}

.food-category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* INFO & ACTIONS */
.food-category-info {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.3rem; /* Lebih kecil */
  min-height: 50px;
}

.food-name {
  font-size: 1.1rem;
  color: #2e7d32;
  font-weight: bold;
  margin: 0;
  /* Batasi max 2 baris */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.food-meta {
  font-size: 0.85rem;
  color: #555;
}

/* Tombol dan Favorit */
.food-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 0.6rem;
}

.cook-btn {
  flex: 1;
  padding: 0.4rem 1rem; /* Lebih ramping */
  border-radius: 8px;
  background: linear-gradient(to right, #2e7d32, #66bb6a);
  color: white;
  border: none;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.cook-btn:hover {
  background: linear-gradient(to right, #1b5e20, #4caf50);
}

.heart-icon {
  font-size: 1.4rem;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s ease;
}

.heart-icon:hover {
  color: red;
}
</style>
