const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const user_id = req.user._id;
    const recipess_id = req.body.recipess_id;

    const existingFavorite = await Favorite.findOne({ user_id, recipess_id });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Recipe already in favorites list' });
    }

    await Favorite.create({ user_id, recipess_id });
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  const favorites = await Favorite.find({ user_id: req.user._id }).populate('recipess_id');
  const formatted = favorites
    .filter(f => f.recipess_id)
    .map(f => ({
      id: f._id,
      recipess_id: f.recipess_id._id,
      title_cleaned: f.recipess_id.title_cleaned,
      carbon_score: f.recipess_id.carbon_score,
      total_recipe_carbon: f.recipess_id.total_recipe_carbon,
      image: f.recipess_id.image_name ? `/foodImages/${f.recipess_id.image_name}.jpg` : (f.recipess_id.url || ""),
      image_name: f.recipess_id.image_name,
      instructions_cleaned: f.recipess_id.instructions_cleaned || f.recipess_id.instructions,
      cleaned_ingredients: f.recipess_id.cleaned_ingredients || f.recipess_id.ingredients
    }));
  res.json(formatted);
};