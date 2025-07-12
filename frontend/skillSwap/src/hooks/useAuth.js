import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Mock implementation for development
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('skillswap_token');
      const userData = localStorage.getItem('skillswap_user');
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('skillswap_token');
          localStorage.removeItem('skillswap_user');
        }
      }
    }, []);

    const login = async (email, password) => {
      // Mock login - in real app, this would be an API call
      if (email && password) {
        const mockUser = {
          id: '1',
          email,
          username: email.split('@')[0],
          githubProfile: 'https://github.com/' + email.split('@')[0],
          skillsOffered: ['React', 'TypeScript', 'Node.js'],
          skillsWanted: ['Python', 'Machine Learning', 'DevOps'],
          availability: ['Weekends', 'Evenings'],
          location: 'San Francisco, CA',
          profileVisibility: 'public'
        };

        const mockToken = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('skillswap_token', mockToken);
        localStorage.setItem('skillswap_user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    };

    const register = async (userData) => {
      // Mock registration
      if (userData.email && userData.password && userData.githubProfile) {
        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          username: userData.username,
          githubProfile: userData.githubProfile,
          skillsOffered: userData.skillsOffered || [],
          skillsWanted: userData.skillsWanted || [],
          availability: userData.availability || [],
          location: userData.location,
          profilePhoto: userData.profilePhoto,
          profileVisibility: userData.profileVisibility || 'public'
        };

        const mockToken = 'mock_jwt_token_' + Date.now();
        
        localStorage.setItem('skillswap_token', mockToken);
        localStorage.setItem('skillswap_user', JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    };

    const logout = () => {
      localStorage.removeItem('skillswap_token');
      localStorage.removeItem('skillswap_user');
      setUser(null);
      setIsAuthenticated(false);
    };

    const updateProfile = (userData) => {
      if (user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    };

    return {
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile
    };
  }
  return context;
};
