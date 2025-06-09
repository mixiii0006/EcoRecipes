const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, user.getProfile);

module.exports = router;
