const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const vm = require('vm');
const Recipe = require('../models/Recipe');
const connectDB = require('./connection');

connectDB();

const results = [];

fs.createReadStream(path.join(__dirname, 'all_recipes.csv'), { encoding: 'utf8' }) 
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', async () => {
    for (let item of results) {
      let ingredients = [];
      try {
        ingredients = vm.runInNewContext(item.Cleaned_Ingredients);
      } catch (parseErr) {
        console.error(`Failed to parse ingredients for: ${item.Title_Cleaned}`);
        continue;
      }

      const carbonScore = parseFloat(item.carbon_score?.trim());
      const totalCarbon = parseFloat(item.total_recipe_carbon?.trim());

      try {
        await Recipe.create({
          image_name: item.Image_Name,
          url: item.url,
          cleaned_ingredients: ingredients,
          title_cleaned: item.Title_Cleaned,
          instructions_cleaned: item.Instructions_Cleaned,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          pure_name: item.pure_name,
          carbon_score: isNaN(carbonScore) ? null : carbonScore,
          total_recipe_carbon: isNaN(totalCarbon) ? null : totalCarbon
        });
      } catch (err) {
        console.error('Insert failed:', err.message);
      }
    }

    console.log('Recipe seeding complete');
    process.exit();
  });
