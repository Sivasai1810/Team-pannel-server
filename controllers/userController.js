const User = require('../models/User');

exports.getStaffUsers = async (req, res) => {
  try {
    const staffUsers = await User.find({ role: 'staff' }).select('-password');
    res.json({ users: staffUsers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
