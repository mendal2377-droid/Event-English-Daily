// 行业黑话卡库 — Industry Glossary flashcards.
// Search + category filter, tap a card to flip (EN definition → Chinese), 🔊 to hear.
// Add your own terms to the deck.

import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { GLOSSARY, GLOSSARY_CATEGORIES, GlossaryTerm } from '../constants/glossary';
import { loadCustomGlossary, addCustomGlossary, deleteCustomGlossary, CustomGlossaryTerm } from '../lib/storage';
import { speakText } from '../lib/tts';
import { useApp } from '../context/AppContext';

function toGlossaryCustom(c: CustomGlossaryTerm): GlossaryTerm {
  return {
    term: c.term,
    definition: c.definition,
    cn: c.cn,
    example: c.example ?? '',
    category: 'Custom',
  };
}

type Filter = 'All' | GlossaryTerm['category'] | 'Custom';

const CAT_COLOR: Record<string, string> = {
  'AV & Tech': Colors.cyan,
  'Venue & Catering': Colors.violet,
  'Logistics': Colors.orange,
  'Business': Colors.gold,
  'Travel': Colors.green,
  'Custom': Colors.muted,
};

export default function Glossary() {
  const router = useRouter();
  const { chineseAssist, slowMode } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [custom, setCustom] = useState<GlossaryTerm[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDef, setNewDef] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCn, setNewCn] = useState('');

  useEffect(() => {
    loadCustomGlossary().then((list) =>
      setCustom(list.map(toGlossaryCustom)),
    );
  }, []);

  const all: GlossaryTerm[] = useMemo(() => [...custom, ...GLOSSARY], [custom]);

  const filters: Filter[] = useMemo(() => {
    const base: Filter[] = ['All', ...GLOSSARY_CATEGORIES];
    return custom.length ? [...base, 'Custom'] : base;
  }, [custom.length]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((t) => {
      if (filter !== 'All' && t.category !== filter) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.cn.includes(query.trim())
      );
    });
  }, [all, filter, query]);

  function toggleFlip(term: string) {
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(term) ? next.delete(term) : next.add(term);
      return next;
    });
  }

  async function handleAdd() {
    const term = newTerm.trim();
    if (!term) return;
    const list = await addCustomGlossary({
      term, definition: newDef.trim() || '(your note)', cn: newCn.trim(),
      example: newExample.trim(),
    });
    setCustom(list.map(toGlossaryCustom));
    setNewTerm(''); setNewDef(''); setNewExample(''); setNewCn(''); setAddOpen(false);
    setFilter('Custom');
  }

  async function handleDelete(term: string) {
    const list = await deleteCustomGlossary(term);
    setCustom(list.map(toGlossaryCustom));
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>📇 Industry Glossary</Text>
          {chineseAssist && <Text style={styles.headerCn}>行业黑话卡库 — 点卡翻面，🔊 听发音</Text>}
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddOpen(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Search terms, definitions, 汉字查询…"
          placeholderTextColor={Colors.dim}
          autoCapitalize="none"
        />
      </View>

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filters}>
        {filters.map((c) => (
          <TouchableOpacity key={c} style={[styles.pill, filter === c && styles.pillSel]}
            onPress={() => setFilter(c)}>
            <Text style={[styles.pillText, filter === c && styles.pillTextSel]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Cards */}
      <ScrollView contentContainerStyle={styles.cards} showsVerticalScrollIndicator={false}>
        {shown.length === 0 && (
          <Text style={styles.empty}>No terms match. Try another search or category.</Text>
        )}
        {shown.map((t) => {
          const isFlipped = flipped.has(t.term);
          const color = CAT_COLOR[t.category] ?? Colors.muted;
          return (
            <TouchableOpacity key={t.term} activeOpacity={0.9}
              style={styles.card} onPress={() => toggleFlip(t.term)}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardTag, { color, borderColor: color + '55', backgroundColor: color + '14' }]}>
                  {t.category.toUpperCase()}
                </Text>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation?.(); speakText(t.term, slowMode); }}
                  hitSlop={10}
                >
                  <Text style={styles.speaker}>🔊</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.term}>{t.term}</Text>

              {isFlipped ? (
                <Text style={styles.cn}>{t.cn || '(no translation yet)'}</Text>
              ) : (
                <>
                  <Text style={styles.def}>{t.definition}</Text>
                  {!!t.example && (
                    <View style={styles.exampleBox}>
                      <View style={styles.exampleTop}>
                        <Text style={styles.exampleLabel}>EXAMPLE 例句</Text>
                        <TouchableOpacity
                          onPress={(e) => { e.stopPropagation?.(); speakText(t.example, slowMode); }}
                          hitSlop={8}
                        >
                          <Text style={styles.exampleSpeaker}>🔊</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.example}>“{t.example}”</Text>
                    </View>
                  )}
                </>
              )}

              <View style={styles.cardFoot}>
                <Text style={styles.flipHint}>
                  {isFlipped ? '↩ Tap to flip back' : '💡 Tap to translate'}
                </Text>
                {t.category === 'Custom' && (
                  <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); handleDelete(t.term); }}>
                    <Text style={styles.delete}>delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add-your-own modal */}
      <Modal visible={addOpen} transparent animationType="slide" onRequestClose={() => setAddOpen(false)}>
        <View style={styles.overlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => setAddOpen(false)} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>Add a term 添加新词</Text>
              <TextInput style={styles.input} value={newTerm} onChangeText={setNewTerm}
                placeholder="Term (English), e.g. Drayage" placeholderTextColor={Colors.dim} autoFocus />
              <TextInput style={styles.input} value={newDef} onChangeText={setNewDef}
                placeholder="Definition (optional)" placeholderTextColor={Colors.dim} multiline />
              <TextInput style={styles.input} value={newExample} onChangeText={setNewExample}
                placeholder="Example sentence 例句 (optional)" placeholderTextColor={Colors.dim} multiline />
              <TextInput style={styles.input} value={newCn} onChangeText={setNewCn}
                placeholder="中文意思 (optional)" placeholderTextColor={Colors.dim} />
              <View style={styles.btns}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddOpen(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, !newTerm.trim() && styles.saveDisabled]}
                  onPress={handleAdd} disabled={!newTerm.trim()}>
                  <Text style={styles.saveText}>Add to deck →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: '#9b7aff18', borderWidth: 1, borderColor: '#9b7aff44',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
  },
  addBtnText: { fontSize: 12, color: Colors.violet, fontWeight: '700' },

  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  search: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 13, color: Colors.text,
  },
  filterScroll: { marginTop: 10, maxHeight: 42 },
  filters: { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  pill: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border2,
  },
  pillSel: { borderColor: Colors.violet, backgroundColor: '#9b7aff0f' },
  pillText: { fontSize: 12, color: Colors.dim },
  pillTextSel: { color: Colors.violet },

  cards: { padding: 16, gap: 12 },
  empty: { color: Colors.muted, textAlign: 'center', marginTop: 40, fontSize: 13 },
  card: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 14, padding: 15, marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  cardTag: {
    fontSize: 9, fontWeight: '700', letterSpacing: 0.5,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, overflow: 'hidden',
  },
  speaker: { fontSize: 16 },
  term: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  def: { fontSize: 13, color: Colors.muted, lineHeight: 19 },
  exampleBox: {
    marginTop: 10,
    backgroundColor: Colors.bg,
    borderRadius: 9,
    borderLeftWidth: 2,
    borderLeftColor: Colors.gold,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  exampleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  exampleLabel: { fontSize: 8, letterSpacing: 1, color: Colors.gold, fontWeight: '700' },
  exampleSpeaker: { fontSize: 13 },
  example: { fontSize: 12.5, color: Colors.text, fontStyle: 'italic', lineHeight: 18 },
  cn: { fontSize: 14, color: Colors.violet, lineHeight: 21 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  flipHint: { fontSize: 10, color: Colors.dim },
  delete: { fontSize: 10, color: '#ff6b6b', textDecorationLine: 'underline' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: Colors.border2,
  },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: Colors.dim, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 10,
    padding: 12, fontSize: 14, color: Colors.text, marginBottom: 10,
  },
  btns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1, padding: 13, borderRadius: 10, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border2, alignItems: 'center',
  },
  cancelText: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  saveBtn: { flex: 2, padding: 13, borderRadius: 10, backgroundColor: Colors.violet, alignItems: 'center' },
  saveDisabled: { opacity: 0.4 },
  saveText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
