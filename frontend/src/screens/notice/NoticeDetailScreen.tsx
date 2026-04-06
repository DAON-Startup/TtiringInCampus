import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Platform, Linking } from 'react-native';
import { colors, spacing, typography } from '../../styles/tokens';

// WebView는 웹 플랫폼에서 지원되지 않으므로 조건부 import
let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

const NoticeDetailScreen = ({ route }: any) => {
  const { notice } = route.params;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>{notice.title}</Text>
        <Text style={styles.webMeta}>{notice.sourceName} · {notice.postedDate}</Text>
        <TouchableOpacity
          style={styles.webLinkButton}
          onPress={() => Linking.openURL(notice.url)}
        >
          <Text style={styles.webLinkText}>원본 공지 열기 →</Text>
        </TouchableOpacity>
        <Text style={styles.webNote}>웹 브라우저에서는 새 탭으로 원본 페이지가 열립니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: notice.url }}
        startInLoadingState
        renderLoading={() => <ActivityIndicator style={styles.loader} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%' as any,
    left: '50%' as any,
    marginLeft: -20,
    marginTop: -20,
  },
  webContainer: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webTitle: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.black,
  },
  webMeta: {
    ...typography.caption,
    color: colors.gray[500],
    marginBottom: spacing.xl,
  },
  webLinkButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  webLinkText: {
    color: colors.white,
    ...typography.body1,
  },
  webNote: {
    ...typography.caption,
    color: colors.gray[400],
    textAlign: 'center',
  },
});

export default NoticeDetailScreen;
