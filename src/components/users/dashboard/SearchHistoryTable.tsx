import React from 'react';

type StatusType = 'Pending' | 'On appeal' | 'Disposed';

interface PropertyData {
  title: string;
  address: string;
  status: StatusType;
  regNumber: string;
}

const data: PropertyData[] = [
  {
    title: 'Deelaw Housing & Real Estates Ag...',
    address: 'Plot 1-5 Lamido crescent, Abuja',
    status: 'Pending',
    regNumber: 'LP24452168PD',
  },
  {
    title: 'Golden boys Estate',
    address: '5 apple avenue Nomansland, Jos',
    status: 'On appeal',
    regNumber: 'LP23256718AC',
  },
  {
    title: 'Okpara & sons real estates',
    address: '2/3 Russel avenue Taurani, kano',
    status: 'Disposed',
    regNumber: 'LP11342890ZA',
  },
];

const statusColor = {
  Pending: 'text-yellow-600 border-yellow-400 bg-yellow-100',
  'On appeal': 'text-red-600 border-red-400 bg-red-100',
  Disposed: 'text-green-600 border-green-400 bg-green-100',
};

const SearchHistoryTable = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Searched History</h2>
        <button className="text-sm font-medium text-[#6C63FF] hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="pb-3">Property Title (cert of occupancy)</th>
              <th className="pb-3">Location/Address of Property</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Registered Title number</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((property, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-3">{property.title}</td>
                <td className="py-3">{property.address}</td>
                <td className="py-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor[property.status]}`}
                  >
                    {property.status}
                  </span>
                </td>
                <td className="py-3 font-medium">{property.regNumber}</td>
                <td className="py-3">
                  <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
                    See Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchHistoryTable;
