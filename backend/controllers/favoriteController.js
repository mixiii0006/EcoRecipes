const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  await Favorite.create({ user_id: req.user._id, recipess_id: req.body.recipess_id });
  res.json({ message: 'Added to favorites' });
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
      image_url: f.recipess_id.url, // ✅ pakai url langsung
      image_name: f.recipess_id.image_name // ✅ tetap sertakan image_name
    }));
  res.json(formatted);
};

exports.deleteFavorite = async (req, res) => {
  await Favorite.deleteOne({ _id: req.params.id, user_id: req.user._id });
  res.json({ message: 'Removed from favorites' });
};
