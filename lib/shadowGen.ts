// AI-generated daily shadowing sentences — keeps the shadowing library fresh.
// Uses the app's AI provider (shared DeepSeek proxy by default). Returns [] on
// mock/offline so the screen falls back to the built-in hint pool.

import { ApiMode } from './api';
import { PROXY_CHAT_URL } from './config';

export interface ShadowSentence {
  en: string;
  cn: string;
}

const PROMPT = `Generate 15 short spoken-English sentences that a Chinese event/exhibition professional would actually say at an overseas trade show. Spread them across: AV & build, catering, client pitch, negotiation, on-site crisis, and business travel (airport/hotel/dinner).

Rules:
- Natural, professional, confident — the way a fluent pro speaks, not a textbook.
- 6 to 16 words each.
- For each, give a natural Chinese translation.

Return ONLY 15 lines, one per line, in EXACTLY this format (no numbering, no extra text):
English sentence ||| 中文翻译`;

async function callAI(mode: ApiMode, apiKey?: string): Promise<string> {
  if (mode === 'shared') {
    const r = await fetch(PROXY_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: PROMPT }] }),
    });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).content ?? '';
  }

  if (mode === 'claude') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 700,
        messages: [{ role: 'user', content: PROMPT }],
      }),
    });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).content?.[0]?.text ?? '';
  }

  // openai / deepseek (OpenAI-compatible)
  const url = mode === 'deepseek'
    ? 'https://api.deepseek.com/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  const model = mode === 'deepseek' ? 'deepseek-chat' : 'gpt-4o';
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey ?? ''}` },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      messages: [{ role: 'user', content: PROMPT }],
    }),
  });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()).choices?.[0]?.message?.content ?? '';
}

function parse(raw: string): ShadowSentence[] {
  return raw
    .split('\n')
    .map((line) => {
      const parts = line.split('|||');
      if (parts.length < 2) return null;
      const en = parts[0].replace(/^\s*[-*\d.]+\s*/, '').trim();
      const cn = parts[1].trim();
      if (!en || !cn) return null;
      return { en, cn };
    })
    .filter((x): x is ShadowSentence => x !== null)
    .slice(0, 20);
}

/** Generate a fresh batch. Returns [] on mock, missing key, or any failure. */
export async function generateDailyShadow(mode: ApiMode, apiKey?: string): Promise<ShadowSentence[]> {
  if (mode === 'mock') return [];
  if (mode !== 'shared' && !apiKey) return [];
  try {
    return parse(await callAI(mode, apiKey));
  } catch {
    return [];
  }
}
