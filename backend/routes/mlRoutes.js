const express = require('express');
const router = express.Router();
const ml = require('../controllers/mlController');
const multer = require('multer');
const upload = multer();
    // GET /
router.post('/carbon', ml.predictCarbon);     // POST /carbon
router.post('/recipes', ml.analyzeRecipe);    // POST /recipes
router.post('/full', ml.runFullPipeline);     // POST /full
router.post('/', upload.single('file'), ml.findSimilarImages); // POST / (for image similarity)

module.exports = router;
