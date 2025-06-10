const Cook = require('../models/Cook');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.addCook = async (req, res) => {
  try {
    const user_id = req.user._id;
    const recipess_id = req.body.recipess_id;

    const existingCook = await Cook.findOne({ user_id, recipess_id });
    if (existingCook) {
      return res.status(400).json({ message: 'Recipe already in cooks list' });
    }

    const newCook = await Cook.create({ user_id, recipess_id });

    const recipe = await Recipe.findById(recipess_id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await User.findByIdAndUpdate(user_id, {
      $inc: { total_user_carbon: recipe.total_recipe_carbon }
    });

    res.json({ message: 'Cook record saved and user carbon updated', newCook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCooks = async (req, res) => {
  const cooks = await Cook.find({ user_id: req.user._id }).populate('recipess_id');
  const formatted = cooks
    .filter(c => c.recipess_id)
    .map(c => ({
      id: c._id,
      recipess_id: c.recipess_id._id,
      title_cleaned: c.recipess_id.title_cleaned,
      carbon_score: c.recipess_id.carbon_score,
      total_recipe_carbon: c.recipess_id.total_recipe_carbon,
      image_url: c.recipess_id.url,
      image_name: c.recipess_id.image_name,
      cooked_at: c.cooked_at
    }));
  res.json(formatted);
};