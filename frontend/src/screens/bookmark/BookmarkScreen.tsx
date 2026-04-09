import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { bookmarkApi } from '../../api';
import { Bookmark } from '../../types';
import NoticeCard from '../../components/common/NoticeCard';
import Header from '../../components/layout/Header';
import { colors, spacing, fonts } from '../../styles/tokens';

const BookmarkScreen = ({ navigation }: any) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const response = await bookmarkApi.getBookmarks();
      setBookmarks(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchBookmarks);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="북마크" />
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.bookmarkId.toString()}
          contentContainerStyle={bookmarks.length === 0 ? styles.emptyContainer : styles.listContent}
          renderItem={({ item }) => (
            <NoticeCard
              notice={item.notice}
              onPress={(notice) => navigation.navigate('NoticeDetail', { notice })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🔖</Text>
              <Text style={styles.emptyTitle}>저장한 공지가 없습니다</Text>
              <Text style={styles.emptyDesc}>공지사항 상세에서 저장 버튼을 눌러 보관하세요.</Text>
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

export default BookmarkScreen;
