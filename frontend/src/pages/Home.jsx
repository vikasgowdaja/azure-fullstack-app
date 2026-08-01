import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import useTasks from '../hooks/useTasks';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  AlertTriangle,
  ChevronLeft, 
  ChevronRight, 
  CalendarDays,
  ListTodo
} from 'lucide-react';

const Home = () => {
  const {
    tasks,
    loading,
    error,
    pagination,
    taskStats,
    filters,
    setFilters,
    handleSearchChange,
    clearFilters,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    refreshTasks,
  } = useTasks();

  // Search input state (managed locally for smooth typing, debounced inside useTasks)
  const [searchInput, setSearchInput] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected task state for edit/delete
  const [currentTask, setCurrentTask] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Search input handler
  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    handleSearchChange(e.target.value);
  };

  const handleClearFiltersAndSearch = () => {
    setSearchInput('');
    clearFilters();
  };

  // Open Edit Modal
  const handleOpenEdit = (task) => {
    setCurrentTask(task);
    setIsEditOpen(true);
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (task) => {
    setCurrentTask(task);
    setIsDeleteOpen(true);
  };

  // CRUD Submits
  const handleCreateSubmit = async (taskData) => {
    setIsActionLoading(true);
    const success = await addTask(taskData);
    setIsActionLoading(false);
    if (success) {
      setIsAddOpen(false);
    }
  };

  const handleEditSubmit = async (taskData) => {
    if (!currentTask) return;
    setIsActionLoading(true);
    const success = await updateTask(currentTask._id, taskData);
    setIsActionLoading(false);
    if (success) {
      setIsEditOpen(false);
      setCurrentTask(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentTask) return;
    setIsActionLoading(true);
    const success = await deleteTask(currentTask._id);
    setIsActionLoading(false);
    if (success) {
      setIsDeleteOpen(false);
      setCurrentTask(null);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.search !== '' || 
    filters.status !== '' || 
    filters.priority !== '' ||
    filters.sortBy !== 'createdAt' ||
    filters.order !== 'desc';

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col pb-16">
      {/* Dynamic Navbar */}
      <Navbar taskStats={taskStats} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create, organize, and prioritize your daily work.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Add New Task
          </button>
        </div>

        {/* Filters and Search Panel */}
        <div className="glass-card rounded-2xl p-5 mb-8 border border-white/5">
          <div className="flex flex-col gap-4">
            
            {/* Row 1: Search */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={onSearchInputChange}
                placeholder="Search tasks by title or description..."
                className="w-full rounded-xl glass-input pl-10 pr-4 py-2.5 text-sm"
              />
            </div>

            {/* Row 2: Status, Priority, Sorting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Status Filter */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters('status', e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-medium cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-white">All Statuses</option>
                  <option value="Pending" className="bg-slate-950 text-white">Pending</option>
                  <option value="In Progress" className="bg-slate-950 text-white">In Progress</option>
                  <option value="Completed" className="bg-slate-950 text-white">Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters('priority', e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-medium cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-white">All Priorities</option>
                  <option value="Low" className="bg-slate-950 text-white">Low</option>
                  <option value="Medium" className="bg-slate-950 text-white">Medium</option>
                  <option value="High" className="bg-slate-950 text-white">High</option>
                </select>
              </div>

              {/* Sort Field */}
              <div>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters('sortBy', e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-medium cursor-pointer"
                >
                  <option value="createdAt" className="bg-slate-950 text-white">Sort by Date Created</option>
                  <option value="dueDate" className="bg-slate-950 text-white">Sort by Due Date</option>
                  <option value="title" className="bg-slate-950 text-white">Sort by Title</option>
                  <option value="priority" className="bg-slate-950 text-white">Sort by Priority</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <select
                  value={filters.order}
                  onChange={(e) => setFilters('order', e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-medium cursor-pointer"
                >
                  <option value="desc" className="bg-slate-950 text-white">Descending</option>
                  <option value="asc" className="bg-slate-950 text-white">Ascending</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Indicator */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                <span className="text-xs text-violet-400">Filters are active</span>
                <button
                  onClick={handleClearFiltersAndSearch}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Reset filters and search
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Task Grid Rendering */}
        {error ? (
          <ErrorAlert onRetry={refreshTasks} message={error} />
        ) : loading ? (
          <div className="py-24">
            <LoadingSpinner />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState 
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFiltersAndSearch}
            onCreateTask={() => setIsAddOpen(true)}
            title={hasActiveFilters ? 'No tasks match criteria' : 'Workspace is empty'}
            description={
              hasActiveFilters 
                ? 'Try resetting the filters or search keywords to view other tasks.' 
                : 'Get started by creating your very first task. Hit the button below!'
            }
          />
        ) : (
          <div className="space-y-8">
            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  onToggleComplete={toggleTaskComplete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-xs text-slate-400">
                  Page <strong className="text-white">{pagination.currentPage}</strong> of <strong className="text-white">{pagination.totalPages}</strong> ({pagination.totalTasks} total tasks)
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters('page', filters.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white transition hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setFilters('page', filters.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white transition hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsAddOpen(false)}
          isLoading={isActionLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setCurrentTask(null);
        }}
        title="Edit Task"
      >
        <TaskForm
          initialData={currentTask}
          onSubmit={handleEditSubmit}
          onCancel={() => {
            setIsEditOpen(false);
            setCurrentTask(null);
          }}
          isLoading={isActionLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setCurrentTask(null);
        }}
        title="Delete Task"
      >
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Are you absolutely sure?</h4>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                This action will delete "<strong className="text-white font-medium">{currentTask?.title}</strong>" permanently. This action is irreversible.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => {
                setIsDeleteOpen(false);
                setCurrentTask(null);
              }}
              disabled={isActionLoading}
              className="rounded-xl border border-white/10 hover:bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isActionLoading}
              className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isActionLoading ? 'Deleting...' : 'Yes, Delete Task'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Home;
