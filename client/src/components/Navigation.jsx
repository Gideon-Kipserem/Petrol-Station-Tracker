'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Fuel, MapPin, Users, Menu, X, User, Bell } from 'lucide-react';

const Navigation = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('guest@petroltracker.com');
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  // Load auth and notifications from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('auth_token');
      const name = localStorage.getItem('auth_name');
      const email = localStorage.getItem('auth_email');
      
      if (token && name && email) {
        setUserName(name);
        setUserEmail(email);
      } else {
        // Redirect to login if not authenticated
        if (pathname !== '/login') {
          window.location.href = '/login';
          return;
        }
        setUserName('Guest');
        setUserEmail('guest@petroltracker.com');
      }

      const saved = localStorage.getItem('notifications');
      if (saved) setNotifications(JSON.parse(saved));
      else {
        // Start with empty notifications - will be populated by real system events
        setNotifications([]);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, [pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3, current: pathname === '/' },
    { name: 'Stations', href: '/stations', icon: MapPin, current: pathname === '/stations' },
    { name: 'Sales', href: '/sales', icon: Fuel, current: pathname === '/sales' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth');
    localStorage.removeItem('auth_name');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_user_id');
    
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex pr-8" style={{backgroundColor: '#002d32'}}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 navbar-bg-image pr-6`}>
        <div className="flex items-center justify-between h-16 px-6 relative z-10">
          <div className="flex items-center">
            <Fuel className="h-8 w-8 text-white" />
            <span className="ml-2 text-lg font-bold text-white">Smart Petro</span>
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
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    item.current
                      ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200`}
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

      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-6">
        {/* Top navigation */}
        <header className="shadow-sm border-b border-gray-200 lg:static" style={{backgroundColor: '#002d32'}}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* User profile section */}
              <div className="hidden md:flex items-center ml-4 lg:ml-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#b2b8b7'}}>
                      <User className="h-4 w-4" style={{color: '#002d32'}} />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-white">{userEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                  style={{color: '#002d32'}}
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                        <span className="text-sm text-gray-500">{unreadCount} unread</span>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map((notif) => (
                          <div key={notif.id} className={`p-3 rounded-lg ${notif.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                            <p className="text-sm text-gray-900">{notif.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        )) : (
                          <p className="text-sm text-gray-500">No notifications</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  style={{backgroundColor: '#cfcfcf', color: '#333333'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#cf2d4d'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#cfcfcf'}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto" style={{backgroundColor: '#002d32'}}>
          <div className="p-6 pr-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Navigation;
