const mongoose = require('mongoose');
const FavoriteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipess_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
});
module.exports = mongoose.model('Favorite', FavoriteSchema);