<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="close-btn" @click="closeModal">×</button>
      <div class="recipe-header">
        <h2>Nastar Keju</h2>
      </div>

      <div class="recipe-body">
        <div class="left-column">
          <img class="recipe-image" src="https://via.placeholder.com/150" alt="Nastar Keju" />
          <div class="ingredients-card">
            <h3>How to Cook</h3>
            <ul>
              <li>1 bar cheese</li>
              <li>1 cup of flour</li>
              <li>1 tsp of sugar</li>
              <li>1/2 tsp of salt</li>
              <li>20 gr of butter</li>
              <li>50 ml of oil</li>
              <li>20 gr of condensed milk</li>
            </ul>
          </div>
        </div>

        <div class="right-column">
          <div class="instructions-card">
            <h3>Ingredients</h3>
            <ul>
              <li>1 bar cheese</li>
              <li>1 cup of flour</li>
              <li>1 tsp of sugar</li>
              <li>1/2 tsp of salt</li>
              <li>20 gr of butter</li>
              <li>50 ml of oil</li>
              <li>20 gr of condensed milk</li>
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
  emits: ["close"],
  methods: {
    closeModal() {
      this.$emit("close");
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
  font-size: 1.5rem;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.recipe-body {
  display: flex;
  gap: 2rem;
}

.left-column,
.right-column {
  flex: 1;
}

.recipe-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1.5rem;
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
}
</style>
