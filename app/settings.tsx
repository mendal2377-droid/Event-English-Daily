import React, { useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { NavBar } from '../components/ui/NavBar';
import { Toggle } from '../components/ui/Toggle';
import { useApp } from '../context/AppContext';
import { diagnoseVoices } from '../lib/tts';

const GOALS = [
  { n: 1, cn: '1个场景' },
  { n: 2, cn: '2个场景' },
  { n: 3, cn: '3个场景' },
  { n: 5, cn: '5个场景' },
];

const API_MODES = [
  { id: 'shared' as const, label: '✨ Built-in AI (DeepSeek)', desc: 'No key needed · always on · Recommended' },
  { id: 'deepseek' as const, label: 'DeepSeek — my own key', desc: 'Use your own DeepSeek key instead' },
  { id: 'claude' as const, label: 'Anthropic Claude', desc: 'Your own key · needs VPN in China' },
  { id: 'openai' as const, label: 'OpenAI GPT-4o', desc: 'Your own key · needs VPN in China' },
  { id: 'mock' as const, label: '🧪 Mock Mode / 离线测试', desc: 'Scripted, works offline' },
];

const SHOW_PRESETS = [
  { label: '1 week', labelCn: '1周后', days: 7 },
  { label: '2 weeks', labelCn: '2周后', days: 14 },
  { label: '1 month', labelCn: '1个月后', days: 30 },
  { label: '3 months', labelCn: '3个月后', days: 90 },
];

function isoDateInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Settings() {
  const {
    chineseAssist, setChineseAssist,
    apiMode, setApiMode,
    apiKey, setApiKey,
    dailyGoal, setDailyGoal,
    hintsOn, setHintsOn,
    slowMode, setSlowMode,
    autoSpeak, setAutoSpeak,
    showDate, setShowDate,
    showName, setShowName,
  } = useApp();

  const router = useRouter();
  const [showKey, setShowKey] = useState(false);
  const [assistJustOff, setAssistJustOff] = useState(false);
  const [testing, setTesting] = useState(false);

  async function handleVoiceTest() {
    setTesting(true);
    const r = await diagnoseVoices();
    setTesting(false);
    if (r.englishVoices > 0) {
      Alert.alert(
        '✅ English voice found 已找到英文语音',
        `Your phone has ${r.englishVoices} English voice(s) out of ${r.totalVoices} total.\n` +
          `你的手机共有 ${r.totalVoices} 个语音，其中 ${r.englishVoices} 个英文语音。\n\n` +
          'You should have heard a test sentence just now. If you did NOT, ' +
          'turn up the MEDIA volume (press volume-up while media plays), and ' +
          'check the phone is not in silent/Do-Not-Disturb mode.\n\n' +
          '刚才应该播放了一句测试语音。如果没听到，请调高「媒体音量」' +
          '（播放时按音量+键），并确认手机不在静音/勿扰模式。',
      );
    } else if (r.totalVoices === 0) {
      Alert.alert(
        '⚠️ Cannot read voice list 无法读取语音列表',
        'Your phone reported no installed voices (common on some Android ROMs).\n' +
          '你的手机未报告任何已安装语音（部分安卓系统常见）。\n\n' +
          'We still tried to play a sample. If you heard nothing:\n' +
          '我们仍尝试播放了一段。如果你什么都没听到：\n\n' +
          '1. Install "Google Text-to-Speech" / 安装「Google 文字转语音」\n' +
          '2. Settings → Additional settings → Accessibility → Text-to-speech\n' +
          '   设置 → 更多设置 → 无障碍 → 文字转语音（TTS）\n' +
          '3. Set engine to Google, download English (US), tap "Listen to example"\n' +
          '   选 Google 引擎，下载英语（美国），点「播放示例」测试',
      );
    } else {
      Alert.alert(
        '❌ No English voice installed 未安装英文语音',
        `Your phone has ${r.totalVoices} voice(s) but NONE are English — ` +
          'that is why the app is silent.\n' +
          `你的手机有 ${r.totalVoices} 个语音，但没有英文语音——这就是没声音的原因。\n\n` +
          'Fix / 解决：\n' +
          '1. Install "Google Text-to-Speech" / 安装「Google 文字转语音」\n' +
          '2. Settings → Additional settings → Accessibility → Text-to-speech\n' +
          '   设置 → 更多设置 → 无障碍 → 文字转语音（TTS）\n' +
          '3. Set engine to Google → download English (US) voice\n' +
          '   选 Google 引擎 → 下载英语（美国）语音',
      );
    }
  }

  function handleAssistToggle() {
    const next = !chineseAssist;
    setChineseAssist(next);
    if (!next) setAssistJustOff(true);
  }

  return (
    <SafeAreaView style={styles.bg} edges={['top']}>
      <NavBar rightLabel="⚙ Settings" rightLabelCn="设置" rightHighlighted hideSettings />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.h1}>Settings</Text>
        <Text style={styles.sub}>设置 — API, goals & practice preferences</Text>

        {/* Mock mode banner */}
        {apiMode === 'mock' && (
          <View style={styles.mockBanner}>
            <View style={styles.mockDot} />
            <View>
              <Text style={styles.mockEn}>Mock Mode Active — no API key needed</Text>
              {chineseAssist && <Text style={styles.mockCn}>测试模式已开启，无需真实API密钥</Text>}
            </View>
          </View>
        )}

        {/* Chinese Assist celebration */}
        {assistJustOff && (
          <View style={styles.celebrationBanner}>
            <Text style={styles.celebrationText}>
              You're going English-only — great progress! 你在进步！ 🎉
            </Text>
          </View>
        )}

        {/* ── BILINGUAL ASSIST ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelEn}>Bilingual Assist</Text>
            {chineseAssist && <Text style={styles.sectionLabelCn}>双语辅助设置</Text>}
          </View>
          <View style={styles.assistRow}>
            <View style={styles.assistLeft}>
              <Text style={styles.assistEn}>Chinese Assist</Text>
              {chineseAssist && (
                <Text style={styles.assistCnLabel}>中文辅助 — 开启后，提示和反馈下方显示中文</Text>
              )}
              <Text style={styles.assistSub}>Shows CN below hints, coach notes & phrases</Text>
            </View>
            <Toggle value={chineseAssist} onToggle={handleAssistToggle} />
          </View>
        </View>

        {/* ── MY NEXT SHOW ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelEn}>My Next Show</Text>
            {chineseAssist && <Text style={styles.sectionLabelCn}>我的下一场展会 — 倒计时练习</Text>}
          </View>
          <View style={styles.keyRow}>
            <TextInput
              style={styles.keyInput}
              value={showName}
              onChangeText={setShowName}
              placeholder="Show name, e.g. CES, Automechanika…"
              placeholderTextColor={Colors.dim}
              autoCapitalize="words"
            />
          </View>
          <View style={[styles.goals, { marginTop: 10 }]}>
            {SHOW_PRESETS.map((p) => {
              const presetDate = isoDateInDays(p.days);
              const selected = showDate === presetDate;
              return (
                <Pressable
                  key={p.days}
                  style={[styles.goalPill, selected && styles.goalPillSel]}
                  onPress={() => setShowDate(presetDate)}
                >
                  <Text style={[styles.goalMin, selected && styles.goalMinSel]}>{p.label}</Text>
                  {chineseAssist && (
                    <Text style={[styles.goalCn, selected && styles.goalCnSel]}>{p.labelCn}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          {!!showDate && (
            <View style={styles.showDateRow}>
              <Text style={styles.showDateText}>
                🎯 {showName || 'Show'} — {showDate}
              </Text>
              <Pressable onPress={() => { setShowDate(''); setShowName(''); }}>
                <Text style={styles.showClear}>clear</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── AI PROVIDER ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelEn}>AI Provider</Text>
            {chineseAssist && <Text style={styles.sectionLabelCn}>AI 服务选择</Text>}
          </View>
          {API_MODES.map((mode) => (
            <Pressable
              key={mode.id}
              style={[styles.apiOption, apiMode === mode.id && styles.apiOptionSel]}
              onPress={() => setApiMode(mode.id)}
            >
              <View style={[styles.radio, apiMode === mode.id && styles.radioSel]}>
                {apiMode === mode.id && <View style={styles.radioDot} />}
              </View>
              <View>
                <Text style={styles.apiName}>{mode.label}</Text>
                <Text style={styles.apiDesc}>{mode.desc}</Text>
              </View>
            </Pressable>
          ))}

          {(apiMode === 'claude' || apiMode === 'openai' || apiMode === 'deepseek') && (
            <>
              <View style={styles.keyRow}>
                <TextInput
                  style={styles.keyInput}
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder={`Paste your ${
                    apiMode === 'claude' ? 'Anthropic' : apiMode === 'openai' ? 'OpenAI' : 'DeepSeek'
                  } API key…`}
                  placeholderTextColor={Colors.dim}
                  secureTextEntry={!showKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable onPress={() => setShowKey((v) => !v)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showKey ? '🙈' : '👁️'}</Text>
                </Pressable>
              </View>
              {apiMode === 'deepseek' && (
                <Text style={styles.keyHint}>
                  Get a key at platform.deepseek.com → API keys.
                  {chineseAssist ? ' 在 platform.deepseek.com 获取密钥。' : ''}
                </Text>
              )}
            </>
          )}
        </View>

        {/* ── DAILY GOAL ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelEn}>Daily Goal (scenes / day)</Text>
            {chineseAssist && <Text style={styles.sectionLabelCn}>每日目标（每天练几个场景）</Text>}
          </View>
          <View style={styles.goals}>
            {GOALS.map((g) => (
              <Pressable
                key={g.n}
                style={[styles.goalPill, dailyGoal === g.n && styles.goalPillSel]}
                onPress={() => setDailyGoal(g.n)}
              >
                <Text style={[styles.goalMin, dailyGoal === g.n && styles.goalMinSel]}>
                  {g.n} {g.n === 1 ? 'scene' : 'scenes'}
                </Text>
                {chineseAssist && (
                  <Text style={[styles.goalCn, dailyGoal === g.n && styles.goalCnSel]}>
                    {g.cn}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── PRACTICE PREFERENCES ── */}
        <View style={styles.section}>
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelEn}>Practice Preferences</Text>
            {chineseAssist && <Text style={styles.sectionLabelCn}>练习偏好</Text>}
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowEn}>Starter Hints</Text>
              {chineseAssist && <Text style={styles.rowCn}>开场提示（含中文含义）</Text>}
            </View>
            <Toggle value={hintsOn} onToggle={() => setHintsOn(!hintsOn)} />
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowEn}>Auto-play AI voice</Text>
              {chineseAssist && <Text style={styles.rowCn}>自动朗读 AI 回复</Text>}
            </View>
            <Toggle value={autoSpeak} onToggle={() => setAutoSpeak(!autoSpeak)} />
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.rowEn}>Slow Mode (75%)</Text>
              {chineseAssist && <Text style={styles.rowCn}>慢速发音模式</Text>}
            </View>
            <Toggle value={slowMode} onToggle={() => setSlowMode(!slowMode)} />
          </View>

          {/* Voice diagnostic — nails down "no sound" on the user's device */}
          <Pressable style={styles.testBtn} onPress={handleVoiceTest} disabled={testing}>
            <Text style={styles.testBtnText}>
              {testing ? 'Testing…' : '🔊 Test English voice'}
            </Text>
            {chineseAssist && <Text style={styles.testBtnCn}>测试英文语音 — 检查手机能否发英文音</Text>}
          </Pressable>

          {/* Full device readiness check (sound + voice) */}
          <Pressable style={styles.deviceBtn} onPress={() => router.push('/device-check')}>
            <Text style={styles.deviceBtnText}>📱 Run full device check →</Text>
            {chineseAssist && <Text style={styles.testBtnCn}>完整设备检测 — 声音与语音输入</Text>}
          </Pressable>
        </View>

        {/* ── TUTOR TEASER ── */}
        <View style={styles.tutorCard}>
          <Text style={styles.tutorIcon}>👩‍🏫</Text>
          <View style={styles.tutorBody}>
            <View style={styles.tutorTitle}>
              <Text style={styles.tutorEn}>Human Tutor Sessions</Text>
              {chineseAssist && <Text style={styles.tutorCn}>真人外教课程（即将推出）</Text>}
            </View>
            <Text style={styles.tutorDesc}>
              Book 1-on-1 with a real event industry English teacher. Coming in V3.
            </Text>
            <Text style={styles.tutorLink}>Join waitlist / 加入等候名单 →</Text>
          </View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16 },
  h1: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  sub: { fontSize: 13, color: Colors.muted, marginBottom: 20 },

  mockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#ff6b2b0a', borderWidth: 1, borderColor: '#ff6b2b26',
    borderRadius: 10, padding: 12, marginBottom: 16,
  },
  mockDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.orange },
  mockEn: { fontSize: 13, color: Colors.orange2 },
  mockCn: { fontSize: 11, color: Colors.orange, opacity: 0.7 },

  celebrationBanner: {
    backgroundColor: Colors.greenTint, borderWidth: 1, borderColor: Colors.greenBorder,
    borderRadius: 10, padding: 12, marginBottom: 16,
  },
  celebrationText: { fontSize: 13, color: Colors.green, textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionLabel: { marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sectionLabelEn: { fontSize: 11, fontWeight: '700', color: Colors.dim, textTransform: 'uppercase', letterSpacing: 1 },
  sectionLabelCn: { fontSize: 10, color: Colors.dim, opacity: 0.7, marginTop: 2 },

  assistRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#ff6b2b06', borderWidth: 1, borderColor: '#ff6b2b1c',
    borderRadius: 10, padding: 12,
  },
  assistLeft: { flex: 1, marginRight: 12 },
  assistEn: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 2 },
  assistCnLabel: { fontSize: 12, color: Colors.orange, marginBottom: 2 },
  assistSub: { fontSize: 11, color: Colors.muted },

  apiOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, padding: 12, marginBottom: 8,
  },
  apiOptionSel: { borderColor: '#ff6b2b28', backgroundColor: '#ff6b2b07' },
  radio: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1.5, borderColor: Colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSel: { borderColor: Colors.orange },
  radioDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.orange },
  apiName: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  apiDesc: { fontSize: 11, color: Colors.muted, marginTop: 1 },
  keyRow: {
    flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center',
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 8, padding: 10,
  },
  keyInput: { flex: 1, fontSize: 13, color: Colors.text },
  keyHint: { fontSize: 10, color: Colors.dim, marginTop: 6, marginLeft: 2 },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16 },

  goals: { flexDirection: 'row', gap: 8 },
  showDateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 10, paddingHorizontal: 4,
  },
  showDateText: { fontSize: 12, color: Colors.orange2 },
  showClear: { fontSize: 12, color: Colors.dim, textDecorationLine: 'underline' },
  goalPill: {
    flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, paddingVertical: 10, alignItems: 'center',
  },
  goalPillSel: { borderColor: Colors.orange, backgroundColor: '#ff6b2b0a' },
  goalMin: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  goalMinSel: { color: Colors.orange },
  goalCn: { fontSize: 10, color: Colors.dim, marginTop: 2 },
  goalCnSel: { color: Colors.orange, opacity: 0.7 },

  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  rowEn: { fontSize: 15, color: Colors.text },
  rowCn: { fontSize: 11, color: Colors.dim, marginTop: 2 },
  testBtn: {
    marginTop: 14,
    backgroundColor: '#00d4c80f',
    borderWidth: 1,
    borderColor: '#00d4c830',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  testBtnText: { fontSize: 14, color: Colors.cyan, fontWeight: '600' },
  testBtnCn: { fontSize: 10, color: Colors.muted, marginTop: 3 },
  deviceBtn: {
    marginTop: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  deviceBtnText: { fontSize: 14, color: Colors.text, fontWeight: '600' },

  tutorCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    backgroundColor: Colors.violetTint, borderWidth: 1, borderColor: Colors.violetBorder,
    borderRadius: 12, padding: 14,
  },
  tutorIcon: { fontSize: 28 },
  tutorBody: { flex: 1 },
  tutorTitle: { marginBottom: 6 },
  tutorEn: { fontSize: 15, fontWeight: '600', color: Colors.violet },
  tutorCn: { fontSize: 11, color: Colors.violet, opacity: 0.7, marginTop: 2 },
  tutorDesc: { fontSize: 12, color: Colors.muted, lineHeight: 18, marginBottom: 8 },
  tutorLink: { fontSize: 12, color: Colors.violet },
});
