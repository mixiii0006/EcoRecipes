const mongoose = require('mongoose');
const CarbonReferenceSchema = new mongoose.Schema({
  cluster_id: Number,
  food_item: String,
  carbon_footprint: Number,
  type: String
});
module.exports = mongoose.model('CarbonReference', CarbonReferenceSchema);