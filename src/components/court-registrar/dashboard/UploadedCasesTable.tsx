import React from 'react';

const cases = [
  { title: 'Deelaw Housing & Real Estates Ag...', location: 'Plot 1-5 Lamido crescent, Abuja', status: 'Pending' },
  { title: 'Golden boys Estate', location: '5 apple avenue Nomansland, Jos', status: 'On appeal' },
  { title: 'Okpara & sons real estates', location: '2/3 Russel avenue Taurani, kano', status: 'Disposed' },
];

const statusStyles: Record<string, string> = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-400',
  'On appeal': 'bg-red-50 text-red-600 border-red-400',
  Disposed: 'bg-green-50 text-green-700 border-green-400',
};

const UploadedCasesTable: React.FC = () => (
  <div className="bg-white rounded-2xl shadow p-2 sm:p-6 w-full">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
      <h2 className="font-semibold text-lg">Uploaded cases</h2>
      <button className="text-gray-700 font-medium flex items-center gap-1">More <span>&gt;</span></button>
    </div>
    {/* Mobile: Card view */}
    <div className="flex flex-col gap-3 sm:hidden">
      {cases.map((item, idx) => (
        <div key={idx} className="border rounded-lg p-3 flex flex-col gap-1 shadow-sm">
          <div className="font-medium text-sm">{item.title}</div>
          <div className="text-xs text-gray-500">{item.location}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${statusStyles[item.status]}`}>{item.status}</span>
            <button className="ml-auto border border-gray-300 rounded-lg px-3 py-1 text-xs hover:bg-gray-100 transition">See Details</button>
          </div>
        </div>
      ))}
    </div>
    {/* Desktop: Table view */}
    <table className="min-w-full text-left hidden sm:table">
      <thead>
        <tr className="text-gray-500 text-sm">
          <th className="py-2 px-3 font-medium">Property Title (cert of occupancy)</th>
          <th className="py-2 px-3 font-medium">Location/Address of Property</th>
          <th className="py-2 px-3 font-medium">Status</th>
          <th className="py-2 px-3 font-medium"></th>
        </tr>
      </thead>
      <tbody>
        {cases.map((item, idx) => (
          <tr key={idx} className="border-b last:border-b-0">
            <td className="py-3 px-3 whitespace-nowrap max-w-[220px] truncate">{item.title}</td>
            <td className="py-3 px-3 whitespace-nowrap max-w-[220px] truncate">{item.location}</td>
            <td className="py-3 px-3">
              <span className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${statusStyles[item.status]}`}>{item.status}</span>
            </td>
            <td className="py-3 px-3">
              <button className="border border-gray-300 rounded-lg px-4 py-1 text-sm hover:bg-gray-100 transition">See Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UploadedCasesTable;
