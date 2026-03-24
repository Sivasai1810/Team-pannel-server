const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    logger.info('Registration attempt', { email, role });

    // Validate email domain
    if (!email.endsWith('@ai4invest.in')) {
      return res.status(400).json({ message: 'Only @ai4invest.in email addresses are allowed' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration failed - user already exists', { email });
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password, role });
    await user.save();
    logger.info('User registered successfully', { userId: user._id, email });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    logger.error('Registration error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info('Login attempt', { email });

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('Login failed - user not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      logger.warn('Login failed - user inactive', { email });
      return res.status(401).json({ message: 'Account is inactive' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Login failed - invalid password', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    logger.info('Login successful', { userId: user._id, email });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
