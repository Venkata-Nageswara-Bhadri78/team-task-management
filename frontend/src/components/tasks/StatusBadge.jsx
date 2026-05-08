import Badge from '../common/Badge';

const StatusBadge = ({ status }) => {
  let variant = 'secondary';
  
  switch (status) {
    case 'To Do':
      variant = 'warning';
      break;
    case 'In Progress':
      variant = 'primary';
      break;
    case 'Done':
      variant = 'success';
      break;
  }

  return <Badge variant={variant}>{status}</Badge>;
};

export default StatusBadge;
