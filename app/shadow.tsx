// Shadowing mode: listen to a pro phrase, repeat it aloud, advance.
// Real speaking practice with no speech recognition required —
// the classic interpreter-training technique.

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { SCENARIOS } from '../constants/scenarios';
import { loadPhrases, Phrase } from '../lib/storage';
import { speakText, stopSpeaking } from '../lib/tts';
import { useApp } from '../context/AppContext';

interface ShadowItem {
  en: string;
  cn: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_SIZE = 10;

export default function Shadow() {
  const router = useRouter();
  const { chineseAssist, slowMode } = useApp();
  const [bankPhrases, setBankPhrases] = useState<Phrase[]>([]);
  const [index, setIndex] = useState(0);
  const [saidCount, setSaidCount] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadPhrases().then((p) => {
      setBankPhrases(p);
      setLoaded(true);
    });
    return () => {
      stopSpeaking();
    };
  }, []);

  // Round = user's saved phrases first, topped up with scenario hints
  const items: ShadowItem[] = useMemo(() => {
    if (!loaded) return [];
    const fromBank: ShadowItem[] = bankPhrases.map((p) => ({ en: p.en, cn: p.cn }));
    const fromHints: ShadowItem[] = SCENARIOS.flatMap((s) => s.hints);
    const combined = [...shuffle(fromBank), ...shuffle(fromHints)];
    // De-dupe by English text
    const seen = new Set<string>();
    const unique = combined.filter((it) => {
      if (seen.has(it.en)) return false;
      seen.add(it.en);
      return true;
    });
    return unique.slice(0, ROUND_SIZE);
  }, [loaded, bankPhrases]);

  const current = items[index];
  const done = loaded && (index >= items.length || items.length === 0);

  async function playCurrent() {
    if (!current) return;
    setSpeaking(true);
    const result = await speakText(current.en, slowMode);
    setSpeaking(false);
    if (!result.ok && result.reason === 'no-english-voice') {
      Alert.alert(
        'No English voice installed 未安装英文语音',
        'Install "Google Text-to-Speech" and download the English (US) voice in your phone\'s Text-to-speech settings.\n\n' +
          '请安装「Google 文字转语音」并在手机的文字转语音设置中下载英语（美国）语音包。',
      );
    }
  }

  function handleSaidIt() {
    stopSpeaking();
    setSpeaking(false);
    setSaidCount((c) => c + 1);
    setIndex((i) => i + 1);
  }

  function handleSkip() {
    stopSpeaking();
    setSpeaking(false);
    setIndex((i) => i + 1);
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🗣️ Shadowing</Text>
          {chineseAssist && <Text style={styles.headerCn}>跟读训练 — 听一句，大声跟读一句</Text>}
        </View>
        {!done && items.length > 0 && (
          <Text style={styles.counter}>{Math.min(index + 1, items.length)}/{items.length}</Text>
        )}
      </View>

      {!loaded ? null : done ? (
        /* ── Round complete ── */
        <View style={styles.center}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>
            {saidCount > 0 ? `You spoke ${saidCount} pro phrases aloud` : 'No phrases yet'}
          </Text>
          {chineseAssist && (
            <Text style={styles.doneCn}>
              {saidCount > 0 ? `你刚刚大声说出了${saidCount}句专业表达` : '完成一次练习后，这里会有你的短语'}
            </Text>
          )}
          <Text style={styles.doneSub}>
            Speaking aloud builds the muscle memory that typing never will.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => { setIndex(0); setSaidCount(0); }}
          >
            <Text style={styles.primaryBtnText}>Another round →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostBtn} onPress={() => router.back()}>
            <Text style={styles.ghostBtnText}>Back to scenarios</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── Active card ── */
        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.stepLabel}>LISTEN → REPEAT ALOUD</Text>
            <Text style={styles.phraseEn}>{current.en}</Text>
            {chineseAssist && !!current.cn && <Text style={styles.phraseCn}>{current.cn}</Text>}

            <TouchableOpacity
              onPress={playCurrent}
              style={[styles.listenBtn, speaking && styles.listenBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={styles.listenText}>
                {speaking ? '🔊 Playing…' : '🔊 Listen'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.instruction}>
            Say it out loud — with the same rhythm and confidence.
          </Text>
          {chineseAssist && (
            <Text style={styles.instructionCn}>大声跟读——模仿同样的节奏和自信。</Text>
          )}

          <TouchableOpacity style={styles.saidBtn} onPress={handleSaidIt} activeOpacity={0.85}>
            <Text style={styles.saidBtnText}>🎤 I said it aloud →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
            <Text style={styles.skipText}>skip this one</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 14, color: Colors.muted },
  headerTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  headerCn: { fontSize: 10, color: Colors.muted, marginTop: 1 },
  counter: { fontSize: 12, color: Colors.orange, fontWeight: '600' },

  body: { flex: 1, padding: 20, justifyContent: 'center' },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 18,
    padding: 22,
    marginBottom: 24,
  },
  stepLabel: {
    fontSize: 10, letterSpacing: 1.5, color: Colors.cyan,
    fontWeight: '700', marginBottom: 14,
  },
  phraseEn: { fontSize: 20, fontWeight: '600', color: Colors.text, lineHeight: 29 },
  phraseCn: { fontSize: 14, color: Colors.muted, marginTop: 8, lineHeight: 21 },
  listenBtn: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#00d4c812',
    borderWidth: 1,
    borderColor: '#00d4c830',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  listenBtnActive: { backgroundColor: '#00d4c825', borderColor: '#00d4c860' },
  listenText: { fontSize: 14, color: Colors.cyan, fontWeight: '600' },

  instruction: { fontSize: 13, color: Colors.muted, textAlign: 'center' },
  instructionCn: { fontSize: 11, color: Colors.dim, textAlign: 'center', marginTop: 3 },

  saidBtn: {
    marginTop: 20,
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  saidBtnText: { fontSize: 16, color: '#fff', fontWeight: '700' },
  skipBtn: { marginTop: 14, alignItems: 'center' },
  skipText: { fontSize: 12, color: Colors.dim, textDecorationLine: 'underline' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  doneEmoji: { fontSize: 44, marginBottom: 12 },
  doneTitle: { fontSize: 19, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  doneCn: { fontSize: 13, color: Colors.muted, marginTop: 6, textAlign: 'center' },
  doneSub: { fontSize: 12, color: Colors.dim, marginTop: 12, textAlign: 'center', lineHeight: 18 },
  primaryBtn: {
    marginTop: 26,
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  primaryBtnText: { fontSize: 15, color: '#fff', fontWeight: '700' },
  ghostBtn: { marginTop: 14 },
  ghostBtnText: { fontSize: 13, color: Colors.muted, textDecorationLine: 'underline' },
});
