import React, { useEffect, useState } from 'react';
import { MdInventory, MdShoppingCart, MdAttachMoney, MdPeople, MdVisibility, MdTrendingUp } from 'react-icons/md';
import StatsCard from '../components/Admin/StatsCard';
import { useAPI } from '../contexts/ApiContext';
import { useToast } from '../components/Toast/ToastContainer';

const AdminDashboard = () => {
  const api = useAPI();
  const { showError } = useToast();
  const [stats, setStats] = useState({
    totalProducts: 128,
    totalOrders: 5203,
    totalRevenue: '€183.478',
    totalCustomers: 0
  });

  const [graphView, setGraphView] = useState('weekly'); // 'weekly' or 'monthly'
  const [graphData, setGraphData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [visitorStats, setVisitorStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: '#12346', amount: '€ 120.00' },
    { id: '#12345', amount: '€ 120.00' },
    { id: '#12344', amount: '€ 120.00' }
  ]);

  const [recentUsers, setRecentUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({ totalUsers: 0, totalVisitors: 0, totalTryOns: 0 });

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

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await api.get('/users?page=1&limit=5');
        const raw = response;
        const data = (response && response.data) ? response.data : response;

        // Normalize shapes similar to ManageUsers
        let usersArr = [];
        let paginationObj = null;
        if (data) {
          if (Array.isArray(data.users)) {
            usersArr = data.users;
            paginationObj = data.pagination || null;
          } else if (data.data && Array.isArray(data.data.users)) {
            usersArr = data.data.users;
            paginationObj = data.data.pagination || null;
          } else if (data.success && data.data && Array.isArray(data.data.users)) {
            usersArr = data.data.users;
            paginationObj = data.data.pagination || null;
          }
        }

        if (!usersArr.length && Array.isArray(response)) usersArr = response;

        console.debug('Dashboard fetch -> raw:', raw);
        console.debug('Dashboard fetch -> users count:', usersArr.length);

        setRecentUsers(usersArr.slice(0, 4));
        setStats(prev => ({ ...prev, totalCustomers: paginationObj?.total ?? usersArr.length }));
      } catch (error) {
        console.error('Error fetching users:', error);
        showError('Failed to load recent users');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch dashboard aggregate stats
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoadingDashboard(true);
      try {
        const resp = await api.get('/users/dashboard');
        const raw = resp;
        const body = resp && resp.data ? resp.data : resp;
        const data = body?.data || body;
        
        if (data) {
          // Set main stats
          const totals = {
            totalUsers: data.totalUsers ?? data.total_users ?? 0,
            totalVisitors: data.totalVisitors ?? data.total_visitors ?? 0,
            totalTryOns: data.totalTryOns ?? data.total_try_ons ?? 0
          };
          console.debug('Dashboard stats API ->', raw, 'parsed totals:', totals);
          setDashboardStats(totals);

          // Set visitor stats (today, this week, this month)
          if (data.visitorStats) {
            setVisitorStats({
              today: data.visitorStats.today ?? 0,
              thisWeek: data.visitorStats.thisWeek ?? 0,
              thisMonth: data.visitorStats.thisMonth ?? 0
            });
          }

          // Set graph data (weekly by default)
          if (data.graphs) {
            if (data.graphs.weekly && Array.isArray(data.graphs.weekly)) {
              setWeeklyData(data.graphs.weekly);
              setGraphData(data.graphs.weekly);
            }
            if (data.graphs.monthly && Array.isArray(data.graphs.monthly)) {
              setMonthlyData(data.graphs.monthly);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        showError('Failed to load dashboard statistics');
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboard();
  }, []);

  // Update graph data when view changes
  useEffect(() => {
    if (graphView === 'weekly' && weeklyData.length > 0) {
      setGraphData(weeklyData);
    } else if (graphView === 'monthly' && monthlyData.length > 0) {
      setGraphData(monthlyData);
    }
    setHoveredPoint(null); // Reset hover when switching views
  }, [graphView, weeklyData, monthlyData]);

  const handleChartMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
    setHoveredPoint(index);
  };

  const handleChartMouseLeave = () => {
    setHoveredPoint(null);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 flex-shrink-0">
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

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            <StatsCard
              title="Total Users"
              value={loadingDashboard ? '...' : dashboardStats.totalUsers.toLocaleString()}
              icon={MdPeople}
              bgColor="bg-blue-600"
            />
            <StatsCard
              title="Total Visitors"
              value={loadingDashboard ? '...' : dashboardStats.totalVisitors.toLocaleString()}
              icon={MdVisibility}
              bgColor="bg-purple-600"
            />
            <StatsCard
              title="Total Try-Ons"
              value={loadingDashboard ? '...' : dashboardStats.totalTryOns.toLocaleString()}
              icon={MdTrendingUp}
              bgColor="bg-green-600"
            />
          </div>

          {/* Visitor Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium opacity-90">Today's Visitors</h3>
                <MdVisibility className="w-6 h-6 opacity-80" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{loadingDashboard ? '...' : visitorStats.today.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium opacity-90">This Week</h3>
                <MdTrendingUp className="w-6 h-6 opacity-80" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{loadingDashboard ? '...' : visitorStats.thisWeek.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium opacity-90">This Month</h3>
                <MdPeople className="w-6 h-6 opacity-80" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold">{loadingDashboard ? '...' : visitorStats.thisMonth.toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
            {/* Visitor Analytics Chart */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">Visitor Analytics</h2>
                <select
                  value={graphView}
                  onChange={(e) => setGraphView(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              {loadingDashboard ? (
                <div className="flex items-center justify-center h-48 sm:h-56 lg:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : graphData.length > 0 ? (
                <div className="relative h-48 sm:h-56 lg:h-64">
                  {/* Tooltip */}
                  {hoveredPoint !== null && graphData[hoveredPoint] && (
                    <div
                      className="absolute z-10 pointer-events-none transition-all duration-200"
                      style={{
                        left: `${tooltipPos.x}px`,
                        top: `${tooltipPos.y - 60}px`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap">
                        <div className="font-semibold">{graphData[hoveredPoint].visitors} visitors</div>
                        <div className="text-xs text-gray-300">
                          {graphView === 'weekly' 
                            ? `${graphData[hoveredPoint].day}, ${new Date(graphData[hoveredPoint].date).toLocaleDateString()}`
                            : new Date(graphData[hoveredPoint].date).toLocaleDateString()}
                        </div>
                        {/* Triangle pointer */}
                        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Line Chart */}
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="visitorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Grid lines */}
                    <g opacity="0.1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <line
                          key={i}
                          x1="0"
                          y1={40 * i}
                          x2="600"
                          y2={40 * i}
                          stroke="#3b82f6"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                      ))}
                    </g>

                    {/* Generate path from data */}
                    {(() => {
                      if (!graphData.length) return null;
                      const maxVisitors = Math.max(...graphData.map(d => d.visitors), 1);
                      const points = graphData.map((d, i) => {
                        const x = (i / (graphData.length - 1)) * 600;
                        const y = 200 - (d.visitors / maxVisitors) * 160 - 20;
                        return `${x} ${y}`;
                      }).join(' L ');
                      
                      const linePath = `M ${points}`;
                      const areaPath = `M ${points} L 600 200 L 0 200 Z`;
                      
                      return (
                        <>
                          {/* Area fill */}
                          <path
                            d={areaPath}
                            fill="url(#visitorGradient)"
                          />
                          {/* Line */}
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Data points with hover areas */}
                          {graphData.map((d, i) => {
                            const x = (i / (graphData.length - 1)) * 600;
                            const y = 200 - (d.visitors / maxVisitors) * 160 - 20;
                            const isHovered = hoveredPoint === i;
                            
                            return (
                              <g key={i}>
                                {/* Invisible larger hit area */}
                                <rect
                                  x={x - 15}
                                  y="0"
                                  width="30"
                                  height="200"
                                  fill="transparent"
                                  style={{ cursor: 'pointer' }}
                                  onMouseMove={(e) => handleChartMouseMove(e, i)}
                                  onMouseLeave={handleChartMouseLeave}
                                />
                                {/* Vertical line on hover */}
                                {isHovered && (
                                  <>
                                    <line
                                      x1={x}
                                      y1="0"
                                      x2={x}
                                      y2="200"
                                      stroke="#3b82f6"
                                      strokeWidth="1"
                                      strokeDasharray="4,4"
                                      opacity="0.5"
                                    />
                                    {/* Glow circle on hover */}
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r="8"
                                      fill="#3b82f6"
                                      opacity="0.3"
                                    />
                                  </>
                                )}
                                {/* Data point circle */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHovered ? "6" : "4"}
                                  fill="#3b82f6"
                                  stroke="white"
                                  strokeWidth="2"
                                  filter={isHovered ? "url(#glow)" : "none"}
                                  style={{ 
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                  }}
                                />
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                  {/* Labels */}
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 mt-2 px-1">
                    {graphData.map((d, i) => (
                      <span 
                        key={i} 
                        className={`text-center transition-colors ${hoveredPoint === i ? 'text-blue-600 font-semibold' : ''}`}
                        title={d.date}
                      >
                        {graphView === 'weekly' ? d.day : new Date(d.date).getDate()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 sm:h-56 lg:h-64 text-gray-500">
                  No data available
                </div>
              )}
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
              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user, index) => (
                      <div key={user.id || index} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.first_name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                              {user.first_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="font-medium text-sm sm:text-base text-gray-800">
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPeople className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No users found</p>
                  )}
                </div>
              )}
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
    </div>
  );
};

export default AdminDashboard;
