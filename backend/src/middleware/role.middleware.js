const sendResponse = require('../utils/response');
const pool = require('../config/db');

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const projectId = req.params.projectId || req.body.project_id;

      if (!projectId) {
        return sendResponse(res, 400, false, 'Project ID is required', null);
      }

      const [rows] = await pool.execute(
        'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, userId]
      );

      if (rows.length === 0) {
        return sendResponse(res, 403, false, 'You are not a member of this project', null);
      }

      const userRole = rows[0].role;

      if (requiredRole === 'Admin' && userRole !== 'Admin') {
        return sendResponse(res, 403, false, 'Admin access required', null);
      }

      req.projectRole = userRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roleMiddleware;
