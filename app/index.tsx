import React, { useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';
import { isOnboardingDone, setOnboardingDone, isDeviceCheckSeen } from '../lib/storage';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const router = useRouter();
  const { settingsLoaded } = useApp();

  useEffect(() => {
    if (!settingsLoaded) return;
    isOnboardingDone().then(async (done) => {
      if (!done) return;
      // Returning user: show the device check once, then home
      const checked = await isDeviceCheckSeen();
      router.replace(checked ? '/home' : '/device-check');
    });
  }, [settingsLoaded, router]);

  async function handleStart() {
    await setOnboardingDone();
    // First run → device check, which continues to home
    router.replace('/device-check');
  }

  const steps = [
    { num: '1', en: 'Pick a real scenario', cn: '选择一个真实工作场景' },
    { num: '2', en: 'Hold & speak in English', cn: '按住麦克风，用英语说话' },
    { num: '3', en: 'Get a coach note. Tap to hear.', cn: '收到教练反馈，点击听发音' },
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

        <View style={styles.steps}>
          {steps.map((step) => (
            <View key={step.num} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.num}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepEn}>{step.en}</Text>
                <Text style={styles.stepCn}>{step.cn}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.btn} onPress={handleStart}>
          <Text style={styles.btnText}>Start Practicing →</Text>
        </Pressable>

        <Pressable onPress={handleStart}>
          <Text style={styles.skip}>跳过介绍</Text>
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
    paddingHorizontal: 28,
    paddingTop: 80,
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
  icon: { fontSize: 56, marginBottom: 16 },
  tag: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.orange,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 6,
  },
  h1Accent: { color: Colors.orange, fontStyle: 'italic' },
  cnSub: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: Colors.dim,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 36,
  },
  steps: { width: '100%', gap: 10, marginBottom: 32 },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumText: { fontSize: 11, color: Colors.orange, fontWeight: '700' },
  stepBody: { flex: 1 },
  stepEn: { fontSize: 13, color: Colors.text, lineHeight: 20, fontWeight: '500' },
  stepCn: { fontSize: 11, color: Colors.dim, lineHeight: 17, marginTop: 2 },
  btn: {
    width: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  skip: { fontSize: 13, color: Colors.dim },
});
