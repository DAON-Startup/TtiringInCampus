export const colors = {
  primary: '#3366FF',
  secondary: '#ff7f00',
  white: '#ffffff',
  black: '#000000',
  text: '#11181C',
  background: '#ffffff',
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
  categoryBadge: '#8e8e8e',
  important: '#e03131',
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

export const fonts = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semiBold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extraBold: 'Pretendard-ExtraBold',
};

export const typography = {
  h1: {
    fontSize: 32,
    fontFamily: fonts.extraBold,
  },
  h2: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  h3: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
  body1: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  body2: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  caption: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.gray[600],
  },
};
