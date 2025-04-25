'use client';

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Inner component that uses client-side hooks
const LoadingProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create a timeout ID reference
    let timeoutId: NodeJS.Timeout;

    // Function to handle route change start
    const handleStart = () => {
      // Clear any existing timeout
      if (timeoutId) clearTimeout(timeoutId);
      setIsLoading(true);
    };

    // Function to handle route change complete
    const handleComplete = () => {
      // Add a small delay before hiding the loader to prevent flashing
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Listen for route changes
    window.addEventListener('beforeunload', handleStart);

    // Clean up event listeners
    return () => {
      window.removeEventListener('beforeunload', handleStart);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // This effect will run when the pathname or search params change
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <LoadingSpinner isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  );
};

// Outer component that provides the Suspense boundary
export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
};