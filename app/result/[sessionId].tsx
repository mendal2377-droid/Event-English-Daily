import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { loadSession, SessionData } from '../../lib/storage';
import { useApp } from '../../context/AppContext';

export default function Result() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { chineseAssist } = useApp();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    loadSession(sessionId).then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, [sessionId]);

  const durationMin = session ? Math.round(session.durationMs / 60000) : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.orange} />
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.text }}>Session not found.</Text>
        <Pressable onPress={() => router.replace('/home')}>
          <Text style={{ color: Colors.orange, marginTop: 12 }}>Go home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.rh}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.h1}>Session <Text style={styles.h1Accent}>Complete</Text></Text>
          <Text style={styles.sub}>
            {session.scenarioTitle} · {session.turns} turns · {durationMin < 1 ? '<1' : durationMin} min
          </Text>
        </View>

        {/* Scores */}
        <View style={styles.scores}>
          <View style={styles.score}>
            <Text style={[styles.scoreN, { color: Colors.green }]}>{session.grade}</Text>
            <Text style={styles.scoreEn}>Fluency</Text>
            {chineseAssist && <Text style={styles.scoreCn}>流利度</Text>}
          </View>
          <View style={styles.score}>
            <Text style={[styles.scoreN, { color: Colors.cyan }]}>{session.proPhrasesCount}</Text>
            <Text style={styles.scoreEn}>Pro phrases</Text>
            {chineseAssist && <Text style={styles.scoreCn}>专业表达</Text>}
          </View>
          <View style={styles.score}>
            <Text style={[styles.scoreN, { color: Colors.violet }]}>{session.savedPhrases.length}</Text>
            <Text style={styles.scoreEn}>Saved</Text>
            {chineseAssist && <Text style={styles.scoreCn}>已保存</Text>}
          </View>
        </View>

        {/* Did well */}
        {session.didWell.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={[styles.sectionEn, { color: Colors.green }]}>✓ What you did well</Text>
              {chineseAssist && <Text style={styles.sectionCn}>你做得好的地方</Text>}
            </View>
            {session.didWell.map((item, i) => (
              <View key={i} style={styles.feedItem}>
                <Text style={styles.feedIcon}>✅</Text>
                <View style={styles.feedBody}>
                  <Text style={styles.feedEn}>{item.en}</Text>
                  {chineseAssist && <Text style={styles.feedCn}>{item.cn}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Try next */}
        {session.tryNext.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={[styles.sectionEn, { color: Colors.gold }]}>→ Try next time</Text>
              {chineseAssist && <Text style={styles.sectionCn}>下次可以改进的地方</Text>}
            </View>
            {session.tryNext.map((item, i) => (
              <View key={i} style={styles.feedItem}>
                <Text style={styles.feedIcon}>💡</Text>
                <View style={styles.feedBody}>
                  <Text style={styles.feedEn}>{item.en}</Text>
                  {chineseAssist && <Text style={styles.feedCn}>{item.cn}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Saved phrases */}
        {session.savedPhrases.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={[styles.sectionEn, { color: Colors.violet }]}>📚 Phrases saved</Text>
              {chineseAssist && <Text style={styles.sectionCn}>本次保存的短语</Text>}
            </View>
            {session.savedPhrases.map((p, i) => (
              <View key={i} style={styles.savedPhrase}>
                <Text style={styles.phraseEn}>"{p.en}"</Text>
                {chineseAssist && <Text style={styles.phraseCn}>{p.cn}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => router.replace(`/practice/${session.scenarioId}`)}
          >
            <Text style={styles.btnPrimaryText}>Practice Again</Text>
          </Pressable>
          <Pressable style={styles.btnSecondary} onPress={() => router.replace('/home')}>
            <Text style={styles.btnSecondaryText}>New Scenario</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 48 },
  rh: { alignItems: 'center', marginBottom: 20 },
  trophy: { fontSize: 48, marginBottom: 10 },
  h1: { fontSize: 26, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  h1Accent: { color: Colors.green, fontStyle: 'italic' },
  sub: { fontSize: 12, color: Colors.muted },
  scores: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  score: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  scoreN: { fontSize: 28, fontWeight: '700', marginBottom: 2 },
  scoreEn: { fontSize: 11, color: Colors.muted, textAlign: 'center' },
  scoreCn: { fontSize: 9, color: Colors.dim, textAlign: 'center' },
  section: { marginBottom: 18 },
  sectionTitle: { marginBottom: 10, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionEn: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  sectionCn: { fontSize: 10, color: Colors.dim, marginTop: 2 },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  feedIcon: { fontSize: 16, marginTop: 1 },
  feedBody: { flex: 1 },
  feedEn: { fontSize: 12, color: Colors.muted, lineHeight: 18 },
  feedCn: { fontSize: 10, color: Colors.dim, lineHeight: 16, marginTop: 3 },
  savedPhrase: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  phraseEn: { fontSize: 12, color: Colors.text, fontStyle: 'italic', lineHeight: 18 },
  phraseCn: { fontSize: 10, color: Colors.dim, marginTop: 4, lineHeight: 15 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnPrimary: {
    flex: 2,
    backgroundColor: Colors.orange,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnSecondary: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: { fontSize: 14, fontWeight: '600', color: Colors.muted },
});
