import React from 'react';
import { Calendar, AlertCircle, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const { title, description, status, priority, dueDate, _id } = task;

  // Format Due Date
  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Determine status styles
  const isCompleted = status === 'Completed';

  // Styles for Priority badges
  const priorityStyles = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/10',
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/10',
  };

  // Styles for Status badges
  const statusStyles = {
    Pending: 'bg-slate-800 text-slate-400 border-slate-700/50',
    'In Progress': 'bg-violet-500/15 text-violet-400 border-violet-500/20',
    Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div 
      className={`glass-card glass-card-hover relative flex flex-col justify-between rounded-2xl p-5 border ${
        isCompleted ? 'opacity-65 border-emerald-500/20 shadow-emerald-950/5' : 'border-white/5'
      }`}
    >
      <div>
        {/* Header: Checkbox + Title + Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(task)}
              className="mt-0.5 text-slate-500 hover:text-violet-400 transition cursor-pointer"
              title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/10" />
              ) : (
                <Circle className="h-5 w-5 hover:scale-105" />
              )}
            </button>
            
            <h4 
              className={`font-semibold text-base leading-snug break-words ${
                isCompleted ? 'text-slate-500 line-through' : 'text-white'
              }`}
            >
              {title}
            </h4>
          </div>
        </div>

        {/* Description */}
        <p 
          className={`text-sm leading-relaxed mb-4 break-words ${
            isCompleted ? 'text-slate-600' : 'text-slate-400'
          }`}
        >
          {description || <span className="italic opacity-40">No description provided.</span>}
        </p>
      </div>

      {/* Footer: Metadata & Actions */}
      <div className="mt-auto space-y-4 pt-3 border-t border-white/5">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold border ${priorityStyles[priority] || ''}`}>
              {priority}
            </span>
            <span className={`rounded-lg px-2 py-0.5 text-xs font-semibold border ${statusStyles[status] || ''}`}>
              {status}
            </span>
          </div>

          {/* Due date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            <span className={dueDate && new Date(dueDate) < new Date() && !isCompleted ? 'text-rose-400 font-medium animate-pulse-slow' : ''}>
              {formatDueDate(dueDate)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(task)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-white/5 hover:border-violet-500/30 text-slate-400 hover:text-white transition hover:bg-slate-800 cursor-pointer"
            title="Edit Task"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          
          <button
            onClick={() => onDelete(task)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-white/5 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition hover:bg-slate-800 cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
