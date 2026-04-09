import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ActivityIndicator,
  TouchableOpacity, Platform, Linking, Share, SafeAreaView,
} from 'react-native';
import { colors, spacing, fonts } from '../../styles/tokens';

let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

const NoticeDetailScreen = ({ route }: any) => {
  const { notice } = route.params;
  const [bookmarked, setBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({ message: `${notice.title}\n${notice.url}` });
    } catch (error) {
      console.error(error);
    }
  };

  const ActionBar = () => (
    <View style={styles.actionBar}>
      <View style={styles.meta}>
        <Text style={styles.metaSource}>{notice.sourceName}</Text>
        <Text style={styles.metaDot}> · </Text>
        <Text style={styles.metaDate}>{notice.postedDate}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setBookmarked((b) => !b)}>
          <Text style={[styles.actionIcon, bookmarked && styles.actionIconActive]}>
            {bookmarked ? '🔖' : '🔖'}
          </Text>
          <Text style={[styles.actionLabel, bookmarked && styles.actionLabelActive]}>
            {bookmarked ? '저장됨' : '저장'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionLabel}>공유</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(notice.url)}>
          <Text style={styles.actionIcon}>🔗</Text>
          <Text style={styles.actionLabel}>원본</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActionBar />
        <View style={styles.webContainer}>
          <Text style={styles.webTitle}>{notice.title}</Text>
          <TouchableOpacity style={styles.webOpenBtn} onPress={() => Linking.openURL(notice.url)}>
            <Text style={styles.webOpenText}>원본 페이지 열기 →</Text>
          </TouchableOpacity>
          <Text style={styles.webNote}>웹에서는 새 탭으로 원본 페이지가 열립니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ActionBar />
      <WebView
        source={{ uri: notice.url }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            color={colors.primary}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1 },
  actionBar: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaSource: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  metaDot: {
    fontSize: 13,
    color: colors.gray[400],
  },
  metaDate: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.gray[500],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  actionBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionIconActive: {
    opacity: 1,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.gray[600],
  },
  actionLabelActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  webContainer: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 28,
  },
  webOpenBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  webOpenText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  webNote: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.gray[400],
    textAlign: 'center',
  },
});

export default NoticeDetailScreen;
