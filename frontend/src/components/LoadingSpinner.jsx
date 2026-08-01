import React from 'react';

const LoadingSpinner = ({ fullscreen = false, message = 'Loading tasks...' }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute h-full w-full rounded-full border-4 border-violet-500/10"></div>
        {/* Spin gradient ring */}
        <div className="absolute h-full w-full rounded-full border-4 border-t-violet-500 border-r-fuchsia-500 border-b-transparent border-l-transparent animate-spin"></div>
      </div>
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
