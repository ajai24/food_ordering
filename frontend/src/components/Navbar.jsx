import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { colors, typography, spacing, borderRadius, shadows, animation } from '../styles/designSystem.js';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <div className="brand-logo">
              <span className="brand-icon">🍕</span>
              <span className="brand-text">FoodHub</span>
            </div>
          </Link>
        </div>

        <nav className="navbar-nav">
          <NavLink 
            to="/restaurants" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🍽️</span>
            <span className="nav-text">Restaurants</span>
          </NavLink>
          
          {user?.accountType === 'restaurant_admin' && (
            <NavLink 
              to="/admin/restaurants" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Admin</span>
            </NavLink>
          )}
          
          {user && user.accountType !== 'restaurant_admin' && (
            <>
              <NavLink 
                to="/orders" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-text">My Orders</span>
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">Profile</span>
              </NavLink>
            </>
          )}
          
          {user?.accountType === 'restaurant_admin' && (
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-button">
                <span className="user-avatar">
                  {user.profileInfo?.firstName?.[0] || user.username?.[0] || 'U'}
                </span>
                <span className="user-name">
                  {user.profileInfo?.firstName || user.username}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  <span>Profile</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className={({ isActive }) => `auth-button ${isActive ? 'active' : ''}`}
            >
              <span className="auth-icon">🔐</span>
              <span className="auth-text">Sign In</span>
            </NavLink>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          background: white;
          border-bottom: 1px solid ${colors.neutral[200]};
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: ${shadows.sm};
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 ${spacing[6]};
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .navbar-brand {
          flex-shrink: 0;
        }

        .brand-link {
          text-decoration: none;
          color: inherit;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          padding: ${spacing[2]} ${spacing[4]};
          border-radius: ${borderRadius.lg};
          background: ${colors.primary[500]};
          color: white;
          transition: all ${animation.duration.fast} ${animation.easing.ease};
        }

        .brand-logo:hover {
          background: ${colors.primary[600]};
          transform: translateY(-1px);
          box-shadow: ${shadows.md};
        }

        .brand-icon {
          font-size: ${typography.fontSize.lg};
        }

        .brand-text {
          font-size: ${typography.fontSize.lg};
          font-weight: ${typography.fontWeight.bold};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          padding: ${spacing[3]} ${spacing[4]};
          border-radius: ${borderRadius.lg};
          text-decoration: none;
          color: ${colors.neutral[600]};
          font-weight: ${typography.fontWeight.medium};
          font-size: ${typography.fontSize.sm};
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          position: relative;
        }

        .nav-link:hover {
          background: ${colors.neutral[100]};
          color: ${colors.neutral[800]};
        }

        .nav-link.active {
          background: ${colors.primary[50]};
          color: ${colors.primary[600]};
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: ${colors.primary[500]};
          border-radius: ${borderRadius.full};
        }

        .nav-icon {
          font-size: ${typography.fontSize.base};
        }

        .nav-text {
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: ${spacing[3]};
          flex-shrink: 0;
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          padding: ${spacing[2]} ${spacing[3]};
          border: 1px solid ${colors.neutral[200]};
          border-radius: ${borderRadius.lg};
          background: white;
          cursor: pointer;
          transition: all ${animation.duration.fast} ${animation.easing.ease};
        }

        .user-button:hover {
          border-color: ${colors.primary[300]};
          box-shadow: ${shadows.sm};
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: ${borderRadius.full};
          background: ${colors.primary[500]};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: ${typography.fontWeight.semibold};
          font-size: ${typography.fontSize.sm};
        }

        .user-name {
          font-size: ${typography.fontSize.sm};
          font-weight: ${typography.fontWeight.medium};
          color: ${colors.neutral[700]};
          font-family: ${typography.fontFamily.sans.join(', ')};
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dropdown-arrow {
          font-size: ${typography.fontSize.xs};
          color: ${colors.neutral[500]};
          transition: transform ${animation.duration.fast} ${animation.easing.ease};
        }

        .user-button:hover .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: ${spacing[2]};
          background: white;
          border: 1px solid ${colors.neutral[200]};
          border-radius: ${borderRadius.lg};
          box-shadow: ${shadows.lg};
          min-width: 180px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          z-index: 100;
        }

        .user-menu:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: ${spacing[3]};
          padding: ${spacing[3]} ${spacing[4]};
          color: ${colors.neutral[700]};
          text-decoration: none;
          font-size: ${typography.fontSize.sm};
          font-weight: ${typography.fontWeight.medium};
          cursor: pointer;
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .dropdown-item:hover {
          background: ${colors.neutral[100]};
          color: ${colors.neutral[800]};
        }

        .dropdown-item.logout-item:hover {
          background: ${colors.error[50]};
          color: ${colors.error[600]};
        }

        .dropdown-icon {
          font-size: ${typography.fontSize.base};
        }

        .dropdown-divider {
          height: 1px;
          background: ${colors.neutral[200]};
          margin: ${spacing[1]} 0;
        }

        .auth-button {
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          padding: ${spacing[3]} ${spacing[6]};
          background: ${colors.primary[500]};
          color: white;
          text-decoration: none;
          border-radius: ${borderRadius.lg};
          font-weight: ${typography.fontWeight.semibold};
          font-size: ${typography.fontSize.sm};
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .auth-button:hover {
          background: ${colors.primary[600]};
          transform: translateY(-1px);
          box-shadow: ${shadows.md};
        }

        .auth-icon {
          font-size: ${typography.fontSize.base};
        }

        .auth-text {
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 ${spacing[4]};
            height: 64px;
          }

          .brand-text {
            display: none;
          }

          .navbar-nav {
            gap: ${spacing[1]};
          }

          .nav-text {
            display: none;
          }

          .nav-link {
            padding: ${spacing[3]};
          }

          .user-name {
            display: none;
          }

          .dropdown-menu {
            right: -${spacing[2]};
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 ${spacing[3]};
          }

          .navbar-nav {
            gap: 0;
          }

          .nav-link {
            padding: ${spacing[2]};
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
