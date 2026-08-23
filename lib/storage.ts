import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Phrase {
  id: string;
  en: string;
  cn: string;
  tag: string;
  source: 'practice' | 'manual';
  addedAt: number;
}

export interface AppSettings {
  chineseAssist: boolean;
  apiMode: 'mock' | 'claude' | 'openai' | 'deepseek';
  apiKey: string;
  dailyGoal: number;
  hintsOn: boolean;
  slowMode: boolean;
  dailyReminder: boolean;
  /** auto-speak the AI's reply aloud when it arrives */
  autoSpeak: boolean;
  /** ISO date (yyyy-mm-dd) of the user's next show, or '' if not set */
  showDate: string;
  showName: string;
}

export interface SessionData {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  grade: string;
  turns: number;
  durationMs: number;
  proPhrasesCount: number;
  didWell: Array<{ en: string; cn: string }>;
  tryNext: Array<{ en: string; cn: string }>;
  savedPhrases: Array<{ en: string; cn: string; tag: string }>;
  completedAt: number;
}

export interface WeekProgress {
  weekStart: number;
  sessions: number;
  goal: number;
}

const KEYS = {
  onboarding: '@onstage/onboarding_done',
  phrases: '@onstage/phrases',
  settings: '@onstage/settings',
  progress: '@onstage/progress',
  session: (id: string) => `@onstage/session/${id}`,
  plan: '@onstage/plan',
  deviceCheck: '@onstage/device_check_seen',
  daily: '@onstage/daily',
  glossaryCustom: '@onstage/glossary_custom',
  upgradeCount: '@onstage/upgrade_count',
} as const;

export interface CustomGlossaryTerm {
  term: string;
  definition: string;
  cn: string;
}

export interface DailyProgress {
  /** ISO date (yyyy-mm-dd) the count is for */
  date: string;
  /** scenes completed today */
  count: number;
}

export interface PlanState {
  /** ISO date (yyyy-mm-dd) the user started the 30-day plan */
  startDate: string;
  /** day numbers (1..30) marked complete */
  completedDays: number[];
}

const DEFAULT_SETTINGS: AppSettings = {
  chineseAssist: true,
  apiMode: 'mock',
  apiKey: '',
  dailyGoal: 3,
  hintsOn: true,
  slowMode: false,
  dailyReminder: true,
  autoSpeak: true,
  showDate: '',
  showName: '',
};

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.onboarding);
  return val === 'true';
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboarding, 'true');
}

export async function isDeviceCheckSeen(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.deviceCheck);
  return val === 'true';
}

export async function setDeviceCheckSeen(): Promise<void> {
  await AsyncStorage.setItem(KEYS.deviceCheck, 'true');
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await loadSettings();
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...settings }));
}

export async function loadPhrases(): Promise<Phrase[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.phrases);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function savePhrase(phrase: Omit<Phrase, 'id' | 'addedAt'>): Promise<Phrase> {
  const phrases = await loadPhrases();
  const newPhrase: Phrase = {
    ...phrase,
    id: Date.now().toString(),
    addedAt: Date.now(),
  };
  phrases.unshift(newPhrase);
  await AsyncStorage.setItem(KEYS.phrases, JSON.stringify(phrases));
  return newPhrase;
}

export async function deletePhrase(id: string): Promise<void> {
  const phrases = await loadPhrases();
  const updated = phrases.filter((p) => p.id !== id);
  await AsyncStorage.setItem(KEYS.phrases, JSON.stringify(updated));
}

export async function saveSession(session: SessionData): Promise<void> {
  await AsyncStorage.setItem(KEYS.session(session.id), JSON.stringify(session));
  await incrementWeekProgress();
  // Auto-save session phrases to phrase bank
  for (const p of session.savedPhrases) {
    await savePhrase({ en: p.en, cn: p.cn, tag: p.tag, source: 'practice' });
  }
  // Count toward today's daily scene goal
  await incrementDailyProgress();
  // If a 30-day plan is active, mark today's plan day complete
  const plan = await loadPlan();
  if (plan) {
    const today = planDayNumber(plan.startDate);
    if (today <= 30 && !plan.completedDays.includes(today)) {
      plan.completedDays = [...plan.completedDays, today].sort((a, b) => a - b);
      await AsyncStorage.setItem(KEYS.plan, JSON.stringify(plan));
    }
  }
}

export async function loadDailyProgress(): Promise<DailyProgress> {
  const today = todayISO();
  try {
    const raw = await AsyncStorage.getItem(KEYS.daily);
    if (!raw) return { date: today, count: 0 };
    const d = JSON.parse(raw) as DailyProgress;
    return d.date === today ? d : { date: today, count: 0 };
  } catch {
    return { date: today, count: 0 };
  }
}

async function incrementDailyProgress(): Promise<void> {
  const cur = await loadDailyProgress();
  await AsyncStorage.setItem(
    KEYS.daily,
    JSON.stringify({ date: cur.date, count: cur.count + 1 }),
  );
}

// ── Glossary (custom terms) ─────────────────────────────────────────────────

export async function loadCustomGlossary(): Promise<CustomGlossaryTerm[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.glossaryCustom);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addCustomGlossary(t: CustomGlossaryTerm): Promise<CustomGlossaryTerm[]> {
  const list = await loadCustomGlossary();
  const next = [t, ...list.filter((x) => x.term !== t.term)];
  await AsyncStorage.setItem(KEYS.glossaryCustom, JSON.stringify(next));
  return next;
}

export async function deleteCustomGlossary(term: string): Promise<CustomGlossaryTerm[]> {
  const list = await loadCustomGlossary();
  const next = list.filter((x) => x.term !== term);
  await AsyncStorage.setItem(KEYS.glossaryCustom, JSON.stringify(next));
  return next;
}

// ── Upgrade engine achievements ─────────────────────────────────────────────

export async function loadUpgradeCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.upgradeCount);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function incrementUpgradeCount(): Promise<number> {
  const cur = await loadUpgradeCount();
  const next = cur + 1;
  await AsyncStorage.setItem(KEYS.upgradeCount, String(next));
  return next;
}

export async function loadSession(id: string): Promise<SessionData | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.session(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function loadWeekProgress(): Promise<WeekProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.progress);
    if (!raw) return { weekStart: weekStartTimestamp(), sessions: 0, goal: 5 };
    const data = JSON.parse(raw) as WeekProgress;
    if (data.weekStart < weekStartTimestamp()) {
      return { weekStart: weekStartTimestamp(), sessions: 0, goal: data.goal };
    }
    return data;
  } catch {
    return { weekStart: weekStartTimestamp(), sessions: 0, goal: 5 };
  }
}

async function incrementWeekProgress(): Promise<void> {
  const progress = await loadWeekProgress();
  await AsyncStorage.setItem(
    KEYS.progress,
    JSON.stringify({ ...progress, sessions: progress.sessions + 1 }),
  );
}

function weekStartTimestamp(): number {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.getFullYear(), now.getMonth(), diff).getTime();
}

// ── 30-Day Plan ────────────────────────────────────────────────────────────

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Calendar day of the plan (1-based), given the ISO start date. */
export function planDayNumber(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  if (isNaN(start.getTime())) return 1;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

export async function loadPlan(): Promise<PlanState | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.plan);
    return raw ? (JSON.parse(raw) as PlanState) : null;
  } catch {
    return null;
  }
}

export async function startPlan(): Promise<PlanState> {
  const state: PlanState = { startDate: todayISO(), completedDays: [] };
  await AsyncStorage.setItem(KEYS.plan, JSON.stringify(state));
  return state;
}

export async function resetPlan(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.plan);
}

export async function markPlanDayDone(day: number): Promise<PlanState | null> {
  const plan = await loadPlan();
  if (!plan) return null;
  if (!plan.completedDays.includes(day)) {
    plan.completedDays = [...plan.completedDays, day].sort((a, b) => a - b);
    await AsyncStorage.setItem(KEYS.plan, JSON.stringify(plan));
  }
  return plan;
}
