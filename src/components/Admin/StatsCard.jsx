import React from 'react';

const StatsCard = ({ title, value, icon: Icon, bgColor = 'bg-blue-500' }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 truncate">{title}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1a1a1a] truncate">{value}</p>
        </div>
        <div className={`${bgColor} p-3 sm:p-3.5 lg:p-4 rounded-lg sm:rounded-xl shadow-md flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
