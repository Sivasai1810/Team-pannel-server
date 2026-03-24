const Task = require('../models/Task');
const DailyLog = require('../models/DailyLog');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      deadline
    });

    await task.save();
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'staff') {
      query.assignedTo = req.user._id;
    } else if (req.query.userId) {
      query.assignedTo = req.query.userId;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'staff' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { taskId, workDone, progress } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'staff' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const dailyLog = new DailyLog({
      userId: req.user._id,
      taskId,
      workDone,
      progress
    });

    await dailyLog.save();

    task.progress = progress;
    task.status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';
    await task.save();

    res.json({ message: 'Progress updated successfully', task, dailyLog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTaskLogs = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'staff' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const logs = await DailyLog.find({ taskId })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
