const Recipe = require("../models/Recipe");
const axios = require("axios");
const FormData = require("form-data");
const stringSimilarity = require("string-similarity");

const BASE_URL_NLP = "https://capstone-ml-production.up.railway.app";
const BASE_URL_CNN = "https://capstone-ml-gambar.up.railway.app";

exports.runFullPipeline = async (req, res) => {
  console.log("runFullPipeline DIPANGGIL");
  console.log("Payload dari frontend:", req.body); // log untuk debugging
  const safeNum = (x) => (x != null ? x : null);

  try {
    // 1) Kirim input ke Railway NLP service
    const { data: mlResult } = await axios.post(`${BASE_URL_NLP}/full`, req.body, { timeout: 30000 });

    // DEBUG: tampilkan seluruh hasil dari NLP
    console.log("=== Full mlResult from NLP ===");
    console.dir(mlResult, { depth: null });

    // DEBUG: periksa field dalam recommended_recipes
    const mlRecs = Array.isArray(mlResult.recommended_recipes) ? mlResult.recommended_recipes : [];

    mlRecs.forEach((rec, i) => {
      console.log(`Recipe ${i}:`);
      console.log("title:", rec.title);
      console.log("used:", rec.used);
      console.log("missing:", rec.missing);
      console.log("leftovers:", rec.leftovers);
      console.log("efficiency:", rec.efficiency);
      console.log("total_used_carbon:", rec.total_used_carbon);
      console.log("total_missing_carbon:", rec.total_missing_carbon);
    });

    const cleanTitle = (text) =>
      (text || "")
        .replace(/\([^()]*CO2eq\/kg[^()]*\)/gi, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/\d+(\.\d+)?/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const recommendations = [];

    for (const mlRec of mlRecs) {
      const rawTitle = mlRec.title || "";

      const titleForSearch = rawTitle
        .replace(/\([^)]*CO2eq\/kg[^)]*\)/gi, "")
        .replace(/\([^)]*\)/g, "")
        .replace(/\d+(\.\d+)?/g, "")
        .trim();

      const safe = titleForSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

      let found = await Recipe.findOne({
        $or: [{ title_cleaned: { $regex: safe, $options: "i" } }, { name: { $regex: safe, $options: "i" } }],
      });

      if (!found) {
        const candidates = await Recipe.find({
          $or: [{ title_cleaned: { $regex: safe, $options: "i" } }, { name: { $regex: safe, $options: "i" } }],
        }).limit(10);

        const norm = cleanTitle(rawTitle);
        let best = null,
          bestScore = 0;

        for (const c of candidates) {
          for (const str of [c.title_cleaned, c.name]) {
            const score = stringSimilarity.compareTwoStrings(norm, cleanTitle(str));
            if (score > bestScore) {
              bestScore = score;
              best = c;
            }
          }
        }

        if (best && bestScore >= 0.6) {
          console.log(`[SIMILARITY MATCH] "${rawTitle}" → "${best.title_cleaned}" (score: ${bestScore.toFixed(2)})`);
          found = best;
        }
      }

      if (found) {
        recommendations.push({
          id: found._id,
          title: found.title_cleaned,
          image: found.image_name ? `/foodImages/${found.image_name}` : found.url?.startsWith("http") ? found.url : "/foodImages/default.jpg",
          carbon: found.carbon_score,
          total_recipe_carbon: found.total_recipe_carbon,

          // Data dari NLP
          used: Array.isArray(mlRec.used) ? mlRec.used : [],
          total_used_carbon: safeNum(mlRec.total_used_carbon),
          missing: Array.isArray(mlRec.missing) ? mlRec.missing : [],
          total_missing_carbon: safeNum(mlRec.total_missing_carbon),
          efficiency: safeNum(mlRec.efficiency),
          leftovers: Array.isArray(mlRec.leftovers) ? mlRec.leftovers : [],

          // Tambahan (optional)
          cleaned_ingredients: found.cleaned_ingredients,
          instructions_cleaned: found.instructions_cleaned,
        });
      } else {
        console.warn(`[NOT FOUND] "${rawTitle}"`);
        recommendations.push({
          id: null,
          title: rawTitle,
          image: "",
          carbon: null,
          total_recipe_carbon: null,
          used: Array.isArray(mlRec.used) ? mlRec.used : [],
          total_used_carbon: safeNum(mlRec.total_used_carbon),
          missing: Array.isArray(mlRec.missing) ? mlRec.missing : [],
          total_missing_carbon: safeNum(mlRec.total_missing_carbon),
          efficiency: safeNum(mlRec.efficiency),
          leftovers: Array.isArray(mlRec.leftovers) ? mlRec.leftovers : [],
        });
      }
    }

    return res.json({
      parsed_ingredients: mlResult.parsed_ingredients,
      total_carbon: mlResult.total_carbon,
      recommended_recipes: recommendations,
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
      headers: formData.getHeaders(),
    });

    console.log("Response data from CNN service:", response.data);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
