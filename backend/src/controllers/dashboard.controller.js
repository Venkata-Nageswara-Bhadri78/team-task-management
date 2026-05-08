const pool = require('../config/db');
const sendResponse = require('../utils/response');

const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [adminProjects] = await pool.execute(
      'SELECT project_id FROM project_members WHERE user_id = ? AND role = "Admin"',
      [userId]
    );

    const isAdminInAnyProject = adminProjects.length > 0;
    let projectIds = adminProjects.map((p) => p.project_id);

    let totalTasks = 0;
    let tasksByStatus = { to_do: 0, in_progress: 0, done: 0 };
    let tasksPerUserMap = {};
    let overdueTasks = 0;

    if (isAdminInAnyProject) {
      const idsPlaceholder = projectIds.map(() => '?').join(',');

      const [tasks] = await pool.execute(
        `SELECT id, status, assigned_to, due_date FROM tasks WHERE project_id IN (${idsPlaceholder})`,
        [...projectIds]
      );

      totalTasks = tasks.length;

      tasks.forEach((task) => {
        if (task.status === 'To Do') tasksByStatus.to_do++;
        if (task.status === 'In Progress') tasksByStatus.in_progress++;
        if (task.status === 'Done') tasksByStatus.done++;

        if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done') {
          overdueTasks++;
        }

        if (task.assigned_to) {
          tasksPerUserMap[task.assigned_to] = (tasksPerUserMap[task.assigned_to] || 0) + 1;
        }
      });
    } else {
      const [tasks] = await pool.execute(
        'SELECT id, status, due_date FROM tasks WHERE assigned_to = ?',
        [userId]
      );

      totalTasks = tasks.length;

      tasks.forEach((task) => {
        if (task.status === 'To Do') tasksByStatus.to_do++;
        if (task.status === 'In Progress') tasksByStatus.in_progress++;
        if (task.status === 'Done') tasksByStatus.done++;

        if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done') {
          overdueTasks++;
        }
      });

      if (totalTasks > 0) {
        tasksPerUserMap[userId] = totalTasks;
      }
    }

    let tasks_per_user = [];
    const userIds = Object.keys(tasksPerUserMap);

    if (userIds.length > 0) {
      const idsPlaceholder = userIds.map(() => '?').join(',');
      const [users] = await pool.execute(
        `SELECT id, name FROM users WHERE id IN (${idsPlaceholder})`,
        [...userIds]
      );

      tasks_per_user = users.map((user) => ({
        user_id: user.id,
        name: user.name,
        task_count: tasksPerUserMap[user.id],
      }));
    }

    sendResponse(res, 200, true, 'Dashboard summary fetched successfully', {
      total_tasks: totalTasks,
      tasks_by_status: tasksByStatus,
      tasks_per_user,
      overdue_tasks: overdueTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectDashboard = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const [projects] = await pool.execute('SELECT name FROM projects WHERE id = ?', [projectId]);
    if (projects.length === 0) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    const [tasks] = await pool.execute(
      'SELECT id, status, priority, due_date, assigned_to FROM tasks WHERE project_id = ?',
      [projectId]
    );

    let totalTasks = tasks.length;
    let tasksByStatus = { to_do: 0, in_progress: 0, done: 0 };
    let tasksByPriority = { low: 0, medium: 0, high: 0 };
    let tasksPerUserMap = {};
    let overdueTasks = 0;

    tasks.forEach((task) => {
      if (task.status === 'To Do') tasksByStatus.to_do++;
      if (task.status === 'In Progress') tasksByStatus.in_progress++;
      if (task.status === 'Done') tasksByStatus.done++;

      if (task.priority === 'Low') tasksByPriority.low++;
      if (task.priority === 'Medium') tasksByPriority.medium++;
      if (task.priority === 'High') tasksByPriority.high++;

      if (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'Done') {
        overdueTasks++;
      }

      if (task.assigned_to) {
        tasksPerUserMap[task.assigned_to] = (tasksPerUserMap[task.assigned_to] || 0) + 1;
      }
    });

    let tasks_per_user = [];
    const userIds = Object.keys(tasksPerUserMap);

    if (userIds.length > 0) {
      const idsPlaceholder = userIds.map(() => '?').join(',');
      const [users] = await pool.execute(
        `SELECT id, name FROM users WHERE id IN (${idsPlaceholder})`,
        [...userIds]
      );

      tasks_per_user = users.map((user) => ({
        user_id: user.id,
        name: user.name,
        task_count: tasksPerUserMap[user.id],
      }));
    }

    sendResponse(res, 200, true, 'Project dashboard fetched successfully', {
      project_id: parseInt(projectId),
      project_name: projects[0].name,
      total_tasks: totalTasks,
      tasks_by_status: tasksByStatus,
      tasks_by_priority: tasksByPriority,
      tasks_per_user,
      overdue_tasks: overdueTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getProjectDashboard,
};
