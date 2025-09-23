'use client'

// Dashboard component for Next.js with Recharts and hardcoded CSS
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Fuel, Users, MapPin, BarChart3, Clock, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalLitres: 0,
    totalStations: 0,
    totalStaff: 0,
    todaySales: 0,
    avgPricePerLitre: 0,
    recentSales: [],
    fuelTypeData: [],
    salesTrends: [],
    topStations: [],
    lowStockAlerts: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  // Mock data: swap this for fetch('/api/dashboard') as above
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual fetch calls to your Flask API
        const mockData = {
          totalRevenue: 125840.50,
          totalLitres: 85420,
          totalStations: 5,
          totalStaff: 23,
          todaySales: 45,
          avgPricePerLitre: 147.32,
          recentSales: [
            { id: 1, pump: 'Pump 1 - Station A', fuelType: 'Diesel', litres: 45.2, amount: 6658.64, time: '2 minutes ago' },
            { id: 2, pump: 'Pump 3 - Station B', fuelType: 'Unleaded', litres: 32.1, amount: 4540.32, time: '5 minutes ago' },
            { id: 3, pump: 'Pump 2 - Station A', fuelType: 'Diesel', litres: 78.5, amount: 11567.80, time: '12 minutes ago' },
            { id: 4, pump: 'Pump 1 - Station C', fuelType: 'Premium', litres: 25.0, amount: 3933.00, time: '18 minutes ago' },
            { id: 5, pump: 'Pump 4 - Station B', fuelType: 'Unleaded', litres: 41.8, amount: 5912.76, time: '25 minutes ago' }
          ],
          fuelTypeData: [
            { name: 'Diesel', value: 45.2, revenue: 67850, color: '#3B82F6' },
            { name: 'Unleaded', value: 32.8, revenue: 42340, color: '#10B981' },
            { name: 'Premium', value: 22.0, revenue: 35650, color: '#F59E0B' }
          ],
          salesTrends: [
            { date: 'Mon', sales: 32, revenue: 47580 },
            { date: 'Tue', sales: 45, revenue: 65240 },
            { date: 'Wed', sales: 38, revenue: 52130 },
            { date: 'Thu', sales: 52, revenue: 73590 },
            { date: 'Fri', sales: 68, revenue: 89470 },
            { date: 'Sat', sales: 75, revenue: 98650 },
            { date: 'Sun', sales: 41, revenue: 58920 }
          ],
          topStations: [
            { name: 'Station A - Downtown', sales: 156, revenue: 235680 },
            { name: 'Station B - Highway', sales: 134, revenue: 198420 },
            { name: 'Station C - Mall', sales: 89, revenue: 134570 },
            { name: 'Station D - Airport', sales: 67, revenue: 102340 },
            { name: 'Station E - Suburb', sales: 45, revenue: 68920 }
          ],
          lowStockAlerts: [
            { station: 'Station A', fuelType: 'Premium', level: 15, threshold: 20 },
            { station: 'Station C', fuelType: 'Diesel', level: 8, threshold: 15 }
          ]
        };

        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-600 border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
            <p className="text-gray-600">Fetching your latest data...</p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8 animate-slide-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
              <p className="text-gray-600 text-lg">Real-time insights into your fuel business operations</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Last updated:</span>
                <span className="ml-1 text-sm font-medium text-gray-900">Just now</span>
              </div>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="mt-6 flex gap-1 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +12.5% from last period
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Litres Sold</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.totalLitres)}L</p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +8.2% from last period
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                <Fuel className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Stations</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalStations}</p>
                <p className="text-sm text-gray-600 mt-1">All stations operational</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.totalStaff}</p>
                <p className="text-sm text-blue-600 mt-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  {dashboardData.todaySales} sales today
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {dashboardData.lowStockAlerts.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mb-8 shadow-lg animate-slide-in">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800">Low Stock Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dashboardData.lowStockAlerts.map((alert, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="font-medium text-red-800">{alert.station}</p>
                  <p className="text-sm text-red-600">
                    {alert.fuelType}: {alert.level}% remaining (threshold: {alert.threshold}%)
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trends</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.salesTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'sales' ? `${value} sales` : formatCurrency(value),
                    name === 'sales' ? 'Sales Count' : 'Revenue'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fuel Type Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Fuel Type Distribution</h3>
              <Fuel className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.fuelTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {dashboardData.fuelTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{sale.pump}</p>
                    <p className="text-sm text-gray-600">{sale.fuelType} • {sale.litres}L</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(sale.amount)}</p>
                    <p className="text-xs text-gray-500">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Stations */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 card-hover animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Stations</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {dashboardData.topStations.map((station, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3 ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{station.name}</p>
                      <p className="text-sm text-gray-600">{station.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(station.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
