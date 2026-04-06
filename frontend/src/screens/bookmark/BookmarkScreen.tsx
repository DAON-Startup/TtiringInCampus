import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { bookmarkApi } from '../../api';
import { Bookmark } from '../../types';
import NoticeCard from '../../components/common/NoticeCard';
import { colors, spacing, typography } from '../../styles/tokens';

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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookmarks();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.bookmarkId.toString()}
          renderItem={({ item }) => (
            <NoticeCard
              notice={item.notice}
              onPress={(notice) => navigation.navigate('NoticeDetail', { notice })}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>보관된 공지사항이 없습니다.</Text>
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
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    color: colors.gray[500],
    ...typography.body2,
  },
});

export default BookmarkScreen;
