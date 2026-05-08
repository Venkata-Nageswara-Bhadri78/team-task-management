export const formatDate = (date) => {
  if (!date) return 'No due date';

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const isOverdue = (date, status) => {
  if (!date || status === 'Done') return false;

  const today = new Date();
  const dueDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};
