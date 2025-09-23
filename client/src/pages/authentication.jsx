// Gideon — Auth mocks
// Using 3 test accounts. Swap to real auth when ready:
// - POST /api/login { email, password } -> { id, name, email, role }
// - DELETE /api/logout -> 204
// - GET /api/check_session -> { id, name, email, role } or 401
// For now we store auth in localStorage and redirect to '/'.
import React, { useState } from 'react';

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const TEST_USERS = [
    { email: 'admin@petroltracker.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { email: 'manager@petroltracker.com', password: 'manager123', name: 'Station Manager', role: 'manager' },
    { email: 'staff@petroltracker.com', password: 'staff123', name: 'Staff Member', role: 'staff' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');

    const inputEmail = email.trim().toLowerCase();
    const foundUser = TEST_USERS.find(
      (u) => u.email.toLowerCase() === inputEmail && u.password === password
    );

    if (!foundUser) {
      setMessage('Invalid email or password');
      return;
    }

    // Mock session (replace with server session later)
    localStorage.setItem('auth', 'true');
    localStorage.setItem('auth_email', foundUser.email);
    localStorage.setItem('auth_name', foundUser.name);
    localStorage.setItem('auth_role', foundUser.role);

    setMessage(`Logged in as ${foundUser.name} (${foundUser.role})`);
    window.location.href = '/';
  };

  const handleLogout = () => {
    // Mock logout (replace with DELETE /api/logout)
    localStorage.removeItem('auth');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_name');
    localStorage.removeItem('auth_role');
    setMessage('Logged out');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full max-w-md animate-slide-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in</h1>
        <div className="mb-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">Test Accounts</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Admin — admin@petroltracker.com / admin123</li>
            <li>Manager — manager@petroltracker.com / manager123</li>
            <li>Staff — staff@petroltracker.com / staff123</li>
          </ul>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
        <button onClick={handleLogout} className="w-full mt-3 py-2 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors">
          Logout
        </button>
        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
