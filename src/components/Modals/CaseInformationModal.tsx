import { ReactNode } from 'react';

interface CaseInformationModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const CaseInformationModal = ({ 
  show, 
  onClose, 
  children 
}: CaseInformationModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl">
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
