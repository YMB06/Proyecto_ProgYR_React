import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, userRole } = useAuth();
    
    console.log('Auth state:', { isAuthenticated, userRole }); // Debug log
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }
  
    if (userRole !== 'ROLE_ADMIN') {
      console.log('Not admin - Current role:', userRole);
      console.log('Role type:', typeof userRole);
      console.log('Role comparison:', {
        userRole,
        expected: 'ROLE_ADMIN',
        isEqual: userRole === 'ROLE_ADMIN'
      });
      return <Navigate to="/unauthorized" replace />;
    }
  
    console.log('Admin access granted');
    return <>{children}</>;
  };