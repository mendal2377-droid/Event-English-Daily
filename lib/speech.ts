// Safe wrapper around expo-speech-recognition (on-device speech-to-text).
//
// Design goals:
//  - Real voice input in a standalone / dev build (the APK).
//  - NEVER crash where the native module is absent (Expo Go) or the device has
//    no speech-recognition service (some China-ROM phones without Google apps).
//    In those cases isVoiceSupported() returns false and callers fall back to
//    the text sheet.
//
// Everything touches the native module lazily, inside try/catch, so simply
// importing this file is always safe.

type ResultHandler = (transcript: string, isFinal: boolean) => void;
type ErrorHandler = (code: string, message: string) => void;

interface Sub { remove: () => void }

let moduleCache: any;
let moduleLoaded = false;

function getModule(): any {
  if (moduleLoaded) return moduleCache;
  moduleLoaded = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    moduleCache = require('expo-speech-recognition');
  } catch {
    moduleCache = null;
  }
  return moduleCache;
}

function getSR(): any {
  const m = getModule();
  return m?.ExpoSpeechRecognitionModule ?? null;
}

/** True only when the device can actually do speech recognition right now. */
export function isVoiceSupported(): boolean {
  const m = getModule();
  if (!m) return false;
  try {
    if (typeof m.isRecognitionAvailable === 'function') {
      return !!m.isRecognitionAvailable();
    }
    const SR = getSR();
    if (SR && typeof SR.isRecognitionAvailable === 'function') {
      return !!SR.isRecognitionAvailable();
    }
    // Module present but no availability probe — assume usable, start() will
    // surface any real error and we fall back then.
    return !!SR;
  } catch {
    return false;
  }
}

export async function ensureVoicePermission(): Promise<boolean> {
  const SR = getSR();
  if (!SR) return false;
  try {
    const cur = await SR.getPermissionsAsync?.();
    if (cur?.granted) return true;
    const req = await SR.requestPermissionsAsync?.();
    return !!req?.granted;
  } catch {
    return false;
  }
}

let listeners: Sub[] = [];

function cleanup() {
  for (const l of listeners) {
    try { l.remove(); } catch { /* ignore */ }
  }
  listeners = [];
}

/**
 * Start listening. Returns true if recognition actually started.
 * Falls back (returns false) on any failure so the caller can open text input.
 */
export function startListening(handlers: {
  onResult: ResultHandler;
  onError: ErrorHandler;
  onEnd: () => void;
}): boolean {
  const SR = getSR();
  if (!SR) return false;
  try {
    cleanup();
    listeners.push(SR.addListener('result', (e: any) => {
      const transcript = e?.results?.[0]?.transcript ?? '';
      handlers.onResult(transcript, !!e?.isFinal);
    }));
    listeners.push(SR.addListener('error', (e: any) => {
      handlers.onError(e?.error ?? 'error', e?.message ?? '');
    }));
    listeners.push(SR.addListener('end', () => {
      handlers.onEnd();
    }));
    SR.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
      maxAlternatives: 1,
      addsPunctuation: true,
    });
    return true;
  } catch {
    cleanup();
    return false;
  }
}

/** Stop and let the final result come through the 'result'/'end' events. */
export function stopListening(): void {
  const SR = getSR();
  try { SR?.stop?.(); } catch { /* ignore */ }
}

/** Cancel immediately, discard any result, remove listeners. */
export function abortListening(): void {
  const SR = getSR();
  try { SR?.abort?.(); } catch { /* ignore */ }
  cleanup();
}

/** Remove listeners without touching the recognizer (for unmount cleanup). */
export function disposeListeners(): void {
  cleanup();
}
