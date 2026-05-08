import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Optionally, remove any user info if stored
    localStorage.removeItem('user');

    // Redirect to home page
    navigate('/', { replace: true });
  }, [navigate]);

  return null; // No UI needed, instantly redirects
};

export default Logout;
