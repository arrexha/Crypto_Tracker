import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const Header = ({ 
  title = "Crypto Tracker", 
  subtitle = "Real-time cryptocurrency prices and market data",
  showBackButton = false 
}: HeaderProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <div className="header-actions">

          {!isAuthenticated && (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-link">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
