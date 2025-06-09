const express = require('express');
const router = express.Router();
const cook = require('../controllers/cookController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, cook.addCook);
router.get('/', authMiddleware, cook.getCooks);

module.exports = router;