import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './hooks/useAuth.jsx';
import { colors, typography, spacing, borderRadius, shadows, animation } from './styles/designSystem.js';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Restaurants from './pages/Restaurants.jsx';
import RestaurantDetail from './pages/RestaurantDetail.jsx';
import Orders from './pages/Orders.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminRestaurants from './pages/AdminRestaurants.jsx';

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route
              path="/restaurants/:id"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <RestaurantDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/restaurants"
              element={
                <ProtectedRoute allowedRoles={['restaurant_admin']}>
                  <AdminRestaurants />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">FoodHub</h3>
              <p className="footer-description">
                Your trusted partner for delicious meals delivered fresh to your doorstep.
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="/restaurants" className="footer-link">Restaurants</a></li>
                <li><a href="/orders" className="footer-link">My Orders</a></li>
                <li><a href="/profile" className="footer-link">Profile</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">FAQs</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-heading">Connect</h4>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">📷</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="copyright">
              © 2024 FoodHub. All rights reserved. Made with ❤️
            </p>
          </div>
        </footer>
      </div>
      
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: ${typography.fontFamily.sans.join(', ')};
          font-size: ${typography.fontSize.base};
          line-height: ${typography.lineHeight.normal};
          color: ${colors.neutral[800]};
          background-color: ${colors.neutral[50]};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font-family: inherit;
        }

        input, textarea, select {
          font-family: inherit;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-main {
          flex: 1;
          padding-top: 72px;
        }

        .app-footer {
          background: ${colors.neutral[900]};
          color: ${colors.neutral[300]};
          margin-top: auto;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: ${spacing[16]} ${spacing[6]};
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: ${spacing[12]};
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: ${spacing[4]};
        }

        .footer-title {
          font-size: ${typography.fontSize.xl};
          font-weight: ${typography.fontWeight.bold};
          color: white;
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .footer-description {
          font-size: ${typography.fontSize.sm};
          line-height: ${typography.lineHeight.relaxed};
          color: ${colors.neutral[400]};
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .footer-heading {
          font-size: ${typography.fontSize.base};
          font-weight: ${typography.fontWeight.semibold};
          color: white;
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: ${spacing[2]};
        }

        .footer-link {
          color: ${colors.neutral[400]};
          font-size: ${typography.fontSize.sm};
          transition: color ${animation.duration.fast} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .footer-link:hover {
          color: ${colors.primary[400]};
        }

        .social-links {
          display: flex;
          gap: ${spacing[3]};
        }

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: ${borderRadius.full};
          background: ${colors.neutral[800]};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${typography.fontSize.lg};
          transition: all ${animation.duration.fast} ${animation.easing.ease};
        }

        .social-link:hover {
          background: ${colors.primary[500]};
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid ${colors.neutral[800]};
          padding: ${spacing[6]};
          text-align: center;
        }

        .copyright {
          font-size: ${typography.fontSize.sm};
          color: ${colors.neutral[500]};
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: ${spacing[8]};
          }
        }

        @media (max-width: 768px) {
          .app-main {
            padding-top: 64px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: ${spacing[6]};
            padding: ${spacing[12]} ${spacing[4]};
          }

          .footer-section {
            text-align: center;
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer-content {
            padding: ${spacing[8]} ${spacing[3]};
          }

          .footer-bottom {
            padding: ${spacing[4]};
          }
        }
      `}</style>
    </AuthProvider>
  );
};

export default App;
