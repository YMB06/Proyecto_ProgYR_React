
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem('userRole');
  });

  // Update localStorage when auth state changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [isAuthenticated, userRole]);

  const login = (role: string) => {
    console.log('AuthProvider: Setting role:', role);
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    // Clear localStorage on logout
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};