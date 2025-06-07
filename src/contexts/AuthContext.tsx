
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'agent';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const rolePermissions = {
  admin: ['view_leads', 'create_leads', 'assign_leads', 'create_projects', 'create_users', 'view_reports', 'export_reports', 'manage_users'],
  manager: ['view_leads', 'create_leads', 'assign_leads', 'create_projects', 'view_reports', 'export_reports'],
  agent: ['view_leads', 'create_leads', 'view_reports_limited']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This would be replaced with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      // Mock login for demo purposes
      if (email === 'admin@demo.com' && password === 'admin') {
        const userData = { id: '1', email, name: 'Admin User', role: 'admin' as const };
        localStorage.setItem('auth_token', 'demo_token');
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else if (email === 'manager@demo.com' && password === 'manager') {
        const userData = { id: '2', email, name: 'Manager User', role: 'manager' as const };
        localStorage.setItem('auth_token', 'demo_token');
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else if (email === 'agent@demo.com' && password === 'agent') {
        const userData = { id: '3', email, name: 'Agent User', role: 'agent' as const };
        localStorage.setItem('auth_token', 'demo_token');
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
