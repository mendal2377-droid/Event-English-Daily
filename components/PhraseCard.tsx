import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Phrase } from '../lib/storage';
import { speakText } from '../lib/tts';
import { useApp } from '../context/AppContext';
import { Badge } from './ui/Badge';
import { Category } from '../constants/scenarios';

interface PhraseCardProps {
  phrase: Phrase;
  onDelete: (id: string) => void;
}

const VALID_CATEGORIES: Category[] = ['On-Site', 'Business', 'Production'];

export function PhraseCard({ phrase, onDelete }: PhraseCardProps) {
  const { chineseAssist, slowMode } = useApp();
  const isValidCategory = VALID_CATEGORIES.includes(phrase.tag as Category);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        {isValidCategory && <Badge category={phrase.tag as Category} />}
        {!isValidCategory && <Text style={styles.customTag}>{phrase.tag}</Text>}
        <Pressable onPress={() => onDelete(phrase.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteIcon}>✕</Text>
        </Pressable>
      </View>
      <Text style={styles.enText}>"{phrase.en}"</Text>
      {chineseAssist && phrase.cn ? (
        <Text style={styles.cnText}>{phrase.cn}</Text>
      ) : null}
      <Pressable onPress={() => speakText(phrase.en, slowMode)} style={styles.ttsBtn}>
        <Text style={styles.ttsText}>🔊 Tap to hear</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customTag: {
    fontSize: 10,
    color: Colors.violet,
    backgroundColor: Colors.violetTint,
    borderColor: Colors.violetBorder,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  deleteBtn: { marginLeft: 'auto' },
  deleteIcon: { fontSize: 13, color: Colors.dim },
  enText: {
    fontSize: 13,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 4,
  },
  cnText: {
    fontSize: 11,
    color: Colors.muted,
    lineHeight: 16,
    marginBottom: 6,
  },
  ttsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#00d4c808',
    borderWidth: 1,
    borderColor: '#00d4c818',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ttsText: { fontSize: 10, color: Colors.cyan },
});
