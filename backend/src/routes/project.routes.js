const express = require('express');
const {
  createProject,
  getMyProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/project.controller');
const {
  createTask,
  getProjectTasks,
} = require('../controllers/task.controller');
const {
  getProjectDashboard,
} = require('../controllers/dashboard.controller');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
} = require('../validators/project.validator');
const {
  createTaskValidator,
} = require('../validators/task.validator');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createProjectValidator, validateMiddleware, createProject);
router.get('/', getMyProjects);

router.get('/:projectId', roleMiddleware('Member'), getProjectDetails);
router.put('/:projectId', roleMiddleware('Admin'), updateProjectValidator, validateMiddleware, updateProject);
router.delete('/:projectId', roleMiddleware('Admin'), deleteProject);

router.post('/:projectId/members', roleMiddleware('Admin'), addMemberValidator, validateMiddleware, addMember);
router.delete('/:projectId/members/:userId', roleMiddleware('Admin'), removeMember);

// Task routes under project
router.post('/:projectId/tasks', roleMiddleware('Admin'), createTaskValidator, validateMiddleware, createTask);
router.get('/:projectId/tasks', roleMiddleware('Member'), getProjectTasks);

// Dashboard routes under project
router.get('/:projectId/dashboard', roleMiddleware('Member'), getProjectDashboard);

module.exports = router;
