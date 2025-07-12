import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Get user profile when token exists
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('skillswap_token');
      if (token) {
        setIsAuthenticated(true);
        await getUserProfile();
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:1124/api/v1/user/login',
        { email, password }
      );

      const token = response.data.data.data; // Double-check this
      localStorage.setItem('skillswap_token', token);
      setIsAuthenticated(true);
      await getUserProfile();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        'http://localhost:1124/api/v1/user/register',
        userData
      );

      const token = response.data.data.token;
      localStorage.setItem('skillswap_token', token);
      setIsAuthenticated(true);
      await getUserProfile();
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (userData) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem('skillswap_token');
      if (!token) return;

      const response = await axios.get('http://localhost:1124/api/v1/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userDetails = response.data.data;
      setUser(userDetails);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        getUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
