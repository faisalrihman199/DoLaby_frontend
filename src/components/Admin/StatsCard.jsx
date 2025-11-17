import React from 'react';

const StatsCard = ({ title, value, icon: Icon, bgColor = 'bg-blue-500' }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a]">{value}</p>
        </div>
        <div className={`${bgColor} p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
