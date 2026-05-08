import { useState, useEffect } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { getMyTasksApi, updateTaskStatusApi, createTaskApi } from '../api/taskApi';
import getErrorMessage from '../utils/getErrorMessage';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import TaskCard from '../components/tasks/TaskCard';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import GlobalTaskForm from '../components/tasks/GlobalTaskForm';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const response = await getMyTasksApi();
      setTasks(response.data?.tasks || response.data || []);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      fetchMyTasks(); // Refetch to get updated lists, or update locally
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleCreateTask = async (projectId, data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createTaskApi(projectId, data);
      setIsModalOpen(false);
      fetchMyTasks();
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader className="min-h-[60vh]" />;

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100">
        <p className="font-medium">Failed to load tasks</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesSearch = searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
          <p className="text-slate-500 mt-1">Manage and update tasks assigned to you</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Task
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
          >
            <option value="">All Statuses</option>
            {TASK_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Priority Filter</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
          >
            <option value="">All Priorities</option>
            {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={tasks.length === 0 ? "You don't have any assigned tasks yet." : "No tasks match your filters."}
          icon={CheckSquare}
          action={
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 mt-4">
              <Plus className="w-5 h-5" />
              Create Task
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange} 
              canEditStatus={true} 
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {submitError}
          </div>
        )}
        <GlobalTaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
      </Modal>
    </div>
  );
};

export default MyTasks;
