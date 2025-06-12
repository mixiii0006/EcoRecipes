<template>
  <div :class="['recipe-card', { compact }]" @click="handleClick">
    <!-- Recipe Image -->
    <div class="image-wrapper">
      <img :src="imageUrl" :alt="name" @error="onImageError" />
    </div>

    <!-- Card Body -->
    <div class="card-body">
      <h3 class="recipe-title">{{ name }}</h3>

      <!-- Stats Box -->
      <div class="stat" v-if="!compact && totalRecipeCarbon !== null">
        <span class="stat-label">Recipe Carbon Footprint</span>
        <span class="stat-value">{{ totalRecipeCarbon }} CO₂eq/kg</span>
      </div>

      <div class="stat" v-if="!compact && totalUsedCarbon !== null">
        <span class="stat-label">Carbon Avoided</span>
        <span class="stat-value">{{ totalUsedCarbon }} CO₂eq/kg</span>
      </div>

      <div class="stat" v-if="!compact && totalMissingCarbon !== null">
        <span class="stat-label">Carbon to Emit</span>
        <span class="stat-value">{{ totalMissingCarbon }} CO₂eq/kg</span>
      </div>

      <div class="stat" v-if="!compact && efficiency !== null">
        <span class="stat-label">Efficiency</span>
        <span class="stat-value"> {{ (efficiency * 100).toFixed(1) }}% </span>
      </div>

      <!-- Used / Missing / Leftovers -->
      <div class="badge-container" v-if="used.length || missing.length || leftovers.length">
        <span v-for="(item, i) in used" :key="`u${i}`" class="badge used">Used: {{ item }}</span>
        <span v-for="(item, i) in missing" :key="`m${i}`" class="badge missing">Missing: {{ item }}</span>
        <span v-for="(item, i) in leftovers" :key="`l${i}`" class="badge leftover">Leftover: {{ item }}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <button class="btn cook" :disabled="!matched" @click.stop="handleCook"><i class="fa-solid fa-utensils"></i> Cook</button>
      <button class="btn fav" @click.stop="toggleFavorite"><i class="fa-regular fa-heart"></i> Favorite</button>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "RecipeCard",
  props: {
    favorites: { type: Array, default: () => [] },
    cooks: { type: Array, default: () => [] },
    recipess_id: { type: String, required: true },
    image: { type: String, default: "" },
    name: { type: String, default: "" },
    carbon: { type: [Number, String], default: null },
    totalRecipeCarbon: { type: [Number, String], default: null },
    totalUsedCarbon: { type: [Number, String], default: null },
    totalMissingCarbon: { type: [Number, String], default: null },
    efficiency: { type: [Number, String], default: null },
    used: { type: Array, default: () => [] },
    leftovers: { type: Array, default: () => [] },
    missing: { type: Array, default: () => [] },
    matched: { type: Boolean, default: true },
    compact: { type: Boolean, default: false },
  },
  computed: {
    imageUrl() {
      if (!this.image) return "/foodImages/default.jpg";
      const hasExt = /\.(jpe?g|png|gif)$/i.test(this.image);
      const path = this.image.startsWith("http") || this.image.startsWith("/") ? this.image : `/foodImages/${this.image}`;
      return hasExt ? path : `${path}.jpg`;
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
.recipe-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 350px;
  padding-bottom: 60px; /* space for footer */
}
.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
  width: 100%;
  aspect-ratio: 16/9;
  border-bottom: 2px solid #e0e0e0;
  overflow: hidden;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
  flex: none;
}

.recipe-title {
  font-size: 1rem;
  font-weight: 700;
  color: #235f3a;
  margin: 0;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}
.stat {
  text-align: center;
  background: #eafaf2;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
}
.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #73b06f;
  font-weight: 600;
}
.stat-value {
  display: block;
  font-size: 0.95rem;
  color: #1f4b2b;
  font-weight: 700;
  margin-top: 0.25rem;
}

.badge-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.badge {
  font-size: 0.75rem;
  padding: 0.8rem 0.8rem;
  border-radius: 10px;
  font-weight: 500;
}
.badge.missing {
  background: #fdecea;
  color: #c0392b;
}
.badge.leftover {
  background: #eafaf2;
  color: #27ae60;
}
.badge.used {
  background: #e0f7ea;
  color: #2e7d32;
}

.card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
}

.btn {
  flex: 1;
  padding: 0.5rem 0;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn.cook {
  background: linear-gradient(135deg, #94da8f 0%, #73b06f 100%);
  color: #fff;
}
.btn.cook:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
.btn.cook:hover:not(:disabled) {
  opacity: 0.9;
}
.btn.fav {
  background: #fff;
  border: 2px solid #e74c3c;
  color: #e74c3c;
}
.btn.fav:hover {
  background: #e74c3c;
  color: #fff;
}
</style>
