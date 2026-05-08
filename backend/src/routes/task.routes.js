const express = require('express');
const {
  getSingleTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyAssignedTasks,
} = require('../controllers/task.controller');
const {
  updateTaskValidator,
  updateTaskStatusValidator,
} = require('../validators/task.validator');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/my-tasks', getMyAssignedTasks);

// The remaining task routes assume taskId is in params
// Role checks for these require looking up the project_id from the task first,
// which is handled inside the controller instead of roleMiddleware (since roleMiddleware expects projectId).

router.get('/:taskId', getSingleTask);
router.put('/:taskId', updateTaskValidator, validateMiddleware, updateTask); // Admin handled in controller
router.patch('/:taskId/status', updateTaskStatusValidator, validateMiddleware, updateTaskStatus);
router.delete('/:taskId', deleteTask); // Admin handled in controller

module.exports = router;
