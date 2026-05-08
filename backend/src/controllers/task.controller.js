const pool = require('../config/db');
const sendResponse = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, due_date, priority, assigned_to } = req.body;
    const createdBy = req.user.id;

    if (assigned_to) {
      const [members] = await pool.execute(
        'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
        [projectId, assigned_to]
      );
      if (members.length === 0) {
        return sendResponse(res, 400, false, 'Assigned user must be a member of this project');
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO tasks (project_id, title, description, due_date, priority, assigned_to, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [projectId, title, description || null, due_date || null, priority || 'Medium', assigned_to || null, createdBy]
    );

    const taskId = result.insertId;

    const [taskResult] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);

    sendResponse(res, 201, true, 'Task created successfully', {
      task: taskResult[0],
    });
  } catch (error) {
    next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assigned_to } = req.query;
    const userId = req.user.id;
    const role = req.projectRole;

    let query = `
      SELECT t.*, u.id AS assigned_user_id, u.name AS assigned_user_name, u.email AS assigned_user_email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ?
    `;
    const params = [projectId];

    if (role === 'Member') {
      query += ' AND t.assigned_to = ?';
      params.push(userId);
    } else if (assigned_to) {
      query += ' AND t.assigned_to = ?';
      params.push(assigned_to);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    const [tasks] = await pool.execute(query, params);

    const formattedTasks = tasks.map((task) => {
      const { assigned_user_id, assigned_user_name, assigned_user_email, ...rest } = task;
      if (assigned_user_id) {
        rest.assigned_user = {
          id: assigned_user_id,
          name: assigned_user_name,
          email: assigned_user_email,
        };
      } else {
        rest.assigned_user = null;
      }
      return rest;
    });

    sendResponse(res, 200, true, 'Tasks fetched successfully', {
      tasks: formattedTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const query = `
      SELECT 
        t.*, 
        p.name AS project_name,
        au.name AS assigned_user_name,
        cu.name AS created_by_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN users au ON t.assigned_to = au.id
      JOIN users cu ON t.created_by = cu.id
      WHERE t.id = ?
    `;

    const [tasks] = await pool.execute(query, [taskId]);

    if (tasks.length === 0) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    const task = tasks[0];

    const [members] = await pool.execute(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [task.project_id, userId]
    );

    if (members.length === 0) {
      return sendResponse(res, 403, false, 'You are not a member of this project');
    }

    const role = members[0].role;

    if (role === 'Member' && task.assigned_to !== userId) {
      return sendResponse(res, 403, false, 'You can only view your assigned tasks');
    }

    sendResponse(res, 200, true, 'Task details fetched successfully', {
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, due_date, priority, assigned_to, status } = req.body;

    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (tasks.length === 0) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    const task = tasks[0];

    const [memberRoles] = await pool.execute(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [task.project_id, req.user.id]
    );

    if (memberRoles.length === 0 || memberRoles[0].role !== 'Admin') {
      return sendResponse(res, 403, false, 'Admin access required');
    }

    if (assigned_to) {
      const [members] = await pool.execute(
        'SELECT id FROM project_members WHERE project_id = ? AND user_id = ?',
        [task.project_id, assigned_to]
      );
      if (members.length === 0) {
        return sendResponse(res, 400, false, 'Assigned user must be a member of this project');
      }
    }

    const updatedTitle = title || task.title;
    const updatedDescription = description !== undefined ? description : task.description;
    const updatedDueDate = due_date !== undefined ? due_date : task.due_date;
    const updatedPriority = priority || task.priority;
    const updatedAssignedTo = assigned_to !== undefined ? assigned_to : task.assigned_to;
    const updatedStatus = status || task.status;

    await pool.execute(
      'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, assigned_to = ?, status = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedDueDate, updatedPriority, updatedAssignedTo, updatedStatus, taskId]
    );

    const [updatedTasks] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);

    sendResponse(res, 200, true, 'Task updated successfully', {
      task: updatedTasks[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const [tasks] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);

    if (tasks.length === 0) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    const task = tasks[0];

    const [members] = await pool.execute(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [task.project_id, userId]
    );

    if (members.length === 0) {
      return sendResponse(res, 403, false, 'You are not a member of this project');
    }

    const role = members[0].role;

    if (role === 'Member' && task.assigned_to !== userId) {
      return sendResponse(res, 403, false, 'You can update only your assigned tasks');
    }

    await pool.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId]);

    sendResponse(res, 200, true, 'Task status updated successfully', {
      task: { id: parseInt(taskId), status },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const [tasks] = await pool.execute('SELECT project_id FROM tasks WHERE id = ?', [taskId]);

    if (tasks.length === 0) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    const task = tasks[0];

    const [memberRoles] = await pool.execute(
      'SELECT role FROM project_members WHERE project_id = ? AND user_id = ?',
      [task.project_id, req.user.id]
    );

    if (memberRoles.length === 0 || memberRoles[0].role !== 'Admin') {
      return sendResponse(res, 403, false, 'Admin access required');
    }

    const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [taskId]);

    if (result.affectedRows === 0) {
      return sendResponse(res, 404, false, 'Task not found');
    }

    sendResponse(res, 200, true, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getMyAssignedTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT t.id, t.title, t.project_id, p.name AS project_name, t.due_date, t.priority, t.status
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ?
    `;

    const [tasks] = await pool.execute(query, [userId]);

    sendResponse(res, 200, true, 'Assigned tasks fetched successfully', {
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getProjectTasks,
  getSingleTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyAssignedTasks,
};
