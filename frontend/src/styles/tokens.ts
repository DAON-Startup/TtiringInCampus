export const colors = {
  primary: '#005bac', // Incheon University main color
  secondary: '#ff7f00',
  white: '#ffffff',
  black: '#000000',
  gray: {
    100: '#f8f9fa',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
  },
  error: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    color: colors.gray[600],
  },
};
