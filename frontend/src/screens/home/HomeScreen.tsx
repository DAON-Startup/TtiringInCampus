import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { noticeApi } from '../../api';
import { Notice, NoticeCategory } from '../../types';
import NoticeCard from '../../components/common/NoticeCard';
import { colors, spacing, typography } from '../../styles/tokens';

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

  const fetchNotices = useCallback(async (category?: NoticeCategory, pageNum: number = 0, isInitial: boolean = false) => {
    setLoading(true);
    try {
      const response = await noticeApi.getNotices(category, pageNum);
      if (isInitial) {
        setNotices(response.data.data.notices);
      } else {
        setNotices((prev) => [...prev, ...response.data.data.notices]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotices(selectedCategory, nextPage);
    }
  };

  const handleCategoryPress = (category?: NoticeCategory) => {
    setSelectedCategory(category);
    setPage(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.categoryList}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item.value && styles.categoryItemActive,
              ]}
              onPress={() => handleCategoryPress(item.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.value && styles.categoryTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
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
        ListFooterComponent={loading ? <ActivityIndicator style={styles.loader} /> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  categoryList: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  categoryItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
  },
  categoryItemActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    ...typography.body2,
    color: colors.gray[700],
  },
  categoryTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  loader: {
    padding: spacing.md,
  },
});

export default HomeScreen;
