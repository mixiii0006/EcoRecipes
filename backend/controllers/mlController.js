const axios = require('axios');

exports.recommendRecipes = async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) {
    return res.status(400).json({ error: true, message: 'Ingredients input is required' });
  }

  try {
    const response = await axios.post('http://localhost:5001/recommend', { ingredients });
    const recommendations = response.data.recommendations || [];
    res.json({
      error: false,
      message: 'Recommendations fetched successfully',
      recommendations
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to fetch recommendations',
      details: error.message
    });
  }
};