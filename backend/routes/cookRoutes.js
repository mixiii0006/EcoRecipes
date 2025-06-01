const express = require('express');
const router = express.Router();
const cook = require('../controllers/cookController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, cook.addCook);
router.get('/', authMiddleware, cook.getCooks);
router.delete('/:id', authMiddleware, cook.deleteCook);

module.exports = router;