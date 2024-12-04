import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="my-6">
      <div className="w-full bg-gray-300 rounded-md overflow-hidden">
        <div
          className={`h-5 transition-all duration-300 ${
            clampedProgress === 100 ? "bg-green-700" : "bg-green-500"
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      <p className="text-sm text-center mt-2">{Math.round(clampedProgress)}% Completed</p>
    </div>
  );
};

export default ProgressBar;

