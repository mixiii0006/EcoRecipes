const express = require('express');
const router = express.Router();
const favorite = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, favorite.addFavorite);
router.get('/', authMiddleware, favorite.getFavorites);

module.exports = router;