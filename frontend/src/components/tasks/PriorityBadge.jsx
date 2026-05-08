import Badge from '../common/Badge';

const PriorityBadge = ({ priority }) => {
  let variant = 'secondary';
  
  switch (priority) {
    case 'Low':
      variant = 'success';
      break;
    case 'Medium':
      variant = 'warning';
      break;
    case 'High':
      variant = 'danger';
      break;
  }

  return <Badge variant={variant}>{priority}</Badge>;
};

export default PriorityBadge;
