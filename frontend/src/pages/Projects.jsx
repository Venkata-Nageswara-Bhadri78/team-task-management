import { useState } from 'react';
import { Plus } from 'lucide-react';
import useProjects from '../hooks/useProjects';
import { createProjectApi } from '../api/projectApi';
import getErrorMessage from '../utils/getErrorMessage';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ProjectCard from '../components/projects/ProjectCard';
import Modal from '../components/common/Modal';
import ProjectForm from '../components/projects/ProjectForm';
import Button from '../components/common/Button';

const Projects = () => {
  const { projects, loading, error, fetchProjects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleCreateProject = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await createProjectApi(data);
      setIsModalOpen(false);
      fetchProjects();
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
        <p className="font-medium">Failed to load projects</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your team's projects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="You don't have any projects yet. Create your first project to get started."
          action={
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 mt-4">
              <Plus className="w-5 h-5" />
              Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {submitError}
          </div>
        )}
        <ProjectForm onSubmit={handleCreateProject} isSubmitting={isSubmitting} />
      </Modal>
    </div>
  );
};

export default Projects;
