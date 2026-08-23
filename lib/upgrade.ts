// "话术一键变高级" — Dialogue Upgrade Engine.
// Takes a user's rough Chinese or plain English and returns a polished,
// professional English line suitable for overseas event/exhibition work.
// Uses the selected AI provider; falls back to a curated Mock lookup.

import { ApiMode } from './api';
import { PROXY_CHAT_URL } from './config';

export interface UpgradeResult {
  upgraded: string;   // the professional English line
  note: string;       // one-line explanation of what changed
  noteCn: string;     // Chinese explanation
  term: string;       // the key term worth remembering
  fromMock: boolean;  // true if produced by the offline fallback
}

const SYSTEM_PROMPT = `You upgrade a Chinese event/exhibition professional's rough input into ONE polished, professional English sentence they can say on-site at an overseas trade show (build, AV, catering, negotiation, guest handling, travel).

The input may be Chinese, or plain/broken English. Keep the meaning; make it sound like a confident industry professional, not a textbook.

Respond in EXACTLY this format, nothing else:
UPGRADED: <the professional English sentence>
NOTE: <one short sentence in English on what you improved or the key phrase to use>
NOTE_CN: <the NOTE translated to Chinese>
TERM: <the single most useful word or phrase from the upgrade>`;

// Small offline lookup so Mock Mode still does something useful.
const MOCK_LOOKUP: Record<string, UpgradeResult> = {
  '物料延误': {
    upgraded: 'Our freight is held up in transit — can we confirm the latest delivery slot that still makes load-in?',
    note: "Use 'held up in transit' and 'load-in' instead of just 'delayed'.",
    noteCn: "用 'held up in transit' 和 'load-in' 代替单说 'delayed'。",
    term: 'load-in', fromMock: true,
  },
  '大屏分辨率': {
    upgraded: "What's the native resolution and pixel pitch on the main LED wall?",
    note: "Ask for 'native resolution' and 'pixel pitch' — the precise AV terms.",
    noteCn: "问 'native resolution' 和 'pixel pitch'——精准的AV术语。",
    term: 'pixel pitch', fromMock: true,
  },
  '加桌子': {
    upgraded: 'Could we add two more rounds of ten to the floor plan?',
    note: "'Rounds of ten' is how event pros say a 10-seat round table.",
    noteCn: "'Rounds of ten' 是行业里对10人圆桌的说法。",
    term: 'rounds of ten', fromMock: true,
  },
  '搭建': {
    upgraded: "When does your crew start the build, and when will the shell be up?",
    note: "Say 'the build' / 'load-in', not 'set up the booth'.",
    noteCn: "说 'the build' / 'load-in'，而不是 'set up the booth'。",
    term: 'the build', fromMock: true,
  },
};

function mockUpgrade(input: string): UpgradeResult {
  const key = Object.keys(MOCK_LOOKUP).find((k) => input.includes(k));
  if (key) return MOCK_LOOKUP[key];
  return {
    upgraded: input.trim(),
    note: 'Mock Mode can only upgrade a few sample phrases. Select DeepSeek in Settings for full AI upgrades.',
    noteCn: '测试模式只能升级少量示例短语。在「设置」中选择 DeepSeek 即可使用完整 AI 升级。',
    term: '',
    fromMock: true,
  };
}

function parseUpgrade(raw: string, fromMock: boolean): UpgradeResult {
  const grab = (label: string) => {
    const m = raw.match(new RegExp(`${label}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, 's'));
    return m?.[1]?.trim() ?? '';
  };
  return {
    upgraded: grab('UPGRADED') || raw.trim(),
    note: grab('NOTE'),
    noteCn: grab('NOTE_CN'),
    term: grab('TERM'),
    fromMock,
  };
}

export async function upgradePhrase(params: {
  input: string;
  mode: ApiMode;
  apiKey?: string;
}): Promise<UpgradeResult> {
  const { input, mode, apiKey } = params;
  const text = input.trim();
  if (!text) return mockUpgrade('');

  // Built-in shared DeepSeek proxy — no key needed
  if (mode === 'shared') {
    try {
      const res = await fetch(PROXY_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: text }],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      return parseUpgrade(data.content ?? '', false);
    } catch {
      return mockUpgrade(text);
    }
  }

  if (mode === 'mock' || !apiKey) {
    return mockUpgrade(text);
  }

  try {
    if (mode === 'claude') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: text }],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      return parseUpgrade(data.content?.[0]?.text ?? '', false);
    }

    // OpenAI-compatible (openai, deepseek)
    const url = mode === 'deepseek'
      ? 'https://api.deepseek.com/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    const model = mode === 'deepseek' ? 'deepseek-chat' : 'gpt-4o';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    return parseUpgrade(data.choices?.[0]?.message?.content ?? '', false);
  } catch {
    // On any failure, degrade gracefully to the mock lookup
    return mockUpgrade(text);
  }
}
