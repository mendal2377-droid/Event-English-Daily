import { Scenario } from '../constants/scenarios';
import { getMockTurn, getMockOpening } from './mock';
import { buildSystemPrompt } from './systemPrompts';
import { PROXY_CHAT_URL } from './config';

export interface Message {
  role: 'ai' | 'user';
  text: string;
}

export interface AIResponse {
  aiText: string;
  coachEn: string;
  coachCn: string;
  coachType: 'phrasing' | 'positive' | 'vocabulary';
}

// 'shared' = the built-in DeepSeek proxy (one key for the whole app, no setup).
export type ApiMode = 'shared' | 'mock' | 'claude' | 'openai' | 'deepseek';

export function getOpeningMessage(scenarioId: string, _mode: ApiMode): string {
  // Every scenario gets its strong, in-character opening line regardless of mode.
  return getMockOpening(scenarioId);
}

export async function sendMessage(params: {
  scenario: Scenario;
  history: Message[];
  userText: string;
  turnIndex: number;
  mode: ApiMode;
  apiKey?: string;
}): Promise<AIResponse> {
  const { scenario, history, userText, turnIndex, mode, apiKey } = params;

  if (mode === 'mock') {
    return getMockResponse(scenario.id, turnIndex);
  }

  if (mode === 'shared') {
    try {
      return await callProxy(scenario, history, userText);
    } catch {
      // Offline / proxy down → degrade gracefully to the scripted turn
      return getMockResponse(scenario.id, turnIndex);
    }
  }

  if (mode === 'claude') {
    return callClaude(scenario, history, userText, apiKey ?? '');
  }

  if (mode === 'openai') {
    return callOpenAICompatible(
      'https://api.openai.com/v1/chat/completions', 'gpt-4o',
      scenario, history, userText, apiKey ?? '', 'OpenAI',
    );
  }

  if (mode === 'deepseek') {
    return callOpenAICompatible(
      'https://api.deepseek.com/chat/completions', 'deepseek-chat',
      scenario, history, userText, apiKey ?? '', 'DeepSeek',
    );
  }

  return getMockResponse(scenario.id, turnIndex);
}

function getMockResponse(scenarioId: string, turnIndex: number): AIResponse {
  const turn = getMockTurn(scenarioId, turnIndex);
  if (!turn) {
    return {
      aiText: "That was a great session. Well done on your English today.",
      coachEn: "Excellent work throughout. You handled the conversation professionally.",
      coachCn: "全程表现出色。你以专业的方式处理了对话。",
      coachType: 'positive',
    };
  }
  return {
    aiText: turn.aiText,
    coachEn: turn.coachEn,
    coachCn: turn.coachCn,
    coachType: turn.coachType,
  };
}

async function callClaude(
  scenario: Scenario,
  history: Message[],
  userText: string,
  apiKey: string,
): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(scenario);
  const messages = [
    ...history.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userText },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text ?? '';
  return parseAIResponse(content);
}

// The built-in shared DeepSeek proxy (api/chat.js on Vercel) — no key on device.
async function callProxy(
  scenario: Scenario,
  history: Message[],
  userText: string,
): Promise<AIResponse> {
  const system = buildSystemPrompt(scenario);
  const messages = [
    ...history.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userText },
  ];

  const response = await fetch(PROXY_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, messages }),
  });

  if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
  const data = await response.json();
  return parseAIResponse(data.content ?? '');
}

// Works for any OpenAI-compatible chat API (OpenAI, DeepSeek, etc.)
async function callOpenAICompatible(
  url: string,
  model: string,
  scenario: Scenario,
  history: Message[],
  userText: string,
  apiKey: string,
  providerName: string,
): Promise<AIResponse> {
  const systemPrompt = buildSystemPrompt(scenario);
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userText },
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`${providerName} API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  return parseAIResponse(content);
}

function parseAIResponse(raw: string): AIResponse {
  const coachMatch = raw.match(/COACH:\s*(.+?)(?=COACH_CN:|$)/s);
  const coachCnMatch = raw.match(/COACH_CN:\s*(.+?)$/s);
  const aiText = raw.replace(/COACH:.*/s, '').trim();
  const coachEn = coachMatch?.[1]?.trim() ?? '';
  const coachCn = coachCnMatch?.[1]?.trim() ?? '';

  let coachType: AIResponse['coachType'] = 'phrasing';
  const lower = coachEn.toLowerCase();
  if (lower.includes('great') || lower.includes('perfect') || lower.includes('excellent')) {
    coachType = 'positive';
  } else if (lower.includes("'") && lower.includes('=')) {
    coachType = 'vocabulary';
  }

  return { aiText, coachEn, coachCn, coachType };
}
