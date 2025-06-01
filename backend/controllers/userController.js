const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getProfile = async (req, res) => {
  try {
    // req.user sudah di-set oleh authMiddleware
    const user = req.user;
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      total_user_carbon: user.total_user_carbon,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const user = req.user;
  user.name = name;
  user.email = email;
  await user.save();
  res.json({ message: 'Profile updated successfully' });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(400).json({ message: 'Wrong current password' });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};