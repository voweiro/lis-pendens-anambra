import { SearchResultData } from '@/types';

interface SearchPageLayoutProps {
  setShowSearchResult: (show: boolean) => void;
  showSearchResultData: SearchResultData;
  setShowBlurredScreen: (show: boolean) => void;
}

export const SearchPageLayout = ({
  setShowSearchResult,
  showSearchResultData,
  setShowBlurredScreen
}: SearchPageLayoutProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <div className="mb-4">
        {/* Display search results */}
        <pre>{JSON.stringify(showSearchResultData, null, 2)}</pre>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowSearchResult(false)}
          className="px-4 py-2 border rounded"
        >
          Close
        </button>
        <button
          onClick={() => setShowBlurredScreen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
