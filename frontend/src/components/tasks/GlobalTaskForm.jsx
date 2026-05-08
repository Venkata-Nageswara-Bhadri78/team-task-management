import { useState, useEffect } from 'react';
import useProjects from '../../hooks/useProjects';
import { getProjectDetailsApi } from '../../api/projectApi';
import Select from '../common/Select';
import TaskForm from './TaskForm';

const GlobalTaskForm = ({ onSubmit, isSubmitting }) => {
  const { projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  useEffect(() => {
    if (selectedProjectId) {
      const fetchMembers = async () => {
        setMembersLoading(true);
        try {
          const res = await getProjectDetailsApi(selectedProjectId);
          setMembers(res.data?.project?.members || res.data?.members || []);
        } catch (error) {
          console.error('Failed to fetch project details');
        } finally {
          setMembersLoading(false);
        }
      };
      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [selectedProjectId]);

  const handleTaskSubmit = (taskData) => {
    onSubmit(selectedProjectId, taskData);
  };

  const projectOptions = projects.map(p => ({ label: p.name, value: p.id }));

  return (
    <div className="space-y-4">
      <Select
        label="Select Project"
        name="projectId"
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        options={projectOptions}
        required
      />
      {selectedProjectId && (
        <div className="pt-4 border-t border-slate-200 mt-4">
          {membersLoading ? (
            <p className="text-sm text-slate-500">Loading project members...</p>
          ) : (
            <TaskForm 
              onSubmit={handleTaskSubmit} 
              members={members} 
              isSubmitting={isSubmitting} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalTaskForm;
