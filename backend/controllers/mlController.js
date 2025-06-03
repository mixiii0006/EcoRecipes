const Recipe = require("../models/Recipe");
const axios = require("axios");
const FormData = require("form-data");
const stringSimilarity = require("string-similarity");

const BASE_URL_NLP = "https://capstone-ml-production.up.railway.app";
const BASE_URL_CNN = "https://capstone-ml-gambar.up.railway.app";

// PREDICT CARBON
exports.predictCarbon = async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL_NLP}/carbon`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

// ANALYZE RECIPE
exports.analyzeRecipe = async (req, res) => {
  try {
    console.log("analyzeRecipe req.body:", req.body);
    const text = req.body.text || req.body.ingredients || "";
    const payload = { text };
    const response = await axios.post(`${BASE_URL_NLP}/recipes`, payload);
    res.json(response.data);
  } catch (err) {
    console.error("analyzeRecipe error:", err.message);
    console.error("analyzeRecipe error response data:", err.response ? err.response.data : "No response data");
    res.status(500).json({ error: true, message: err.message });
  }
};

// RUN FULL PIPELINE (MAP RECOMMENDATION)
// RUN FULL PIPELINE (MAP RECOMMENDATION)
exports.runFullPipeline = async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL_NLP}/full`, req.body);
    const mlResult = response.data;
    const titles = mlResult.recommended_recipes || [];

    // Ambil semua judul dari DB, dan normalisasi
    const allRecipes = await Recipe.find({});
    const dbTitles = allRecipes.map((r) => ({
      doc: r,
      norm: (r.title_cleaned || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    }));

    const recipesObj = titles.map((title) => {
      const normTitle = (title || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      // Cari kemiripan tertinggi
      const candidates = dbTitles.map((t) => ({
        ...t,
        score: stringSimilarity.compareTwoStrings(normTitle, t.norm),
      }));
      const bestMatch = candidates.reduce((a, b) => (a.score > b.score ? a : b), { score: 0 });

      if (bestMatch.score >= 0.75) {
        // Threshold bisa kamu atur sendiri (0.75 = 75% mirip)
        console.log(`[MATCH] "${title}" ≈ "${bestMatch.doc.title_cleaned}" | Score: ${bestMatch.score}`);
        const found = bestMatch.doc;
        return {
          id: found._id,
          title: found.title_cleaned,
          image: found.image_name ? `/images/${found.image_name}` : found.url,
          carbon: found.carbon_score,
          total_recipe_carbon: found.total_recipe_carbon,
          cleaned_ingredients: found.cleaned_ingredients,
          instructions_cleaned: found.instructions_cleaned,
        };
      } else {
        console.log(`[NOT FOUND] "${title}" | Best Score: ${bestMatch.score}`);
        return { id: null, title, image: "", carbon: null, total_recipe_carbon: null };
      }
    });

    res.json({
      ...mlResult,
      recommended_recipes: recipesObj,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.findSimilarImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(`${BASE_URL_CNN}/`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log("Response data from CNN service:", response.data);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
