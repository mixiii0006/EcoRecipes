const mongoose = require('mongoose');
const RecipeSchema = new mongoose.Schema({
  image_name: String,
  url: String, // URL untuk gambar resep
  title_cleaned: String,
  cleaned_ingredients: [String],
  instructions_cleaned: String,
  quantity: Number,
  unit: String,
  pure_name: String,
  carbon_score: Number,
  total_recipe_carbon: Number,
  users_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Recipe', RecipeSchema);