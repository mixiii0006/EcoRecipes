const express = require('express');
const router = express.Router();
const ml = require('../controllers/mlController');
const multer = require('multer');
const upload = multer();

router.post('/full', ml.runFullPipeline);     // POST /full
router.post('/', upload.single('file'), ml.findSimilarImages); // POST / (for image similarity)

module.exports = router;
