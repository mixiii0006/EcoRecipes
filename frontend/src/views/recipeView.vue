<template>
  <div class="recipe-detail-page">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <main class="content">
      <div class="recipe-header">
        <h2>Nastar Keju</h2>
      </div>

      <div class="recipe-body">
        <div class="left-column">
          <RecipeCard
            v-for="recipe in recipes"
            :key="recipe.id"
            :name="recipe.name"
            :image="recipe.image"
            :duration="recipe.duration"
            :carbon="recipe.carbon"
            @favorite="handleFavorite"
          />
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
    </main>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import RecipeCard from "../components/RecipeCard.vue";
import RecipeModel from "../model/RecipeModel";
import RecipePresenter from "../presenter/RecipePresenter";
import ProfileModel from "../model/ProfileModel";

export default {
  name: "RecipeDetail",
  components: {
    Sidebar,
    RecipeCard,
  },
  data() {
    return {
      model: new RecipeModel(),
      presenter: null,
      profileModel: new ProfileModel(),
      recipes: [
        // Example recipe data; replace with actual data fetching logic
        { id: 1, name: "Nastar Keju", image: "nastar-keju", duration: 30, carbon: 100 },
        // Add more recipes as needed
      ],
    };
  },
  created() {
    this.presenter = new RecipePresenter(this.model, this);
  },
  mounted() {
    const id = this.$route.params.id;
    this.presenter.setRecipeId(id);
    console.log("Recipe ID:", id);
  },
  methods: {
    update() {
      this.$forceUpdate();
    },
    async handleFavorite(favoriteData) {
      try {
        await this.profileModel.addFavorite(favoriteData.recipess_id);
        this.$toast.success(`Favorit: ${favoriteData.name} berhasil ditambahkan`);
      } catch (error) {
        this.$toast.error(`Gagal menambahkan favorit: ${favoriteData.name}`);
      }
    },
  },
};
</script>


<style scoped>
.recipe-detail-page {
  display: flex;
  height: 100vh;
  font-family: "Poppins", sans-serif;
  background-color: #f8f8f8;
}

/* Sidebar handled separately */
.sidebar {
  width: 270px;
  background-color: #ffffff;
  padding: 2rem 1rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
}

/* Main Content */
.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-left: 270px;
}

/* Header Title */
.recipe-header {
  height: 70px;
  padding-left: 1rem;
  background: linear-gradient(to right, #235f3a, #73b06f);
  color: white;
  border-radius: 12px;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.recipe-header h2 {
  margin: 0;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Recipe Layout */
.recipe-body {
  display: flex;
  gap: 2rem;
  width: 100%;
}

/* Left Column (Image + Ingredients) */
.left-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Right Column (Instructions) */
.right-column {
  flex: 1;
}

/* Recipe Image */
.recipe-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Card Style */
.ingredients-card,
.instructions-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

/* Headings */
.ingredients-card h3,
.instructions-card h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* List Styling */
.ingredients-card ul,
.instructions-card ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.ingredients-card li,
.instructions-card li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .recipe-detail-page {
    flex-direction: column;
  }

  .content {
    margin-left: 0;
    padding-top: 0;
    margin-top: 60px;
  }

  .recipe-body {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .recipe-image {
    max-height: 250px;
  }
}

</style>