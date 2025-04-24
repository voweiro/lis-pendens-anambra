// components/NoResultsFound.tsx
import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const NoResultsFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-sm w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gray-300 animate-ping opacity-30" />
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-black">
              <CheckIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Successful Payment
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please check your email for <br /> receipt proceedings to this record
        </p>
        <button className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition">
          View Records
        </button>
      </div>
    </div>
  );
};

export default NoResultsFound;
