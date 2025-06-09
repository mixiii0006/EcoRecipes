const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
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