import { Link } from 'react-router-dom';
import { formatDate, isOverdue } from '../../utils/formatDate';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import TaskStatusSelect from './TaskStatusSelect';

const TaskTable = ({ tasks, onStatusChange, canManage, currentUserId }) => {
  if (!tasks || tasks.length === 0) {
    return <div className="text-sm text-slate-500 py-4">No tasks found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-sm text-slate-500">
            <th className="py-3 px-4 font-medium">Title</th>
            <th className="py-3 px-4 font-medium">Priority</th>
            <th className="py-3 px-4 font-medium">Assigned To</th>
            <th className="py-3 px-4 font-medium">Due Date</th>
            <th className="py-3 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status);
            const canEditStatus = canManage || task.assigned_to === currentUserId;

            return (
              <tr key={task.id} className="hover:bg-slate-50 transition group">
                <td className="py-3 px-4">
                  <Link to={`/tasks/${task.id}`} className="font-medium text-slate-800 hover:text-blue-600">
                    {task.title}
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {task.assigned_name || 'Unassigned'}
                </td>
                <td className={`py-3 px-4 text-sm ${overdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                  {formatDate(task.due_date)}
                </td>
                <td className="py-3 px-4">
                  {canEditStatus ? (
                    <TaskStatusSelect 
                      value={task.status} 
                      onChange={(newStatus) => onStatusChange(task.id, newStatus)} 
                    />
                  ) : (
                    <StatusBadge status={task.status} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
