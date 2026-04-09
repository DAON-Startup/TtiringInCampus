import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors, fonts, spacing } from '../../styles/tokens';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showAlert?: boolean;
  onBack?: () => void;
  onAlert?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showAlert = false,
  onBack,
  onAlert,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity style={styles.iconButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>
        {showAlert && (
          <TouchableOpacity style={styles.iconButton} onPress={onAlert}>
            <Text style={styles.alertIcon}>🔔</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  iconButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 20,
    color: colors.text,
  },
  alertIcon: {
    fontSize: 20,
  },
});

export default Header;
