
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  reset_token: String,
  reset_token_expired: Date,
  total_user_carbon: { type: Number, default: 0 }
});
module.exports = mongoose.model('User', UserSchema);
