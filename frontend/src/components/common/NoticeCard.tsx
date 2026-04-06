import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Notice } from '../../types';
import { colors, spacing, typography } from '../../styles/tokens';

interface NoticeCardProps {
  notice: Notice;
  onPress: (notice: Notice) => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(notice)}>
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{notice.category}</Text>
        </View>
        <Text style={styles.dateText}>{notice.postedDate}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {notice.title}
      </Text>
      <Text style={styles.sourceText}>{notice.sourceName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  categoryContainer: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  dateText: {
    ...typography.caption,
  },
  title: {
    ...typography.body1,
    marginBottom: spacing.xs,
  },
  sourceText: {
    ...typography.caption,
    color: colors.gray[500],
  },
});

export default NoticeCard;
