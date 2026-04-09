import React, { useState } from 'react';
import {
  View, TextInput, FlatList, StyleSheet,
  Text, ActivityIndicator, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { noticeApi } from '../../api';
import { Notice } from '../../types';
import NoticeCard from '../../components/common/NoticeCard';
import Header from '../../components/layout/Header';
import { colors, spacing, fonts } from '../../styles/tokens';

const SearchScreen = ({ navigation }: any) => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
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
    <SafeAreaView style={styles.safeArea}>
      <Header title="검색" />
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="검색어를 입력하세요 (예: 장학금)"
          placeholderTextColor={colors.gray[400]}
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>검색</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.noticeId.toString()}
          contentContainerStyle={results.length === 0 ? styles.emptyContainer : styles.listContent}
          renderItem={({ item }) => (
            <NoticeCard
              notice={item}
              onPress={(notice) => navigation.navigate('NoticeDetail', { notice })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>{searched ? '😔' : '🔍'}</Text>
              <Text style={styles.emptyText}>
                {searched ? '검색 결과가 없습니다.' : '검색어를 입력해 공지사항을 찾아보세요.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.gray[100] },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  searchBtnText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  loader: { padding: spacing.xl },
  emptyContainer: { flex: 1 },
  listContent: { paddingVertical: spacing.sm },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default SearchScreen;
