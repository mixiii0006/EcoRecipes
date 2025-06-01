const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const CarbonReference = require('../models/CarbonReference');
const connectDB = require('./connection');

connectDB();

const carbonResults = [];
fs.createReadStream(path.join(__dirname, 'all_carbon.csv'))
  .pipe(csv())
  .on('data', (data) => carbonResults.push(data))
  .on('end', async () => {
    for (let row of carbonResults) {
      try {
        await CarbonReference.create({
          cluster_id: parseInt(row.cluster_id),
          food_item: row.food_item,
          carbon_footprint: parseFloat(row.carbon_footprint),
          type: row.type
        });
      } catch (err) {
        console.error('Carbon insert error:', err.message);
      }
    }
    console.log('Carbon reference seeding complete');
    process.exit();
  });