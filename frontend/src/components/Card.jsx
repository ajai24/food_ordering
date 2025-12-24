import { colors, typography, spacing, borderRadius, shadows, animation } from '../styles/designSystem.js';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md', 
  hover = false,
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return `
          background: white;
          box-shadow: ${shadows.lg};
          border: 1px solid ${colors.neutral[200]};
          ${hover ? `
            &:hover {
              transform: translateY(-4px);
              box-shadow: ${shadows.xl};
              border-color: ${colors.primary[200]};
            }
          ` : ''}
        `;
      case 'outlined':
        return `
          background: white;
          border: 2px solid ${colors.neutral[300]};
          box-shadow: none;
          ${hover ? `
            &:hover {
              border-color: ${colors.primary[400]};
              box-shadow: ${shadows.md};
            }
          ` : ''}
        `;
      case 'filled':
        return `
          background: ${colors.neutral[100]};
          border: 1px solid ${colors.neutral[200]};
          box-shadow: none;
          ${hover ? `
            &:hover {
              background: ${colors.neutral[200]};
              border-color: ${colors.primary[300]};
            }
          ` : ''}
        `;
      case 'glass':
        return `
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: ${shadows.md};
          ${hover ? `
            &:hover {
              background: rgba(255, 255, 255, 0.9);
              border-color: rgba(255, 255, 255, 0.5);
              transform: translateY(-2px);
              box-shadow: ${shadows.lg};
            }
          ` : ''}
        `;
      default:
        return `
          background: white;
          box-shadow: ${shadows.base};
          border: 1px solid ${colors.neutral[200]};
          ${hover ? `
            &:hover {
              transform: translateY(-2px);
              box-shadow: ${shadows.md};
              border-color: ${colors.primary[200]};
            }
          ` : ''}
        `;
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return 'padding: 0;';
      case 'sm':
        return `padding: ${spacing[4]};`;
      case 'md':
        return `padding: ${spacing[6]};`;
      case 'lg':
        return `padding: ${spacing[8]};`;
      case 'xl':
        return `padding: ${spacing[12]};`;
      default:
        return `padding: ${spacing[6]};`;
    }
  };

  return (
    <div className={`card ${className}`} {...props}>
      {children}
      
      <style jsx>{`
        .card {
          border-radius: ${borderRadius.xl};
          transition: all ${animation.duration.normal} ${animation.easing.ease};
          position: relative;
          overflow: hidden;
          ${getVariantStyles()}
          ${getPaddingStyles()}
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            ${colors.primary[500]},
            ${colors.secondary[500]}
          );
          opacity: 0;
          transition: opacity ${animation.duration.fast} ${animation.easing.ease};
        }

        ${hover ? `
          .card:hover::before {
            opacity: 1;
          }
        ` : ''}
      `}</style>
    </div>
  );
};

export default Card;
