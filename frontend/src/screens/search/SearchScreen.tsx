import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { noticeApi } from '../../api';
import { Notice } from '../../types';
import NoticeCard from '../../components/common/NoticeCard';
import { colors, spacing, typography } from '../../styles/tokens';

const SearchScreen = ({ navigation }: any) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const response = await noticeApi.searchNotices(keyword);
      setResults(response.data.data.notices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="검색어를 입력하세요 (예: 장학)"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.noticeId.toString()}
          renderItem={({ item }) => (
            <NoticeCard
              notice={item}
              onPress={(notice) => navigation.navigate('NoticeDetail', { notice })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {keyword ? '검색 결과가 없습니다.' : '검색어를 입력하여 공지사항을 찾아보세요.'}
            </Text>
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
  searchBar: {
    padding: spacing.md,
    backgroundColor: colors.gray[100],
  },
  input: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  loader: {
    padding: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    color: colors.gray[500],
    ...typography.body2,
  },
});

export default SearchScreen;
