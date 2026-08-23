// 话术一键变高级 — Dialogue Upgrade Engine.
// Type rough Chinese or plain English → one tap → polished professional phrasing.

import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { upgradePhrase, UpgradeResult } from '../lib/upgrade';
import { speakText } from '../lib/tts';
import { savePhrase, loadUpgradeCount, incrementUpgradeCount } from '../lib/storage';
import { useApp } from '../context/AppContext';

const EXAMPLES = ['物料延误了', '大屏分辨率', '加桌子', '搭建时间'];

export default function Upgrade() {
  const router = useRouter();
  const { chineseAssist, slowMode, apiMode, apiKey } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UpgradeResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => { loadUpgradeCount().then(setCount); }, []);

  async function handleUpgrade() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    setResult(null);
    setSaved(false);
    const r = await upgradePhrase({ input: text, mode: apiMode, apiKey });
    setResult(r);
    setLoading(false);
    if (!r.fromMock || r.term) {
      const n = await incrementUpgradeCount();
      setCount(n);
    }
  }

  async function handleSave() {
    if (!result) return;
    await savePhrase({
      en: result.upgraded,
      cn: input.trim(),
      tag: 'Upgrade',
      source: 'manual',
    });
    setSaved(true);
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>✨ Phrase Upgrade</Text>
          {chineseAssist && <Text style={styles.headerCn}>话术一键变高级 — 大白话秒变专业行业表达</Text>}
        </View>
        <Text style={styles.count}>{count} ⬆</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lead}>
          Type what you want to say — in Chinese or rough English — and get the
          polished, professional version an overseas event pro would use.
        </Text>
        {chineseAssist && (
          <Text style={styles.leadCn}>
            输入你想说的话（中文或大白话英文），一键换成海外会展人的高级专业表达。
          </Text>
        )}

        {/* Input */}
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="e.g. 物料延误了 / can we put screen higher…"
          placeholderTextColor={Colors.dim}
          multiline
        />

        {/* Example chips */}
        <View style={styles.chips}>
          {EXAMPLES.map((ex) => (
            <TouchableOpacity key={ex} style={styles.chip} onPress={() => setInput(ex)}>
              <Text style={styles.chipText}>{ex}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.upgradeBtn, (!input.trim() || loading) && styles.upgradeDisabled]}
          onPress={handleUpgrade}
          disabled={!input.trim() || loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.upgradeText}>✨ Upgrade →</Text>}
        </TouchableOpacity>

        {apiMode === 'mock' && (
          <Text style={styles.mockHint}>
            🧪 Mock Mode upgrades a few samples only. Select DeepSeek in Settings for full AI upgrades.
            {chineseAssist ? ' 测试模式仅支持少量示例，选 DeepSeek 可用完整 AI 升级。' : ''}
          </Text>
        )}

        {/* Result */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>PROFESSIONAL VERSION</Text>
            <Text style={styles.resultEn}>{result.upgraded}</Text>

            <TouchableOpacity style={styles.hearBtn} onPress={() => speakText(result.upgraded, slowMode)}>
              <Text style={styles.hearText}>🔊 Hear it</Text>
            </TouchableOpacity>

            {!!result.note && (
              <View style={styles.noteBox}>
                <Text style={styles.noteEn}>💡 {result.note}</Text>
                {chineseAssist && !!result.noteCn && <Text style={styles.noteCn}>{result.noteCn}</Text>}
              </View>
            )}

            {!!result.term && (
              <Text style={styles.term}>Key term: <Text style={styles.termHi}>{result.term}</Text></Text>
            )}

            <TouchableOpacity style={[styles.saveBtn, saved && styles.savedBtn]} onPress={handleSave} disabled={saved}>
              <Text style={styles.saveText}>{saved ? '✓ Saved to Phrase Bank' : '+ Save to Phrase Bank'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
  count: { fontSize: 12, color: Colors.violet, fontWeight: '700' },

  content: { padding: 18 },
  lead: { fontSize: 13, color: Colors.muted, lineHeight: 20 },
  leadCn: { fontSize: 11.5, color: Colors.dim, lineHeight: 18, marginTop: 6 },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 12,
    padding: 14, fontSize: 15, color: Colors.text, minHeight: 80, textAlignVertical: 'top',
    marginTop: 16, lineHeight: 22,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
  },
  chipText: { fontSize: 12, color: Colors.muted },
  upgradeBtn: {
    marginTop: 16, backgroundColor: Colors.violet, borderRadius: 14, paddingVertical: 15,
    alignItems: 'center', shadowColor: Colors.violet, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  upgradeDisabled: { opacity: 0.4 },
  upgradeText: { fontSize: 16, color: '#fff', fontWeight: '700' },
  mockHint: { fontSize: 11, color: Colors.dim, marginTop: 12, lineHeight: 17 },

  resultCard: {
    marginTop: 20, backgroundColor: '#9b7aff0c', borderWidth: 1, borderColor: '#9b7aff33',
    borderRadius: 16, padding: 16,
  },
  resultLabel: { fontSize: 9, letterSpacing: 1.5, color: Colors.violet, fontWeight: '700' },
  resultEn: { fontSize: 17, color: Colors.text, fontWeight: '600', lineHeight: 25, marginTop: 8 },
  hearBtn: {
    alignSelf: 'flex-start', marginTop: 12, backgroundColor: '#00d4c812',
    borderWidth: 1, borderColor: '#00d4c830', borderRadius: 9, paddingHorizontal: 13, paddingVertical: 7,
  },
  hearText: { fontSize: 13, color: Colors.cyan, fontWeight: '600' },
  noteBox: {
    marginTop: 14, backgroundColor: Colors.card, borderRadius: 10, padding: 11,
    borderWidth: 1, borderColor: Colors.border,
  },
  noteEn: { fontSize: 12, color: Colors.text, lineHeight: 18 },
  noteCn: { fontSize: 11, color: Colors.muted, lineHeight: 17, marginTop: 4 },
  term: { fontSize: 12, color: Colors.muted, marginTop: 12 },
  termHi: { color: Colors.gold, fontWeight: '700' },
  saveBtn: {
    marginTop: 16, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 10, paddingVertical: 12, alignItems: 'center',
  },
  savedBtn: { borderColor: Colors.green },
  saveText: { fontSize: 13, color: Colors.text, fontWeight: '600' },
});
