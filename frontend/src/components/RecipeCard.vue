<template>
  <div class="recipe-card">
    <img :src="image" alt="Recipe Image" class="recipe-image" />
    <div class="recipe-info">
      <h4 class="recipe-title">{{ name }}</h4>
      <p class="recipe-duration">Duration: {{ duration }} mins</p>
      <p class="recipe-carbon">Footprint Carbon: {{ carbon }}%</p>
      <div class="stars">
        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= rating }">★</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    carbon: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    // Memeriksa apakah data props sudah sampai
    console.log("RecipeCard props:", this.$props);
  },
};
</script>

<style scoped>
.recipe-card {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
}

.recipe-card:hover {
  transform: scale(1.05);
}

.recipe-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
}

.recipe-info {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
}

.recipe-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.recipe-duration,
.recipe-carbon {
  font-size: 0.9rem;
  color: #666;
  margin: 0.3rem 0;
}

.stars {
  margin-top: 0.5rem;
}

.star {
  font-size: 1.2rem;
  color: #ccc;
}

.star.filled {
  color: #ffc107;
}
</style>
