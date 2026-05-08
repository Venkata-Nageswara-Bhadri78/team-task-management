const { body } = require('express-validator');

const createProjectValidator = [
  body('name')
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 3 })
    .withMessage('Project name should be at least 3 characters'),
];

const updateProjectValidator = [
  body('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Project name should be at least 3 characters'),
];

const addMemberValidator = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('role')
    .isIn(['Admin', 'Member'])
    .withMessage('Role must be either Admin or Member'),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
};
