const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Cache for loaded recipes
let cachedRecipes = null;

// Load recipes from CSV file with caching
function loadRecipes() {
  return new Promise((resolve, reject) => {
    if (cachedRecipes) {
      // Return cached recipes if available
      resolve(cachedRecipes);
      return;
    }
    const results = [];
    fs.createReadStream(path.join(__dirname, '../ML_model/Capstone-NLP-main/nama_file.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Group by Title to get unique recipes
        const grouped = {};
        results.forEach(row => {
          const title = row.Title_Cleaned || row.Title || row.title || 'Unknown';
          if (!grouped[title]) {
            grouped[title] = {
              id: Object.keys(grouped).length + 1,
              name: title,
              image: row.Image_Name || row.image_name || '',
              instructions: row.Instructions_Cleaned || row.Instruction || row.instruction || '',
              ingredients: row.Cleaned_Ingredients || row.cleaned_ingredients || '',
              rating: 4.5, // default rating, as CSV doesn't have rating
              duration: row.Duration || row.duration || '30 mins', // default duration
              carbon: row.Carbon_Footprint || row.carbon_footprint || 'Low', // default carbon footprint
            };
          }
        });
        // Convert grouped object to array
        cachedRecipes = Object.values(grouped);
        resolve(cachedRecipes);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Function to recommend recipes based on input text or return random recipes if no input
function recommendRecipes(input, recipes) {
  if (!input || input.trim() === '') {
    // Return 12 random unique recipes
    const shuffled = recipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 12);
  } else {
    const lowerInput = input.toLowerCase();
    const filtered = recipes.filter(recipe => {
      return recipe.name && recipe.name.toLowerCase().includes(lowerInput);
    });
    return filtered.slice(0, 50); // Maksimal 50 hasil
  }
}

// Controller for text input recommendation
exports.recommendByText = async (req, res) => {
  try {
    let { text } = req.body;
    console.log('Received search text:', text);
    if (!text) {
      text = ''; // Treat empty or missing text as empty string to get random recipes
    }
    const recipes = await loadRecipes();
    console.log('Loaded recipes:', recipes.length);
    const recommendations = recommendRecipes(text, recipes);
    console.log('Filtered recommendations count:', recommendations.length);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error in recommendByText:', error);
    res.status(500).json({ error: error.message });
  }
};

// Controller for image input recommendation (stub)
exports.recommendByImage = async (req, res) => {
  try {
    // For now, just return dummy recommendations ignoring image input
    const recipes = await loadRecipes();
    const recommendations = recommendRecipes(null, recipes);
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};