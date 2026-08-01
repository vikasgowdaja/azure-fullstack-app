import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

const ErrorAlert = ({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while trying to fetch the tasks. Please check your connection and try again.', 
  onRetry 
}) => {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <div className="flex-1 space-y-1">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 border border-red-500/25 transition active:scale-95 shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
