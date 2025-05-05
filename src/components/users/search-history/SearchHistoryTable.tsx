import React from 'react';
import SearchHistoryRow from './SearchHistoryRow';

export interface SearchHistoryItem {
  id: string;
  title: string;
  location: string;
  status: 'Pending' | 'On appeal' | 'Disposed';
  regNumber: string;
}

interface Props {
  history: SearchHistoryItem[];
}

const SearchHistoryTable: React.FC<Props> = ({ history }) => (
  <div className="bg-white rounded-2xl shadow p-4 md:p-8 w-full overflow-x-auto">
    <h2 className="font-semibold text-lg mb-4">Searched History</h2>
    <table className="min-w-full text-left">
      <thead>
        <tr className="text-gray-500 text-sm">
          <th className="py-2 px-3 font-medium">Property Title (cert of occupancy)</th>
          <th className="py-2 px-3 font-medium">Location/Address of Property</th>
          <th className="py-2 px-3 font-medium">Status</th>
          <th className="py-2 px-3 font-medium">Registered Title number</th>
          <th className="py-2 px-3 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        {history.map((item) => (
          <SearchHistoryRow key={item.id} item={item} />
        ))}
      </tbody>
    </table>
  </div>
);

export default SearchHistoryTable;
