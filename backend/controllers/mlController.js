const { spawn } = require('child_process');
const path = require('path');

exports.recommendRecipes = (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) {
    return res.status(400).json({ error: true, message: 'Ingredients input is required' });
  }

  const pythonPath = 'D:/Coding Camp/CAPSTONE/EcoRecipesNew/EcoRecipes/backend/ML_model/Capstone-NLP-main/venv/Scripts/python.exe'; // sesuaikan
  const scriptPath = path.join(__dirname, '..', 'ML_model', 'Capstone-NLP-main', 'main.py');

  console.log('Received ingredients:', ingredients);

  const py = spawn(pythonPath, [scriptPath]);

  let output = '';
  let errorOutput = '';

  py.stdout.on('data', (data) => {
    console.log('Python stdout:', data.toString());
    output += data.toString();
  });

  py.stderr.on('data', (data) => {
    console.error('Python stderr:', data.toString());
    errorOutput += data.toString();
  });

  py.on('close', (code) => {
    if (code !== 0) {
      console.error('Python exited with code:', code);
      console.error('Error output:', errorOutput);
      return res.status(500).json({ error: true, message: 'Python script error', details: errorOutput });
    }
    try {
      const recommendations = JSON.parse(output.trim());
      res.json({ error: false, recommendations });
    } catch (e) {
      console.error('JSON parse error:', e.message);
      console.error('Raw output:', output);
      res.status(500).json({ error: true, message: 'Failed to parse Python output' });
    }
  });

  py.stdin.write(ingredients + '\n');
  py.stdin.end();
};
