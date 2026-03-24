const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { auth, isAdmin } = require('../middleware/auth');
const { taskValidator, progressValidator } = require('../middleware/validators');

router.post('/', auth, isAdmin, taskValidator, taskController.createTask);
router.get('/', auth, taskController.getTasks);
router.get('/:id', auth, taskController.getTaskById);
router.post('/progress', auth, progressValidator, taskController.updateProgress);
router.get('/:taskId/logs', auth, taskController.getTaskLogs);

module.exports = router;
