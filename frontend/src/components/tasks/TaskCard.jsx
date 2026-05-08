import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { formatDate, isOverdue } from '../../utils/formatDate';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import TaskStatusSelect from './TaskStatusSelect';

const TaskCard = ({ task, onStatusChange, canEditStatus }) => {
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col hover:shadow-md transition ${overdue ? 'border-red-300' : 'border-slate-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <Link to={`/tasks/${task.id}`} className="text-lg font-semibold text-slate-800 hover:text-blue-600 line-clamp-1 flex-1 pr-4">
          {task.title}
        </Link>
        <PriorityBadge priority={task.priority} />
      </div>

      <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">
        {task.description || 'No description provided.'}
      </p>

      {task.project_name && (
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md mb-4 self-start">
          Project: {task.project_name}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-1.5" title="Assigned To">
            <User className="w-4 h-4 text-slate-400" />
            <span className="line-clamp-1 max-w-[120px]">{task.assigned_name || 'Unassigned'}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-600 font-medium' : ''}`} title="Due Date">
            <Calendar className={`w-4 h-4 ${overdue ? 'text-red-500' : 'text-slate-400'}`} />
            <span>{formatDate(task.due_date)}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 mt-1 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Status</span>
          {canEditStatus ? (
            <TaskStatusSelect 
              value={task.status} 
              onChange={(newStatus) => onStatusChange(task.id, newStatus)} 
            />
          ) : (
            <StatusBadge status={task.status} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
