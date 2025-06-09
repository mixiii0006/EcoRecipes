const mongoose = require('mongoose');
const CarbonReferenceSchema = new mongoose.Schema({
  cluster_id: Number,
  food_item: { type: String, maxlength: 100 },
  carbon_footprint: Number,
  type: { type: String, maxlength: 100 },
});
module.exports = mongoose.model('CarbonReference', CarbonReferenceSchema);