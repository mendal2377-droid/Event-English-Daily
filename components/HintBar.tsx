import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Hint } from '../constants/scenarios';
import { speakText } from '../lib/tts';
import { useApp } from '../context/AppContext';

interface HintBarProps {
  hints: Hint[];
  onSelect: (hint: string) => void;
  challengeMode: boolean;
  onToggleChallenge: () => void;
}

export function HintBar({ hints, onSelect, challengeMode, onToggleChallenge }: HintBarProps) {
  const { chineseAssist, slowMode } = useApp();

  if (challengeMode) {
    return (
      <View style={styles.challengeBar}>
        <Text style={styles.challengeText}>Challenge Mode — no hints</Text>
        <Pressable onPress={onToggleChallenge}>
          <Text style={styles.toggleLink}>Show Hints</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dot} />
        <View>
          <Text style={styles.labelEn}>Starter Hints</Text>
          {chineseAssist && <Text style={styles.labelCn}>开场提示</Text>}
        </View>
        <Pressable onPress={onToggleChallenge} style={styles.challengeBtn}>
          <Text style={styles.challengeBtnText}>Challenge →</Text>
        </Pressable>
      </View>

      {hints.map((hint, i) => (
        <Pressable
          key={i}
          style={styles.hint}
          onPress={() => onSelect(hint.en)}
          onLongPress={() => speakText(hint.en, slowMode)}
        >
          <View style={styles.hintRow}>
            <Text style={styles.hintArrow}>›</Text>
            <Text style={styles.hintEn}>{hint.en}</Text>
            <Pressable onPress={() => speakText(hint.en, slowMode)} style={styles.speakBtn}>
              <Text style={styles.speakIcon}>🔊</Text>
            </Pressable>
          </View>
          {chineseAssist && (
            <Text style={styles.hintCn}>{hint.cn}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  labelEn: {
    fontSize: 10,
    color: Colors.gold,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  labelCn: {
    fontSize: 9,
    color: Colors.dim,
    marginTop: 1,
  },
  challengeBtn: { marginLeft: 'auto' },
  challengeBtnText: { fontSize: 10, color: Colors.dim },
  hint: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 7,
    padding: 8,
    marginBottom: 6,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  hintArrow: { color: Colors.gold, fontSize: 14, lineHeight: 18 },
  hintEn: { flex: 1, fontSize: 12, color: Colors.muted, lineHeight: 18 },
  speakBtn: { paddingLeft: 4 },
  speakIcon: { fontSize: 13 },
  hintCn: {
    fontSize: 10,
    color: Colors.dim,
    marginTop: 3,
    paddingLeft: 18,
    lineHeight: 15,
  },
  challengeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  challengeText: { fontSize: 12, color: Colors.dim },
  toggleLink: { fontSize: 12, color: Colors.gold },
});
