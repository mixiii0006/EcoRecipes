
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, unique: true, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 100 },
  reset_token: { type: String, maxlength: 100 },
  reset_token_expired: Date,
  total_user_carbon: { type: Number, default: 0 }
});
module.exports = mongoose.model('User', UserSchema);
