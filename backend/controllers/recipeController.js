const Recipe = require('../models/Recipe');

exports.getAllRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50; // default 50
    const recipes = await Recipe.find()
      .select('title_cleaned carbon_score total_recipe_carbon url image_name')
      .limit(limit); // tambahkan limit di sini

    const formatted = recipes.map(r => {
      let imageUrl = r.url || '';
      // If url is relative and does not start with http, prepend /foodImages/
      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
        imageUrl = `/foodImages/${imageUrl}`;
      }
      return {
        id: r._id,
        title_cleaned: r.title_cleaned,
        carbon_score: r.carbon_score,
        total_recipe_carbon: r.total_recipe_carbon,
        image: imageUrl || '/foodImages/default.jpg'
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

  let imageUrl = recipe.url || '';
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = `/foodImages/${imageUrl}`;
  }

  res.json({
    id: recipe._id,
    title_cleaned: recipe.title_cleaned,
    cleaned_ingredients: recipe.cleaned_ingredients,
    instructions_cleaned: recipe.instructions_cleaned,
    image: imageUrl || '/foodImages/default.jpg',
    quantity: recipe.quantity,
    unit: recipe.unit,
    pure_name: recipe.pure_name,
    carbon_score: recipe.carbon_score,
    total_recipe_carbon: recipe.total_recipe_carbon
  });
};
