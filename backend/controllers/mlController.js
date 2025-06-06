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

// Cache for ML API responses to improve performance
const mlApiCache = new Map();
const ML_API_CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// RUN FULL PIPELINE (MAP RECOMMENDATION)
exports.runFullPipeline = async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL_NLP}/full`, req.body, { timeout: 30000 });
    const mlResult = response.data;
    const titles = Array.isArray(mlResult.recommended_recipes) ? mlResult.recommended_recipes : [];

    const cleanTitle = (text) =>
      (text || "")
        .replace(/\([^()]*CO2eq\/kg[^()]*\)/gi, "") // remove CO2eq info in parentheses
        .replace(/\([^)]*\)/g, "") // remove other parentheses
        .replace(/\d+(\.\d+)?/g, "") // remove numbers including decimals
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const recipesObj = [];

    for (const title of titles) {
      // Remove CO2eq and numbers from title for regex search
      const cleanedTitleForSearch = title.replace(/\([^)]*CO2eq\/kg[^)]*\)/gi, "")
                                         .replace(/\([^)]*\)/g, "")
                                         .replace(/\d+(\.\d+)?/g, "")
                                         .trim();

      // Use case-insensitive regex to find matching recipes by title_cleaned or name
      const regex = new RegExp(cleanedTitleForSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
      let foundRecipes = await Recipe.find({
        $or: [
          { title_cleaned: { $regex: regex } },
          { name: { $regex: regex } }
        ]
      }).limit(6);

      let found = null;
      if (foundRecipes.length === 1) {
        found = foundRecipes[0];
        console.log(`[REGEX MATCH] "${title}" → "${found.title_cleaned}"`);
      } else if (foundRecipes.length > 1) {
        // If multiple matches, pick best by string similarity
        const normTitle = cleanTitle(title);
        let bestMatch = null;
        let highestScore = 0;
        for (const recipe of foundRecipes) {
          const candidates = [recipe.normalized_title || "", recipe.title_cleaned || "", recipe.name || ""].map(cleanTitle);
          for (const candidate of candidates) {
            const score = stringSimilarity.compareTwoStrings(normTitle, candidate);
            if (score > highestScore) {
              highestScore = score;
              bestMatch = recipe;
            }
          }
        }
        const MATCH_THRESHOLD = 0.6;
        if (bestMatch && highestScore >= MATCH_THRESHOLD) {
          found = bestMatch;
          console.log(`[SIMILARITY MATCH] "${title}" → "${found.title_cleaned}" (score: ${highestScore})`);
        }
      }

      if (found) {
        recipesObj.push({
          id: found._id,
          title: found.title_cleaned,
          image: found.image_name
            ? `/foodImages/${found.image_name}`
            : found.url && (found.url.startsWith("http") || found.url.startsWith("/"))
            ? found.url
            : "/foodImages/default.jpg",
          carbon: found.carbon_score,
          total_recipe_carbon: found.total_recipe_carbon,
          cleaned_ingredients: found.cleaned_ingredients,
          instructions_cleaned: found.instructions_cleaned,
        });
      } else {
        console.log(`[NOT FOUND] "${title}"`);
        recipesObj.push({
          id: null,
          title,
          image: "",
          carbon: null,
          total_recipe_carbon: null,
        });
      }
    }

    console.log("Recommended recipes with images:");
    recipesObj.forEach((rec, idx) => {
      console.log(`Recipe ${idx}: id=${rec.id}, image=${rec.image}`);
    });
    res.json({
      ...mlResult,
      recommended_recipes: recipesObj,
    });
  } catch (err) {
    console.error("Pipeline error:", err);
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
