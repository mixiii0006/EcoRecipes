const Recipe = require("../models/Recipe");
const axios = require("axios");
const FormData = require("form-data");
const stringSimilarity = require("string-similarity");

const BASE_URL_NLP = "https://capstone-ml-production.up.railway.app";
const BASE_URL_CNN = "https://capstone-ml-gambar.up.railway.app";

exports.runFullPipeline = async (req, res) => {
  try {
    // 1) call your NLP full pipeline
    const { data: mlResult } = await axios.post(
      `${BASE_URL_NLP}/full`,
      req.body,
      { timeout: 30000 }
    );

    const mlRecs = Array.isArray(mlResult.recommended_recipes)
      ? mlResult.recommended_recipes
      : [];

    // helper: normalize a string for fuzzy matching
    const cleanTitle = (text) =>
      (text || "")
        .replace(/\([^()]CO2eq\/kg[^()]\)/gi, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/\d+(\.\d+)?/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const recommendations = [];

    for (const mlRec of mlRecs) {
      const rawTitle = mlRec.title || "";
      // strip out parenthetical CO2 and numbers for search
      const titleForSearch = rawTitle
        .replace(/\([^)]CO2eq\/kg[^)]\)/gi, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/\d+(\.\d+)?/g, "")
        .trim();

      // 2) try a case-insensitive regex search on title_cleaned or name
      const safe = titleForSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      let found = await Recipe.findOne({
        $or: [
          { title_cleaned: { $regex: safe, $options: "i" } },
          { name:          { $regex: safe, $options: "i" } }
        ]
      });

      // 3) fallback fuzzy matching if regex returned multiple or none
      if (!found) {
        const candidates = await Recipe.find({
          $or: [
            { title_cleaned: { $regex: safe, $options: "i" } },
            { name:          { $regex: safe, $options: "i" } }
          ]
        }).limit(10);

        const norm = cleanTitle(rawTitle);
        let best = null, bestScore = 0;
        for (const c of candidates) {
          for (const str of [c.title_cleaned, c.name]) {
            const score = stringSimilarity.compareTwoStrings(
              norm,
              cleanTitle(str)
            );
            if (score > bestScore) {
              bestScore = score;
              best = c;
            }
          }
        }
        // use if similarity ≥ 0.6
        if (best && bestScore >= 0.6) {
          console.log(
            `[SIMILARITY MATCH] "${rawTitle}" → "${best.title_cleaned}" (score: ${bestScore.toFixed(
              2
            )})`
          );
          found = best;
        }
      }

      // 4) compose the final object, including leftovers & missing from ML
      if (found) {
        recommendations.push({
          id: found._id,
          title: found.title_cleaned,
          image: found.image_name
            ? `/foodImages/${found.image_name}`
            : found.url?.startsWith("http")
            ? found.url
            : "/foodImages/default.jpg",
          carbon: found.carbon_score,
          total_recipe_carbon: found.total_recipe_carbon,
          cleaned_ingredients: found.cleaned_ingredients,
          instructions_cleaned: found.instructions_cleaned,
          leftovers: Array.isArray(mlRec.leftovers) ? mlRec.leftovers : [],
          missing:   Array.isArray(mlRec.missing)   ? mlRec.missing   : []
        });
      } else {
        console.warn(`[NOT FOUND] "${rawTitle}"`);
        recommendations.push({
          id: null,
          title: rawTitle,
          image: "",
          carbon: null,
          total_recipe_carbon: null,
          leftovers: Array.isArray(mlRec.leftovers) ? mlRec.leftovers : [],
          missing:   Array.isArray(mlRec.missing)   ? mlRec.missing   : []
        });
      }
    }

    // 5) send back total_carbon + our enriched recommendations
    return res.json({
      total_carbon: mlResult.total_carbon,
      recommended_recipes: recommendations
    });
  } catch (err) {
    console.error("runFullPipeline error:", err);
    return res.status(500).json({ error: true, message: err.message });
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
