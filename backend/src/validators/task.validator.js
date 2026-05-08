const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 3 })
    .withMessage('Task title should be at least 3 characters'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date should be a valid date'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('assigned_to')
    .optional()
    .isInt()
    .withMessage('Assigned to must be a valid user ID'),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Task title should be at least 3 characters'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date should be a valid date'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be To Do, In Progress, or Done'),
  body('assigned_to')
    .optional()
    .isInt()
    .withMessage('Assigned to must be a valid user ID'),
];

const updateTaskStatusValidator = [
  body('status')
    .isIn(['To Do', 'In Progress', 'Done'])
    .withMessage('Status must be To Do, In Progress, or Done'),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
};
