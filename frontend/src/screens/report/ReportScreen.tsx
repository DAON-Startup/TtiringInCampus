import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { reportApi } from '../../api';
import { AiReport } from '../../types';
import { colors, spacing, typography } from '../../styles/tokens';

const ReportScreen = ({ navigation }: any) => {
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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.reportId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.reportItem}>
              <Text style={styles.dateText}>{item.reportDate}</Text>
              <Text style={styles.summaryText} numberOfLines={3}>
                {item.summaryContent}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>아직 생성된 AI 리포트가 없습니다.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loader: {
    padding: spacing.xl,
  },
  reportItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  dateText: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  summaryText: {
    ...typography.body2,
    color: colors.gray[700],
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    color: colors.gray[500],
    ...typography.body2,
  },
});

export default ReportScreen;
