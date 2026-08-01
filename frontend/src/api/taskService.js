import axiosInstance from './axiosInstance';

const taskService = {
  // Get all tasks (supports query filters, sorting, search, pagination)
  getTasks: (params = {}) => {
    return axiosInstance.get('/tasks', { params });
  },

  // Get single task by ID
  getTask: (id) => {
    return axiosInstance.get(`/tasks/${id}`);
  },

  // Create new task
  createTask: (taskData) => {
    return axiosInstance.post('/tasks', taskData);
  },

  // Update an existing task
  updateTask: (id, taskData) => {
    return axiosInstance.put(`/tasks/${id}`, taskData);
  },

  // Delete a task
  deleteTask: (id) => {
    return axiosInstance.delete(`/tasks/${id}`);
  },
};

export default taskService;
