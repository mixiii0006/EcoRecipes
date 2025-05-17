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
    fs.createReadStream(path.join(__dirname, '../data/nama_file.csv'))
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

// Stub function for ML model recommendation based on input text or image data
function recommendRecipes(input, recipes) {
  // For now, return first 10 unique recipes as dummy recommendation
  return recipes.slice(0, 10);
}

// Controller for text input recommendation
exports.recommendByText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text input is required' });
    }
    const recipes = await loadRecipes();
    console.log('Loaded recipes:', recipes.length);
    const recommendations = recommendRecipes(text, recipes);
    console.log('Recommendations:', recommendations.length);
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