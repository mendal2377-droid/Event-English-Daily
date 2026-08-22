// MicButton: real on-device voice input when available (standalone/dev build),
// with a text-input sheet as the universal fallback (Expo Go, or devices with
// no speech-recognition service).

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform, Animated, Easing,
} from 'react-native';
import { Colors } from '../constants/colors';
import {
  isVoiceSupported, ensureVoicePermission, startListening, stopListening,
  abortListening, disposeListeners,
} from '../lib/speech';

interface MicButtonProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  prefill?: string;
  onClearPrefill?: () => void;
}

type Mode = 'idle' | 'listening';

export function MicButton({ onSubmit, disabled, prefill, onClearPrefill }: MicButtonProps) {
  const [mode, setMode] = useState<Mode>('idle');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [transcript, setTranscript] = useState('');
  const [voiceHint, setVoiceHint] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recAnim = useRef(new Animated.Value(1)).current;
  const finalRef = useRef('');

  // Idle pulse
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 1100, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1100, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Recording pulse
  useEffect(() => {
    if (mode !== 'listening') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(recAnim, { toValue: 1.25, duration: 600, useNativeDriver: true }),
        Animated.timing(recAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mode, recAnim]);

  // Hint tap (from HintBar) → pre-fill and open the text sheet
  useEffect(() => {
    if (prefill) {
      setInputText(prefill);
      setSheetOpen(true);
      onClearPrefill?.();
    }
  }, [prefill, onClearPrefill]);

  // Cleanup recognizer on unmount
  useEffect(() => () => { abortListening(); disposeListeners(); }, []);

  async function handleMicPress() {
    if (disabled) return;
    if (mode === 'listening') {
      // Stop → final result arrives via events, then submitted
      stopListening();
      return;
    }

    // Try real voice first
    if (isVoiceSupported()) {
      const granted = await ensureVoicePermission();
      if (!granted) {
        setVoiceHint('Mic permission needed — you can type instead.');
        setSheetOpen(true);
        return;
      }
      finalRef.current = '';
      setTranscript('');
      const started = startListening({
        onResult: (text, isFinal) => {
          setTranscript(text);
          if (isFinal && text.trim()) finalRef.current = text.trim();
        },
        onError: (code) => {
          // Common on China-ROM devices without a recognition service
          setMode('idle');
          setVoiceHint(
            code === 'not-allowed' || code === 'service-not-allowed'
              ? 'Voice unavailable on this device — type instead.'
              : code === 'no-speech'
                ? "Didn't catch that — try again or type."
                : 'Voice error — you can type instead.',
          );
          setSheetOpen(true);
        },
        onEnd: () => {
          const finalText = finalRef.current || transcript.trim();
          setMode('idle');
          setTranscript('');
          if (finalText) {
            onSubmit(finalText);
          }
        },
      });
      if (started) {
        setVoiceHint('');
        setMode('listening');
      } else {
        // Native start failed → fall back to text
        setSheetOpen(true);
      }
    } else {
      // No voice support (Expo Go, or no service) → text input
      setSheetOpen(true);
    }
  }

  function closeSheet() {
    setInputText('');
    setSheetOpen(false);
  }

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    setSheetOpen(false);
    onSubmit(text);
  }

  const listening = mode === 'listening';

  return (
    <>
      <View style={styles.wrapper}>
        {listening ? (
          <Text style={styles.hintRed}>● Listening… tap to stop</Text>
        ) : (
          <Text style={styles.hint}>Tap mic to speak</Text>
        )}

        {/* Live transcript while listening */}
        {listening && (
          <Text style={styles.transcript} numberOfLines={3}>
            {transcript || 'Say your line in English…'}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleMicPress}
          disabled={disabled}
          activeOpacity={0.75}
          style={styles.micWrap}
        >
          {listening ? (
            <>
              <Animated.View style={[styles.ringRed, { transform: [{ scale: recAnim }] }]} />
              <View style={styles.micBtnRed}>
                <Text style={styles.micIcon}>⏹️</Text>
              </View>
            </>
          ) : (
            <>
              <Animated.View style={[styles.ring, { transform: [{ scale: pulseAnim }] }]} />
              <View style={[styles.micBtn, disabled && styles.micDisabled]}>
                <Text style={styles.micIcon}>🎙️</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {!listening && (
          <TouchableOpacity onPress={() => setSheetOpen(true)} style={styles.typeLink}>
            <Text style={styles.typeLinkText}>type instead ✍️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Text-input fallback sheet */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeSheet} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.avoidView}
          >
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>What do you want to say?</Text>
              <Text style={styles.sheetSub}>
                {voiceHint || '🗣️ Speak it aloud as you type — that\'s the practice'}
              </Text>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="e.g. Let me walk you through the space..."
                placeholderTextColor={Colors.dim}
                multiline
                autoFocus
              />
              <View style={styles.btns}>
                <TouchableOpacity onPress={closeSheet} style={styles.cancelBtn} activeOpacity={0.8}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!inputText.trim()}
                  style={[styles.sendBtn, !inputText.trim() && styles.sendDisabled]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sendText}>Send →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  hint: { fontSize: 11, color: Colors.muted, marginBottom: 10, letterSpacing: 0.3 },
  hintRed: { fontSize: 12, color: '#ff4444', fontWeight: '600', marginBottom: 8 },
  transcript: {
    fontSize: 13,
    color: Colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
    minHeight: 18,
  },
  micWrap: { alignItems: 'center', justifyContent: 'center', width: 90, height: 90 },
  ring: {
    position: 'absolute', width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#ff6b2b0c', borderWidth: 1.5, borderColor: '#ff6b2b22',
  },
  ringRed: {
    position: 'absolute', width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#ff000015', borderWidth: 2, borderColor: '#ff000040',
  },
  micBtn: {
    width: 62, height: 62, borderRadius: 31, backgroundColor: Colors.orange,
    alignItems: 'center', justifyContent: 'center', elevation: 8,
    shadowColor: Colors.orange, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8,
  },
  micBtnRed: {
    width: 62, height: 62, borderRadius: 31, backgroundColor: '#dd2222',
    alignItems: 'center', justifyContent: 'center', elevation: 8,
  },
  micDisabled: { opacity: 0.35 },
  micIcon: { fontSize: 28 },
  typeLink: { marginTop: 10 },
  typeLinkText: { fontSize: 11, color: Colors.dim, textDecorationLine: 'underline' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  avoidView: { width: '100%' },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 22, borderTopRightRadius: 22,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40,
    borderTopWidth: 1, borderTopColor: Colors.border2,
  },
  handle: {
    width: 38, height: 4, borderRadius: 2, backgroundColor: Colors.dim,
    alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  sheetSub: { fontSize: 12, color: Colors.muted, marginBottom: 16 },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2,
    borderRadius: 12, padding: 14, fontSize: 15, color: Colors.text,
    minHeight: 88, textAlignVertical: 'top', marginBottom: 14, lineHeight: 22,
  },
  btns: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1, padding: 14, borderRadius: 12, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border2, alignItems: 'center',
  },
  cancelText: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
  sendBtn: {
    flex: 2, padding: 14, borderRadius: 12, backgroundColor: Colors.orange, alignItems: 'center',
  },
  sendDisabled: { opacity: 0.35 },
  sendText: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
