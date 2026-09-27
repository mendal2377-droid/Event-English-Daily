import React, { useEffect, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';
import {
  isOnboardingDone, setOnboardingDone, isDeviceCheckSeen, startPlan,
} from '../lib/storage';
import { useApp } from '../context/AppContext';

const SHOW_PRESETS = [
  { label: '1 week', cn: '1周后', days: 7 },
  { label: '2 weeks', cn: '2周后', days: 14 },
  { label: '1 month', cn: '1个月后', days: 30 },
  { label: '3 months', cn: '3个月后', days: 90 },
  { label: 'No date yet', cn: '还没定', days: -1 },
];

function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Onboarding() {
  const router = useRouter();
  const { settingsLoaded, chineseAssist, setUserName, setShowDate, setShowName } = useApp();

  const [name, setName] = useState('');
  const [showTitle, setShowTitle] = useState('');
  const [preset, setPreset] = useState<number | null>(null); // index into SHOW_PRESETS

  useEffect(() => {
    if (!settingsLoaded) return;
    isOnboardingDone().then(async (done) => {
      if (!done) return;
      const checked = await isDeviceCheckSeen();
      router.replace(checked ? '/home' : '/device-check');
    });
  }, [settingsLoaded, router]);

  async function finish() {
    if (name.trim()) setUserName(name.trim());

    if (preset !== null && SHOW_PRESETS[preset].days >= 0) {
      const days = SHOW_PRESETS[preset].days;
      setShowDate(isoInDays(days));
      setShowName(showTitle.trim());
      await startPlan(); // anchor the 30-day plan to today
    }

    await setOnboardingDone();
    router.replace('/device-check');
  }

  const steps = [
    { num: '1', en: 'Pick a real work scenario', cn: '选择一个真实工作场景' },
    { num: '2', en: 'Speak your reply (or type it)', cn: '用英语说出你的回答（也可打字）' },
    { num: '3', en: 'Get instant AI coaching · hear it', cn: '获得即时AI教练反馈，点击听发音' },
  ];

  return (
    <View style={styles.bg}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.glow} />

        <Text style={styles.icon}>🎤</Text>
        <Text style={styles.tag}>◈ ON STAGE</Text>
        <Text style={styles.h1}>Your English{'\n'}<Text style={styles.h1Accent}>Rehearsal Room</Text></Text>
        <Text style={styles.cnSub}>你的英语口语练习室</Text>
        <Text style={styles.sub}>Real event work conversations. Speak, get coached, improve.</Text>

        {/* How it works */}
        <View style={styles.steps}>
          {steps.map((step) => (
            <View key={step.num} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.num}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepEn}>{step.en}</Text>
                {chineseAssist && <Text style={styles.stepCn}>{step.cn}</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* Personalize */}
        <View style={styles.field}>
          <Text style={styles.label}>What should we call you? <Text style={styles.optional}>(optional)</Text></Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name / 你的名字"
            placeholderTextColor={Colors.dim}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>When's your next show or trip?</Text>
          {chineseAssist && <Text style={styles.labelCn}>你的下一场展会或出差是什么时候？</Text>}
          <TextInput
            style={styles.input}
            value={showTitle}
            onChangeText={setShowTitle}
            placeholder="Show name, e.g. CES, Frankfurt… (optional)"
            placeholderTextColor={Colors.dim}
            autoCapitalize="words"
          />
          <View style={styles.presets}>
            {SHOW_PRESETS.map((p, i) => (
              <Pressable
                key={p.label}
                style={[styles.preset, preset === i && styles.presetSel]}
                onPress={() => setPreset(i)}
              >
                <Text style={[styles.presetText, preset === i && styles.presetTextSel]}>{p.label}</Text>
                {chineseAssist && (
                  <Text style={[styles.presetCn, preset === i && styles.presetTextSel]}>{p.cn}</Text>
                )}
              </Pressable>
            ))}
          </View>
          {preset !== null && SHOW_PRESETS[preset].days >= 0 && (
            <Text style={styles.planNote}>
              ✓ We'll start your 30-day plan and count down to the day.
              {chineseAssist ? ' 我们会为你开启30天计划并倒计时。' : ''}
            </Text>
          )}
        </View>

        <Pressable style={styles.btn} onPress={finish}>
          <Text style={styles.btnText}>Start Practicing →</Text>
        </Pressable>

        <Pressable onPress={finish}>
          <Text style={styles.skip}>{chineseAssist ? '跳过，稍后设置' : 'Skip for now'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },
  glow: {
    position: 'absolute',
    top: -20,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ff6b2b10',
  },
  icon: { fontSize: 52, marginBottom: 12 },
  tag: { fontSize: 11, letterSpacing: 2, color: Colors.orange, textTransform: 'uppercase', marginBottom: 10 },
  h1: { fontSize: 30, fontWeight: '700', color: Colors.text, textAlign: 'center', lineHeight: 38, marginBottom: 6 },
  h1Accent: { color: Colors.orange, fontStyle: 'italic' },
  cnSub: { fontSize: 14, color: Colors.muted, textAlign: 'center', marginBottom: 6 },
  sub: { fontSize: 12.5, color: Colors.dim, textAlign: 'center', lineHeight: 19, marginBottom: 26 },

  steps: { width: '100%', gap: 8, marginBottom: 24 },
  step: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12,
  },
  stepNum: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: Colors.orange,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  stepNumText: { fontSize: 11, color: Colors.orange, fontWeight: '700' },
  stepBody: { flex: 1 },
  stepEn: { fontSize: 13, color: Colors.text, lineHeight: 19, fontWeight: '500' },
  stepCn: { fontSize: 11, color: Colors.dim, lineHeight: 16, marginTop: 2 },

  field: { width: '100%', marginBottom: 18 },
  label: { fontSize: 13, color: Colors.text, fontWeight: '600', marginBottom: 6 },
  labelCn: { fontSize: 11, color: Colors.muted, marginBottom: 6, marginTop: -4 },
  optional: { fontSize: 11, color: Colors.dim, fontWeight: '400' },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.text,
  },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  preset: {
    borderWidth: 1, borderColor: Colors.border2, borderRadius: 9,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center',
  },
  presetSel: { borderColor: Colors.orange, backgroundColor: '#ff6b2b0f' },
  presetText: { fontSize: 12, color: Colors.muted, fontWeight: '600' },
  presetCn: { fontSize: 9, color: Colors.dim, marginTop: 1 },
  presetTextSel: { color: Colors.orange },
  planNote: { fontSize: 11, color: Colors.green, marginTop: 10, lineHeight: 16 },

  btn: {
    width: '100%', backgroundColor: Colors.orange, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 14,
    shadowColor: Colors.orange, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  skip: { fontSize: 13, color: Colors.dim },
});
