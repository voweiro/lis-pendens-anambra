import React from 'react';

const stats = [
  { icon: '🖥️', value: 4657, label: 'Total searches' },
  { icon: '⏳', value: 2156, label: 'Total pending' },
  { icon: '👥', value: 1089, label: 'Total On appeal' },
  { icon: '🔨', value: 1113, label: 'Total Dismissed' },
];

const StatsBar: React.FC = () => (
  <div className="bg-[#524A4C] rounded-[29px] flex flex-col sm:flex-row items-center justify-between  px-2 sm:px-8 md:px-12 py-3 sm:py-6 mt-4 text-white text-center gap-4 sm:gap-0">

    {stats.map((stat, idx) => (
      <div key={idx} className="flex flex-col items-center flex-1">
        <span className="text-3xl mb-1">{stat.icon}</span>
        <span className="text-2xl font-bold">{stat.value}</span>
        <span className="text-xs mt-1">{stat.label}</span>
        {idx < stats.length - 1 && <div className="hidden md:block h-10 border-r border-white mx-8"></div>}
      </div>
    ))}
  </div>
);

export default StatsBar;
