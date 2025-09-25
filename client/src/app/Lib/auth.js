import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Authentication utilities
export const authAPI = {
  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('auth_token') !== null;
  },

  // Get current user data
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    return {
      id: localStorage.getItem('auth_user_id'),
      name: localStorage.getItem('auth_name'),
      email: localStorage.getItem('auth_email'),
      role: localStorage.getItem('auth_role'),
      token: token
    };
  },

  // Get auth token
  getToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  // Logout user
  logout: () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth');
    localStorage.removeItem('auth_name');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_user_id');
    
    // Redirect to login
    window.location.href = '/login';
  },

  // Make authenticated API request
  fetchWithAuth: async (url, options = {}) => {
    const token = authAPI.getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // If unauthorized, logout user
      if (response.status === 401) {
        authAPI.logout();
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

// Protected route wrapper
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = () => {
        if (authAPI.isAuthenticated()) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};
