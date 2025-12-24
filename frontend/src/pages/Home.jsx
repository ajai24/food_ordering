import { Link } from 'react-router-dom';
import { colors, typography, spacing, borderRadius, shadows, animation, breakpoints } from '../styles/designSystem.js';

const Home = () => {
  const features = [
    {
      icon: '🍽️',
      title: 'Discover Restaurants',
      description: 'Explore a curated selection of top-rated restaurants in your area',
      color: colors.primary[500]
    },
    {
      icon: '⚡',
      title: 'Lightning Fast Delivery',
      description: 'Get your favorite meals delivered in record time with real-time tracking',
      color: colors.secondary[500]
    },
    {
      icon: '🛡️',
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-level security for every transaction',
      color: colors.success[500]
    },
    {
      icon: '📱',
      title: 'Mobile First Design',
      description: 'Perfect experience on any device with our responsive platform',
      color: colors.neutral[600]
    },
    {
      icon: '⭐',
      title: 'Verified Reviews',
      description: 'Real customer reviews to help you make informed dining decisions',
      color: colors.warning[500]
    },
    {
      icon: '🎯',
      title: 'Personalized Recommendations',
      description: 'AI-powered suggestions based on your taste preferences and order history',
      color: colors.error[500]
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers', color: colors.primary[600] },
    { number: '500+', label: 'Restaurant Partners', color: colors.secondary[600] },
    { number: '50K+', label: 'Orders Delivered', color: colors.success[600] },
    { number: '4.8★', label: 'Average Rating', color: colors.warning[600] }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Delicious Meals,
              <span className="hero-highlight"> Delivered Fresh</span>
            </h1>
            <p className="hero-subtitle">
              Browse curated restaurants, customize your order, and track it in real-time.
              Experience the future of food ordering with FoodHub.
            </p>
            <div className="hero-actions">
              <Link to="/restaurants" className="cta-primary">
                <span className="cta-icon">🍽️</span>
                Browse Restaurants
              </Link>
              <Link to="/login" className="cta-secondary">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">🍕</span>
                <div className="placeholder-text">
                  <span>FoodHub</span>
                  <span>Your Food, Your Way</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number" style={{ color: stat.color }}>
                {stat.number}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose FoodHub?</h2>
          <p className="section-subtitle">
            We're redefining the food ordering experience with innovative features and unmatched convenience
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div 
                className="feature-icon-wrapper"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Order?</h2>
          <p className="cta-subtitle">
            Join thousands of satisfied customers who enjoy delicious meals delivered to their doorstep
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="cta-button primary">
              Sign Up Now
            </Link>
            <Link to="/restaurants" className="cta-button secondary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: ${colors.neutral[50]};
        }

        .hero-section {
          background: linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[400]} 100%);
          padding: ${spacing[20]} ${spacing[6]};
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='30' cy='30' r='2' fill='white' opacity='0.1'/%3E%3C/g%3E%3C/svg%3E");
          background-size: 60px 60px;
          opacity: 0.3;
        }

        .hero-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${spacing[16]};
          align-items: center;
          position: relative;
          z-index: 1;
        }

        .hero-text {
          color: white;
        }

        .hero-title {
          font-size: ${typography.fontSize['5xl']};
          font-weight: ${typography.fontWeight.black};
          line-height: ${typography.lineHeight.tight};
          margin: 0 0 ${spacing[6]} 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .hero-highlight {
          color: ${colors.secondary[300]};
          position: relative;
        }

        .hero-highlight::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: ${colors.secondary[300]};
          border-radius: ${borderRadius.full};
        }

        .hero-subtitle {
          font-size: ${typography.fontSize.lg};
          line-height: ${typography.lineHeight.relaxed};
          margin: 0 0 ${spacing[8]} 0;
          opacity: 0.9;
          max-width: 500px;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .hero-actions {
          display: flex;
          gap: ${spacing[4]};
          align-items: center;
        }

        .cta-primary {
          display: flex;
          align-items: center;
          gap: ${spacing[2]};
          padding: ${spacing[4]} ${spacing[8]};
          background: ${colors.secondary[500]};
          color: white;
          text-decoration: none;
          border-radius: ${borderRadius.lg};
          font-weight: ${typography.fontWeight.semibold};
          font-size: ${typography.fontSize.base};
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          box-shadow: ${shadows.md};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .cta-primary:hover {
          background: ${colors.secondary[600]};
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
        }

        .cta-icon {
          font-size: ${typography.fontSize.lg};
        }

        .cta-secondary {
          padding: ${spacing[4]} ${spacing[6]};
          background: transparent;
          color: white;
          text-decoration: none;
          border: 2px solid white;
          border-radius: ${borderRadius.lg};
          font-weight: ${typography.fontWeight.semibold};
          font-size: ${typography.fontSize.base};
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .cta-secondary:hover {
          background: white;
          color: ${colors.primary[600]};
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
        }

        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-placeholder {
          width: 400px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: ${borderRadius['2xl']};
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .placeholder-content {
          text-align: center;
          color: white;
        }

        .placeholder-icon {
          font-size: ${typography.fontSize['6xl']};
          display: block;
          margin-bottom: ${spacing[4]};
        }

        .placeholder-text span {
          display: block;
          font-weight: ${typography.fontWeight.bold};
          font-size: ${typography.fontSize.xl};
          margin-bottom: ${spacing[2]};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .stats-section {
          padding: ${spacing[16]} ${spacing[6]};
          background: white;
        }

        .stats-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: ${spacing[8]};
        }

        .stat-item {
          text-align: center;
          padding: ${spacing[6]};
          border-radius: ${borderRadius.xl};
          background: ${colors.neutral[50]};
          border: 1px solid ${colors.neutral[200]};
          transition: all ${animation.duration.normal} ${animation.easing.ease};
        }

        .stat-item:hover {
          transform: translateY(-4px);
          box-shadow: ${shadows.lg};
          border-color: ${colors.primary[200]};
        }

        .stat-number {
          font-size: ${typography.fontSize['4xl']};
          font-weight: ${typography.fontWeight.black};
          margin-bottom: ${spacing[2]};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .stat-label {
          font-size: ${typography.fontSize.sm};
          color: ${colors.neutral[600]};
          font-weight: ${typography.fontWeight.medium};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .features-section {
          padding: ${spacing[16]} ${spacing[6]};
          background: linear-gradient(180deg, ${colors.neutral[50]} 0%, white 50%);
        }

        .section-header {
          text-align: center;
          margin-bottom: ${spacing[12]};
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: ${typography.fontSize['3xl']};
          font-weight: ${typography.fontWeight.black};
          color: ${colors.neutral[800]};
          margin: 0 0 ${spacing[4]} 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .section-subtitle {
          font-size: ${typography.fontSize.base};
          color: ${colors.neutral[600]};
          line-height: ${typography.lineHeight.relaxed};
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .features-grid {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: ${spacing[8]};
        }

        .feature-card {
          background: white;
          padding: ${spacing[8]};
          border-radius: ${borderRadius['2xl']};
          box-shadow: ${shadows.base};
          border: 1px solid ${colors.neutral[200]};
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: ${shadows.xl};
          border-color: ${colors.primary[200]};
        }

        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: ${borderRadius.xl};
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto ${spacing[6]} auto;
        }

        .feature-icon {
          font-size: ${typography.fontSize['3xl']};
        }

        .feature-title {
          font-size: ${typography.fontSize.xl};
          font-weight: ${typography.fontWeight.semibold};
          color: ${colors.neutral[800]};
          margin: 0 0 ${spacing[4]} 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .feature-description {
          font-size: ${typography.fontSize.base};
          color: ${colors.neutral[600]};
          line-height: ${typography.lineHeight.relaxed};
          margin: 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .cta-section {
          padding: ${spacing[20]} ${spacing[6]};
          background: linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%);
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: ${typography.fontSize['3xl']};
          font-weight: ${typography.fontWeight.black};
          color: ${colors.neutral[800]};
          margin: 0 0 ${spacing[4]} 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .cta-subtitle {
          font-size: ${typography.fontSize.lg};
          color: ${colors.neutral[600]};
          line-height: ${typography.lineHeight.relaxed};
          margin: 0 0 ${spacing[8]} 0;
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .cta-buttons {
          display: flex;
          gap: ${spacing[4]};
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: ${spacing[4]} ${spacing[8]};
          border-radius: ${borderRadius.lg};
          font-weight: ${typography.fontWeight.semibold};
          font-size: ${typography.fontSize.base};
          text-decoration: none;
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .cta-button.primary {
          background: ${colors.primary[500]};
          color: white;
          box-shadow: ${shadows.md};
        }

        .cta-button.primary:hover {
          background: ${colors.primary[600]};
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
        }

        .cta-button.secondary {
          background: white;
          color: ${colors.primary[600]};
          border: 2px solid ${colors.primary[500]};
        }

        .cta-button.secondary:hover {
          background: ${colors.primary[50]};
          border-color: ${colors.primary[600]};
          transform: translateY(-2px);
          box-shadow: ${shadows.lg};
        }

        @media (max-width: ${breakpoints.lg}) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: ${spacing[12]};
            text-align: center;
          }

          .hero-visual {
            order: -1;
          }

          .hero-image-placeholder {
            width: 300px;
            height: 300px;
          }

          .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: ${spacing[6]};
          }

          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: ${spacing[6]};
          }
        }

        @media (max-width: ${breakpoints.md}) {
          .hero-section {
            padding: ${spacing[12]} ${spacing[4]};
          }

          .hero-title {
            font-size: ${typography.fontSize['4xl']};
          }

          .hero-subtitle {
            font-size: ${typography.fontSize.base};
          }

          .hero-actions {
            flex-direction: column;
            gap: ${spacing[3]};
          }

          .hero-image-placeholder {
            width: 250px;
            height: 250px;
          }

          .stats-container {
            grid-template-columns: 1fr;
            gap: ${spacing[4]};
          }

          .stat-item {
            padding: ${spacing[4]};
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: ${spacing[4]};
          }

          .feature-card {
            padding: ${spacing[6]};
          }

          .cta-buttons {
            flex-direction: column;
            gap: ${spacing[3]};
          }
        }

        @media (max-width: ${breakpoints.sm}) {
          .hero-section {
            padding: ${spacing[8]} ${spacing[3]};
          }

          .hero-title {
            font-size: ${typography.fontSize['3xl']};
          }

          .hero-image-placeholder {
            width: 200px;
            height: 200px;
          }

          .placeholder-icon {
            font-size: ${typography.fontSize['4xl']};
          }

          .placeholder-text span {
            font-size: ${typography.fontSize.lg};
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
