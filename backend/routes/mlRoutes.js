const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');

router.post('/recommend', mlController.recommendRecipes);

module.exports = router;