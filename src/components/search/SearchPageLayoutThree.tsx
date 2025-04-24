import { CaseData } from '@/types';

interface SearchPageLayoutThreeProps {
  setShowSearchResultThree: (show: boolean) => void;
  showSearchResultData: any;
  setSelectedCaseData: (data: CaseData) => void;
  selectedCaseData: CaseData | null;
  setShowCaseInformationThree: (show: boolean) => void;
}

export const SearchPageLayoutThree = ({
  setShowSearchResultThree,
  showSearchResultData,
  setSelectedCaseData,
  selectedCaseData,
  setShowCaseInformationThree
}: SearchPageLayoutThreeProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Case Results</h2>
      <div className="mb-4">
        {/* Display case results */}
        <pre>{JSON.stringify(showSearchResultData, null, 2)}</pre>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowSearchResultThree(false)}
          className="px-4 py-2 border rounded"
        >
          Close
        </button>
        <button
          onClick={() => {
            if (selectedCaseData) {
              setShowCaseInformationThree(true);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          View Case
        </button>
      </div>
    </div>
  );
};
