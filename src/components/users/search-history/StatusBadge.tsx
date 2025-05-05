import React from 'react';

const statusStyles: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'On appeal': 'bg-red-100 text-red-700 border-red-300',
  'Disposed': 'bg-green-100 text-green-700 border-green-300',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-block px-3 py-1 rounded-full text-xs border font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
    {status}
  </span>
);

export default StatusBadge;
