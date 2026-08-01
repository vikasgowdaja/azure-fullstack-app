import React from 'react';
import { ClipboardList, RefreshCw, Plus } from 'lucide-react';

const EmptyState = ({ 
  title = 'No tasks found', 
  description = 'Try adjusting your filters, search keyword, or create a brand new task to get started.',
  hasFilters = false,
  onClearFilters,
  onCreateTask 
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-900/30 px-6 py-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-white/10 text-slate-500 shadow-inner mb-5">
        <ClipboardList className="h-8 w-8 text-violet-400/80" />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="max-w-md text-sm text-slate-400 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-95"
          >
            <RefreshCw className="h-4 w-4 text-violet-400" />
            Reset Filters
          </button>
        )}
        
        {onCreateTask && (
          <button
            onClick={onCreateTask}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:from-violet-500 hover:to-fuchsia-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
