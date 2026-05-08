import { useState } from 'react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

const ProjectForm = ({ onSubmit, initialData = {}, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g. Website Redesign"
        required
      />
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Brief description of the project..."
        rows={4}
      />
      <div className="flex justify-end gap-3 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
