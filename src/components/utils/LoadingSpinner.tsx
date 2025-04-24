'use client';

import React from 'react';

interface LoadingSpinnerProps {
  isLoading: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-[#f5f6fa] border-t-[#3498db] animate-spin"></div>
        <div className="mt-4 text-center text-[#3498db] font-medium">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;