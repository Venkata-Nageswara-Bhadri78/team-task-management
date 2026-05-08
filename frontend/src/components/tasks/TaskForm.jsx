import { useState } from 'react';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import { TASK_PRIORITIES } from '../../utils/constants';

const TaskForm = ({ onSubmit, initialData = {}, members = [], isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    due_date: initialData.due_date ? new Date(initialData.due_date).toISOString().split('T')[0] : '',
    priority: initialData.priority || 'Medium',
    assigned_to: initialData.assigned_to || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const priorityOptions = TASK_PRIORITIES.map((p) => ({ label: p, value: p }));
  const memberOptions = members.map((m) => ({ label: m.name, value: m.id }));

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Design Homepage"
        required
      />
      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Details about the task..."
        rows={3}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          required
        />
        <Select
          label="Assign To"
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          options={memberOptions}
          required
        />
      </div>

      <Input
        label="Due Date"
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
