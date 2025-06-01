const axios = require('axios');
const FormData = require('form-data');

const BASE_URL_NLP = 'https://capstone-ml-production.up.railway.app';
const BASE_URL_CNN = 'https://capstone-ml-gambar.up.railway.app';

exports.predictCarbon = async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL_NLP}/carbon`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.analyzeRecipe = async (req, res) => {
  try {
    console.log("analyzeRecipe req.body:", req.body);  // Log incoming request body
    // Use string text directly from req.body.text or req.body.ingredients
    const text = req.body.text || req.body.ingredients || "";
    const payload = { text };
    const response = await axios.post(`${BASE_URL}/recipes`, payload);
    res.json(response.data);
  } catch (err) {
    console.error("analyzeRecipe error:", err.message);
    console.error("analyzeRecipe error response data:", err.response ? err.response.data : 'No response data');
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.runFullPipeline = async (req, res) => {
  try {
    const text = req.body.text || req.body.ingredients || "";
    const payload = { text };
    const response = await axios.post(`${BASE_URL}/full`, req.body, payload);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// Endpoint untuk Image Similarity, menerima file upload dari frontend
exports.findSimilarImages = async (req, res) => {
  try {
    // req.file harus ada, pakai middleware multer di route
    if (!req.file) {
      return res.status(400).json({ error: true, message: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const response = await axios.post(`${BASE_URL_CNN}/`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
