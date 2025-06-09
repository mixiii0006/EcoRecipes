const express = require('express');
const router = express.Router();
const ml = require('../controllers/mlController');
const multer = require('multer');
const upload = multer();

router.post('/full', ml.runFullPipeline);
router.post('/findSimilarImages', upload.single('file'), ml.findSimilarImages);

module.exports = router;
