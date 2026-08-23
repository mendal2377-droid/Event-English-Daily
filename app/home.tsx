import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '../constants/colors';
import { SCENARIOS, Category } from '../constants/scenarios';
import { ScenarioCard } from '../components/ScenarioCard';
import { NavBar } from '../components/ui/NavBar';
import { loadWeekProgress, WeekProgress, loadPlan, planDayNumber, PlanState, loadDailyProgress, DailyProgress } from '../lib/storage';
import { getPlanDay, PLAN_LENGTH } from '../constants/plan';
import { useApp } from '../context/AppContext';

const CATEGORIES: Array<'All' | Category> = ['All', 'On-Site', 'Business', 'Production', 'Travel'];

function daysUntil(isoDate: string): number | null {
  if (!isoDate) return null;
  const target = new Date(isoDate + 'T00:00:00');
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// Show-prep sequencing: what to rehearse based on how close the show is
function showFocus(days: number): { category: Category; en: string; cn: string } {
  if (days > 14) {
    return { category: 'Business', en: 'Prep phase — pitch, sponsors & negotiation', cn: '筹备期——提案、赞助与谈判' };
  }
  if (days > 3) {
    return { category: 'Production', en: 'Build-up — freight, AV & coordination', cn: '搭建期——物流、AV与协调' };
  }
  return { category: 'On-Site', en: 'Show week — briefings, booth & crisis', cn: '展会周——简报、展位与突发状况' };
}

export default function Home() {
  const router = useRouter();
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [progress, setProgress] = useState<WeekProgress | null>(null);
  const [plan, setPlan] = useState<PlanState | null>(null);
  const [daily, setDaily] = useState<DailyProgress | null>(null);
  const { chineseAssist, apiMode, showDate, showName, dailyGoal } = useApp();

  useEffect(() => {
    loadWeekProgress().then(setProgress);
  }, []);

  // Reload plan + daily progress each time Home regains focus (so completions reflect)
  useFocusEffect(useCallback(() => {
    loadPlan().then(setPlan);
    loadDailyProgress().then(setDaily);
  }, []));

  const dailyCount = daily?.count ?? 0;
  const dailyMet = dailyCount >= dailyGoal;

  const planDay = plan ? Math.min(planDayNumber(plan.startDate), PLAN_LENGTH) : 0;
  const planToday = plan ? getPlanDay(planDay) : undefined;
  const planDone = plan?.completedDays.length ?? 0;

  const daysLeft = daysUntil(showDate);
  const focus = daysLeft !== null && daysLeft >= 0 ? showFocus(daysLeft) : null;

  const filtered = filter === 'All'
    ? SCENARIOS
    : SCENARIOS.filter((s) => s.category === filter);

  const weekGoal = 5;
  const weekSessions = progress?.sessions ?? 0;
  const progressFraction = Math.min(weekSessions / weekGoal, 1);

  return (
    <SafeAreaView style={styles.bg} edges={['top']}>
      <NavBar rightLabel="Phrases" rightLabelCn="短语库" rightHref="/phrases" />

      {apiMode === 'mock' && (
        <View style={styles.mockBanner}>
          <View style={styles.mockDot} />
          <View>
            <Text style={styles.mockEn}>Mock Mode Active — no API key needed</Text>
            {chineseAssist && <Text style={styles.mockCn}>测试模式已开启，无需真实API密钥</Text>}
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Choose your scenario</Text>
          <Text style={styles.h1}>Practice Real <Text style={styles.h1Accent}>Work English</Text></Text>
          {chineseAssist && <Text style={styles.cnSub}>选择场景，开始练习真实工作英语</Text>}
          <Text style={styles.sub}>33 scenarios · tap mic to speak · get coached</Text>

          {/* Daily scene goal */}
          <View style={styles.dailyRow}>
            <View style={styles.dots}>
              {Array.from({ length: Math.min(dailyGoal, 8) }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i < dailyCount && styles.dotFilled]}
                />
              ))}
            </View>
            <Text style={[styles.dailyText, dailyMet && styles.dailyTextMet]}>
              {dailyMet
                ? `✓ Daily goal done — ${dailyCount} today`
                : `${dailyCount} / ${dailyGoal} scenes today`}
            </Text>
          </View>
        </View>

        {/* 30-Day Plan — the hero */}
        {plan && planToday ? (
          <Pressable style={styles.planCard} onPress={() => router.push('/plan')}>
            <View style={styles.planTop}>
              <Text style={styles.planDay}>Day {planDay}</Text>
              <Text style={styles.planOf}>/ {PLAN_LENGTH}</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.planDone}>{planDone} done</Text>
            </View>
            <View style={styles.planBar}>
              <View style={[styles.planFill, { width: `${(planDone / PLAN_LENGTH) * 100}%` }]} />
            </View>
            <Text style={styles.planTodayLbl}>
              TODAY · {plan.completedDays.includes(planDay) ? '✓ done' : plan.completedDays.length >= planDay ? 'caught up' : 'to do'}
            </Text>
            <Text style={styles.planTodayTitle}>
              {planToday.type === 'shadow' ? '🗣️ ' : ''}{planToday.title}
            </Text>
            {chineseAssist && <Text style={styles.planTodayCn}>{planToday.titleCn}</Text>}
            <Text style={styles.planCta}>Open plan →</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.planStart} onPress={() => router.push('/plan')}>
            <Text style={styles.planStartIcon}>🗓️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.planStartTitle}>Start the 30-Day Speaking Plan</Text>
              <Text style={styles.planStartSub}>
                One task a day toward your show{chineseAssist ? ' · 30天口语冲刺，无需联网' : ''}
              </Text>
            </View>
            <Text style={styles.countdownArrow}>→</Text>
          </Pressable>
        )}

        {/* Show countdown — the retention engine */}
        {focus && daysLeft !== null ? (
          <Pressable
            style={styles.countdown}
            onPress={() => setFilter(focus.category)}
          >
            <Text style={styles.countdownDays}>
              {daysLeft === 0 ? '🔥 SHOW DAY' : `🎯 ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.countdownTitle} numberOfLines={1}>
                {daysLeft === 0 ? 'Today is the day' : `until ${showName || 'your show'}`}
              </Text>
              <Text style={styles.countdownFocus}>{focus.en}</Text>
              {chineseAssist && <Text style={styles.countdownCn}>{focus.cn}</Text>}
            </View>
            <Text style={styles.countdownArrow}>→</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.setShowRow} onPress={() => router.push('/settings')}>
            <Text style={styles.setShowText}>🎯 Set your next show date — practice with a countdown</Text>
            {chineseAssist && <Text style={styles.setShowCn}>设置你的下一场展会日期，倒计时练习</Text>}
          </Pressable>
        )}

        {/* Shadowing drill entry */}
        <Pressable style={styles.shadowRow} onPress={() => router.push('/shadow')}>
          <Text style={styles.shadowIcon}>🗣️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.shadowTitle}>Shadowing drill — 2 minutes</Text>
            <Text style={styles.shadowSub}>
              Listen and repeat pro phrases aloud{chineseAssist ? ' · 听一句跟读一句' : ''}
            </Text>
          </View>
          <Text style={styles.countdownArrow}>→</Text>
        </Pressable>

        {/* Tools row: Glossary + Upgrade */}
        <View style={styles.toolsRow}>
          <Pressable style={styles.tool} onPress={() => router.push('/glossary')}>
            <Text style={styles.toolIcon}>📇</Text>
            <Text style={styles.toolTitle}>Glossary</Text>
            <Text style={styles.toolSub}>{chineseAssist ? '行业黑话卡' : 'Jargon cards'}</Text>
          </Pressable>
          <Pressable style={styles.tool} onPress={() => router.push('/upgrade')}>
            <Text style={styles.toolIcon}>✨</Text>
            <Text style={styles.toolTitle}>Upgrade</Text>
            <Text style={styles.toolSub}>{chineseAssist ? '话术变高级' : 'Phrase upgrade'}</Text>
          </Pressable>
        </View>

        {/* Industry pack row */}
        <View style={styles.packRow}>
          <Text style={styles.packLbl}>Pack:</Text>
          <Text style={styles.packActive}>🎪 Events ✓</Text>
          <Text style={styles.packLocked}>💼 Sales 🔒</Text>
          <Text style={styles.packLocked}>🏨 Hotels 🔒</Text>
        </View>

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
          {CATEGORIES.map((cat) => (
            <Pressable key={cat} style={[styles.filter, filter === cat && styles.filterActive]} onPress={() => setFilter(cat)}>
              <Text style={[styles.filterText, filter === cat && styles.filterTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Scenario cards */}
        <View style={styles.cards}>
          {filtered.map((scenario, i) => (
            <ScenarioCard key={scenario.id} scenario={scenario} featured={i === 0 && filter === 'All'} />
          ))}
        </View>

        {/* Weekly progress */}
        <View style={styles.progressRow}>
          <View>
            <Text style={styles.progressEn}>This week</Text>
            {chineseAssist && <Text style={styles.progressCn}>本周进度</Text>}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressFraction * 100}%` }]} />
          </View>
          <Text style={styles.progressCount}>{weekSessions}/{weekGoal}</Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  mockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6b2b0a',
    borderWidth: 1,
    borderColor: '#ff6b2b26',
    borderRadius: 8,
  },
  mockDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.orange },
  mockEn: { fontSize: 12, color: Colors.orange2 },
  mockCn: { fontSize: 10, color: Colors.orange, opacity: 0.7 },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, color: Colors.orange, textTransform: 'uppercase', marginBottom: 4 },
  h1: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  h1Accent: { color: Colors.orange, fontStyle: 'italic' },
  cnSub: { fontSize: 12, color: Colors.muted, marginBottom: 4 },
  sub: { fontSize: 12, color: Colors.dim, lineHeight: 18 },
  dailyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  dots: { flexDirection: 'row', gap: 5 },
  dot: {
    width: 9, height: 9, borderRadius: 5,
    borderWidth: 1.5, borderColor: Colors.border2, backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  dailyText: { fontSize: 11, color: Colors.muted, fontWeight: '600' },
  dailyTextMet: { color: Colors.green },
  packRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexWrap: 'wrap',
  },
  packLbl: { fontSize: 11, color: Colors.dim },
  packActive: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: '#ff6b2b0d',
    color: Colors.orange,
    borderWidth: 1,
    borderColor: '#ff6b2b22',
    overflow: 'hidden',
  },
  packLocked: {
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: Colors.card,
    color: Colors.dim,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  filtersScroll: { marginBottom: 4 },
  filters: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  filterActive: { borderColor: Colors.orange, backgroundColor: '#ff6b2b0a' },
  filterText: { fontSize: 12, color: Colors.dim },
  filterTextActive: { color: Colors.orange },
  cards: { paddingHorizontal: 16 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  progressEn: { fontSize: 11, color: Colors.muted },
  progressCn: { fontSize: 10, color: Colors.dim },
  progressBar: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.orange, borderRadius: 2 },
  progressCount: { fontSize: 12, color: Colors.orange, fontWeight: '600' },

  // Show countdown
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#ff6b2b10',
    borderWidth: 1,
    borderColor: '#ff6b2b30',
    borderRadius: 12,
  },
  countdownDays: { fontSize: 15, fontWeight: '800', color: Colors.orange },
  countdownTitle: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  countdownFocus: { fontSize: 11, color: Colors.orange2, marginTop: 2 },
  countdownCn: { fontSize: 10, color: Colors.muted, marginTop: 1 },
  countdownArrow: { fontSize: 16, color: Colors.orange },
  setShowRow: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 11,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 12,
  },
  setShowText: { fontSize: 12, color: Colors.muted },
  setShowCn: { fontSize: 10, color: Colors.dim, marginTop: 2 },

  // 30-Day Plan card
  planCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    backgroundColor: '#ff6b2b12',
    borderWidth: 1,
    borderColor: '#ff6b2b38',
    borderRadius: 14,
  },
  planTop: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  planDay: { fontSize: 20, fontWeight: '800', color: Colors.orange },
  planOf: { fontSize: 12, color: Colors.muted },
  planDone: { fontSize: 11, color: Colors.orange2, fontWeight: '600' },
  planBar: {
    height: 5, backgroundColor: Colors.border, borderRadius: 3,
    overflow: 'hidden', marginTop: 10, marginBottom: 10,
  },
  planFill: { height: '100%', backgroundColor: Colors.orange, borderRadius: 3 },
  planTodayLbl: { fontSize: 9, letterSpacing: 1, color: Colors.orange, fontWeight: '700' },
  planTodayTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginTop: 3 },
  planTodayCn: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  planCta: { fontSize: 12, color: Colors.orange, marginTop: 8, fontWeight: '600' },
  planStart: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 10, padding: 13,
    backgroundColor: '#ff6b2b0d', borderWidth: 1, borderColor: '#ff6b2b30',
    borderRadius: 14,
  },
  planStartIcon: { fontSize: 22 },
  planStartTitle: { fontSize: 14, fontWeight: '700', color: Colors.orange2 },
  planStartSub: { fontSize: 10.5, color: Colors.muted, marginTop: 2 },

  // Shadowing entry
  shadowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#00d4c80a',
    borderWidth: 1,
    borderColor: '#00d4c822',
    borderRadius: 12,
  },
  shadowIcon: { fontSize: 20 },
  shadowTitle: { fontSize: 13, fontWeight: '600', color: Colors.cyan },
  shadowSub: { fontSize: 10, color: Colors.muted, marginTop: 2 },

  // Tools row (Glossary + Upgrade)
  toolsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 12 },
  tool: {
    flex: 1, backgroundColor: '#9b7aff0c', borderWidth: 1, borderColor: '#9b7aff2c',
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, alignItems: 'flex-start',
  },
  toolIcon: { fontSize: 20, marginBottom: 5 },
  toolTitle: { fontSize: 13, fontWeight: '700', color: Colors.violet },
  toolSub: { fontSize: 10, color: Colors.muted, marginTop: 1 },
});
