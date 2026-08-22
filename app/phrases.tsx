import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, Pressable, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { NavBar } from '../components/ui/NavBar';
import { PhraseCard } from '../components/PhraseCard';
import { loadPhrases, savePhrase, deletePhrase, Phrase } from '../lib/storage';
import { useApp } from '../context/AppContext';
import { Category } from '../constants/scenarios';

const TAG_OPTIONS = ['On-Site', 'Business', 'Production', 'Crisis', 'Custom'];
const FILTERS = ['All', 'On-Site', 'Business', 'Production', 'Crisis', 'Custom'];

export default function Phrases() {
  const { chineseAssist } = useApp();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [filter, setFilter] = useState('All');
  const [newEn, setNewEn] = useState('');
  const [newTag, setNewTag] = useState('On-Site');
  const [showTagPicker, setShowTagPicker] = useState(false);

  useEffect(() => {
    loadPhrases().then(setPhrases);
  }, []);

  const filtered = filter === 'All' ? phrases : phrases.filter((p) => p.tag === filter);

  const thisWeekCount = phrases.filter(
    (p) => p.addedAt > Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).length;

  const tagCounts = new Set(phrases.map((p) => p.tag)).size;

  async function handleAdd() {
    const text = newEn.trim();
    if (!text) return;
    const phrase = await savePhrase({ en: text, cn: '', tag: newTag, source: 'manual' });
    setPhrases((prev) => [phrase, ...prev]);
    setNewEn('');
  }

  async function handleDelete(id: string) {
    await deletePhrase(id);
    setPhrases((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top']}>
      <NavBar rightLabel="Phrases ✦" rightLabelCn="短语库" rightHighlighted />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Your Collection</Text>
          <Text style={styles.h1}>Phrase <Text style={styles.h1Accent}>Bank</Text></Text>
          {chineseAssist && <Text style={styles.cnSub}>你的短语收藏库</Text>}
          <Text style={styles.sub}>Saved from practice + added from real work.</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statN, { color: Colors.violet }]}>{phrases.length}</Text>
            <Text style={styles.statEn}>Total</Text>
            {chineseAssist && <Text style={styles.statCn}>总数</Text>}
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statN, { color: Colors.violet }]}>{thisWeekCount}</Text>
            <Text style={styles.statEn}>This week</Text>
            {chineseAssist && <Text style={styles.statCn}>本周</Text>}
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statN, { color: Colors.violet }]}>{tagCounts}</Text>
            <Text style={styles.statEn}>Tags</Text>
            {chineseAssist && <Text style={styles.statCn}>标签</Text>}
          </View>
        </View>

        {/* Add phrase */}
        <View style={styles.addBox}>
          <View style={styles.addLabel}>
            <Text style={styles.addLabelEn}>Add phrase from YouTube, podcast or real work</Text>
            {chineseAssist && (
              <Text style={styles.addLabelCn}>从YouTube、播客或真实工作中添加短语</Text>
            )}
          </View>
          <View style={styles.addRow}>
            <Pressable onPress={() => setShowTagPicker((v) => !v)} style={styles.tagBtn}>
              <Text style={styles.tagBtnText}>{newTag}</Text>
            </Pressable>
            <TextInput
              style={styles.input}
              value={newEn}
              onChangeText={setNewEn}
              placeholder="Your phrase…"
              placeholderTextColor={Colors.dim}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />
            <Pressable onPress={handleAdd} style={styles.addBtn}>
              <Text style={styles.addBtnText}>+</Text>
            </Pressable>
          </View>
          {showTagPicker && (
            <View style={styles.tagPicker}>
              {TAG_OPTIONS.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => { setNewTag(t); setShowTagPicker(false); }}
                  style={[styles.tagOption, newTag === t && styles.tagOptionActive]}
                >
                  <Text style={[styles.tagOptionText, newTag === t && styles.tagOptionTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Category filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filter, filter === f && styles.filterActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Phrase list */}
        <View style={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyText}>No phrases yet.</Text>
              {chineseAssist && <Text style={styles.emptyCn}>练习后短语会自动保存在这里</Text>}
              <Text style={styles.emptyHint}>Complete a practice session to auto-save phrases.</Text>
            </View>
          ) : (
            filtered.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} onDelete={handleDelete} />
            ))
          )}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, color: Colors.violet, textTransform: 'uppercase', marginBottom: 4 },
  h1: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  h1Accent: { color: Colors.violet, fontStyle: 'italic' },
  cnSub: { fontSize: 12, color: Colors.muted, marginBottom: 4 },
  sub: { fontSize: 12, color: Colors.dim },
  stats: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 14 },
  stat: {
    flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 10, padding: 10, alignItems: 'center',
  },
  statN: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  statEn: { fontSize: 11, color: Colors.muted },
  statCn: { fontSize: 9, color: Colors.dim },
  addBox: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 12,
  },
  addLabel: { marginBottom: 10 },
  addLabelEn: { fontSize: 11, color: Colors.dim, textTransform: 'uppercase', letterSpacing: 0.6 },
  addLabelCn: { fontSize: 10, color: Colors.dim, opacity: 0.7, marginTop: 2 },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tagBtn: {
    backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 7, paddingHorizontal: 10, paddingVertical: 7,
  },
  tagBtnText: { fontSize: 11, color: Colors.muted },
  input: {
    flex: 1, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 7, paddingHorizontal: 10, paddingVertical: 7,
    fontSize: 13, color: Colors.text,
  },
  addBtn: {
    width: 34, height: 34, borderRadius: 7, backgroundColor: Colors.violet,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontSize: 20, color: '#fff', fontWeight: '700', lineHeight: 24 },
  tagPicker: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10,
    paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  tagOption: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 7,
    borderWidth: 1, borderColor: Colors.border2,
  },
  tagOptionActive: { borderColor: Colors.violet, backgroundColor: Colors.violetTint },
  tagOptionText: { fontSize: 12, color: Colors.dim },
  tagOptionTextActive: { color: Colors.violet },
  filters: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  filter: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border2,
  },
  filterActive: { borderColor: Colors.violet, backgroundColor: Colors.violetTint },
  filterText: { fontSize: 12, color: Colors.dim },
  filterTextActive: { color: Colors.violet },
  list: { paddingHorizontal: 16 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 16, color: Colors.muted, fontWeight: '600', marginBottom: 4 },
  emptyCn: { fontSize: 13, color: Colors.dim, marginBottom: 8 },
  emptyHint: { fontSize: 12, color: Colors.dim, textAlign: 'center' },
});
