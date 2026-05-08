import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, AlignLeft, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { getTaskDetailsApi, updateTaskApi, deleteTaskApi, updateTaskStatusApi } from '../api/taskApi';
import useAuth from '../hooks/useAuth';
import getErrorMessage from '../utils/getErrorMessage';
import { formatDate, isOverdue } from '../utils/formatDate';
import { isAdmin } from '../utils/roleHelpers';

import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import PriorityBadge from '../components/tasks/PriorityBadge';
import TaskStatusSelect from '../components/tasks/TaskStatusSelect';
import StatusBadge from '../components/tasks/StatusBadge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import TaskForm from '../components/tasks/TaskForm';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]); // In a real app we might fetch project details to get members
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const response = await getTaskDetailsApi(taskId);
      const taskData = response.data?.task || response.data;
      setTask(taskData);
      setProjectMembers([{ id: taskData.assigned_to, name: taskData.assigned_name || 'Assigned User' }]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  if (loading) return <Loader className="min-h-[60vh]" />;
  if (error) return <div className="p-6 bg-red-50 text-red-600 rounded-2xl">{error}</div>;
  if (!task) return null;

  // Assume user role can be checked via task.project_role or we just use admin logic if available, 
  // since backend might return current user's role in the project. For now assume user can manage if they created it or if they're admin.
  // We'll rely on backend returning `project_role` in the task details if possible, or just allow status update if assigned.
  const canEditStatus = task.assigned_to === user.id || task.project_role === 'Admin';
  const canManage = task.project_role === 'Admin';

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      fetchTaskDetails();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleEditTask = async (data) => {
    setIsSubmitting(true);
    setModalError('');
    try {
      await updateTaskApi(taskId, data);
      setIsEditOpen(false);
      fetchTaskDetails();
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTaskApi(taskId);
      navigate(`/projects/${task.project_id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleteOpen(false);
    }
  };

  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to={`/projects/${task.project_id}`} className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition mb-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Project
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{task.title}</h1>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Status:</span>
                {canEditStatus ? (
                  <TaskStatusSelect value={task.status} onChange={handleStatusChange} />
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Priority:</span>
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
          </div>
          
          {canManage && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(true)} className="flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <AlignLeft className="w-5 h-5 text-slate-400" /> Description
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>
          </div>

          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">Project</h4>
              <Link to={`/projects/${task.project_id}`} className="text-slate-800 font-medium hover:text-blue-600 transition">
                {task.project_name}
              </Link>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">Assigned To</h4>
              <div className="flex items-center gap-2 text-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{task.assigned_name || 'Unassigned'}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">Due Date</h4>
              <div className={`flex items-center gap-2 ${overdue ? 'text-red-600 font-medium' : 'text-slate-800'}`}>
                <Calendar className={`w-5 h-5 ${overdue ? 'text-red-500' : 'text-slate-400'}`} />
                <span>{formatDate(task.due_date)} {overdue && '(Overdue)'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-medium text-slate-500 mb-1">Created By</h4>
              <p className="text-sm text-slate-800">{task.created_by_name}</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Task">
        {modalError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{modalError}</div>}
        <TaskForm onSubmit={handleEditTask} initialData={task} members={projectMembers} isSubmitting={isSubmitting} />
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
      />
    </div>
  );
};

export default TaskDetails;
