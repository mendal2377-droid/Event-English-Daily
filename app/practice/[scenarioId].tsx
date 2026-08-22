import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { getScenarioById, getScenarioHints, Hint } from '../../constants/scenarios';
import { AiBubble, UserBubble } from '../../components/ChatBubble';
import { CoachNote } from '../../components/CoachNote';
import { HintBar } from '../../components/HintBar';
import { MicButton } from '../../components/MicButton';
import { Badge } from '../../components/ui/Badge';
import { sendMessage, getOpeningMessage, Message, AIResponse } from '../../lib/api';
import { getMockResult } from '../../lib/mock';
import { countProPhrases, computeGrade } from '../../lib/score';
import { saveSession } from '../../lib/storage';
import { useApp } from '../../context/AppContext';

const MAX_TURNS = 6;

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  text: string;
  coachEn?: string;
  coachCn?: string;
  coachType?: AIResponse['coachType'];
}

export default function Practice() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  const router = useRouter();
  const { apiMode, apiKey, hintsOn } = useApp();

  const scenario = getScenarioById(scenarioId ?? '');
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [apiHistory, setApiHistory] = useState<Message[]>([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [hints, setHints] = useState<Hint[]>([]);
  const [hintPrefill, setHintPrefill] = useState('');
  const sessionStart = useRef(Date.now());
  const userTextsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!scenario) return;
    const opening = getOpeningMessage(scenario.id, apiMode);
    setMessages([{ id: 'opening', type: 'ai', text: opening }]);
    setApiHistory([{ role: 'ai', text: opening }]);
    setHints(getScenarioHints(scenario.id, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, apiMode]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  if (!scenario) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.text }}>Scenario not found.</Text>
      </View>
    );
  }

  async function handleUserSubmit(text: string) {
    if (loading || sessionDone || !scenario) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, type: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    userTextsRef.current.push(text);
    setLoading(true);

    const newHistory: Message[] = [...apiHistory, { role: 'user', text }];
    setApiHistory(newHistory);

    try {
      const response = await sendMessage({
        scenario,
        history: newHistory,
        userText: text,
        turnIndex,
        mode: apiMode,
        apiKey,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        text: response.aiText,
        coachEn: response.coachEn,
        coachCn: response.coachCn,
        coachType: response.coachType,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setApiHistory((prev) => [...prev, { role: 'ai', text: response.aiText }]);

      const nextTurn = turnIndex + 1;
      setTurnIndex(nextTurn);
      setHints(getScenarioHints(scenario.id, 2));

      if (nextTurn >= MAX_TURNS) {
        setSessionDone(true);
        setTimeout(() => endSession(nextTurn, scenario.id, scenario.title), 1200);
      }
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function endSession(finalTurn: number, scId: string, scTitle: string) {
    const mockResult = getMockResult(scId);
    const sessionId = Date.now().toString();
    const durationMs = Date.now() - sessionStart.current;

    // Real measurement: trade vocabulary the user actually used this session
    const userTexts = userTextsRef.current;
    const proPhrases = countProPhrases(userTexts, scId);
    const grade = computeGrade(proPhrases, userTexts);

    await saveSession({
      id: sessionId,
      scenarioId: scId,
      scenarioTitle: scTitle,
      grade,
      turns: finalTurn,
      durationMs,
      proPhrasesCount: proPhrases,
      didWell: mockResult?.didWell ?? [],
      tryNext: mockResult?.tryNext ?? [],
      savedPhrases: mockResult?.savedPhrases ?? [],
      completedAt: Date.now(),
    });

    router.replace(`/result/${sessionId}`);
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {scenario.icon} {scenario.title}
          </Text>
          <View style={styles.headerMeta}>
            <Badge category={scenario.category} />
            <Text style={styles.turnCount}>Turn {turnIndex} / {MAX_TURNS}</Text>
          </View>
        </View>
      </View>

      {/* Chat */}
      <ScrollView
        ref={scrollRef}
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View key={msg.id}>
            {msg.type === 'ai' ? (
              <AiBubble role={scenario.aiRole} text={msg.text} />
            ) : (
              <UserBubble text={msg.text} />
            )}
            {msg.coachEn && (
              <CoachNote
                enText={msg.coachEn}
                cnText={msg.coachCn ?? ''}
                type={msg.coachType ?? 'phrasing'}
              />
            )}
          </View>
        ))}

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={Colors.orange} />
            <Text style={styles.loadingText}>AI is responding...</Text>
          </View>
        )}

        {sessionDone && (
          <View style={styles.endNote}>
            <Text style={styles.endText}>Session complete — going to results...</Text>
          </View>
        )}
      </ScrollView>

      {/* Hints */}
      {hintsOn && !sessionDone && !loading && (
        <HintBar
          hints={hints}
          onSelect={(text) => setHintPrefill(text)}
          challengeMode={challengeMode}
          onToggleChallenge={() => setChallengeMode((v) => !v)}
        />
      )}

      {/* Mic */}
      {!sessionDone && (
        <MicButton
          onSubmit={handleUserSubmit}
          disabled={loading}
          prefill={hintPrefill}
          onClearPrefill={() => setHintPrefill('')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 14, color: Colors.muted },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  turnCount: { fontSize: 11, color: Colors.dim },
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 6 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  loadingText: { fontSize: 12, color: Colors.muted },
  endNote: { alignItems: 'center', paddingVertical: 16 },
  endText: { fontSize: 13, color: Colors.green },
});
