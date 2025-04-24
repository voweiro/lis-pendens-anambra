interface DownloadRecordTwoProps {
  userId?: string;
  referenceId?: string;
  setShowDownloadAndEmail: (show: boolean) => void;
  setShowSearchSuccessTwo: (show: boolean) => void;
}

export const DownloadRecordTwo = ({
  userId,
  referenceId,
  setShowDownloadAndEmail,
  setShowSearchSuccessTwo
}: DownloadRecordTwoProps) => {
  const handleDownload = () => {
    // TODO: Implement actual download logic
    console.log('Downloading record for user:', userId, 'reference:', referenceId);
    setShowSearchSuccessTwo(true);
    setShowDownloadAndEmail(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Download Record</h2>
      
      <div className="mb-6">
        <p className="mb-4">How would you like to receive this record?</p>
        
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" defaultChecked className="h-4 w-4" />
            <span>Download directly</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" className="h-4 w-4" />
            <span>Email me a copy</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input type="radio" name="delivery" className="h-4 w-4" />
            <span>Both</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowDownloadAndEmail(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
