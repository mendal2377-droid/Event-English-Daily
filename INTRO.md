# ON STAGE — App Intro

*Last updated: 2026-07-29*

---

## What it is

**ON STAGE** is a mobile app that helps **Chinese event- and exhibition-industry
professionals working overseas** rehearse high-stakes English conversations
*before* they happen — booth pitches, client walkthroughs, day-of crises,
vendor negotiations — in the exact vocabulary of their trade.

The product is **not** "learn English." It's **"don't freeze at the moment that
decides your career."** You practice a specific work scenario with an AI
counterpart, get instant bilingual coaching on your phrasing, and walk away with
the pro phrases saved for review.

**One-line pitch:** *An AI speaking coach that rehearses your next trade show, in
your industry's English, before you fly.*

---

## Who it's for

- **Primary:** immigrated Chinese exhibition / event project managers working
  international shows (Frankfurt, Las Vegas, Dubai, Milan).
- **Wider circle:** any Chinese professional who works overseas trade shows —
  factory sales teams, booth staff, sourcing managers.
- **Core pain (from market research):** the blocker is *psychological, not
  proficiency* — capable readers who freeze on a live booth conversation — and
  the gap is *technical trade vocabulary under pressure*, not grammar.

---

## Core design principles

1. **Rehearse a date, not a streak.** The retention engine is a **show
   countdown** — "🎯 14 days until CES" — that sequences what to practice by how
   close the show is.
2. **Vertical-deep, not generic.** Scenarios use the real phrases of the floor:
   *hard out, ISPM-15, ATA carnet, confidence monitor, drayage, load-in.*
3. **Bilingual, English-lead.** Chinese assist sits *below* English at 75–82%
   size, muted color. It never appears inside chat bubbles, the mic area, or
   grades. A single toggle hides all Chinese for English-only mode.
4. **Speaking-first.** Real voice input, shadowing, and TTS make it about
   *saying* the words, not reading them.
5. **Works with no API and offline.** The whole app runs in Mock Mode — no key,
   no internet — so it's usable on a plane or abroad.

---

## What's in the app today

### 22 scenarios across 3 categories

**On-Site** — Venue Walkthrough · Day-Of Crisis · Staff Briefing · VIP Guest
Issue · Booth Visitor Qualification · Technical Q&A at the Booth · Media
Interview at the Booth · Speaker Green Room

**Business** — Client Concept Pitch · Vendor Negotiation · Post-Event Debrief ·
Sponsorship Pitch · Budget Presentation · Networking Reception · 30-Second
Self-Intro · Post-Show Lead Follow-Up

**Production** — AV & Tech Briefing · Catering Coordination · Stage Manager
Handoff · Customs & Freight Crisis · Show Services Desk · Show Teardown & Strike

Each scenario has an AI role, a 4–6 turn scripted dialogue (mock mode), coach
notes per turn, starter hints, and a set of pro phrases.

### Screens & signature features

| Screen | What it does |
|---|---|
| **Onboarding** | 3 bilingual steps → Device Check → Home |
| **Device Check** | One-time: tells you if your phone can do English **sound** + **voice input**, each with a fix |
| **Home** | Scenario cards, filters, **30-day plan hero**, show countdown, shadowing entry, weekly progress |
| **Practice** | Chat with the AI counterpart, coach notes, hint bar, **real voice mic** (text fallback), 6 turns → result |
| **30-Day Plan** | Day-by-day speaking program toward your show — progress bar, daily task, auto-check |
| **Result** | Measured grade, pro-phrase count, "what you did well / try next," saved phrases |
| **Phrase Bank** | All saved phrases, add/tag/delete, TTS, category filters |
| **Settings** | Chinese Assist, My Next Show, AI provider, daily goal, voice test, device check |

**🗓️ 30-Day Speaking Plan** — the hero. One focused task a day across four
phases (First Impressions → Deals → Build-Up → Show Week), mixing scenarios and
shadowing. Progress bar, "Day N of 30", auto-checks the day when you practice.
Fully offline — built for a countdown to a specific trip.

**🎙️ Real voice input** — on-device speech-to-text (no API key). Tap the mic,
speak, watch your words transcribe, and it auto-submits. Falls back to a text
box where voice isn't available (Expo Go, or a phone without a speech service).

**🎯 Show Countdown** — set your show date in Settings; Home shows days remaining
and recommends a practice phase.

**🗣️ Shadowing Drill** — listen to a pro phrase (TTS) → say it aloud → advance.
Rounds of 10, drawn from your saved phrases first.

### Real scoring (not mocked)
Session grade and "pro phrases" count are **measured** from what you actually
typed: a per-scenario trade-vocabulary dictionary is matched against your
messages, and the grade combines vocabulary usage with response length. More
trade terms → higher grade (A / A- / B+ / B / B-).

---

## How it works under the hood

| Layer | Choice |
|---|---|
| Framework | **Expo SDK 56** (managed), React 19, React Native 0.85 |
| Navigation | **Expo Router** (file-based, typed routes) |
| Speech out | **expo-speech** (system TTS; slow mode = 0.75× rate) |
| Speech in | **expo-speech-recognition** (on-device STT, no API key) |
| Storage | **AsyncStorage** (settings, phrases, sessions, plan — all local) |
| AI | `fetch` dispatcher: **Mock / Claude / OpenAI** |
| Build | **EAS Build** → standalone Android APK (offline, no dev server) |

**Three AI modes:**
- **Mock Mode** (default) — pre-written dialogues, no API key, works offline.
- **Claude / OpenAI** — paste a key for live conversation and coaching.

---

## Device-dependent features (handled gracefully)

Two features depend on the phone's system services. The app **detects each and
falls back cleanly** — it is fully usable with text + reading regardless.

- **Sound (English TTS)** needs an English voice on the device. Some
  Chinese-market phones (Xiaomi/HyperOS) ship without one → speech is silent.
  Fix: install Google Text-to-Speech + English (US) voice. The **Device Check**
  and **Settings → Test English voice** report this and guide the fix.
- **Voice input** needs an Android speech-recognition service (usually Google's).
  Where absent, the mic opens a text box instead. The **Device Check** reports
  this on first launch.

---

## Roadmap

- **Now (this build):** ✅ real on-device voice input, ✅ 30-day plan, ✅ device
  check, ✅ standalone APK — all offline, no API.
- **Next:** live AI conversation via a small backend (adaptive coaching instead
  of scripted), pronunciation scoring, progress curve.
- **V2:** B2B pilot — sell team seats to exhibit builders / agencies, with a
  manager reporting dashboard.
- **V3:** industry packs (Sales, Hotels), human-tutor marketplace, role-play of
  the user's *own* upcoming meeting from their brief.

---

## Building the Android APK (no dev server, use daily, offline)

The project is build-ready (`eas.json` preview profile → APK; expo-doctor 21/21).
Two commands — the first needs your Expo account (free):

```bash
eas login
```

```bash
eas build -p android --profile preview
```

First run creates the project + a keystore (say yes to both), then a cloud build
(~10–20 min) returns a download URL. Install the APK on your phone → it runs like
a normal app, fully offline.

**Quick test in Expo Go first (optional):** `npx expo start`, scan the QR.
Note: voice input only works in the installed APK, not Expo Go.
