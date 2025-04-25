'use client';

import React, { useEffect, useState } from 'react';

const PageLoadingAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loading animation after content is loaded
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      
      // Add a timeout to hide the loader after 3 seconds even if load event doesn't fire
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-2 left-2 w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin-slow"></div>
          <div className="absolute top-4 left-4 w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin-slower"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default PageLoadingAnimation;
