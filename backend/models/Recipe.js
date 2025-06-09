const mongoose = require('mongoose');
const RecipeSchema = new mongoose.Schema({
  image_name: { type: String, maxlength: 300 },
  url: { type: String, maxlength: 500 },
  title_cleaned: { type: String, maxlength: 300 },
  cleaned_ingredients: [{ type: String }],
  instructions_cleaned: { type: String },
  quantity: Number,
  unit: { type: String, maxlength: 50 },
  pure_name: { type: String, maxlength: 255 },
  carbon_score: Number,
  total_recipe_carbon: Number,
  users_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carbonreferences_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CarbonReference' }
});
module.exports = mongoose.model('Recipe', RecipeSchema);