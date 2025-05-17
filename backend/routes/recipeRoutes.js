const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Route for text input recommendation
router.post('/recommend/text', recipeController.recommendByText);

// Route for image input recommendation
router.post('/recommend/image', recipeController.recommendByImage);

module.exports = router;