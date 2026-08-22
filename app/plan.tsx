// 30-Day Speaking Plan screen — a no-API, day-by-day countdown program.
// Sequences the existing scenarios + shadowing drills toward a show abroad.

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '../constants/colors';
import { THIRTY_DAY_PLAN, PlanDay, PLAN_LENGTH } from '../constants/plan';
import {
  loadPlan, startPlan, resetPlan, markPlanDayDone, planDayNumber, PlanState,
} from '../lib/storage';
import { useApp } from '../context/AppContext';

export default function Plan() {
  const router = useRouter();
  const { chineseAssist } = useApp();
  const [plan, setPlan] = useState<PlanState | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    loadPlan().then((p) => {
      setPlan(p);
      setLoaded(true);
    });
  }, []);

  useEffect(refresh, [refresh]);
  // Re-check completion when returning from a practice session
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const currentDay = plan ? Math.min(planDayNumber(plan.startDate), PLAN_LENGTH) : 0;
  const doneCount = plan?.completedDays.length ?? 0;

  async function handleStart() {
    const p = await startPlan();
    setPlan(p);
  }
  async function handleReset() {
    await resetPlan();
    setPlan(null);
  }

  function launchDay(d: PlanDay) {
    if (d.type === 'shadow') router.push('/shadow');
    else if (d.scenarioId) router.push(`/practice/${d.scenarioId}`);
  }

  async function toggleDone(day: number) {
    if (!plan) return;
    if (plan.completedDays.includes(day)) {
      const next = { ...plan, completedDays: plan.completedDays.filter((x) => x !== day) };
      setPlan(next);
      // persist by rewriting via markPlanDayDone's inverse — simplest: reset+save
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('@onstage/plan', JSON.stringify(next));
    } else {
      const updated = await markPlanDayDone(day);
      if (updated) setPlan({ ...updated });
    }
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🗓️ 30-Day Plan</Text>
          {chineseAssist && <Text style={styles.headerCn}>30天口语冲刺计划 — 无需联网</Text>}
        </View>
      </View>

      {!loaded ? null : !plan ? (
        /* ── Not started ── */
        <ScrollView contentContainerStyle={styles.introWrap}>
          <Text style={styles.introEmoji}>🇩🇪</Text>
          <Text style={styles.introTitle}>Ready for your show in 30 days?</Text>
          {chineseAssist && <Text style={styles.introCn}>30天后出发？我们一起准备好。</Text>}
          <Text style={styles.introBody}>
            One focused speaking task a day. It builds from first impressions →
            deals → build-up → show week — so you walk in ready. No internet or
            API key needed.
          </Text>
          {chineseAssist && (
            <Text style={styles.introBodyCn}>
              每天一个口语任务，从第一印象 → 谈判 → 搭建期 → 展会周，循序渐进。
              全程无需联网或API。
            </Text>
          )}
          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start Day 1 →</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        /* ── Active plan ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Progress hero */}
          <View style={styles.hero}>
            <View style={styles.heroRow}>
              <Text style={styles.heroDay}>Day {currentDay}</Text>
              <Text style={styles.heroOf}>of {PLAN_LENGTH}</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.heroDone}>{doneCount}/{PLAN_LENGTH} done</Text>
            </View>
            <View style={styles.heroBar}>
              <View style={[styles.heroFill, { width: `${(doneCount / PLAN_LENGTH) * 100}%` }]} />
            </View>
            <Text style={styles.heroSub}>
              {PLAN_LENGTH - currentDay > 0
                ? `${PLAN_LENGTH - currentDay} days until showtime`
                : 'Showtime — you\'re ready!'}
            </Text>
          </View>

          {/* Day list */}
          {THIRTY_DAY_PLAN.map((d) => {
            const done = plan.completedDays.includes(d.day);
            const isToday = d.day === currentDay;
            const locked = d.day > currentDay;
            return (
              <View
                key={d.day}
                style={[
                  styles.dayCard,
                  isToday && styles.dayCardToday,
                  done && styles.dayCardDone,
                ]}
              >
                {/* Check circle */}
                <TouchableOpacity
                  onPress={() => toggleDone(d.day)}
                  style={[styles.check, done && styles.checkDone]}
                >
                  {done ? (
                    <Text style={styles.checkMark}>✓</Text>
                  ) : (
                    <Text style={styles.checkNum}>{d.day}</Text>
                  )}
                </TouchableOpacity>

                {/* Body */}
                <View style={{ flex: 1 }}>
                  <View style={styles.dayTop}>
                    <Text style={[styles.dayPhase, isToday && styles.dayPhaseToday]}>
                      {d.phase.toUpperCase()}
                    </Text>
                    {d.type === 'shadow' && <Text style={styles.shadowTag}>🗣️ shadow</Text>}
                    {isToday && <Text style={styles.todayTag}>TODAY</Text>}
                  </View>
                  <Text style={styles.dayTitle}>{d.title}</Text>
                  {chineseAssist && <Text style={styles.dayTitleCn}>{d.titleCn}</Text>}
                  <Text style={styles.dayTip}>{d.tip}</Text>
                  {chineseAssist && <Text style={styles.dayTipCn}>{d.tipCn}</Text>}

                  <TouchableOpacity
                    style={[styles.dayBtn, locked && styles.dayBtnLocked]}
                    onPress={() => launchDay(d)}
                  >
                    <Text style={[styles.dayBtnText, locked && styles.dayBtnTextLocked]}>
                      {done ? 'Practise again' : locked ? 'Start early' : 'Start →'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetText}>Reset plan</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 14, color: Colors.muted },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  headerCn: { fontSize: 10, color: Colors.muted, marginTop: 1 },

  // Intro
  introWrap: { padding: 28, alignItems: 'center', paddingTop: 40 },
  introEmoji: { fontSize: 52, marginBottom: 16 },
  introTitle: { fontSize: 21, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  introCn: { fontSize: 13, color: Colors.muted, marginTop: 6, textAlign: 'center' },
  introBody: { fontSize: 13, color: Colors.muted, lineHeight: 20, textAlign: 'center', marginTop: 18 },
  introBodyCn: { fontSize: 11.5, color: Colors.dim, lineHeight: 18, textAlign: 'center', marginTop: 8 },
  startBtn: {
    marginTop: 28, backgroundColor: Colors.orange, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 40,
    shadowColor: Colors.orange, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  startBtnText: { fontSize: 16, color: '#fff', fontWeight: '700' },

  // Hero
  hero: {
    margin: 16, padding: 16, borderRadius: 14,
    backgroundColor: '#ff6b2b10', borderWidth: 1, borderColor: '#ff6b2b30',
  },
  heroRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  heroDay: { fontSize: 24, fontWeight: '800', color: Colors.orange },
  heroOf: { fontSize: 13, color: Colors.muted },
  heroDone: { fontSize: 12, color: Colors.orange2, fontWeight: '600' },
  heroBar: {
    height: 6, backgroundColor: Colors.border, borderRadius: 3,
    overflow: 'hidden', marginTop: 12,
  },
  heroFill: { height: '100%', backgroundColor: Colors.orange, borderRadius: 3 },
  heroSub: { fontSize: 11, color: Colors.muted, marginTop: 8 },

  // Day card
  dayCard: {
    flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 10,
    padding: 12, borderRadius: 12,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  dayCardToday: { borderColor: Colors.orange, backgroundColor: '#ff6b2b08' },
  dayCardDone: { opacity: 0.7 },
  check: {
    width: 30, height: 30, borderRadius: 15, marginTop: 2,
    borderWidth: 1.5, borderColor: Colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  checkDone: { backgroundColor: Colors.green, borderColor: Colors.green },
  checkMark: { fontSize: 15, color: '#04120c', fontWeight: '800' },
  checkNum: { fontSize: 12, color: Colors.muted, fontWeight: '700' },
  dayTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  dayPhase: { fontSize: 9, letterSpacing: 1, color: Colors.dim, fontWeight: '700' },
  dayPhaseToday: { color: Colors.orange },
  shadowTag: { fontSize: 9, color: Colors.cyan },
  todayTag: {
    fontSize: 8, color: '#fff', backgroundColor: Colors.orange,
    paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4, overflow: 'hidden', fontWeight: '700',
  },
  dayTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  dayTitleCn: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  dayTip: { fontSize: 11, color: Colors.muted, marginTop: 5, lineHeight: 16 },
  dayTipCn: { fontSize: 10, color: Colors.dim, marginTop: 2, lineHeight: 15 },
  dayBtn: {
    alignSelf: 'flex-start', marginTop: 9,
    backgroundColor: '#ff6b2b12', borderWidth: 1, borderColor: '#ff6b2b30',
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6,
  },
  dayBtnLocked: { backgroundColor: 'transparent', borderColor: Colors.border2 },
  dayBtnText: { fontSize: 12, color: Colors.orange, fontWeight: '600' },
  dayBtnTextLocked: { color: Colors.dim },

  resetBtn: { alignItems: 'center', marginTop: 10 },
  resetText: { fontSize: 12, color: Colors.dim, textDecorationLine: 'underline' },
});
