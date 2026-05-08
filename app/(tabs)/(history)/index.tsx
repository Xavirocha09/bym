import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, PlatformColor } from 'react-native';
import { Stack, useFocusEffect, router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '@/components/common/GlassCard';
import { CautionBadge } from '@/components/common/CautionBadge';
import { Colors } from '@/constants/colors';
import { spacing } from '@/constants/theme';
import { HistoryItem, ScanType } from '@/types';
import { getHistory, deleteHistoryItem, clearHistory } from '@/utils/historyStorage';

const SCAN_SYMBOLS: Record<ScanType, string> = {
  profile: 'person.circle.fill',
  chat: 'bubble.left.and.bubble.right.fill',
  full: 'magnifyingglass.circle.fill',
};
const SCAN_LABELS: Record<ScanType, string> = {
  profile: 'Profile Scan',
  chat: 'Chat Scan',
  full: 'Full Scan',
};

function HistoryCard({ item, onDelete }: { item: HistoryItem; onDelete: (id: string) => void }) {
  const date = new Date(item.createdAt);
  return (
    <GlassCard padding={16}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <View style={{ width: 44, height: 44, borderRadius: 13, borderCurve: 'continuous', backgroundColor: Colors.teal.muted, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SymbolView name={SCAN_SYMBOLS[item.scanType] as any} size={22} tintColor={Colors.teal.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: PlatformColor('label') as any, letterSpacing: -0.3 }}>{SCAN_LABELS[item.scanType]}</Text>
          <Text style={{ fontSize: 12, color: PlatformColor('tertiaryLabel') as any, marginTop: 2 }}>
            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <SymbolView name="trash" size={17} tintColor={PlatformColor('quaternaryLabel') as any} />
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: spacing.md }} />
      <CautionBadge level={item.cautionLevel} size="sm" />
      <Text style={{ fontSize: 13, color: PlatformColor('secondaryLabel') as any, lineHeight: 18, letterSpacing: -0.1, marginTop: 8 }} numberOfLines={2}>
        {item.summary}
      </Text>
    </GlassCard>
  );
}

function EmptyState() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32 }}>
      <View style={{ width: 72, height: 72, borderRadius: 22, borderCurve: 'continuous', backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
        <SymbolView name="clock" size={34} tintColor={PlatformColor('quaternaryLabel') as any} />
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: PlatformColor('label') as any, letterSpacing: -0.5, marginBottom: spacing.sm }}>No scans yet</Text>
      <Text style={{ fontSize: 15, color: PlatformColor('secondaryLabel') as any, textAlign: 'center', lineHeight: 22, letterSpacing: -0.2 }}>
        Your completed scans will appear here. Run your first safety scan from the Home tab.
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useFocusEffect(useCallback(() => {
    getHistory().then(setHistory);
  }, []));

  async function handleDelete(id: string) {
    Alert.alert('Delete Scan', 'Remove this scan from history?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => setHistory(await deleteHistoryItem(id)) },
    ]);
  }

  function handleClearAll() {
    if (!history.length) return;
    Alert.alert('Clear All History', 'This will permanently delete all saved scans.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: async () => { await clearHistory(); setHistory([]); } },
    ]);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'History',
          headerRight: () => history.length > 0 ? (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={{ fontSize: 15, color: Colors.danger, fontWeight: '500' }}>Clear</Text>
            </TouchableOpacity>
          ) : undefined,
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={history}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
            <HistoryCard item={item} onDelete={handleDelete} />
          </Animated.View>
        )}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: Colors.bg.primary }}
      />
    </>
  );
}
