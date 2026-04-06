import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api';
import { colors, spacing, typography } from '../../styles/tokens';

const SettingsScreen = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '확인',
        onPress: async () => {
          try {
            await authApi.logout();
          } catch (error) {
            console.error(error);
          } finally {
            await logout();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정 설정</Text>
        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Text style={[styles.itemText, { color: colors.error }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>알림 설정</Text>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>키워드 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>푸시 알림 켜기/끄기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>정보</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>버전 정보</Text>
          <Text style={styles.itemValue}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  section: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
  },
  sectionTitle: {
    ...typography.caption,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  itemText: {
    ...typography.body1,
  },
  itemValue: {
    ...typography.body2,
    color: colors.gray[500],
  },
});

export default SettingsScreen;
