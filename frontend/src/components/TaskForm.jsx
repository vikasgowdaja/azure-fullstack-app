import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const TaskForm = ({ onSubmit, initialData = null, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  // Sync initialData if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'Pending',
        priority: initialData.priority || 'Medium',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.title.trim()) {
      tempErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      tempErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      tempErrors.title = 'Title cannot exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      tempErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Task Title <span className="text-rose-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="e.g. Design Landing Page"
          className={`w-full rounded-xl glass-input px-3.5 py-2.5 text-sm ${
            errors.title ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/25' : ''
          }`}
        />
        {errors.title && <p className="mt-1.5 text-xs text-rose-400">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows="3"
          placeholder="Add details about this task..."
          className={`w-full rounded-xl glass-input px-3.5 py-2.5 text-sm resize-none ${
            errors.description ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/25' : ''
          }`}
        />
        {errors.description && <p className="mt-1.5 text-xs text-rose-400">{errors.description}</p>}
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full rounded-xl glass-input px-3.5 py-2.5 text-sm cursor-pointer"
          >
            <option value="Pending" className="bg-slate-900 text-white">Pending</option>
            <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
            <option value="Completed" className="bg-slate-900 text-white">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full rounded-xl glass-input px-3.5 py-2.5 text-sm cursor-pointer"
          >
            <option value="Low" className="bg-slate-900 text-white">Low</option>
            <option value="Medium" className="bg-slate-900 text-white">Medium</option>
            <option value="High" className="bg-slate-900 text-white">High</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full rounded-xl glass-input px-3.5 py-2.5 text-sm cursor-pointer"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-white/10 hover:bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:from-violet-500 hover:to-fuchsia-500 transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            initialData ? 'Save Changes' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
