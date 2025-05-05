import React from 'react';

const TopActions: React.FC = () => (
  <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 md:px-8 py-3 md:py-4">
    <button className="border border-black rounded-full px-6 py-2 font-semibold bg-white shadow-sm">Search case record</button>
    <button className="rounded-md px-6 py-2 font-semibold bg-[#4E4448] text-white">+ Upload new</button>
  </div>
);

export default TopActions;
