import React, { useEffect, useState, useCallback } from 'react';
import {
  View, FlatList, StyleSheet, ActivityIndicator,
  Text, TouchableOpacity, SafeAreaView, ScrollView,
} from 'react-native';
import { noticeApi } from '../../api';
import { Notice, NoticeCategory } from '../../types';
import NoticeCard from '../../components/common/NoticeCard';
import Header from '../../components/layout/Header';
import { colors, spacing, fonts } from '../../styles/tokens';

const CATEGORIES: { label: string; value?: NoticeCategory }[] = [
  { label: '전체' },
  { label: '학사', value: 'ACADEMIC' },
  { label: '장학', value: 'SCHOLARSHIP' },
  { label: '학과', value: 'DEPARTMENT' },
  { label: '취업', value: 'CAREER' },
  { label: '일반', value: 'GENERAL' },
  { label: '생활관', value: 'DORMITORY' },
];

const HomeScreen = ({ navigation }: any) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotices = useCallback(
    async (category?: NoticeCategory, pageNum = 0, isInitial = false) => {
      setLoading(true);
      try {
        const response = await noticeApi.getNotices(category, pageNum);
        const incoming = response.data.data.notices;
        setNotices((prev) => (isInitial ? incoming : [...prev, ...incoming]));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNotices(selectedCategory, 0, true);
  }, [selectedCategory, fetchNotices]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(0);
    fetchNotices(selectedCategory, 0, true);
  };

  const onEndReached = () => {
    if (!loading) {
      const next = page + 1;
      setPage(next);
      fetchNotices(selectedCategory, next);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="공지사항" showAlert />
      {/* 카테고리 필터 — underline 스타일 */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((item) => {
            const active = selectedCategory === item.value;
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.categoryItem}
                onPress={() => { setSelectedCategory(item.value); setPage(0); }}
              >
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                  {item.label}
                </Text>
                {active && <View style={styles.categoryUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        style={styles.list}
        data={notices}
        keyExtractor={(item) => item.noticeId.toString()}
        renderItem={({ item }) => (
          <NoticeCard
            notice={item}
            onPress={(notice) => navigation.navigate('NoticeDetail', { notice })}
          />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={loading ? <ActivityIndicator style={styles.loader} color={colors.primary} /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  categoryBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  categoryScroll: {
    paddingHorizontal: spacing.sm,
  },
  categoryItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.gray[500],
  },
  categoryTextActive: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  categoryUnderline: {
    position: 'absolute',
    bottom: 0,
    left: spacing.sm,
    right: spacing.sm,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  list: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  loader: {
    padding: spacing.md,
  },
});

export default HomeScreen;
