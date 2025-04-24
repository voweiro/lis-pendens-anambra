import { useState } from 'react';

interface DownloadRecordThreeProps {
  setShowDownloadAndEmail: (show: boolean) => void;
  userId?: string;
  referenceId?: string;
  setShowSearchSuccessThree: (show: boolean) => void;
}

export const DownloadRecordThree = ({
  setShowDownloadAndEmail,
  userId,
  referenceId,
  setShowSearchSuccessThree
}: DownloadRecordThreeProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle download and email logic here
    setShowDownloadAndEmail(false);
    setShowSearchSuccessThree(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Download Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowDownloadAndEmail(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Download & Send
          </button>
        </div>
      </form>
    </div>
  );
};
