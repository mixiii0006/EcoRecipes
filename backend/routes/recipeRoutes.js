const express = require('express');
const router = express.Router();
const recipe = require('../controllers/recipeController');

router.get('/', recipe.getAllRecipes);
router.get('/:id', recipe.getRecipeById);

// GET /api/recipes/search?name=<slug>
router.get("/search", async (req, res) => {
  const name = req.query.name || "";
  // Cocokkan title_cleaned atau image_name secara case-insensitive
  const regex = new RegExp(name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
  const found = await Recipe.find({
    $or: [
      { title_cleaned: { $regex: regex } },
      { image_name:  { $regex: regex } }
    ]
  }).limit(5);
  res.json(found);
});


module.exports = router;