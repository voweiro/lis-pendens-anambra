import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string | number;
  title: string;
  owner: string;
  summary?: string;
}

const SearchResultsList = () => {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("searchResults");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  if (!results.length) {
    return <div className="text-center text-gray-500 p-8">No search results found. Please try searching again.</div>;
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      <ul className="space-y-4">
        {results.map((result) => (
          <li
            key={result.id}
            className="bg-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => router.push(`/search-details/${result.id}`)}
          >
            <div className="font-semibold text-lg">{result.title || 'Untitled Property'}</div>
            <div className="text-sm text-gray-700">Owner: {result.owner || 'Unknown'}</div>
            {result.summary && (
              <div className="text-sm text-gray-700">{result.summary}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsList;
