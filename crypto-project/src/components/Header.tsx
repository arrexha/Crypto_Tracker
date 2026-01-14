import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const Header = ({ 
  title = "Crypto Tracker", 
  subtitle = "Real-time cryptocurrency prices and market data"
}: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
