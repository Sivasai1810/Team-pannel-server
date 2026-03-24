const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const { auth, isAdmin } = require('../middleware/auth');
const { profileValidator } = require('../middleware/validators');

router.get('/staff', auth, isAdmin, userController.getStaffUsers);
router.get('/profile', auth, profileController.getProfile);
router.put('/profile', auth, profileValidator, profileController.updateProfile);

module.exports = router;
