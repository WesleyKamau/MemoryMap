import React from 'react';

const ProgressBar = ({ step }) => {
  return (
    <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
      <div
        className="bg-blue-500 h-2.5 rounded-full"
        style={{ width: `${((step-1) / 3) * 100}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
