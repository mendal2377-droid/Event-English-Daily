import { Platform } from 'react-native';

// The shared DeepSeek proxy (api/chat.js on Vercel).
// - Web build: same-origin relative path (works on any domain it's served from).
// - Installed APK: needs the absolute production URL of your Vercel deployment.
//   ⚠️ Update NATIVE_PROXY_URL to your real production domain before building the APK.
const NATIVE_PROXY_URL = 'https://event-english-daily.vercel.app/api/chat';

export const PROXY_CHAT_URL =
  Platform.OS === 'web' ? '/api/chat' : NATIVE_PROXY_URL;
