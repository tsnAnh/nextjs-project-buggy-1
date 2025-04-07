export const calculateTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  
  const completionRate = (completed / total) * 100;
  
  return {
    total,
    completed,
    active,
    completionRate,
  };
};

export const sortTasksByStatus = (tasks) => {
  return tasks.sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return a.completed ? 1 : -1;
  });
};

export const validateTask = (task) => {
  const errors = {};
  
  if (!task.title) {
    errors.title = "Title is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};