import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api';
import Header from '../../components/layout/Header';
import { colors, spacing, fonts } from '../../styles/tokens';

const SettingsScreen = () => {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try { await authApi.logout(); } catch { /* ignore */ } finally { await logout(); }
        },
      },
    ]);
  };

  const sections = [
    {
      title: '계정',
      items: [
        { label: '로그아웃', onPress: handleLogout, danger: true },
      ],
    },
    {
      title: '알림',
      items: [
        { label: '키워드 알림 설정', onPress: () => {}, danger: false },
        { label: '푸시 알림 켜기 / 끄기', onPress: () => {}, danger: false },
      ],
    },
    {
      title: '앱 정보',
      items: [
        { label: '버전', value: '1.0.0', onPress: undefined, danger: false },
        { label: '이용약관', onPress: () => {}, danger: false },
        { label: '개인정보 처리방침', onPress: () => {}, danger: false },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="설정" />
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.item}
              onPress={item.onPress}
              disabled={!item.onPress}
              activeOpacity={item.onPress ? 0.7 : 1}
            >
              <Text style={[styles.itemLabel, item.danger && styles.itemLabelDanger]}>
                {item.label}
              </Text>
              {'value' in item && item.value ? (
                <Text style={styles.itemValue}>{item.value}</Text>
              ) : item.onPress ? (
                <Text style={styles.chevron}>›</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.gray[100] },
  section: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.gray[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.gray[100],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  itemLabelDanger: {
    color: colors.error,
    fontFamily: fonts.semiBold,
  },
  itemValue: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[500],
  },
  chevron: {
    fontSize: 20,
    color: colors.gray[400],
  },
});

export default SettingsScreen;
