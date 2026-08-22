import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { useApp } from '../context/AppContext';

type CoachType = 'phrasing' | 'positive' | 'vocabulary';

const coachColors: Record<CoachType, string> = {
  phrasing: Colors.cyan,
  positive: Colors.green,
  vocabulary: Colors.violet,
};

const coachIcons: Record<CoachType, string> = {
  phrasing: '🎯',
  positive: '✅',
  vocabulary: '📖',
};

interface CoachNoteProps {
  enText: string;
  cnText: string;
  type: CoachType;
}

export function CoachNote({ enText, cnText, type }: CoachNoteProps) {
  const { chineseAssist } = useApp();
  const color = coachColors[type];
  const icon = coachIcons[type];

  return (
    <View style={[styles.container, { borderColor: `${color}20`, backgroundColor: `${color}06` }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.body}>
        <Text style={styles.label}>
          <Text style={[styles.coachWord, { color }]}>Coach: </Text>
          <Text style={styles.enText}>{enText}</Text>
        </Text>
        {chineseAssist && cnText ? (
          <Text style={styles.cnText}>{cnText}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  icon: { fontSize: 16, marginTop: 1 },
  body: { flex: 1 },
  label: { fontSize: 12, lineHeight: 18 },
  coachWord: { fontWeight: '700' },
  enText: { color: '#c0cce0' },
  cnText: {
    fontSize: 11,
    color: Colors.dim,
    lineHeight: 16,
    marginTop: 3,
  },
});
