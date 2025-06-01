const express = require('express');
const router = express.Router();
const recipe = require('../controllers/recipeController');

router.get('/', recipe.getAllRecipes);
router.get('/:id', recipe.getRecipeById);

module.exports = router;