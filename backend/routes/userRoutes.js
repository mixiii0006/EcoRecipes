const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, user.getProfile);
router.put('/profile', authMiddleware, user.updateProfile);
router.put('/change-password', authMiddleware, user.changePassword);

module.exports = router;
