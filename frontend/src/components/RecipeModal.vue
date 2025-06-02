<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <div class="recipe-header">
        <h2>{{ food.name || food.Title_Cleaned }}</h2>
        <div class="carbon-highlight">
          Total Carbon: {{ food.total_recipe_carbon ? food.total_recipe_carbon.toFixed(4) : 'N/A' }} g
        </div>
      </div>

      <div class="recipe-body">
        <!-- Left column -->
        <div class="left-column">
          <img
            class="recipe-image"
            :src="getImageUrl(food.image || food.Image_Name)"
            :alt="food.name || 'Recipe image'"
          />

          <div class="ingredients-card">
            <h3>How to Cook</h3>
            <ul>
              <li v-if="!instructionsArray.length">
                No instructions available.
              </li>
              <li
                v-for="(step, index) in instructionsArray"
                :key="'step-' + index"
              >
                {{ step }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Right column -->
        <div class="right-column">
          <div class="instructions-card">
            <h3>Ingredients</h3>
            <ul>
              <li v-if="!ingredientsArray.length">No ingredients available.</li>
              <li
                v-for="(ingredient, index) in ingredientsArray"
                :key="'ingredient-' + index"
              >
                {{ ingredient }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeModal",
  props: {
    food: {
      type: Object,
      required: true,
    },
  },
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
    },
    getImageUrl(img) {
      return img ? `/foodImages/${img}.jpg` : "https://via.placeholder.com/150";
    },
  },
  computed: {
    instructionsArray() {
      const raw =
        this.food.Instructions_Cleaned || this.food.instructions || "";
      return Array.isArray(raw)
        ? raw
        : typeof raw === "string"
        ? raw
            .split(/[.●•-]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    },
    ingredientsArray() {
      const raw = this.food.Cleaned_Ingredients || this.food.ingredients;

      console.log("ingredientsArray raw data:", raw);

      if (Array.isArray(raw)) {
        return raw;
      }

      if (typeof raw === "string" && raw.startsWith("[")) {
        try {
          // Hapus karakter yang mengganggu
          let fixed = raw.replace(/\\u[a-fA-F0-9]{4}/g, ""); // hapus unicode escape
          fixed = fixed.replace(/â€“|â€|Ã|½/g, ""); // hapus karakter aneh
          fixed = fixed.replace(/'/g, '"'); // ganti ' jadi "

          const parsed = JSON.parse(fixed);
          return Array.isArray(parsed)
            ? parsed.map((s) => s.trim()).filter(Boolean)
            : [];
        } catch (e) {
          console.error("Parse error:", e.message);
          return [];
        }
      }

      return [];
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  width: 100vw;
  height: 100vh;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  border-radius: 0;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  font-size: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.recipe-header {
  font-size: 1rem;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  padding: 0.5rem 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.recipe-body {
  display: flex;
  gap: 1.5rem;
  color: black;
}

.left-column,
.right-column {
  flex: 1;
}

.recipe-image {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.ingredients-card,
.instructions-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 1rem;
}

@media (max-width: 768px) {
  .recipe-body {
    flex-direction: column;
  }

  .recipe-image {
    max-height: 200px;
  }
}
</style>
