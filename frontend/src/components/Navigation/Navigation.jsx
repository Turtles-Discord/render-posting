import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Navigation = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-green-400">
              Social Media Poster
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="hover:text-green-400 transition-colors">
              Dashboard
            </Link>
            <Link to="/settings" className="hover:text-green-400 transition-colors">
              Settings
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 