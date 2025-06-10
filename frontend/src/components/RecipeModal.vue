<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <div class="recipe-header">
        <h2>{{ food.title_cleaned || food.name || food.Title_Cleaned }}</h2>
          <div class="carbon-highlight">
            Total Carbon: {{

              (typeof food.total_recipe_carbon === 'number' && !isNaN(food.total_recipe_carbon))
                ? food.total_recipe_carbon.toFixed(4)
                : 'N/A'
            }} Co2
          </div>
      </div>
      <div class="recipe-body">
        <div class="left-column">
          <img
            class="recipe-image"
            :src="getImageUrl(food.image_url || food.image_name || food.image || food.Image_Name)"
            :alt="food.name || 'Recipe image'"
          />

          <div class="ingredients-card">
            <h3>How to Cook</h3>
            <ul>
              <li v-if="!instructionsArray.length">No instructions available.</li>
              <li v-for="(step, index) in instructionsArray" :key="'step-' + index">{{ step }}</li>
            </ul>
          </div>
        </div>
        <div class="right-column">
          <div class="instructions-card">
            <h3>Ingredients</h3>
            <ul>
              <li v-if="!ingredientsArray.length">No ingredients available.</li>
              <li v-for="(ingredient, index) in ingredientsArray" :key="'ingredient-' + index">{{ ingredient }}</li>
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
      if (!img) return "/assets/default-recipe.jpg";
      if (img.startsWith("http")) return img;
      // Extract filename from path if any
      const filename = img.split("/").pop();
      if (filename.endsWith(".jpg") || filename.endsWith(".png")) {
        return `/foodImages/${filename}`;
      }
      return `/foodImages/${filename}.jpg`;
    },
  },
  computed: {
    instructionsArray() {
      const raw = this.food.instructions_cleaned || this.food.Instructions_Cleaned || this.food.instructions || "";
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
      const raw = this.food.cleaned_ingredients || this.food.Cleaned_Ingredients || this.food.ingredients || [];
      return Array.isArray(raw) ? raw : [];
    },
    ingredientsArray() {
      const raw = this.food.cleaned_ingredients || this.food.Cleaned_Ingredients || this.food.ingredients || "";
      if (Array.isArray(raw)) return raw;
      if (typeof raw === "string" && raw.startsWith("[")) {
        try {
          let fixed = raw.replace(/\\u[a-fA-F0-9]{4}/g, "");
          fixed = fixed.replace(/â€“|â€|Ã|½/g, "");
          fixed = fixed.replace(/'/g, '"');
          const parsed = JSON.parse(fixed);
          return Array.isArray(parsed) ? parsed.map((s) => s.trim()).filter(Boolean) : [];
        } catch (e) {
          console.error("Parse error:", e.message);
          return [];
        }
      }
      return [];
    },
  },
  mounted() {
    // Debug log agar tau data yang masuk ke modal
    console.log("RecipeModal FOOD:", this.food);
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;                        
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;           
  justify-content: center;      
  padding: 0;                  
  overflow-y: auto;            
  z-index: 2000;
}

.modal-content {
  position: relative;
  background: #fff;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  max-width: none;         
  max-height: none;       
  margin: auto;            
  padding: 2rem;                 
  overflow-y: auto;         
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
  margin-top: 25px;
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
  max-height: 300px;
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

.instructions-card ul,
.ingredients-card ul {
  line-height: 1.4;      /* atau nilai sesuai selera */
}

/* Tambah margin antara tiap item */
.instructions-card ul li,
.ingredients-card ul li {
  margin-bottom: 0.75rem;
}

/* (Opsional) Hapus margin-bottom pada item terakhir */
.instructions-card ul li:last-child,
.ingredients-card ul li:last-child {
  margin-bottom: 0;
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
