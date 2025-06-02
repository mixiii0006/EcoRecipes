const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50; // default 50
    const recipes = await Recipe.find()
      .select('title_cleaned carbon_score total_recipe_carbon image_name')
      .limit(limit); // tambahkan limit di sini

    const formatted = recipes.map(r => ({
      id: r._id,
      title_cleaned: r.title_cleaned,
      carbon_score: r.carbon_score,
      total_recipe_carbon: r.total_recipe_carbon,
      image: `/images/${r.image_name}`
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json({
    id: recipe._id,
    title_cleaned: recipe.title_cleaned,
    cleaned_ingredients: recipe.cleaned_ingredients,
    instructions_cleaned: recipe.instructions_cleaned,
    image: `/images/${recipe.image_name}`,
    quantity: recipe.quantity,
    unit: recipe.unit,
    pure_name: recipe.pure_name,
    carbon_score: recipe.carbon_score,
    total_recipe_carbon: recipe.total_recipe_carbon
  });
};
