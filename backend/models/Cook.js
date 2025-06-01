const mongoose = require('mongoose');
const CookSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipess_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  cooked_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Cook', CookSchema);