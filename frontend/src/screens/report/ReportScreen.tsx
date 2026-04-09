import React, { useEffect, useState } from 'react';
import {
  View, FlatList, StyleSheet, Text,
  ActivityIndicator, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { reportApi } from '../../api';
import { AiReport } from '../../types';
import Header from '../../components/layout/Header';
import { colors, spacing, fonts } from '../../styles/tokens';

const ReportScreen = () => {
  const [reports, setReports] = useState<AiReport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportApi.getReports();
      setReports(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="AI 리포트" />
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.reportId.toString()}
          contentContainerStyle={reports.length === 0 ? styles.emptyContainer : styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <View style={styles.cardHeader}>
                <Text style={styles.dateLabel}>✨ AI 요약</Text>
                <Text style={styles.dateText}>{item.reportDate}</Text>
              </View>
              <Text style={styles.summaryText}>{item.summaryContent}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyTitle}>아직 AI 리포트가 없습니다</Text>
              <Text style={styles.emptyDesc}>매일 아침 공지사항을 AI가 요약해 드립니다.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.gray[100] },
  loader: { padding: 40 },
  emptyContainer: { flex: 1 },
  listContent: { paddingVertical: spacing.sm },
  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 12,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  dateText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.gray[500],
  },
  summaryText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[700],
    lineHeight: 22,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: { fontSize: 52, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ReportScreen;
