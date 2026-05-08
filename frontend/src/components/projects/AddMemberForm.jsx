import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { PROJECT_ROLES } from '../../utils/constants';

const AddMemberForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'Member',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const roleOptions = PROJECT_ROLES.map((role) => ({ label: role, value: role }));

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="User Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="user@example.com"
        required
      />
      <Select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        options={roleOptions}
        required
      />
      <div className="flex justify-end gap-3 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
};

export default AddMemberForm;
