const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/forget-password', auth.forgetPassword);
router.post('/reset-password', auth.resetPassword);

module.exports = router;