// Device Check — run once on first launch (and available anytime from Settings).
// Tells the user upfront whether SOUND (English TTS) and VOICE input will work
// on their specific phone, each with a concrete fix. Both are optional — the
// app is fully usable with text + reading even if neither is available.

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { useApp } from '../context/AppContext';
import { checkEnglishVoiceStatus, speakText } from '../lib/tts';
import { isVoiceSupported, ensureVoicePermission } from '../lib/speech';
import { setDeviceCheckSeen } from '../lib/storage';

type SoundStatus = 'checking' | 'ok' | 'no-english' | 'unknown';
type VoiceStatus = 'checking' | 'ok' | 'unavailable';

export default function DeviceCheck() {
  const router = useRouter();
  const { chineseAssist } = useApp();
  const [sound, setSound] = useState<SoundStatus>('checking');
  const [voice, setVoice] = useState<VoiceStatus>('checking');
  const [micGranted, setMicGranted] = useState<boolean | null>(null);

  const runChecks = useCallback(async () => {
    setSound('checking');
    setVoice('checking');
    const s = await checkEnglishVoiceStatus();
    setSound(s);
    setVoice(isVoiceSupported() ? 'ok' : 'unavailable');
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  async function finish() {
    await setDeviceCheckSeen();
    router.replace('/home');
  }

  async function grantMic() {
    const ok = await ensureVoicePermission();
    setMicGranted(ok);
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>ONE-TIME SETUP</Text>
        <Text style={styles.h1}>Is your phone ready?</Text>
        {chineseAssist && <Text style={styles.h1cn}>检查你的手机 — 声音和语音是否可用</Text>}
        <Text style={styles.intro}>
          Both features below are optional — you can always type and read. This
          check just tells you what your phone supports.
        </Text>
        {chineseAssist && (
          <Text style={styles.introCn}>
            以下两项都是可选的——你随时可以打字和阅读。这里只是告诉你手机支持哪些功能。
          </Text>
        )}

        {/* ── SOUND ── */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardIcon}>🔊</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Hear English (Sound)</Text>
              {chineseAssist && <Text style={styles.cardTitleCn}>听英文发音</Text>}
            </View>
            <StatusPill
              tone={sound === 'ok' ? 'good' : sound === 'checking' ? 'wait' : 'bad'}
              label={
                sound === 'ok' ? 'Ready' : sound === 'checking' ? '…' :
                sound === 'no-english' ? 'No voice' : 'Unknown'
              }
            />
          </View>

          {sound === 'ok' && (
            <Text style={styles.cardBody}>
              Your phone has an English voice. Tap below to hear it.
            </Text>
          )}
          {sound === 'no-english' && (
            <Text style={styles.cardBody}>
              Your phone has no English voice, so speech is silent. Install one:
              {'\n'}1. Install "Google Text-to-Speech"
              {'\n'}2. Settings → Additional settings → Accessibility → Text-to-speech
              {'\n'}3. Set engine to Google, download English (US)
              {chineseAssist ? '\n\n手机没有英文语音，所以没声音。安装方法：\n1. 安装「Google 文字转语音」\n2. 设置 → 更多设置 → 无障碍 → 文字转语音\n3. 选 Google 引擎，下载英语（美国）' : ''}
            </Text>
          )}
          {sound === 'unknown' && (
            <Text style={styles.cardBody}>
              Couldn't read your phone's voice list. Tap "Play test" — if you hear
              nothing, install Google Text-to-Speech and an English (US) voice.
              {chineseAssist ? '\n\n无法读取语音列表。点「播放测试」，如果没声音，请安装 Google 文字转语音和英语（美国）语音。' : ''}
            </Text>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.softBtn}
              onPress={() => speakText('Hello. Welcome to ON STAGE. Let\'s practise your English.')}
            >
              <Text style={styles.softBtnText}>▶ Play test</Text>
            </TouchableOpacity>
            {sound !== 'ok' && (
              <TouchableOpacity style={styles.softBtn} onPress={runChecks}>
                <Text style={styles.softBtnText}>↻ Re-check</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── VOICE ── */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.cardIcon}>🎙️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Speak English (Voice input)</Text>
              {chineseAssist && <Text style={styles.cardTitleCn}>用语音输入英文</Text>}
            </View>
            <StatusPill
              tone={voice === 'ok' ? 'good' : voice === 'checking' ? 'wait' : 'bad'}
              label={voice === 'ok' ? 'Ready' : voice === 'checking' ? '…' : 'Text only'}
            />
          </View>

          {voice === 'ok' && (
            <Text style={styles.cardBody}>
              Speech recognition works on your phone. Tap the mic in practice and
              speak — you'll see your words appear.
              {chineseAssist ? '\n\n你的手机支持语音识别。练习时点麦克风说话，会看到文字出现。' : ''}
            </Text>
          )}
          {voice === 'unavailable' && (
            <Text style={styles.cardBody}>
              Voice input isn't available here (this preview, or your phone has no
              speech service). No problem — the mic opens a text box and everything
              still works. Voice needs the installed app + Google services.
              {chineseAssist ? '\n\n此处暂不支持语音输入（预览版，或手机没有语音服务）。没关系——麦克风会打开文字框，一切照常。语音需要安装版应用 + Google 服务。' : ''}
            </Text>
          )}

          {voice === 'ok' && (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.softBtn} onPress={grantMic}>
                <Text style={styles.softBtnText}>
                  {micGranted === true ? '✓ Mic allowed' : 'Allow microphone'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {voice === 'unavailable' && (
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.softBtn} onPress={() => Linking.openSettings()}>
                <Text style={styles.softBtnText}>Open phone settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.softBtn} onPress={runChecks}>
                <Text style={styles.softBtnText}>↻ Re-check</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={finish}>
          <Text style={styles.continueText}>Continue to app →</Text>
        </TouchableOpacity>
        <Text style={styles.footNote}>
          You can run this again anytime from Settings.
          {chineseAssist ? ' 随时可在「设置」中重新检测。' : ''}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusPill({ tone, label }: { tone: 'good' | 'bad' | 'wait'; label: string }) {
  const bg = tone === 'good' ? '#3ddc9720' : tone === 'bad' ? '#ff6b2b20' : Colors.card;
  const bd = tone === 'good' ? '#3ddc9750' : tone === 'bad' ? '#ff6b2b50' : Colors.border2;
  const fg = tone === 'good' ? Colors.green : tone === 'bad' ? Colors.orange2 : Colors.muted;
  return (
    <View style={[pill.wrap, { backgroundColor: bg, borderColor: bd }]}>
      <Text style={[pill.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const pill = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  text: { fontSize: 11, fontWeight: '700' },
});

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 22, paddingTop: 28 },
  eyebrow: { fontSize: 10, letterSpacing: 1.5, color: Colors.orange, fontWeight: '700' },
  h1: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 6 },
  h1cn: { fontSize: 13, color: Colors.muted, marginTop: 4 },
  intro: { fontSize: 12.5, color: Colors.muted, lineHeight: 19, marginTop: 14 },
  introCn: { fontSize: 11, color: Colors.dim, lineHeight: 17, marginTop: 6 },

  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: { fontSize: 22 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  cardTitleCn: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  cardBody: { fontSize: 12, color: Colors.muted, lineHeight: 19, marginTop: 12 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14, flexWrap: 'wrap' },
  softBtn: {
    backgroundColor: '#ff6b2b10',
    borderWidth: 1,
    borderColor: '#ff6b2b30',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  softBtnText: { fontSize: 13, color: Colors.orange, fontWeight: '600' },

  continueBtn: {
    marginTop: 28,
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: Colors.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  continueText: { fontSize: 16, color: '#fff', fontWeight: '700' },
  footNote: { fontSize: 11, color: Colors.dim, textAlign: 'center', marginTop: 14 },
});
