const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  next();
};

const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address')
    .custom((value) => {
      if (!value.endsWith('@ai4invest.in')) {
        throw new Error('Only @ai4invest.in email addresses are allowed');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .isIn(['admin', 'staff'])
    .withMessage('Role must be either admin or staff'),
  handleValidationErrors
];

const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const taskValidator = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('assignedTo')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('deadline')
    .isISO8601()
    .withMessage('Invalid deadline date'),
  handleValidationErrors
];

const progressValidator = [
  body('taskId')
    .isMongoId()
    .withMessage('Invalid task ID'),
  body('workDone')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Work description must be between 10 and 1000 characters'),
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  handleValidationErrors
];

const profileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Invalid phone number format'),
  handleValidationErrors
];

module.exports = {
  registerValidator,
  loginValidator,
  taskValidator,
  progressValidator,
  profileValidator
};
