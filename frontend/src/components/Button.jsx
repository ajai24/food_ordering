import { colors, typography, spacing, borderRadius, shadows, animation } from '../styles/designSystem.js';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  leftIcon, 
  rightIcon, 
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
          background: ${colors.primary[500]};
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background: ${colors.primary[600]};
            transform: translateY(-1px);
            box-shadow: ${shadows.md};
          }
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${shadows.sm};
          }
        `;
      case 'secondary':
        return `
          background: transparent;
          color: ${colors.primary[500]};
          border: 2px solid ${colors.primary[500]};
          &:hover:not(:disabled) {
            background: ${colors.primary[50]};
            border-color: ${colors.primary[600]};
            color: ${colors.primary[600]};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${colors.neutral[600]};
          border: none;
          &:hover:not(:disabled) {
            background: ${colors.neutral[100]};
            color: ${colors.neutral[800]};
          }
        `;
      case 'danger':
        return `
          background: ${colors.error[500]};
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background: ${colors.error[600]};
            transform: translateY(-1px);
            box-shadow: ${shadows.md};
          }
        `;
      case 'success':
        return `
          background: ${colors.success[500]};
          color: white;
          border: none;
          &:hover:not(:disabled) {
            background: ${colors.success[600]};
            transform: translateY(-1px);
            box-shadow: ${shadows.md};
          }
        `;
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return `
          padding: ${spacing[2]} ${spacing[4]};
          font-size: ${typography.fontSize.sm};
          min-height: 36px;
        `;
      case 'md':
        return `
          padding: ${spacing[3]} ${spacing[6]};
          font-size: ${typography.fontSize.base};
          min-height: 44px;
        `;
      case 'lg':
        return `
          padding: ${spacing[4]} ${spacing[8]};
          font-size: ${typography.fontSize.lg};
          min-height: 52px;
        `;
      default:
        return '';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`button ${className}`}
      {...props}
    >
      {loading && <span className="loading-spinner">⏳</span>}
      {!loading && leftIcon && <span className="button-icon left-icon">{leftIcon}</span>}
      <span className="button-text">{children}</span>
      {!loading && rightIcon && <span className="button-icon right-icon">{rightIcon}</span>}
      
      <style jsx>{`
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: ${spacing[2]};
          border-radius: ${borderRadius.lg};
          font-weight: ${typography.fontWeight.semibold};
          font-family: ${typography.fontFamily.sans.join(', ')};
          cursor: pointer;
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          box-shadow: ${shadows.sm};
          position: relative;
          overflow: hidden;
          text-decoration: none;
          outline: none;
          ${fullWidth ? 'width: 100%;' : ''}
          ${getVariantStyles()}
          ${getSizeStyles()}
        }

        .button:disabled {
          background: ${colors.neutral[300]};
          color: ${colors.neutral[500]};
          border-color: ${colors.neutral[300]};
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .button:focus-visible {
          outline: 2px solid ${colors.primary[500]};
          outline-offset: 2px;
        }

        .button-icon {
          display: flex;
          align-items: center;
          font-size: ${typography.fontSize.lg};
        }

        .button-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
          font-size: ${typography.fontSize.lg};
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left ${animation.duration.slow} ${animation.easing.ease};
        }

        .button:hover::before:not(:disabled) {
          left: 100%;
        }
      `}</style>
    </button>
  );
};

export default Button;
