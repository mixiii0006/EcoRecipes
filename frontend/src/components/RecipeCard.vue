<template>
  <div class="food-category-card" @click="handleClick">
    <div class="food-category-image">
      <img :src="imageUrl" :alt="name" />
    </div>
    <div class="food-category-info">
      <h4 class="food-name">{{ name }}</h4>
      <p class="food-meta">Durasi: {{ duration }} min · Karbon: {{ carbon || 'N/A' }} g</p>
      <div class="food-actions">
        <button class="btn cook-btn" @click.stop="handleCook">Masak</button>
        <i class="fa-regular fa-heart heart-icon" @click.stop="toggleFavorite"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    Image_Name: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
    },
    carbon: {
      type: [Number, String],
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    imageUrl() {
      return this.Image_Name
        ? `/foodImages/${this.Image_Name}`
        : "https://source.unsplash.com/160x160/?food";
    },
  },
  methods: {
    handleClick() {
      this.$emit("open");
    },
    handleCook() {
      alert(`Memasak: ${this.name}`);
    },
    toggleFavorite() {
      alert(`Favorit: ${this.name}`);
    },
  },
};
</script>

<style scoped>
/* Card wrapper */
.food-category-card {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s;
  text-align: left;
  display: flex;
  flex-direction: column;
}

/* Hover effect */
.food-category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* Image container */
.food-category-image {
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.food-category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Info section */
.food-category-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Food name */
.food-name {
  font-size: 1.1rem;
  color: #2e7d32;
  font-weight: bold;
  margin: 0;
}

/* Meta info */
.food-meta {
  font-size: 0.85rem;
  color: #555;
}

/* Actions row */
.food-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 0.75rem;
}

/* Cook button */
.cook-btn {
  flex: 1;
  padding: 0.5rem 1rem;
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

/* Heart icon */
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

