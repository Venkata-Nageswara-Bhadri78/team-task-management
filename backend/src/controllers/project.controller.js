const pool = require('../config/db');
const sendResponse = require('../utils/response');

const createProject = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { name, description } = req.body;
    const userId = req.user.id;

    const [result] = await connection.execute(
      'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
      [name, description || null, userId]
    );

    const projectId = result.insertId;

    await connection.execute(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, "Admin")',
      [projectId, userId]
    );

    await connection.commit();

    sendResponse(res, 201, true, 'Project created successfully', {
      project: { id: projectId, name, description, created_by: userId },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT
        p.id, p.name, p.description, pm.role,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.status = 'Done' THEN 1 ELSE 0 END) AS completed_tasks
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE pm.user_id = ?
      GROUP BY p.id, p.name, p.description, pm.role
    `;

    const [projects] = await pool.execute(query, [userId]);

    sendResponse(res, 200, true, 'Projects fetched successfully', {
      projects: projects.map(p => ({
        ...p,
        total_tasks: parseInt(p.total_tasks) || 0,
        completed_tasks: parseInt(p.completed_tasks) || 0
      }))
    });
  } catch (error) {
    next(error);
  }
};

const getProjectDetails = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const [projects] = await pool.execute(
      'SELECT id, name, description, created_by FROM projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    const [members] = await pool.execute(
      `SELECT u.id, u.name, u.email, pm.role 
       FROM project_members pm 
       JOIN users u ON pm.user_id = u.id 
       WHERE pm.project_id = ?`,
      [projectId]
    );

    const project = projects[0];
    project.members = members;

    sendResponse(res, 200, true, 'Project details fetched successfully', {
      project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const [projects] = await pool.execute(
      'SELECT * FROM projects WHERE id = ?',
      [projectId]
    );

    if (projects.length === 0) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    const updatedName = name || projects[0].name;
    const updatedDescription = description !== undefined ? description : projects[0].description;

    await pool.execute(
      'UPDATE projects SET name = ?, description = ? WHERE id = ?',
      [updatedName, updatedDescription, projectId]
    );

    sendResponse(res, 200, true, 'Project updated successfully', {
      project: { id: parseInt(projectId), name: updatedName, description: updatedDescription },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [
      projectId,
    ]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    sendResponse(res, 200, true, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { email, role } = req.body;

    const [users] = await pool.execute('SELECT id, name, email FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return sendResponse(res, 404, false, 'User with this email not found');
    }

    const user = users[0];

    const [members] = await pool.execute(
      'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, user.id]
    );

    if (members.length > 0) {
      return sendResponse(res, 400, false, 'User is already a member of this project');
    }

    await pool.execute(
      'INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?)',
      [projectId, user.id, role || 'Member']
    );

    sendResponse(res, 201, true, 'Member added successfully', {
      member: { id: user.id, name: user.name, email: user.email, role: role || 'Member' },
    });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    const [admins] = await pool.execute(
      'SELECT id FROM project_members WHERE project_id = ? AND role = "Admin"',
      [projectId]
    );

    const [memberToRemove] = await pool.execute(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (memberToRemove.length === 0) {
      return sendResponse(res, 404, false, 'Member not found in this project');
    }

    if (memberToRemove[0].role === 'Admin' && admins.length <= 1) {
      return sendResponse(res, 400, false, 'Cannot remove the only Admin of the project');
    }

    await pool.execute(
      'DELETE FROM project_members WHERE project_id = ? AND user_id = ?',
      [projectId, userId]
    );

    sendResponse(res, 200, true, 'Member removed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
