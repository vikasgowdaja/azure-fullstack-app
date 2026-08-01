import { useState, useEffect, useCallback, useRef } from 'react';
import taskService from '../api/taskService';
import { toast } from 'react-toastify';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Task metrics for navbar/stats
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 6, // 6 tasks per page fits grid layouts nicely
  });

  // Helper ref to throttle searches
  const searchTimeoutRef = useRef(null);

  // Derive status counters for local rendering optimization
  const recalculateStats = useCallback((allTasks) => {
    // If paginated, we should ideally fetch stats from a separate lightweight counter or do it client-side.
    // To make stats accurate for the *entire* database, we will run a quick unfiltered query
    // or calculate based on the overall database count.
    taskService.getTasks({ limit: 1000 })
      .then((res) => {
        if (res && res.success) {
          const list = res.data || [];
          const total = list.length;
          const completed = list.filter((t) => t.status === 'Completed').length;
          const pending = total - completed;
          setTaskStats({ total, pending, completed });
        }
      })
      .catch((err) => console.error('Error fetching global stats:', err));
  }, []);

  // Main fetch function
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(filters);
      if (response && response.success) {
        setTasks(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error('Failed to retrieve tasks');
      }
    } catch (err) {
      console.error(err);
      setError(err.extractedMessage || 'Failed to fetch tasks');
      toast.error(err.extractedMessage || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch when filters change
  useEffect(() => {
    fetchTasks();
    recalculateStats();
  }, [fetchTasks, recalculateStats]);

  // Actions
  const handleSetFilter = useCallback((name, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      // Reset page to 1 when changing filters
      if (name !== 'page') {
        newFilters.page = 1;
      }
      return newFilters;
    });
  }, []);

  // Update search query with debouncing
  const handleSearchChange = useCallback((query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      handleSetFilter('search', query);
    }, 400);
  }, [handleSetFilter]);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
      limit: 6,
    });
  }, []);

  // CRUD Mutations
  const addTask = async (taskData) => {
    setLoading(true);
    try {
      const res = await taskService.createTask(taskData);
      if (res && res.success) {
        toast.success('Task created successfully');
        fetchTasks();
        recalculateStats();
        return true;
      }
    } catch (err) {
      toast.error(err.extractedMessage || 'Error creating task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res && res.success) {
        toast.success('Task updated successfully');
        fetchTasks();
        recalculateStats();
        return true;
      }
    } catch (err) {
      toast.error(err.extractedMessage || 'Error updating task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await taskService.updateTask(task._id, {
        ...task,
        status: newStatus,
      });
      if (res && res.success) {
        toast.success(`Task marked as ${newStatus}`);
        fetchTasks();
        recalculateStats();
      }
    } catch (err) {
      toast.error(err.extractedMessage || 'Failed to update task status');
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const res = await taskService.deleteTask(id);
      if (res && res.success) {
        toast.success('Task deleted successfully');
        // Handle case where we delete the last item on a page
        if (tasks.length === 1 && filters.page > 1) {
          handleSetFilter('page', filters.page - 1);
        } else {
          fetchTasks();
        }
        recalculateStats();
        return true;
      }
    } catch (err) {
      toast.error(err.extractedMessage || 'Error deleting task');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    taskStats,
    filters,
    setFilters: handleSetFilter,
    handleSearchChange,
    clearFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refreshTasks: fetchTasks,
  };
};

export default useTasks;
