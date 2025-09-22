import React, { useState } from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import { BarChart3, Fuel, MapPin, Users, Settings, Menu, X, Bell, Search, User } from "lucide-react";

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, current: location.pathname === '/' },
    { name: 'Stations', href: '/stations', icon: MapPin, current: location.pathname === '/stations' },
    { name: 'Fuel Management', href: '/fuel', icon: Fuel, current: location.pathname === '/fuel' },
    { name: 'Staff', href: '/staff', icon: Users, current: location.pathname === '/staff' },
    { name: 'Settings', href: '/settings', icon: Settings, current: location.pathname === '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center">
            <Fuel className="h-8 w-8 text-white" />
            <span className="ml-2 text-lg font-bold text-white">Petrol Tracker</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    item.current
                      ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-l-lg transition-colors duration-200`}
                >
                  <Icon className={`${
                    item.current ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-5 w-5`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User profile section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@petroltracker.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:static">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Search bar */}
              <div className="hidden md:block ml-4 lg:ml-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search stations, staff, or transactions..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">2</span>
                </span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/stations">
              <div className="p-6">
                <div className="animate-slide-in">
                  <h1 className="text-3xl font-bold text-gray-900">Stations Management</h1>
                  <p className="text-gray-600 mt-2">Manage your petrol stations here.</p>
                </div>
              </div>
            </Route>
            <Route path="/fuel">
              <div className="p-6">
                <div className="animate-slide-in">
                  <h1 className="text-3xl font-bold text-gray-900">Fuel Management</h1>
                  <p className="text-gray-600 mt-2">Track fuel inventory and pricing.</p>
                </div>
              </div>
            </Route>
            <Route path="/staff">
              <div className="p-6">
                <div className="animate-slide-in">
                  <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                  <p className="text-gray-600 mt-2">Manage your staff members.</p>
                </div>
              </div>
            </Route>
            <Route path="/settings">
              <div className="p-6">
                <div className="animate-slide-in">
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-2">Configure your application settings.</p>
                </div>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
}

export default App;
