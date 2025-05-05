import React from 'react';
import StatusBadge from './StatusBadge';
import { SearchHistoryItem } from './SearchHistoryTable';

interface Props {
  item: SearchHistoryItem;
}

const SearchHistoryRow: React.FC<Props> = ({ item }) => (
  <tr className="border-b last:border-b-0">
    <td className="py-3 px-3 whitespace-nowrap max-w-[180px] truncate">{item.title}</td>
    <td className="py-3 px-3 whitespace-nowrap max-w-[180px] truncate">{item.location}</td>
    <td className="py-3 px-3"><StatusBadge status={item.status} /></td>
    <td className="py-3 px-3 font-mono">{item.regNumber}</td>
    <td className="py-3 px-3">
      <button className="border border-gray-300 rounded-lg px-4 py-1 text-sm hover:bg-gray-100 transition">See Details</button>
    </td>
  </tr>
);

export default SearchHistoryRow;
