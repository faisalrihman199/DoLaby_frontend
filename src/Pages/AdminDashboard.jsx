import React, { useEffect, useState } from 'react';
import { MdInventory, MdShoppingCart, MdAttachMoney, MdPeople } from 'react-icons/md';
import StatsCard from '../components/Admin/StatsCard';
import { useAPI } from '../contexts/ApiContext';

const AdminDashboard = () => {
  const api = useAPI();
  const [stats, setStats] = useState({
    totalProducts: 128,
    totalOrders: 5203,
    totalRevenue: '€183.478',
    totalCustomers: 3940
  });

  const [productData, setProductData] = useState([
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 30 },
    { month: 'Apr', value: 45 },
    { month: 'May', value: 40 },
    { month: 'Jun', value: 50 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 60 },
    { month: 'Aug', value: 50 },
    { month: 'Dec', value: 70 }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: '#12346', amount: '€ 120.00' },
    { id: '#12345', amount: '€ 120.00' },
    { id: '#12344', amount: '€ 120.00' }
  ]);

  const [recentUsers, setRecentUsers] = useState([
    { name: 'John Smith', avatar: '👤' },
    { name: 'Aii Ahmed', avatar: '👤' },
    { name: 'Sophie Lee', avatar: '👤' },
    { name: 'Eva Chan', avatar: '👤' }
  ]);

  const orderDistribution = [
    { label: 'Tope', color: 'bg-blue-500', percentage: 30 },
    { label: 'Pants', color: 'bg-blue-400', percentage: 25 },
    { label: 'Dreaess', color: 'bg-blue-300', percentage: 25 },
    { label: 'Shoes', color: 'bg-blue-200', percentage: 20 }
  ];

  const categoryDistribution = [
    { label: 'Tops', color: 'bg-blue-600' },
    { label: 'Pants', color: 'bg-blue-500' },
    { label: 'Dresss', color: 'bg-blue-400' },
    { label: 'Shoes', color: 'bg-blue-300' }
  ];

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Admin Panel</h1>
          <div className="flex items-center space-x-2 sm:space-x-3 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg border border-blue-100">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
              <MdPeople className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-800">Admin</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
          <StatsCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon={MdInventory}
            bgColor="bg-blue-500"
          />
          <StatsCard 
            title="Total Orders" 
            value={stats.totalOrders.toLocaleString()} 
            icon={MdShoppingCart}
            bgColor="bg-blue-500"
          />
          <StatsCard 
            title="Total Revenue" 
            value={stats.totalRevenue} 
            icon={MdAttachMoney}
            bgColor="bg-blue-500"
          />
          <StatsCard 
            title="Total Customers" 
            value={stats.totalCustomers.toLocaleString()} 
            icon={MdPeople}
            bgColor="bg-blue-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
          {/* Product Overview Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Product Overview</h2>
            <div className="relative h-48 sm:h-56 lg:h-64">
              {/* Simple Line Chart Visualization */}
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 180 L 60 150 L 120 160 L 180 120 L 240 130 L 300 90 L 360 80 L 420 60 L 480 70 L 540 40 L 600 20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 0 180 L 60 150 L 120 160 L 180 120 L 240 130 L 300 90 L 360 80 L 420 60 L 480 70 L 540 40 L 600 20 L 600 200 L 0 200 Z"
                  fill="url(#lineGradient)"
                />
              </svg>
              {/* Month labels */}
              <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jul', 'Aug', 'Aug', 'Dec'].map((month, i) => (
                  <span key={i} className="text-center">{month}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Pie Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Recent Orders</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
              {/* Donut Chart */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f0f0f0"
                    strokeWidth="18"
                  />
                  {/* Segments */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="18"
                    strokeDasharray="75 251"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="18"
                    strokeDasharray="63 251"
                    strokeDashoffset="-75"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="18"
                    strokeDasharray="63 251"
                    strokeDashoffset="-138"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#bfdbfe"
                    strokeWidth="18"
                    strokeDasharray="50 251"
                    strokeDashoffset="-201"
                  />
                </svg>
              </div>
              {/* Legend */}
              <div className="sm:ml-6 lg:ml-8 space-y-2 sm:space-y-3">
                {orderDistribution.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Recent Users</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#2d3748] rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                      {user.avatar}
                    </div>
                    <span className="font-medium text-sm sm:text-base text-gray-800">{user.name}</span>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MdPeople className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Recent Orders</h2>
            <div className="space-y-1">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
                  <span className="font-medium text-sm sm:text-base text-gray-800">{order.id}</span>
                  <span className="font-semibold text-sm sm:text-base text-gray-900">{order.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-100 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mb-4 sm:mb-6">Category Distribution</h2>
            <div className="space-y-3 sm:space-y-4">
              {categoryDistribution.map((category, index) => (
                <div key={index} className="flex items-center space-x-3 py-1">
                  <div className={`w-3 h-3 rounded-full ${category.color} shadow-sm`}></div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">{category.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
