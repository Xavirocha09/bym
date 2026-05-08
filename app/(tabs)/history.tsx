import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { CautionBadge } from '@/components/common/CautionBadge';
import { Colors } from '@/constants/colors';
import { fontSize, fontWeight, spacing, radius } from '@/constants/theme';
import { HistoryItem, ScanType } from '@/types';
import { getHistory, deleteHistoryItem, clearHistory } from '@/utils/historyStorage';

type IoniconName = keyof typeof Ionicons.glyphMap;

const SCAN_ICONS: Record<ScanType, IoniconName> = {
  profile: 'person-circle',
  chat: 'chatbubbles',
  full: 'search-circle',
};

const SCAN_LABELS: Record<ScanType, string> = {
  profile: 'Profile Scan',
  chat: 'Chat Scan',
  full: 'Full Scan',
};

function HistoryCard({ item, onDelete }: { item: HistoryItem; onDelete: (id: string) => void }) {
  const date = new Date(item.createdAt);
  const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <GlassCard padding={16} style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.cardIcon, { backgroundColor: Colors.teal.muted }]}>
          <Ionicons name={SCAN_ICONS[item.scanType]} size={22} color={Colors.teal.primary} />
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardType}>{SCAN_LABELS[item.scanType]}</Text>
          <Text style={styles.cardDate}>{dateStr} · {timeStr}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDelete(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color={Colors.text.disabled} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardDivider} />
      <View style={styles.cardBottom}>
        <CautionBadge level={item.cautionLevel} size="sm" />
        <Text style={styles.cardSummary} numberOfLines={2}>
          {item.summary}
        </Text>
      </View>
    </GlassCard>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="time-outline" size={40} color={Colors.text.disabled} />
      </View>
      <Text style={styles.emptyTitle}>No scans yet</Text>
      <Text style={styles.emptySubtitle}>
        Your completed scans will appear here. Run your first safety scan from the Home tab.
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      getHistory().then(setHistory);
    }, [])
  );

  async function handleDelete(id: string) {
    Alert.alert('Delete Scan', 'Remove this scan from history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = await deleteHistoryItem(id);
          setHistory(updated);
        },
      },
    ]);
  }

  function handleClearAll() {
    if (history.length === 0) return;
    Alert.alert('Clear All History', 'This will permanently delete all your saved scans.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  }

  return (
    <LinearGradient colors={[Colors.bg.primary, Colors.bg.tertiary]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Ionicons name="time" size={22} color={Colors.teal.primary} />
            </View>
            <View>
              <Text style={styles.screenLabel}>Scan History</Text>
              <Text style={styles.screenTitle}>
                {history.length} {history.length === 1 ? 'scan' : 'scans'}
              </Text>
            </View>
          </View>
          {history.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll} activeOpacity={0.7}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
              <HistoryCard item={item} onDelete={handleDelete} />
            </Animated.View>
          )}
          ListEmptyComponent={<EmptyState />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: Colors.teal.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenLabel: {
    fontSize: fontSize.xs,
    color: Colors.teal.primary,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    color: Colors.text.primary,
    letterSpacing: -0.6,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearText: {
    fontSize: fontSize.sm,
    color: Colors.danger,
    fontWeight: fontWeight.medium,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: { marginBottom: 0 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: { flex: 1 },
  cardType: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  cardDate: {
    fontSize: fontSize.xs,
    color: Colors.text.muted,
    marginTop: 2,
  },
  deleteBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.separator,
    marginBottom: spacing.md,
  },
  cardBottom: {
    gap: spacing.sm,
  },
  cardSummary: {
    fontSize: fontSize.sm,
    color: Colors.text.muted,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: Colors.card.border,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.base,
    color: Colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: -0.2,
  },
});
