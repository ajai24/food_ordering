export const colors = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  }
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
};

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary[500],
      color: 'white',
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.base,
      border: 'none',
      cursor: 'pointer',
      transition: `all ${animation.duration.normal} ${animation.easing.ease}`,
      boxShadow: shadows.sm,
      '&:hover': {
        backgroundColor: colors.primary[600],
        transform: 'translateY(-1px)',
        boxShadow: shadows.md,
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: shadows.sm,
      },
      '&:disabled': {
        backgroundColor: colors.neutral[300],
        cursor: 'not-allowed',
        transform: 'none',
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: colors.primary[500],
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: borderRadius.lg,
      fontWeight: typography.fontWeight.medium,
      fontSize: typography.fontSize.base,
      border: `2px solid ${colors.primary[500]}`,
      cursor: 'pointer',
      transition: `all ${animation.duration.normal} ${animation.easing.ease}`,
      '&:hover': {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[600],
        color: colors.primary[600],
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[600],
      padding: `${spacing[2]} ${spacing[4]}`,
      borderRadius: borderRadius.base,
      fontWeight: typography.fontWeight.normal,
      fontSize: typography.fontSize.sm,
      border: 'none',
      cursor: 'pointer',
      transition: `all ${animation.duration.fast} ${animation.easing.ease}`,
      '&:hover': {
        backgroundColor: colors.neutral[100],
        color: colors.neutral[800],
      },
    }
  },
  input: {
    base: {
      width: '100%',
      padding: `${spacing[3]} ${spacing[4]}`,
      borderRadius: borderRadius.lg,
      border: `2px solid ${colors.neutral[200]}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.normal,
      color: colors.neutral[800],
      backgroundColor: 'white',
      transition: `all ${animation.duration.fast} ${animation.easing.ease}`,
      '&:focus': {
        outline: 'none',
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
      },
      '&:disabled': {
        backgroundColor: colors.neutral[100],
        borderColor: colors.neutral[300],
        color: colors.neutral[500],
        cursor: 'not-allowed',
      },
      '&.error': {
        borderColor: colors.error[500],
        '&:focus': {
          boxShadow: `0 0 0 3px ${colors.error[100]}`,
        },
      }
    }
  },
  card: {
    base: {
      backgroundColor: 'white',
      borderRadius: borderRadius['2xl'],
      boxShadow: shadows.lg,
      padding: spacing[8],
      border: `1px solid ${colors.neutral[200]}`,
    },
    elevated: {
      boxShadow: shadows.xl,
      transform: 'translateY(-4px)',
    }
  }
};
