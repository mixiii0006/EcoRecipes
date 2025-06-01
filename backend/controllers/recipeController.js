const Recipe = require('../models/Recipe');

// Ambil semua resep lengkap
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find(); // ambil semua tanpa batasan
    res.json(recipes); // kirim semua field apa adanya
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// Ambil detail resep by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.json({
      id: recipe._id,
      title_cleaned: recipe.title_cleaned,
      cleaned_ingredients: recipe.cleaned_ingredients,
      instructions_cleaned: recipe.instructions_cleaned,
      image_url: recipe.url, // ✅ tampilkan url
      image_name: recipe.image_name, // ✅ sertakan juga image_name
      quantity: recipe.quantity,
      unit: recipe.unit,
      pure_name: recipe.pure_name,
      carbon_score: recipe.carbon_score,
      total_recipe_carbon: recipe.total_recipe_carbon
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
