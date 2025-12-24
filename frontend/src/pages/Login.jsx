import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { colors, typography, spacing, borderRadius, shadows, animation, components, breakpoints } from '../styles/designSystem.js';

const AuthPage = ({ initialMode = 'signin' }) => {
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (mode === 'signup') {
      if (!formData.username || formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        accountType: userType,
        profileInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName
        }
      };

      const response = mode === 'signin' 
        ? await login({ email: formData.email, password: formData.password })
        : await register(userData);

      const redirectPath = userType === 'restaurant_admin' ? '/admin/restaurants' : '/restaurants';
      navigate(redirectPath);

    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || error.message || `${mode} failed` 
      });
    }
  };

  const switchMode = (newMode) => {
    setIsAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setErrors({});
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="auth-container">
      <div className="auth-pattern">
        <div className="pattern-grid"></div>
        <div className="pattern-overlay"></div>
      </div>

      <div className="auth-content">
        <div className="auth-left-panel">
          <div className="brand-section">
            <div className="logo">
              <div className="logo-icon">🍕</div>
              <h1 className="brand-title">FoodHub</h1>
            </div>
            <p className="brand-subtitle">Delicious meals, delivered fresh</p>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Restaurant Partners</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Customer Rating</div>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Lightning Fast</h3>
              <p>Order and receive meals in record time</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payments</h3>
              <p>Bank-level security for all transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile First</h3>
              <p>Perfect experience on any device</p>
            </div>
          </div>
        </div>

        <div className={`auth-right-panel ${isAnimating ? 'slide-out' : 'slide-in'}`}>
          <div className="auth-form-container">
            <div className="auth-header">
              <div className="mode-toggle">
                <button 
                  className={`mode-btn ${mode === 'signin' ? 'active' : ''}`}
                  onClick={() => switchMode('signin')}
                >
                  Sign In
                </button>
                <button 
                  className={`mode-btn ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => switchMode('signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <div className="auth-body">
              <h2 className="form-title">
                {mode === 'signin' ? 'Welcome Back!' : 'Join FoodHub Today'}
              </h2>

              <div className="user-selector">
                <label className="user-option">
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={userType === 'customer'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <div className="user-option-content">
                    <span className="user-icon">👤</span>
                    <div>
                      <div className="user-title">Customer</div>
                      <div className="user-desc">Order food from restaurants</div>
                    </div>
                  </div>
                </label>
                {mode === 'signin' && (
                  <label className="user-option">
                    <input
                      type="radio"
                      name="userType"
                      value="restaurant_admin"
                      checked={userType === 'restaurant_admin'}
                      onChange={(e) => setUserType(e.target.value)}
                    />
                    <div className="user-option-content">
                      <span className="user-icon">👨‍🍳</span>
                      <div>
                        <div className="user-title">Restaurant Admin</div>
                        <div className="user-desc">Manage your restaurant</div>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              {errors.submit && (
                <div className="error-banner">
                  <span className="error-icon">⚠️</span>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                {mode === 'signup' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <span className="error-text">{errors.username}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {mode === 'signup' && (
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner">⏳</span>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  {mode === 'signin' ? (
                    <>
                      New to FoodHub?{' '}
                      <button 
                        className="link-btn"
                        onClick={() => {
                          setUserType('customer'); // Force customer type for signup
                          switchMode('signup');
                        }}
                      >
                        Sign Up as Customer
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        className="link-btn"
                        onClick={() => switchMode('signin')}
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>
                {mode === 'signin' && (
                  <p className="admin-note">
                    Restaurant admin? Contact support to create an admin account.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
          background: ${colors.neutral[50]};
        }

        .auth-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .pattern-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(${colors.neutral[200]} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.neutral[200]} 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
        }

        .pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, ${colors.primary[100]} 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, ${colors.secondary[100]} 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, ${colors.primary[50]} 0%, transparent 50%);
          opacity: 0.6;
        }

        .auth-content {
          display: flex;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: ${spacing[8]};
          gap: ${spacing[12]};
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .auth-left-panel {
          flex: 1;
          max-width: 500px;
        }

        .brand-section {
          margin-bottom: ${spacing[12]};
        }

        .logo {
          display: flex;
          align-items: center;
          gap: ${spacing[3]};
          margin-bottom: ${spacing[4]};
        }

        .logo-icon {
          font-size: ${typography.fontSize['4xl']};
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${colors.primary[500]};
          border-radius: ${borderRadius.lg};
          box-shadow: ${shadows.md};
        }

        .brand-title {
          font-size: ${typography.fontSize['4xl']};
          font-weight: ${typography.fontWeight.bold};
          color: ${colors.neutral[800]};
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .brand-subtitle {
          font-size: ${typography.fontSize.lg};
          color: ${colors.neutral[600]};
          margin: 0;
          font-weight: ${typography.fontWeight.normal};
        }

        .stats-section {
          display: flex;
          gap: ${spacing[8]};
          margin-bottom: ${spacing[12]};
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-number {
          font-size: ${typography.fontSize['3xl']};
          font-weight: ${typography.fontWeight.bold};
          color: ${colors.primary[600]};
          display: block;
          margin-bottom: ${spacing[1]};
        }

        .stat-label {
          font-size: ${typography.fontSize.sm};
          color: ${colors.neutral[600]};
          font-weight: ${typography.fontWeight.medium};
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: ${spacing[6]};
        }

        .feature-card {
          background: white;
          padding: ${spacing[6]};
          border-radius: ${borderRadius.xl};
          box-shadow: ${shadows.base};
          border: 1px solid ${colors.neutral[200]};
          transition: all ${animation.duration.normal} ${animation.easing.ease};
        }

        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
          border-color: ${colors.primary[200]};
        }

        .feature-icon {
          font-size: ${typography.fontSize['2xl']};
          margin-bottom: ${spacing[3]};
          display: block;
        }

        .feature-card h3 {
          font-size: ${typography.fontSize.lg};
          font-weight: ${typography.fontWeight.semibold};
          color: ${colors.neutral[800]};
          margin: 0 0 ${spacing[2]} 0;
        }

        .feature-card p {
          font-size: ${typography.fontSize.sm};
          color: ${colors.neutral[600]};
          margin: 0;
          line-height: ${typography.lineHeight.relaxed};
        }

        .auth-right-panel {
          flex: 1;
          max-width: 500px;
          background: white;
          border-radius: ${borderRadius['2xl']};
          box-shadow: ${shadows.xl};
          overflow: hidden;
          border: 1px solid ${colors.neutral[200]};
        }

        .slide-out {
          opacity: 0;
          transform: translateX(20px);
          transition: all ${animation.duration.normal} ${animation.easing.easeOut};
        }

        .slide-in {
          opacity: 1;
          transform: translateX(0);
          transition: all ${animation.duration.normal} ${animation.easing.easeIn};
        }

        .auth-form-container {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .auth-header {
          padding: ${spacing[6]} ${spacing[8]} 0;
        }

        .mode-toggle {
          display: flex;
          background: ${colors.neutral[100]};
          border-radius: ${borderRadius.lg};
          padding: ${spacing[1]};
          gap: ${spacing[1]};
        }

        .mode-btn {
          flex: 1;
          padding: ${spacing[3]} ${spacing[6]};
          border: none;
          background: transparent;
          border-radius: ${borderRadius.base};
          font-weight: ${typography.fontWeight.medium};
          font-size: ${typography.fontSize.sm};
          color: ${colors.neutral[600]};
          cursor: pointer;
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .mode-btn.active {
          background: white;
          color: ${colors.primary[600]};
          box-shadow: ${shadows.sm};
        }

        .auth-body {
          padding: 0 ${spacing[8]} ${spacing[8]};
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-title {
          font-size: ${typography.fontSize['2xl']};
          font-weight: ${typography.fontWeight.bold};
          color: ${colors.neutral[800]};
          margin: 0 0 ${spacing[8]} 0;
          text-align: center;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .user-selector {
          display: flex;
          gap: ${spacing[4]};
          margin-bottom: ${spacing[8]};
        }

        .user-option {
          flex: 1;
          cursor: pointer;
        }

        .user-option input[type="radio"] {
          display: none;
        }

        .user-option-content {
          padding: ${spacing[4]};
          border: 2px solid ${colors.neutral[200]};
          border-radius: ${borderRadius.lg};
          display: flex;
          align-items: center;
          gap: ${spacing[3]};
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          background: white;
        }

        .user-option input[type="radio"]:checked + .user-option-content {
          border-color: ${colors.primary[500]};
          background: ${colors.primary[50]};
          box-shadow: ${shadows.sm};
        }

        .user-icon {
          font-size: ${typography.fontSize.xl};
        }

        .user-title {
          font-weight: ${typography.fontWeight.semibold};
          color: ${colors.neutral[800]};
          font-size: ${typography.fontSize.sm};
        }

        .user-desc {
          font-size: ${typography.fontSize.xs};
          color: ${colors.neutral[500]};
        }

        .error-banner {
          background: ${colors.error[50]};
          border: 1px solid ${colors.error[200]};
          color: ${colors.error[700]};
          padding: ${spacing[3]} ${spacing[4]};
          border-radius: ${borderRadius.lg};
          margin-bottom: ${spacing[6]};
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          font-size: ${typography.fontSize.sm};
        }

        .error-icon {
          font-size: ${typography.fontSize.lg};
        }

        .auth-form {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-row {
          display: flex;
          gap: ${spacing[4]};
        }

        .form-group {
          margin-bottom: ${spacing[6]};
          flex: 1;
        }

        .form-group label {
          display: block;
          margin-bottom: ${spacing[2]};
          font-weight: ${typography.fontWeight.medium};
          color: ${colors.neutral[700]};
          font-size: ${typography.fontSize.sm};
        }

        .form-group input {
          width: 100%;
          padding: ${spacing[3]} ${spacing[4]};
          border: 2px solid ${colors.neutral[200]};
          border-radius: ${borderRadius.lg};
          font-size: ${typography.fontSize.base};
          font-weight: ${typography.fontWeight.normal};
          color: ${colors.neutral[800]};
          background: white;
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .form-group input:focus {
          outline: none;
          border-color: ${colors.primary[500]};
          box-shadow: 0 0 0 3px ${colors.primary[100]};
        }

        .form-group input.error {
          border-color: ${colors.error[500]};
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: ${spacing[3]};
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: ${typography.fontSize.lg};
          padding: ${spacing[1]};
          border-radius: ${borderRadius.base};
          transition: all ${animation.duration.fast} ${animation.easing.ease};
        }

        .password-toggle:hover {
          background: ${colors.neutral[100]};
        }

        .error-text {
          color: ${colors.error[600]};
          font-size: ${typography.fontSize.xs};
          margin-top: ${spacing[1]};
          display: block;
          font-weight: ${typography.fontWeight.medium};
        }

        .submit-btn {
          width: 100%;
          padding: ${spacing[4]};
          background: ${colors.primary[500]};
          color: white;
          border: none;
          border-radius: ${borderRadius.lg};
          font-size: ${typography.fontSize.base};
          font-weight: ${typography.fontWeight.semibold};
          cursor: pointer;
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          box-shadow: ${shadows.base};
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${spacing[2]};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .submit-btn:hover:not(:disabled) {
          background: ${colors.primary[600]};
          transform: translateY(-1px);
          box-shadow: ${shadows.md};
        }

        .submit-btn:active {
          transform: translateY(0);
          box-shadow: ${shadows.sm};
        }

        .submit-btn:disabled {
          background: ${colors.neutral[300]};
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          text-align: center;
          margin-top: ${spacing[6]};
          color: ${colors.neutral[600]};
        }

        .auth-footer p {
          font-size: ${typography.fontSize.sm};
          margin: 0;
        }

        .link-btn {
          background: none;
          border: none;
          color: ${colors.primary[600]};
          font-weight: ${typography.fontWeight.semibold};
          cursor: pointer;
          text-decoration: underline;
          font-size: ${typography.fontSize.sm};
          transition: color ${animation.duration.fast} ${animation.easing.ease};
        }

        .link-btn:hover {
          color: ${colors.primary[700]};
        }

        @media (max-width: ${breakpoints.lg}) {
          .auth-content {
            flex-direction: column;
            gap: ${spacing[8]};
            padding: ${spacing[6]};
          }

          .auth-left-panel {
            max-width: 100%;
            text-align: center;
          }

          .stats-section {
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: ${spacing[4]};
          }

          .auth-right-panel {
            max-width: 100%;
          }
        }

        @media (max-width: ${breakpoints.md}) {
          .auth-content {
            padding: ${spacing[4]};
          }

          .form-row {
            flex-direction: column;
            gap: ${spacing[6]};
          }

          .user-selector {
            flex-direction: column;
            gap: ${spacing[3]};
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
