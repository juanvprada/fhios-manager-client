import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (you might want to use a more robust auth check)
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    // Clear authentication-related items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reset authentication state
    setIsAuthenticated(false);
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <Outlet context={{ onLogout: handleLogout, isAuthenticated }} />
    </div>
  );
};

export default Layout;
