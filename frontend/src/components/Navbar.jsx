import React from 'react';
import { KanbanSquare, CheckCircle, Clock } from 'lucide-react';

const Navbar = ({ taskStats = { total: 0, pending: 0, completed: 0 } }) => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20">
              <KanbanSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
              <span className="ml-1.5 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-400 border border-violet-500/10">
                MERN
              </span>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-1.5 border border-white/5">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-slate-400">
                Pending: <strong className="text-white">{taskStats.pending}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-slate-900/50 px-3 py-1.5 border border-white/5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-slate-400">
                Completed: <strong className="text-white">{taskStats.completed}</strong>
              </span>
            </div>
            
            <div className="text-xs text-slate-400">
              Total tasks: <strong className="text-violet-400">{taskStats.total}</strong>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
