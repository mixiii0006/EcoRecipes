const Recipe = require("../models/Recipe");

exports.getAllRecipes = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50; // default 50
    let nameQuery = req.query.name ? req.query.name.toLowerCase().trim() : null;

    console.log("Received name query:", nameQuery);

    let recipes;
    if (nameQuery) {
      // Use flexible regex for partial match
      // Replace spaces with .* to allow flexible matching of words separated by any chars
      const pattern = nameQuery.replace(/\s+/g, ".*");
      const regex = new RegExp(`.*${pattern}.*`, "i");
      recipes = await Recipe.find({
        $or: [{ title_cleaned: { $regex: regex } }, { name: { $regex: regex } }],
      }).select("title_cleaned carbon_score total_recipe_carbon url image_name cleaned_ingredients instructions_cleaned duration rating name");

      console.log("Found recipes count:", recipes.length);
    } else {
      recipes = await Recipe.find().limit(limit);
    }

    const formatted = recipes.map((r) => {
      return {
        id: r._id,
        title_cleaned: r.title_cleaned,
        carbon_score: r.carbon_score,
        total_recipe_carbon: r.total_recipe_carbon,
        image: r.url || "", // langsung ambil URL dari database
        cleaned_ingredients: r.cleaned_ingredients || [],
        instructions_cleaned: r.instructions_cleaned || "",
        duration: r.duration || 0,
        rating: r.rating || 0,
        name: r.name || r.title_cleaned,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  let imageUrl = recipe.url || "";
  if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
    imageUrl = `/foodImages/${imageUrl}`;
  }

  res.json({
    id: recipe._id,
    title_cleaned: recipe.title_cleaned,
    cleaned_ingredients: recipe.cleaned_ingredients,
    instructions_cleaned: recipe.instructions_cleaned,
    image: recipe.url,
    quantity: recipe.quantity,
    unit: recipe.unit,
    pure_name: recipe.pure_name,
    carbon_score: recipe.carbon_score,
    total_recipe_carbon: recipe.total_recipe_carbon,
  });
};
