import { colors, typography, spacing, borderRadius, shadows, animation } from '../styles/designSystem.js';

const Input = ({ 
  label, 
  error, 
  helperText, 
  leftIcon, 
  rightIcon, 
  variant = 'default',
  size = 'md',
  fullWidth = true,
  disabled = false,
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return `
          background: ${colors.neutral[100]};
          border: 2px solid transparent;
          &:focus {
            background: white;
            border-color: ${colors.primary[500]};
            box-shadow: 0 0 0 3px ${colors.primary[100]};
          }
        `;
      case 'outlined':
        return `
          background: transparent;
          border: 2px solid ${colors.neutral[300]};
          &:focus {
            border-color: ${colors.primary[500]};
            box-shadow: 0 0 0 3px ${colors.primary[100]};
          }
        `;
      case 'underlined':
        return `
          background: transparent;
          border: none;
          border-bottom: 2px solid ${colors.neutral[300]};
          border-radius: 0;
          padding-left: 0;
          padding-right: 0;
          &:focus {
            border-bottom-color: ${colors.primary[500]};
            box-shadow: none;
          }
        `;
      default:
        return `
          background: white;
          border: 2px solid ${colors.neutral[200]};
          &:focus {
            border-color: ${colors.primary[500]};
            box-shadow: 0 0 0 3px ${colors.primary[100]};
          }
        `;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return `
          padding: ${spacing[2]} ${spacing[3]};
          font-size: ${typography.fontSize.sm};
          min-height: 36px;
        `;
      case 'md':
        return `
          padding: ${spacing[3]} ${spacing[4]};
          font-size: ${typography.fontSize.base};
          min-height: 44px;
        `;
      case 'lg':
        return `
          padding: ${spacing[4]} ${spacing[5]};
          font-size: ${typography.fontSize.lg};
          min-height: 52px;
        `;
      default:
        return '';
    }
  };

  const getIconPadding = () => {
    let paddingLeft = spacing[4];
    let paddingRight = spacing[4];
    
    if (leftIcon) paddingLeft = spacing[12];
    if (rightIcon) paddingRight = spacing[12];
    
    return { paddingLeft, paddingRight };
  };

  const { paddingLeft, paddingRight } = getIconPadding();

  return (
    <div className={`input-container ${className}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      
      <div className="input-wrapper">
        {leftIcon && (
          <span className="input-icon left-icon">{leftIcon}</span>
        )}
        
        <input
          className={`input-field ${error ? 'error' : ''}`}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <span className="input-icon right-icon">{rightIcon}</span>
        )}
      </div>
      
      {error && (
        <span className="input-error">{error}</span>
      )}
      
      {helperText && !error && (
        <span className="input-helper">{helperText}</span>
      )}
      
      <style jsx>{`
        .input-container {
          display: flex;
          flex-direction: column;
          gap: ${spacing[2]};
          ${fullWidth ? 'width: 100%;' : ''}
        }

        .input-label {
          font-weight: ${typography.fontWeight.medium};
          color: ${colors.neutral[700]};
          font-size: ${typography.fontSize.sm};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-field {
          width: 100%;
          border-radius: ${borderRadius.lg};
          font-weight: ${typography.fontWeight.normal};
          color: ${colors.neutral[800]};
          transition: all ${animation.duration.fast} ${animation.easing.ease};
          font-family: ${typography.fontFamily.sans.join(', ')};
          outline: none;
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${variant !== 'underlined' ? `
            padding-left: ${paddingLeft};
            padding-right: ${paddingRight};
          ` : ''}
        }

        .input-field::placeholder {
          color: ${colors.neutral[400]};
        }

        .input-field:disabled {
          background: ${colors.neutral[100]};
          color: ${colors.neutral[500]};
          cursor: not-allowed;
          ${variant === 'filled' ? 'background: ${colors.neutral[200];' : ''}
        }

        .input-field.error {
          border-color: ${colors.error[500]};
          ${variant === 'underlined' ? 'border-bottom-color: ${colors.error[500]};' : ''}
        }

        .input-field.error:focus {
          border-color: ${colors.error[500]};
          box-shadow: 0 0 0 3px ${colors.error[100]};
        }

        .input-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${colors.neutral[500]};
          font-size: ${typography.fontSize.lg};
          pointer-events: none;
          transition: color ${animation.duration.fast} ${animation.easing.ease};
        }

        .left-icon {
          left: ${spacing[3]};
        }

        .right-icon {
          right: ${spacing[3]};
        }

        .input-field:focus ~ .input-icon {
          color: ${colors.primary[500]};
        }

        .input-field.error ~ .input-icon {
          color: ${colors.error[500]};
        }

        .input-error {
          color: ${colors.error[600]};
          font-size: ${typography.fontSize.xs};
          font-weight: ${typography.fontWeight.medium};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }

        .input-helper {
          color: ${colors.neutral[500]};
          font-size: ${typography.fontSize.xs};
          font-family: ${typography.fontFamily.sans.join(', ')};
        }
      `}</style>
    </div>
  );
};

export default Input;
