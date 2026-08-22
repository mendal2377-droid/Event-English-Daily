import * as Speech from 'expo-speech';

// Text-to-speech via the device's system TTS engine (expo-av is NOT available
// in Expo Go). expo-speech works in Expo Go.
//
// IMPORTANT lessons baked into this file:
//  1. On Android, Speech.getAvailableVoicesAsync() often returns an EMPTY list
//     in Expo Go even though TTS works. So we must NEVER refuse to speak just
//     because we couldn't find a voice — always attempt playback (best effort).
//  2. Chinese-market phones (Xiaomi/HyperOS, Huawei) may genuinely have no
//     English voice installed, in which case English speech is silent with no
//     error. We detect that case *only when we can prove it* (voice list is
//     populated but contains no English voice) and surface guidance.

let isSpeaking = false;

interface VoiceInfo {
  count: number;
  englishCount: number;
  englishVoiceId: string | null;
  /** true only if we actually retrieved a non-empty voice list */
  known: boolean;
}

let cachedVoices: VoiceInfo | undefined;

async function getVoiceInfo(): Promise<VoiceInfo> {
  if (cachedVoices) return cachedVoices;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const english = voices.filter((v) => (v.language ?? '').toLowerCase().startsWith('en'));
    cachedVoices = {
      count: voices.length,
      englishCount: english.length,
      englishVoiceId: english[0]?.identifier ?? null,
      known: voices.length > 0,
    };
  } catch {
    cachedVoices = { count: 0, englishCount: 0, englishVoiceId: null, known: false };
  }
  return cachedVoices;
}

/** Force a re-read of the device voice list (e.g. after user installs a voice). */
export function resetVoiceCache() {
  cachedVoices = undefined;
}

/**
 * Silent probe of English-voice availability (does NOT speak).
 * 'ok'        → an English voice is installed
 * 'no-english'→ voices exist but none are English (this device is silent for EN)
 * 'unknown'   → couldn't read the voice list (some ROMs); may still work
 */
export async function checkEnglishVoiceStatus(): Promise<'ok' | 'no-english' | 'unknown'> {
  resetVoiceCache();
  const info = await getVoiceInfo();
  if (info.englishCount > 0) return 'ok';
  if (info.known) return 'no-english';
  return 'unknown';
}

export interface SpeakResult {
  ok: boolean;
  reason?: 'no-english-voice';
}

export async function speakText(text: string, slowMode = false): Promise<SpeakResult> {
  if (isSpeaking) {
    Speech.stop();
    isSpeaking = false;
  }

  const info = await getVoiceInfo();

  // Only refuse + warn when we can PROVE there is no English voice:
  // the list was populated (known) but had zero English voices.
  const definitelyNoEnglish = info.known && info.englishCount === 0;

  const options: Speech.SpeechOptions = {
    language: 'en-US',
    rate: slowMode ? 0.75 : 1.0,
    pitch: 1.0,
  };
  // Pin a concrete English voice only if we actually found one.
  if (info.englishVoiceId) options.voice = info.englishVoiceId;

  isSpeaking = true;
  return new Promise<SpeakResult>((resolve) => {
    let settled = false;
    const finish = (r: SpeakResult) => {
      if (settled) return;
      settled = true;
      isSpeaking = false;
      resolve(r);
    };

    Speech.speak(text, {
      ...options,
      onDone: () => finish({ ok: true }),
      onStopped: () => finish({ ok: true }),
      onError: () => finish(
        definitelyNoEnglish ? { ok: false, reason: 'no-english-voice' } : { ok: true },
      ),
    });

    // If we already know there's no English voice, tell the caller so it can
    // guide the user — but we still fired speak() above as a best effort.
    if (definitelyNoEnglish) finish({ ok: false, reason: 'no-english-voice' });
  });
}

export async function stopSpeaking(): Promise<void> {
  isSpeaking = false;
  Speech.stop();
}

export function isTTSSpeaking(): boolean {
  return isSpeaking;
}

/**
 * On-device diagnostic used by the Settings "Test voice" button.
 * Speaks a sample and returns concrete facts about the device's TTS engine,
 * so we can tell the user exactly what's wrong instead of guessing.
 */
export async function diagnoseVoices(): Promise<{
  totalVoices: number;
  englishVoices: number;
  spoke: boolean;
}> {
  resetVoiceCache();
  const info = await getVoiceInfo();
  // Fire a short sample regardless (best effort).
  try {
    Speech.speak('Hello. This is an English voice test.', {
      language: 'en-US',
      ...(info.englishVoiceId ? { voice: info.englishVoiceId } : {}),
    });
  } catch {
    /* ignore */
  }
  return {
    totalVoices: info.count,
    englishVoices: info.englishCount,
    spoke: info.englishCount > 0 || !info.known,
  };
}
