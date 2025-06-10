<template>
   <div class="food-category-card" @click="handleClick">
    <div class="food-category-image">
      <img :src="imageUrl" :alt="name" @error="onImageError" />
    </div>
    <div class="food-category-info">
      <h4 class="food-name">{{ name }}</h4>
      <p class="food-meta">Carbon Footprint: {{ carbon ?? "N/A" }} Co2</p>
      <div class="food-actions">
        <button class="btn cook-btn" :disabled="!matched" @click.stop="handleCook">
          <i class="fa-solid fa-utensils"></i>
          Cook
        </button>

        <button class="btn favorite-btn" @click.stop="toggleFavorite">
          <i class="fa-regular fa-heart"></i>
          Favorite
        </button>
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
    ingredients: { type: Array, default: () => [] },
    instructions: { type: String, default: "" },
    matched: { type: Boolean, default: true },
  },
  computed: {
    imageUrl() {
      if (!this.image) return "";
      if (this.image.startsWith("http") || this.image.startsWith("/")) {
        return /\.(jpe?g|png|gif)$/i.test(this.image) ? this.image : this.image + ".jpg";
      }
      return `/foodImages/${/\.(jpe?g|png|gif)$/i.test(this.image) ? this.image : this.image + ".jpg"}`;
    },
  },
  methods: {
    onImageError(e) {
      e.target.src = "/foodImages/default.jpg";
    },
    handleClick() {
      this.$emit("open", { id: this.recipess_id });
    },
    handleCook() {
      Swal.fire({
        icon: "success",
        title: "Cooking...",
        text: `Cook: ${this.name}`,
        confirmButtonText: "OK",
      }).then((res) => {
        if (res.isConfirmed) {
          this.$emit("cook", this.recipess_id);
          this.$emit("open", { id: this.recipess_id });
        }
      });
    },
    toggleFavorite() {
      this.$emit("favorite", this.recipess_id);
      Swal.fire({
        icon: "success",
        title: "Added to favorites",
        text: `${this.name} has been added to your favorites!`,
        showConfirmButton: false,
        timer: 1500,
      });
    },
  },
};
</script>

<style scoped>
.food-category-card {
  /* gradient border */
  border: 2px solid transparent;
  border-radius: 12px;
  background-image:
    linear-gradient(#fff, #fff),                  /* isi putih */
    linear-gradient(to right, #aac5b5, #94da8f);  /* border hijau gradasi */
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;

  /* layout as before */
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0.75rem;
  box-sizing: border-box;

  /* shadow & transisi */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.food-category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.food-category-image {
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 0.7rem;
  flex-shrink: 0;
}
.food-category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.food-category-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.3rem;
}
.food-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}
.food-meta {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

.food-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

/* Base .btn untuk kedua tombol */
.food-actions .btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 0;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 24px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

/* Cook button (gradient border) */
.food-actions .cook-btn {
  color: #2e7d32;
  background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #235f3a, #73b06f);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  border: 2px solid transparent;
}
.food-actions .cook-btn:not(:disabled):hover {
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: #fff;
}

/* Favorite button (solid border + fill) */
.food-actions .favorite-btn {
  color: #e74c3c;
  border: 2px solid #e74c3c;
  background: #fff;
}
.food-actions .favorite-btn:hover {
  background: #e74c3c;
  color: #fff;
}
</style>
