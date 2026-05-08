import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, Edit, Users, LayoutDashboard, Plus, Settings } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { 
  getProjectDetailsApi, 
  updateProjectApi, 
  deleteProjectApi, 
  addProjectMemberApi, 
  removeProjectMemberApi 
} from '../api/projectApi';
import { getProjectTasksApi, createTaskApi, updateTaskStatusApi } from '../api/taskApi';
import { getProjectDashboardApi } from '../api/dashboardApi';
import { isAdmin } from '../utils/roleHelpers';
import getErrorMessage from '../utils/getErrorMessage';

import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ProjectForm from '../components/projects/ProjectForm';
import AddMemberForm from '../components/projects/AddMemberForm';
import MemberList from '../components/projects/MemberList';
import TaskTable from '../components/tasks/TaskTable';
import TaskForm from '../components/tasks/TaskForm';
import StatCard from '../components/dashboard/StatCard';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  
  // Member to remove state
  const [memberToRemove, setMemberToRemove] = useState(null);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes, dashRes] = await Promise.all([
        getProjectDetailsApi(projectId),
        getProjectTasksApi(projectId),
        getProjectDashboardApi(projectId)
      ]);
      setProject(projRes.data?.project || projRes.data);
      setTasks(tasksRes.data?.tasks || tasksRes.data || []);
      setDashboard(dashRes.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  if (loading) return <Loader className="min-h-[60vh]" />;
  if (error) return <div className="p-6 bg-red-50 text-red-600 rounded-2xl">{error}</div>;
  if (!project) return null;

  const currentRole = project.role; // Assume backend returns role of current user
  const canManage = isAdmin(currentRole);

  const handleEditProject = async (data) => {
    setIsSubmitting(true);
    setModalError('');
    try {
      await updateProjectApi(projectId, data);
      setIsEditProjectOpen(false);
      fetchProjectData();
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProjectApi(projectId);
      navigate('/projects');
    } catch (err) {
      setError(getErrorMessage(err));
      setIsDeleteProjectOpen(false);
    }
  };

  const handleAddMember = async (data) => {
    setIsSubmitting(true);
    setModalError('');
    try {
      await addProjectMemberApi(projectId, data);
      setIsAddMemberOpen(false);
      fetchProjectData();
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    try {
      await removeProjectMemberApi(projectId, memberToRemove.id);
      fetchProjectData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setMemberToRemove(null);
    }
  };

  const handleCreateTask = async (data) => {
    setIsSubmitting(true);
    setModalError('');
    try {
      await createTaskApi(projectId, data);
      setIsCreateTaskOpen(false);
      fetchProjectData();
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      fetchProjectData();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Project Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-800">{project.name}</h1>
              <Badge variant={canManage ? 'primary' : 'secondary'}>{currentRole}</Badge>
            </div>
            <p className="text-slate-600 max-w-3xl">{project.description || 'No description provided.'}</p>
          </div>
          
          {canManage && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditProjectOpen(true)} className="flex items-center gap-2">
                <Edit className="w-4 h-4" /> Edit
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteProjectOpen(true)} className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Dashboard */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Tasks" value={dashboard.total_tasks} icon={LayoutDashboard} colorClass="bg-blue-100 text-blue-600" />
          <StatCard title="To Do" value={dashboard.tasks_by_status.to_do || 0} icon={LayoutDashboard} colorClass="bg-yellow-100 text-yellow-600" />
          <StatCard title="In Progress" value={dashboard.tasks_by_status.in_progress || 0} icon={LayoutDashboard} colorClass="bg-indigo-100 text-indigo-600" />
          <StatCard title="Done" value={dashboard.tasks_by_status.done || 0} icon={LayoutDashboard} colorClass="bg-green-100 text-green-600" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 3: Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-slate-400" /> Tasks
            </h2>
            {canManage && (
              <Button onClick={() => setIsCreateTaskOpen(true)} className="flex items-center gap-1 text-sm py-1.5">
                <Plus className="w-4 h-4" /> Add Task
              </Button>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
            <TaskTable 
              tasks={tasks} 
              onStatusChange={handleStatusChange} 
              canManage={canManage} 
              currentUserId={user.id} 
            />
          </div>
        </div>

        {/* Section 4: Members */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" /> Members
            </h2>
            {canManage && (
              <Button onClick={() => setIsAddMemberOpen(true)} className="flex items-center gap-1 text-sm py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200">
                <Plus className="w-4 h-4" /> Add
              </Button>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
            <MemberList 
              members={project.members} 
              onRemoveMember={setMemberToRemove} 
              canManage={canManage} 
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isEditProjectOpen} onClose={() => setIsEditProjectOpen(false)} title="Edit Project">
        {modalError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{modalError}</div>}
        <ProjectForm onSubmit={handleEditProject} initialData={project} isSubmitting={isSubmitting} />
      </Modal>

      <Modal isOpen={isAddMemberOpen} onClose={() => setIsAddMemberOpen(false)} title="Add Member">
        {modalError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{modalError}</div>}
        <AddMemberForm onSubmit={handleAddMember} isSubmitting={isSubmitting} />
      </Modal>

      <Modal isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} title="Create Task">
        {modalError && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{modalError}</div>}
        <TaskForm onSubmit={handleCreateTask} members={project.members} isSubmitting={isSubmitting} />
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteProjectOpen} 
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This action cannot be undone and will delete all tasks inside this project.`}
        confirmText="Delete Project"
      />

      <ConfirmDialog 
        isOpen={Boolean(memberToRemove)} 
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.name} from this project?`}
        confirmText="Remove"
      />
    </div>
  );
};

export default ProjectDetails;
