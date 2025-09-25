'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Fuel, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://127.0.0.1:5555${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth', 'true');
        localStorage.setItem('auth_name', data.user.name);
        localStorage.setItem('auth_email', data.user.email);
        localStorage.setItem('auth_role', data.user.role);
        localStorage.setItem('auth_user_id', data.user.id);

        // Redirect to dashboard
        router.push('/');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{height: 'calc((100vh - 6rem) * 1.2)', display: 'flex', flexDirection: 'column', margin: '-1.5rem -3rem', position: 'relative'}}>
      {/* Header at Top */}
      <div style={{padding: '2rem 1rem 1rem 1rem'}}>
        <div className="text-center" style={{maxWidth: '448px', margin: '0 auto'}}>
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 rounded-full" style={{backgroundColor: '#b2b8b7'}}>
              <Fuel className="h-8 w-8" style={{color: '#002d32'}} />
            </div>
          </div>
          <h2 className="text-3xl font-bold" style={{color: '#ffffff'}}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="mt-2 text-sm" style={{color: '#b2b8b7'}}>
            {isLogin 
              ? 'Sign in to your Smart Petro account' 
              : 'Join Smart Petro to manage your stations'
            }
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', minHeight: '0'}}>
        <div className="w-full" style={{maxWidth: '448px'}}>
          {/* Form */}
          <div className="py-8 px-6 rounded-lg" style={{backgroundColor: '#b2b8b7', borderRadius: '8px'}}>
            <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="rounded-lg p-4 flex items-center space-x-2" style={{backgroundColor: '#dea4aa', borderRadius: '8px'}}>
                <AlertCircle className="h-5 w-5" style={{color: '#cf2d4d'}} />
                <span className="text-sm" style={{color: '#000000'}}>{error}</span>
              </div>
            )}

            {/* Name Field (Register only) */}
            {!isLogin && (
              <div style={{padding: '0 1rem'}}>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{color: '#000000'}}>
                  Full Name
                </label>
                <div style={{position: 'relative', width: '80%', margin: '0 auto'}}>
                  <div style={{position: 'absolute', top: '0', bottom: '0', left: '0', paddingLeft: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none'}}>
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{
                      paddingLeft: '2.5rem',
                      paddingRight: '0.75rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      lineHeight: '1.25',
                      backgroundColor: 'white',
                      width: '100%',
                      maxWidth: 'none',
                      display: 'block',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div style={{padding: '0 1rem'}}>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{color: '#000000'}}>
                Email Address
              </label>
              <div className="relative" style={{width: '80%', margin: '0 auto'}}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '0.75rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    lineHeight: '1.25',
                    backgroundColor: 'white',
                    width: '100%',
                    maxWidth: 'none',
                    display: 'block',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{padding: '0 1rem'}}>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{color: '#000000'}}>
                Password
              </label>
              <div className="relative" style={{width: '80%', margin: '0 auto'}}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    paddingLeft: '2.5rem',
                    paddingRight: '2.5rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    lineHeight: '1.25',
                    backgroundColor: 'white',
                    width: '100%',
                    maxWidth: 'none',
                    display: 'block',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '0',
                    bottom: '0',
                    right: '0',
                    paddingRight: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {showPassword ? (
                    <EyeOff style={{height: '1rem', width: '1rem', color: '#9ca3af'}} />
                  ) : (
                    <Eye style={{height: '1rem', width: '1rem', color: '#9ca3af'}} />
                  )}
                </button>
              </div>
            </div>

            {/* Role Field (Register only) */}
            {!isLogin && (
              <div style={{padding: '0 1rem'}}>
                <label htmlFor="role" className="block text-sm font-medium mb-2" style={{color: '#000000'}}>
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="px-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none"
                  style={{borderRadius: '8px', width: '80% !important', maxWidth: 'none !important', display: 'block', margin: '0 auto', textAlign: 'center'}}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div style={{paddingTop: '1.5rem'}}>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center py-2 px-6 text-sm font-medium rounded-lg text-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mx-auto"
                style={{backgroundColor: '#cfcfcf', borderRadius: '8px'}}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#b8b8b8')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#cfcfcf')}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{borderColor: '#002d32'}}></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center" style={{paddingTop: '1rem'}}>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '', role: 'user' });
                }}
                className="text-sm font-medium"
                style={{color: '#000000'}}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>

      {/* Footer - Demo Credentials */}
      <footer style={{position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '448px'}}>
        <div className="rounded-lg p-4 text-center" style={{backgroundColor: '#b2b8b7', borderRadius: '8px'}}>
          <p className="text-xs mb-2" style={{color: '#000000'}}>Demo Credentials:</p>
          <p className="text-xs" style={{color: '#000000'}}>
            admin@petroltracker.com / admin123
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
