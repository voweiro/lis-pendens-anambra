interface SearchSuccessThreeProps {
  setShowSearchSuccessThree: (show: boolean) => void;
}

export const SearchSuccessThree = ({
  setShowSearchSuccessThree
}: SearchSuccessThreeProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Complete</h2>
      <div className="mb-4">
        <p>Your search results have been downloaded and emailed to you!</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowSearchSuccessThree(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
