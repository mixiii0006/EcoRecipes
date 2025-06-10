const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ error: true, message: 'Password mismatch' });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });
    res.json({ error: false, message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: true, message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: true, message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.json({ error: false, message: 'success', loginResult: { userId: user._id, name: user.name, token } });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: true, message: 'Email not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.reset_token = token;
  user.reset_token_expired = Date.now() + 3600000;
  await user.save();

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  await sendEmail(user.email, 'Reset Password', `<p>Click <a href="${resetLink}">here</a> to reset password</p>`);

  res.json({ error: false, message: 'Password reset link sent to email' });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ reset_token: token, reset_token_expired: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ error: true, message: 'Token expired or invalid' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.reset_token = null;
  user.reset_token_expired = null;
  await user.save();

  res.json({ error: false, message: 'Password successfully reset' });
};