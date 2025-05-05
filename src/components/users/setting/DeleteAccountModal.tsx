import React from 'react';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ open, onClose, onDelete, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[320px] relative animate-fade-in pointer-events-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg">&times;</button>
        <h2 className="text-xl font-semibold text-center mb-3">Delete Account</h2>
        <p className="text-center mb-6">"Are you sure you want to delete your account?<br/>All records will be purged"</p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-5 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 focus:outline-none"
            onClick={onDelete}
            disabled={loading}
          >
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
