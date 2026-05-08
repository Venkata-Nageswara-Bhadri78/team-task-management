import { TASK_STATUSES } from '../../utils/constants';

const TaskStatusSelect = ({ value, onChange, disabled }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`text-sm rounded-lg border border-slate-300 py-1 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
        disabled ? 'bg-slate-50 cursor-not-allowed opacity-70' : 'bg-white cursor-pointer hover:border-slate-400'
      }`}
    >
      {TASK_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default TaskStatusSelect;
