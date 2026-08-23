// Speech-to-text wrapper.
//  - Web: uses the browser's native Web Speech API (Chrome/Edge). Real voice
//    input on a laptop. Falls back (returns false / errors) where unsupported.
//  - Native (APK): uses expo-speech-recognition.
// Everything is guarded so importing this file is always safe.

import { Platform } from 'react-native';

type ResultHandler = (transcript: string, isFinal: boolean) => void;
type ErrorHandler = (code: string, message: string) => void;

interface Sub { remove: () => void }

// ── Web (browser Web Speech API) ────────────────────────────────────────────

function getWebSpeechCtor(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

let webRec: any = null;

// ── Native (expo-speech-recognition) ────────────────────────────────────────

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

// ── Public API ───────────────────────────────────────────────────────────────

/** True only when the device/browser can actually do speech recognition now. */
export function isVoiceSupported(): boolean {
  if (Platform.OS === 'web') return !!getWebSpeechCtor();

  const m = getModule();
  if (!m) return false;
  try {
    if (typeof m.isRecognitionAvailable === 'function') return !!m.isRecognitionAvailable();
    const SR = getSR();
    if (SR && typeof SR.isRecognitionAvailable === 'function') return !!SR.isRecognitionAvailable();
    return !!SR;
  } catch {
    return false;
  }
}

export async function ensureVoicePermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    // The browser prompts for the mic on recognition.start(); nothing to do here.
    return true;
  }
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

export function startListening(handlers: {
  onResult: ResultHandler;
  onError: ErrorHandler;
  onEnd: () => void;
}): boolean {
  // ── Web ──
  if (Platform.OS === 'web') {
    const Ctor = getWebSpeechCtor();
    if (!Ctor) return false;
    try {
      const rec = new Ctor();
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.continuous = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        let transcript = '';
        for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
        const isFinal = !!e.results[e.results.length - 1]?.isFinal;
        handlers.onResult(transcript, isFinal);
      };
      rec.onerror = (e: any) => handlers.onError(e?.error ?? 'error', e?.message ?? '');
      rec.onend = () => handlers.onEnd();
      rec.start();
      webRec = rec;
      return true;
    } catch {
      webRec = null;
      return false;
    }
  }

  // ── Native ──
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
    listeners.push(SR.addListener('end', () => handlers.onEnd()));
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

export function stopListening(): void {
  if (Platform.OS === 'web') {
    try { webRec?.stop(); } catch { /* ignore */ }
    return;
  }
  const SR = getSR();
  try { SR?.stop?.(); } catch { /* ignore */ }
}

export function abortListening(): void {
  if (Platform.OS === 'web') {
    try { webRec?.abort?.(); } catch { /* ignore */ }
    webRec = null;
    return;
  }
  const SR = getSR();
  try { SR?.abort?.(); } catch { /* ignore */ }
  cleanup();
}

export function disposeListeners(): void {
  if (Platform.OS === 'web') { webRec = null; return; }
  cleanup();
}
