import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { speakText, stopSpeaking } from '../lib/tts';
import { useApp } from '../context/AppContext';

interface AiBubbleProps {
  role: string;
  text: string;
}

export function AiBubble({ role, text }: AiBubbleProps) {
  const { slowMode } = useApp();
  const [speaking, setSpeaking] = useState(false);

  async function handleTTS() {
    if (speaking) {
      await stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const result = await speakText(text, slowMode);
    setSpeaking(false);
    if (!result.ok && result.reason === 'no-english-voice') {
      Alert.alert(
        'No English voice installed 未安装英文语音',
        'Your phone\'s text-to-speech has no English voice, so audio is silent.\n\n' +
          '你的手机语音引擎没有英文语音包，所以没有声音。\n\n' +
          'Fix / 解决方法:\n' +
          '1. Install "Google Text-to-Speech" from an app store\n' +
          '   从应用商店安装「Google 文字转语音」\n' +
          '2. Phone Settings → Additional settings → Accessibility → Text-to-speech\n' +
          '   手机设置 → 更多设置 → 无障碍 → 文字转语音（TTS）\n' +
          '3. Set engine to Google and download English (US)\n' +
          '   选择 Google 引擎并下载英语（美国）语音',
      );
    }
  }

  return (
    <View style={styles.aiRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{role.slice(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.aiBubble}>
        <Text style={styles.roleLabel}>{role.toUpperCase()}</Text>
        <Text style={styles.aiText}>{text}</Text>
        <TouchableOpacity
          onPress={handleTTS}
          activeOpacity={0.7}
          style={[styles.ttsBtn, speaking && styles.ttsBtnActive]}
        >
          <Text style={styles.ttsText}>
            {speaking ? '🔊 Speaking… tap to stop' : '🔊 Tap to hear'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface UserBubbleProps {
  text: string;
}

export function UserBubble({ text }: UserBubbleProps) {
  return (
    <View style={styles.userRow}>
      <View style={styles.userBubble}>
        <Text style={styles.userLabel}>YOU</Text>
        <Text style={styles.userText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 4,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b2b18',
    borderWidth: 1,
    borderColor: '#ff6b2b2c',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 9, color: Colors.orange, fontWeight: '700' },
  aiBubble: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    borderBottomLeftRadius: 4,
    padding: 10,
    maxWidth: '82%',
  },
  roleLabel: {
    fontSize: 9,
    color: Colors.orange,
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: 4,
  },
  aiText: { fontSize: 13, color: Colors.text, lineHeight: 19 },
  ttsBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#00d4c80a',
    borderWidth: 1,
    borderColor: '#00d4c81a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ttsBtnActive: {
    backgroundColor: '#00d4c820',
    borderColor: '#00d4c850',
  },
  ttsText: { fontSize: 10, color: Colors.cyan, fontWeight: '500' },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#ff6b2b08',
    borderWidth: 1,
    borderColor: '#ff6b2b20',
    borderRadius: 14,
    borderBottomRightRadius: 4,
    padding: 10,
    maxWidth: '82%',
  },
  userLabel: {
    fontSize: 9,
    color: Colors.orange2,
    letterSpacing: 0.8,
    fontWeight: '600',
    marginBottom: 4,
  },
  userText: { fontSize: 13, color: Colors.text, lineHeight: 19 },
});
