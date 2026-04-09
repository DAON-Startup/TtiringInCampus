import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Notice } from '../../types';
import { colors, spacing, fonts } from '../../styles/tokens';

interface NoticeCardProps {
  notice: Notice;
  onPress: (notice: Notice) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  ACADEMIC: '학사',
  SCHOLARSHIP: '장학',
  DEPARTMENT: '학과',
  CAREER: '취업',
  GENERAL: '일반',
  DORMITORY: '생활관',
  EXTRACURRICULAR: '비교과',
};

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(notice)} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {CATEGORY_LABELS[notice.category] ?? notice.category}
          </Text>
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
    minHeight: 80,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {} as any,
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.categoryBadge,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.white,
  },
  dateText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.gray[500],
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.gray[500],
  },
});

export default NoticeCard;
