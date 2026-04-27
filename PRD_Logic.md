# Logic Learning App — Prototype PRD (v3, Eclipse Glass)

## 1. Overview

### 1.1 Purpose
A high-fidelity, demo-ready prototype of a gamified logical reasoning learning app, presented as a mobile experience inside a phone frame on the web. The prototype is built to look and feel like a shipping product for stakeholder demos and user testing — not as a deployable production system.

### 1.2 Guiding Principle
**Build a real-feeling app, not a real app.** Every decision optimizes for the experience of using the prototype, not the engineering correctness of a production system. Artificial delays, faked backends, hardcoded data, and prebuilt question banks are all preferred over their "real" equivalents when they produce a better demo. Conversely, the moments a viewer actually sees and touches — animations, transitions, feedback, polish — are built to a production-quality bar.

### 1.3 Scope Boundaries
**In scope:** Onboarding, question engine, learning modules, progress dashboard, XP/streak system, daily challenge, badges, module completion celebrations, ~120 hand-curated questions across 4 modules, sound design, basic accessibility hygiene (semantic HTML, focus states, contrast, keyboard operability in primary flows).

**Out of scope:** Authentication, real backend, push notifications, social features, payments, progressive difficulty algorithms, analytics pipeline, full accessibility audit and screen reader optimization, internationalization, true offline support, true PWA installability.

### 1.4 Success Criteria
- A first-time viewer can be walked through a 3-minute demo covering onboarding → answering questions → viewing progress → completing a module without any visible bugs, layout breaks, or "this doesn't work yet" moments.
- All primary flows are interactive end-to-end with persisted state across page reloads.
- Visual design reads as a polished, shipping consumer app at first glance.
- The prototype can be reset to a clean state — or jumped to any preset state — in under 2 seconds between demos.

---

## 2. Technical Stack

### 2.1 Core Stack
- **Build tool:** Vite
- **Framework:** React 18 with TypeScript (strict mode enabled)
- **Styling:** Tailwind CSS with a customized theme config (see §4)
- **Animation:** Framer Motion
- **Sound:** Howler.js
- **Icons:** Lucide React
- **State management:** Zustand with a `persist` middleware bound to localStorage
- **Routing:** React Router (memory router, since the app lives inside a phone frame and the URL bar is not part of the UX)
- **Data:** Static JSON files in `/src/data/`, imported at build time
- **Font:** Geist (loaded via @fontsource-variable/geist), with Geist Mono for numeric displays

### 2.2 Persistence Contract
All user state lives in a single Zustand store, persisted to localStorage under one namespaced key (`logic-app-v1`). The store contains:
- User profile (display name, avatar selection, goal selected during onboarding, baseline level)
- XP total, current streak count, longest streak, last-active date (local-calendar ISO string)
- Map of `moduleId → { unlocked, completed, accuracy, questionsAnswered }`
- Map of `questionId → { answered, correct, timestamp }`
- Earned badge IDs
- Daily challenge state: `{ date, questionId, completed, correct }`
- User preferences: `{ soundEnabled, reducedMotion }`

A `resetApp()` action clears the store and returns the app to first-launch state.

### 2.3 Browser Targets
Latest Chrome and Safari only. No IE, no legacy Edge, no polyfills beyond what Vite provides by default.

### 2.4 Phone Frame
A fixed-dimension container (390×844 px, iPhone 14 viewport) centered on a dark canvas at desktop widths ≥ 768px. On viewports < 768px, the frame fills the screen edge-to-edge and the surrounding chrome disappears.

The phone frame should feel like black glass hardware:
- **Outer shell:** `#050507`, radius 48px
- **Inner app surface:** `#08080D`
- **Shell border:** `rgba(255,255,255,0.12)`, 1px
- **Outer shadow:** `0 32px 120px rgba(0,0,0,0.70), 0 0 80px rgba(245,208,111,0.08)` — the second layer is a faint solar bloom that ties the hardware to the brand identity.
- Static notch SVG (Dynamic Island style)
- Status bar with current time (live, updates every minute), full signal bars, full battery — all rendered as inline SVG
- Home indicator bar at the bottom

Content scrolls inside the frame. The status bar and home indicator are always visible (sticky).

---

## 3. Information Architecture

### 3.1 Screens
1. **Splash / first-launch detection** — routes to onboarding if no profile exists, else to home
2. **Onboarding sequence** — 3 narrative moments (see §5.1)
3. **Home / Dashboard** — primary surface, default screen
4. **Module detail** — opened by tapping a module card on home
5. **Question screen** — the core loop
6. **Module completion screen** — celebration + stats
7. **Profile / progress detail** — accessed from a header avatar tap; deeper progress view
8. **Daily challenge screen** — variant of question screen with distinct framing

### 3.2 Navigation Model
- Bottom tab bar with three tabs: **Learn** (home), **Progress** (profile), **Daily** (today's challenge)
- Modal-style stacking for question screens (slides up from bottom, dismissible)
- Forward navigation slides right; back navigation slides left; tab switches cross-fade

---

## 4. Visual Design System

### 4.1 Color Tokens — Eclipse Glass

**Eclipse Glass:** a premium black-glass interface with warm solar-gold identity accents, subtle neural-blue system glows, warm off-white typography, and restrained semantic feedback. The product should feel like a serious cognitive performance instrument: futuristic, minimal, luminous, and precise.

The UI should feel:
- Premium, serious, and intelligent
- Dark-night and futuristic, but not neon-heavy
- Minimal, glassy, and cinematic
- More like a cognitive performance instrument than a casual game

#### Core background tokens

| Token | Value | Usage |
|---|---:|---|
| `bg.canvas` | `#030305` | Outside the phone frame. Nearly black with a subtle warm undertone. |
| `bg.app` | `#08080D` | Main app background inside the phone frame. |
| `bg.surface` | `#111119` | Default card and elevated panel background. |
| `bg.surface-2` | `#1A1A25` | Interactive cards, selected surfaces, inputs, and hover states. |
| `bg.surface-3` | `#232333` | Stronger raised surfaces, progress tracks, active module cards. |
| `bg.glass` | `rgba(17,17,25,0.74)` | Translucent glass panels and overlays. |
| `bg.scrim` | `rgba(3,3,5,0.72)` | Modal/backdrop overlay. |

#### Border tokens

| Token | Value | Usage |
|---|---:|---|
| `border.subtle` | `rgba(255,255,255,0.08)` | Default card borders and dividers. |
| `border.strong` | `rgba(255,255,255,0.16)` | Active cards, modal edges, and high-emphasis surfaces. |
| `border.solar` | `rgba(245,208,111,0.45)` | Selected states, primary focus rings, current module border. |
| `border.neural` | `rgba(142,167,255,0.38)` | Visual puzzle borders, secondary active states, charts. |

#### Text tokens

| Token | Value | Usage |
|---|---:|---|
| `text.primary` | `#F2F0EA` | Primary text. Warm off-white, never pure white. |
| `text.secondary` | `#B6B2A8` | Supporting copy, labels, subtitles. |
| `text.tertiary` | `#77747D` | Muted metadata, timestamps, disabled labels. |
| `text.inverse` | `#08080D` | Text on bright solar-gold buttons. |

#### Brand tokens

| Token | Value | Usage |
|---|---:|---|
| `brand.solar` | `#F5D06F` | Primary brand accent. Used for primary CTAs, active module state, XP, level, current progress, and major completion moments. |
| `brand.solar-muted` | `rgba(245,208,111,0.14)` | Muted background tint for selected cards and active states. |
| `brand.solar-glow` | `rgba(245,208,111,0.24)` | Soft corona glow behind primary CTAs, active modules, and completion states. |
| `brand.neural` | `#8EA7FF` | Secondary accent. Used for visual puzzle linework, charts, module illustrations, and subtle AI/logic-system details. |
| `brand.neural-muted` | `rgba(142,167,255,0.14)` | Muted neural-blue background tint. |
| `brand.neural-glow` | `rgba(142,167,255,0.22)` | Secondary glow for puzzle graphics, progress visuals, and dashboard data. |

#### Semantic tokens

| Token | Value | Usage |
|---|---:|---|
| `semantic.success` | `#7CFFB2` | Correct-answer state only. Do not use as the brand accent. |
| `semantic.success-muted` | `rgba(124,255,178,0.13)` | Correct-answer background tint. |
| `semantic.error` | `#FF6B7A` | Incorrect-answer state and destructive demo controls only. |
| `semantic.error-muted` | `rgba(255,107,122,0.13)` | Incorrect-answer background tint. |
| `semantic.warning` | `#FFD166` | Streak risk, reminder states, rare caution states. |
| `semantic.warning-muted` | `rgba(255,209,102,0.13)` | Warning background tint. |

#### Color usage rules

1. **`brand.solar` is the primary identity color.** Use it for: primary buttons, current module state, XP, level indicators, selected goal cards, module completion moments, active progress rings.
2. **`brand.neural` is the secondary intelligence/system color.** Use it for: visual puzzle linework, charts and heatmaps, skill graphs, secondary illustrations, subtle module accents, AI/futuristic decorative geometry.
3. **`semantic.success` is for correct-answer feedback only.** Do not use green for generic progress, CTAs, streaks, or brand moments.
4. **`semantic.error` is for incorrect-answer feedback and destructive demo controls only.**
5. **`semantic.warning` should be rare** — streak risk, caution states, or one-time reminder affordances.
6. **Premium feel comes from restraint.** Avoid large blocks of saturated color. Favor: dark surfaces, thin luminous borders, restrained glow, warm off-white text, small precise accent usage.
7. **Never use pure black `#000000` or pure white `#FFFFFF`** in the app UI.
8. **Cards remain mostly dark.** Selected cards use a subtle solar border and muted solar background, not a bright fill.
9. **Visual puzzle SVGs use `brand.neural`** for geometric linework, with `brand.solar` reserved for the active, missing, or selected element.

### 4.2 Approved Gradients & Glows

Gradients are not decorative. They should feel like controlled light inside a dark glass interface. Only the four uses below are permitted. No other gradients may be added without an explicit update to this design system.

**1. App background glow** — applied to the main app surface inside the phone frame, providing subtle cinematic depth.

```css
background:
  radial-gradient(circle at 50% -10%, rgba(245,208,111,0.18), transparent 38%),
  radial-gradient(circle at 90% 20%, rgba(142,167,255,0.12), transparent 34%),
  #08080D;
```

**2. Active-card glow** — applied to active module hero cards, the daily challenge card, primary CTAs.

```css
box-shadow:
  0 0 0 1px rgba(245,208,111,0.28),
  0 0 36px rgba(245,208,111,0.14);
```

**3. Neural / puzzle glow** — applied to visual puzzle containers, chart cards, data-oriented dashboard surfaces.

```css
box-shadow:
  0 0 0 1px rgba(142,167,255,0.24),
  0 0 32px rgba(142,167,255,0.12);
```

**4. Completion / corona gradient** — module completion screen background only.

```css
background:
  radial-gradient(circle at 50% 0%, rgba(245,208,111,0.28), transparent 42%),
  radial-gradient(circle at 20% 25%, rgba(142,167,255,0.16), transparent 34%),
  #08080D;
```

### 4.3 Typography
- **Font:** Geist Variable (weights 400/500/600/700)
- **Mono font:** Geist Mono (used for numeric displays — XP, streaks, timers)
- **Scale (only these are allowed):**
  - `display`: 36px / 700 / -0.02em
  - `h1`: 28px / 600 / -0.01em
  - `h2`: 20px / 600 / 0
  - `body`: 16px / 400 / 0
  - `caption`: 13px / 500 / 0.01em
  - `mono`: Geist Mono, 16px / 500
- All text uses `text.primary` by default. `text.secondary` for supporting copy, `text.tertiary` for muted metadata.

### 4.4 Spacing
4px base unit. Tailwind defaults aligned to this. Permitted values only: 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Anything else is a bug.

### 4.5 Component Primitives
A `/src/components/ui/` folder containing the only allowed building blocks. Screens compose these — they do not write inline styles.
- `Button` (variants: primary, secondary, ghost; sizes: sm, md, lg)
- `Card` (variants: default, interactive, selected, hero — hero variant carries the active-card glow)
- `Input`, `RadioOption`, `TextArea`
- `ProgressRing` (animated, configurable size; default fill `brand.solar`, data-mode fill `brand.neural`)
- `ProgressBar` (animated fill from 0; same color modes as ProgressRing)
- `StatTile` (number + label, count-up animation)
- `Badge` (icon + label)
- `Tag` (small label chip)
- `Skeleton` (shimmer loader)
- `Modal`, `Toast`, `BottomSheet`
- `IconButton`
- `Avatar`

Every primitive ships with hover, press, focus, and disabled states.

### 4.6 Component Color Behavior

**Primary button**
- Background: `brand.solar`
- Text: `text.inverse`
- Shadow: `0 0 32px rgba(245,208,111,0.24)`
- Hover: slightly brighter solar glow
- Disabled: `bg.surface-2`, `text.tertiary`, no glow

**Secondary button**
- Background: `bg.surface-2`
- Border: `border.subtle`
- Text: `text.primary`
- Hover border: `border.strong`

**Interactive card**
- Background: `bg.surface`
- Border: `border.subtle`
- Hover background: `bg.surface-2`
- Hover border: `border.strong`
- Selected border: `border.solar`
- Selected background: `brand.solar-muted`
- Selected shadow: active-card glow (§4.2.2)

**Correct answer state**
- Border: `semantic.success`
- Background: `semantic.success-muted`
- Text remains `text.primary`
- Glow is subtle, never arcade-like

**Incorrect answer state**
- Border: `semantic.error`
- Background: `semantic.error-muted`
- Text remains `text.primary`

**Progress rings and bars**
- Default track: `bg.surface-3`
- General progress fill: `brand.solar`
- Data / skill graph lines: `brand.neural`
- Correctness-specific progress: `semantic.success` only when the metric explicitly means correctness

**Streak**
- Use `brand.solar`, not orange flame.
- The streak icon is a solar flare/corona, not a cartoon fire. Custom SVG (see §4.7).
- `semantic.warning` only when the streak is at risk.

**Badges**
- Badge shell: `bg.surface-2`
- Badge border: `border.subtle`
- Earned badge accent: `brand.solar`
- Skill / logic badge linework: `brand.neural`
- Locked badge: `text.tertiary` over `bg.surface`

**Module completion screen**
- Background: completion / corona gradient (§4.2.4)
- Headline text: `text.primary`
- XP and primary reward: `brand.solar`
- Newly unlocked module / path accents: `brand.neural`
- Confetti, if used, restricted to solar, neural, and off-white particles — restrained density

### 4.7 Iconography
Lucide React only. Stroke width 1.75. Size in steps of 16, 20, 24. No custom SVG icons except for: app logo, badge artwork, the visual puzzle renderers, avatar set, and the **solar corona** streak icon (radial rays around a glowing center, rendered in `brand.solar`).

---

## 5. Feature Specifications

### 5.1 Onboarding

**Purpose:** Capture goal + baseline, demonstrate product value within 60 seconds, populate enough state to make the home screen feel personalized. The viewer should reach the personalized home reveal quickly — onboarding must not be a slog.

**Three narrative moments (with sub-steps inside each):**

**Moment 1 — Welcome & Goal**
- Welcome screen: animated logo, single tagline, "Get Started" button (primary, solar).
- Goal selection: "What are you preparing for?" Options: LSAT, GRE, Job interviews, General reasoning, Just curious. Single-select tappable cards. Selected card uses solar border + `brand.solar-muted` background per §4.6.

**Moment 2 — Sample Puzzle**
- One easy syllogism question, answered inline. Full question UX (selection → submit → reveal → explanation).
- This is the "aha" moment — the viewer sees the core loop before any commitment.

**Moment 3 — Diagnostic & Reveal**
- Baseline quiz: 5 real questions of varying difficulty across categories. Progress dots at top. No skip.
- Lightweight profile setup at the end of the diagnostic, presented as part of the result: pick a display name (free text, max 20 chars) and an avatar from 6 geometric SVG options. Single screen, two fields.
- Personalized home reveal: animated transition into home, with the user's recommended starting module highlighted (solar border + active-card glow) and a brief "Based on your diagnostic, start here" callout.

**Behavior contract:**
- Onboarding state is checkpointed per step. Closing the tab and returning resumes at the last completed step.
- Baseline quiz score determines starting "level" (1–3) which affects which module is recommended first. It does not affect which questions appear within modules.
- **Onboarding activity contributes XP, but does not contribute to module progress or `questionsAnswered` counts.** This keeps the dashboard from being polluted by diagnostic activity. The home screen shows the user as "0 questions answered in modules" right after onboarding, with XP already populated — which makes the first module entry feel like a real start.

### 5.2 Question Engine

**Purpose:** The atomic unit of the product. Must feel fast, fair, and rewarding.

**Question types:**
- **Multiple choice text** (4 options, one correct)
- **Multiple choice visual** (4 SVG-rendered options, one correct)
- **Sequence completion** (visual or symbolic, choose the next item from 4 options)
- **Matrix puzzle** (3×3 grid, one cell missing, 6 candidate answers in a row below)
- **Odd one out** (4 items, one different)

All types share one core component shell. They differ only in the prompt body and option renderer.

**Question lifecycle:**
1. Question loads with a 200ms skeleton state.
2. Prompt animates in (fade + 8px upward translate).
3. Options stagger in at 40ms intervals.
4. User selects an option — option scales briefly (0.97), gets a `border.solar` selected ring.
5. User taps "Submit." Submit button is disabled until a selection is made.
6. ~250ms artificial delay (with subtle button loading state) — sells the "real backend" feel.
7. Result reveal:
   - Correct: `semantic.success` ring on selected option, soft pulse, `semantic.success-muted` background tint, +XP count-up appears (in `brand.solar`), optional restrained confetti for streak milestones, correct chime sound.
   - Incorrect: `semantic.error` ring on selected option, shake animation (3 cycles, 4px), correct answer highlights with the `semantic.success` ring after 200ms, soft thud sound.
8. Explanation panel slides up from the bottom of the question area. Always shown, regardless of correct/incorrect. 1–2 sentences.
9. "Continue" button replaces "Submit." Tap advances to next question or to module completion if last.

**Behavior contract:**
- A question, once answered, is marked as answered in the store with timestamp and correctness. Re-entering the module shows the next unanswered question.
- The user cannot change their answer after submitting.
- If the user backgrounds the app mid-question, state is preserved. The question is not auto-marked.
- XP rewards: +10 for correct, +2 for incorrect (consolation, encourages continued attempts). +25 bonus for module completion. +50 for daily challenge correct.

### 5.3 Question Bank

**Volume target:** 120 questions total, distributed across 4 modules at 30 questions each. Fewer questions, ruthlessly polished — every question is hand-validated for clarity, exactly one defensible correct answer, and a clean explanation.

**The four modules:**
1. **Foundations** — Syllogisms, validity, basic deductive structure. Beginner-level entry point. Predominantly text MCQ, with **4–5 visual analogy questions interspersed** to keep the module visually alive.
2. **Conditional Reasoning** — If/then logic, contrapositive, modus ponens/tollens, common conditional fallacies. Predominantly text MCQ, with **2–3 visual conditional puzzles** (e.g., flowchart-style diagrams rendered as SVG) to break up the text density.
3. **Logical Fallacies** — Identifying fallacies in short arguments: ad hominem, strawman, slippery slope, false dichotomy, etc. Pure text MCQ, scenario-driven. Visual variety here comes from the scenario styling, not the question type.
4. **Visual Patterns** — Matrix puzzles, sequence completion, odd-one-out, shape rotation. The "IQ test feel" module. Fully SVG-rendered.

This selection covers the breadth of reasoning categories while letting each module have a distinct visual and pedagogical character. The deliberate sprinkling of visual questions across the text-heavy modules ensures the app feels visually rich throughout — not just inside one module.

**Generation pipeline (one-time, build-time only):**
- Authored as JSON via LLM, manually validated by the team.
- Each question schema:
  - `id` (stable string, e.g. `mod_conditional_q012`)
  - `moduleId`
  - `type` (one of the 5 above)
  - `difficulty` (1–3)
  - `prompt` (string for text, or structured object for visual)
  - `options` (array of 4 — strings or structured visual specs)
  - `correctIndex` (0–3)
  - `explanation` (string, 1–2 sentences)
  - `tags` (array, e.g. `["conditional", "modus-ponens"]`)
  - `dailyEligible` (boolean — see §5.8)

**Visual question specs:** Visual content is **never** stored as image files. It is stored as a structured JSON spec consumed by a typed renderer component. Examples:
- Matrix: `{ grid: [[cell, cell, null], ...], options: [cell, cell, ...] }` where `cell = { shape, rotation, fill, count, color }`.
- Sequence: `{ items: [cell, cell, cell, "?"], options: [cell, ...] }`.
- Shape rotation: `{ base: cell, transform: "rotate90" | "mirror" | ..., options: [cell, ...] }`.

**Renderer contract:** A `<VisualPuzzle spec={...} />` component dispatches to the appropriate sub-renderer based on `type`. All sub-renderers output pure SVG, themed via the design tokens — no raster, no external assets. Renderers must be deterministic: same spec → identical output.

**Visual puzzle palette:** All puzzle linework defaults to `brand.neural`. The active, missing, or selected element uses `brand.solar`. Backgrounds use `bg.surface` or `bg.surface-2`. Puzzle containers carry the neural / puzzle glow (§4.2.3).

**Validation gate:** Every authored question passes an automated check that an LLM, given the prompt and options, selects the correct option zero-shot with high confidence. Failures are reviewed manually or discarded. Because the bank is small, every question also gets a human read-through.

### 5.4 Learning Module System

**Module data schema:**
- `id`, `title`, `subtitle`, `iconName` (Lucide), `accentShape` (one of ~8 geometric SVG illustrations rendered in `brand.neural`), `difficulty` (Beginner/Intermediate/Advanced), `questionIds` (ordered array), `prerequisiteModuleId` (optional)

**Module detail screen contract:**
- Header with the module's accent shape SVG (neural blue), title, subtitle, difficulty tag. Hero card carries the active-card glow (§4.2.2).
- Progress ring showing % complete — fill in `brand.solar`.
- Stats row: questions answered, accuracy, XP earned from this module. XP value rendered in `brand.solar`.
- "Continue" or "Start" button — primary, solar.
- Concept primer (3–5 sentences) shown before the user has answered any questions in the module; collapsed to a "Review concept" link afterward.

**Unlock logic:** A module unlocks when its prerequisite is ≥80% complete. Locked modules are visible but rendered with a lock icon and reduced opacity (no glow, `text.tertiary` labels). Tapping a locked module shows a toast indicating which module to complete first.

Default unlock state: Foundations is unlocked at start; the rest follow the order above.

### 5.5 Home / Dashboard

**Above the fold (visible without scrolling):**
- Greeting ("Good morning, {name}") with current date — `text.primary`
- Streak counter (solar corona icon + day count). The corona icon pulses gently when streak ≥ 3 (see §6.5).
- XP total (Geist Mono, `brand.solar`, count-up animated on first render). Level chip next to it uses `brand.solar` text on `brand.solar-muted` background.
- Daily challenge card — prominent, today's date, "Take today's challenge" CTA, completion state if done. Hero variant with active-card glow.

**Below the fold:**
- "Continue learning" — the next-up module rendered as a hero card with progress (active-card glow)
- "All modules" — grid of module cards, locked states visible
- Recent activity strip — last 3 milestones (e.g., "Completed Foundations Lesson 4")
- Weekly heatmap — 7-day strip showing activity intensity. Cells use `brand.neural` at varying opacity (data-oriented visualization → neural blue).

The home background uses the app background glow (§4.2.1).

### 5.6 Progress / Profile Screen

A deeper view of all stats:
- Avatar, name, member-since date (faked: derived from baseline-quiz-date)
- Large stat tiles: total XP (solar), current streak (solar), longest streak (solar), modules completed (solar), overall accuracy (solar — represents personal achievement, not correctness-of-an-answer)
- 30-day activity heatmap (7 cols × ~5 rows). Cells use `brand.neural` opacity ramp.
- Earned badges grid; unearned badges shown locked
- Per-module accuracy breakdown (horizontal bars). Bars use `brand.neural` for the data visualization.

### 5.7 XP & Streak System

**XP rules:** +10 correct, +2 incorrect, +25 module complete, +50 daily challenge. Onboarding diagnostic awards XP at the same rates.

**Streak rules:**
- A streak day is any **local calendar day** with at least one question answered. Local calendar days match the user's intuition and the phone-frame's displayed time.
- If a local calendar day passes without activity (last-active local date is more than 1 day before today's local date), streak resets to 0.
- A "streak freeze" badge can save one missed day — automatic if earned, used silently. No more than one freeze in flight.
- Streak milestones (3, 7, 14, 30, 100 days) trigger a celebratory toast and unlock a corresponding badge.
- Streak-at-risk state (last activity > 18 hours ago, today not yet logged) shifts the streak number to `semantic.warning` and adds a subtle pulse.

**XP visualization:** XP total is always shown via the count-up component in `brand.solar`. A "level" is derived from XP (level = floor(XP / 200) + 1) and displayed as a small chip next to the XP number.

### 5.8 Daily Challenge

**Behavior:**
- One question per local calendar day, deterministically selected from a **dedicated curated subset** of questions flagged with `dailyEligible: true`. This subset contains only the most polished, visually striking, and unambiguous questions — the daily challenge is one of the highest-visibility surfaces in the demo, and every question shown there must be display-quality.
- Selection: `hash(localDate) % dailyPool.length`. Same date → same question, even across reloads.
- Worth +50 XP if correct, +5 if incorrect.
- Completion state is shown on the home card and the Daily tab.
- A 7-day strip on the Daily tab shows past challenge results (✓ in `semantic.success`, ✗ in `semantic.error`, or empty in `bg.surface-3`).

### 5.9 Badges

**Badge categories:**
- Streak badges (3, 7, 14, 30, 100 days)
- Module-completion badges (one per module)
- Accuracy badges (90%+ on a module, 100% on a module)
- Volume badges (50, 100, 250 questions answered)
- Daily challenge badges (5, 25, 100 daily challenges completed)

**Visual treatment per §4.6:**
- Earned badge shell: `bg.surface-2` with `border.subtle`, accent icon in `brand.solar`, supporting linework (e.g., orbital rings, geometric details) in `brand.neural`.
- Locked badge: `bg.surface`, `text.tertiary` artwork, no glow.

**Earning UX:** When a badge is earned, a celebration toast appears: badge artwork scales in with a spring, label below, auto-dismisses after 3 seconds. A short sparkle sound plays. Tappable to view in the badges grid.

### 5.10 Module Completion Screen

Triggered when the last question of a module is answered. Full-screen takeover (not a toast):
- Background: completion / corona gradient (§4.2.4)
- Restrained confetti burst on entry (one time only) — particles limited to solar, neural, and off-white colors
- Module completion sound (celebratory triad)
- "Module Complete" headline in `text.primary`
- Stats: questions answered, accuracy %, XP earned (in `brand.solar`), time spent (rough)
- Any newly unlocked badges shown with their reveal animation
- Newly unlocked next-module preview accent in `brand.neural`
- "Next module" CTA → primary solar button → routes to the next module's detail screen
- "Back to home" secondary CTA

---

## 6. Hyper-Interactivity Specification

This is what separates the prototype from a generic CRUD app. Treat as requirements, not polish.

### 6.1 Motion System
- All transitions use Framer Motion springs. **Default spring:** `{ stiffness: 400, damping: 30 }`. **Bounce spring** (celebrations): `{ stiffness: 300, damping: 15 }`. **Subtle spring** (small UI shifts): `{ stiffness: 500, damping: 40 }`. Linear easing is forbidden except for shimmer loops and progress fills.
- All numeric displays (XP, streaks, accuracy %, timer) animate via count-up. Never snap to a new value.
- All progress fills (rings, bars) animate from 0 on first mount, and from old value to new value on update. Duration scales with delta.

### 6.2 Per-Element Behaviors
- **Buttons:** scale 0.97 on press, 100ms response. Ghost variants get a background flash. Primary buttons have a solar inner highlight that brightens on hover.
- **Cards (interactive):** lift 2px on hover, scale 0.98 on press. Hover transitions to `bg.surface-2` and `border.strong`.
- **Tab switches:** cross-fade content with a 4px vertical translate.
- **Screen transitions:** forward navigation slides content in from right (24px translate + fade); back navigation reverses.
- **Modals/bottom sheets:** spring in from bottom; backdrop (`bg.scrim`) fades in over 200ms.
- **Question entry:** prompt fades + translates 8px up; options stagger in at 40ms intervals.
- **Correct answer reveal:** target option gets a `semantic.success` ring (animated stroke), 0.97→1.03→1.0 scale pulse, `semantic.success-muted` background fades in. Total XP count-up runs in the header (count-up uses `brand.solar`).
- **Incorrect answer:** `semantic.error` ring, 3-cycle 4px horizontal shake, after 200ms the correct option highlights with the same `semantic.success` ring.
- **Streak milestone:** restrained corona-themed confetti from top, solar corona icon scales 1.0→1.4→1.0 with a brief solar glow flare, toast slides down.
- **Module completion:** restrained confetti (solar/neural/off-white), stat tiles count up sequentially (200ms apart), badges (if any) reveal with spring scale, completion / corona gradient fades in behind.

**Nice-to-have (build only if time permits):** XP chip flying from the answered option to the header XP counter and merging into the count-up. This is fiddly to coordinate inside a scrollable phone frame with a sticky header and varying question heights — high-impact when it works, but easy to break. The count-up alone is sufficient to convey the reward.

### 6.3 Loading & Empty States
- Every async-feeling operation gets a skeleton, never a spinner.
- Skeletons use a shimmer animation over `bg.surface-2` (linear gradient sweep, 1.5s loop).
- Artificial delays:
  - Question submit: 250ms
  - Module load: 200ms
  - Onboarding step transitions: 150ms
- Empty states (e.g., no badges yet) show illustrated empty SVGs in `brand.neural` line art with helpful copy, never blank space.

### 6.4 Micro-Feedback
- Every tap on an interactive element has a visible response within 100ms.
- Selection states are sticky and obvious (solar ring + `brand.solar-muted` tint).
- Disabled states are visibly different (opacity 0.4, no hover response).
- Focus rings use `border.solar` for keyboard users.

### 6.5 Ambient Motion
- The solar corona streak icon has a slow pulse loop (when streak ≥ 3) — opacity oscillates between 0.85 and 1.0 over ~2.5s. When the streak is at risk, the pulse warms into `semantic.warning` instead of solar.
- The daily challenge card pulses gently (scale 1.0→1.01→1.0 over 3s) until interacted with — once.
- The app background glow (§4.2.1) is static — its presence is enough; it does not animate.

Ambient motion must never compete for attention. If two ambient animations would be on-screen, only the more recent or contextually relevant one runs.

### 6.6 Sound Design

Sound is an addon to the interactivity system. It layers onto existing visual feedback — never the primary signal, always supportive. The principles mirror motion: subtle, restrained, consistent.

**Library:** Howler.js. All sounds preloaded at app initialization so there is no first-play latency.

**Sound events (mapped to existing interactions):**
- **Soft click** — any primary button tap. Very low gain (~20%).
- **Selection tick** — option selection in question screen, goal selection cards. Lighter than the click.
- **Correct chime** — correct answer reveal. Short, warm, two-note ascending. ~400ms.
- **Incorrect thud** — incorrect answer reveal. Soft, low, non-punishing. ~250ms. Must not feel like a buzzer.
- **XP gain whoosh** — quiet rising tone synced with count-up animation. Plays only on correct answers.
- **Streak milestone fanfare** — slightly more elaborate chime, plays with the milestone toast.
- **Badge sparkle** — short shimmer, plays with badge earned toast.
- **Module complete triad** — three-note celebratory motif, plays with the completion screen.
- **Toast appear** — subtle pop, very low gain.

**Behavior contract:**
- Default state: enabled. The app should sound alive on first launch.
- Toggleable globally via:
  - A small speaker icon in the home screen header (one-tap mute, persists across sessions)
  - The demo menu (§7)
- A `reducedMotion` system preference also disables sound (respect user accessibility settings).
- All sounds are short (under 600ms) and use the same harmonic palette so they feel like one family — a warm, slightly synthetic timbre that matches the Eclipse Glass identity (think glass tone, not arcade).
- No sound ever plays simultaneously with another sound of higher importance. Priority order: module complete > badge > streak milestone > correct/incorrect > UI clicks. Lower-priority sounds are dropped, not queued.
- Sounds must not play during the demo menu's "Skip animations" mode — that mode is for screenshot capture and silence is expected.

**Asset format:** All sounds as compressed MP3 or OGG, < 20 KB each, total bundle impact < 200 KB.

---

## 7. Demo Mode & Reset System

The reset system is a first-class feature, not a debug afterthought. Because localStorage persists between sessions, a clean reset before every walkthrough is essential.

### 7.1 Access Methods
Two redundant access paths, both must work:
1. **Keyboard shortcut:** `Cmd/Ctrl + Shift + R` opens the demo menu from any screen.
2. **Settings icon:** A small gear icon in the top-right of the home screen header opens the same menu.

### 7.2 Demo Menu Contents
A bottom sheet labeled "Demo Controls" containing:
- **Reset to first launch** — clears localStorage, returns to the welcome screen. Confirmation prompt: "This will erase all progress. Continue?" The destructive confirm button uses `semantic.error`.
- **Skip-to-state shortcuts** — preset states for fast demo setup:
  - "Fresh user" (default first-launch state)
  - "Mid-Foundations" (3 questions answered, streak day 1)
  - "Streak day 6" (one question away from a 7-day streak badge)
  - "Module completion ready" (one question away from finishing Foundations)
  - "Power user" (multiple modules completed, 14-day streak, several badges)
- **Toggle: Sound enabled** — global mute.
- **Toggle: Skip animations** — for capturing screenshots; disables motion and sound globally.
- **Toggle: Show grid overlay** — for design review; overlays the 4px spacing grid.
- **App version** — shown at the bottom for sanity.

### 7.3 Behavior Contract
- The menu is visually consistent with the rest of the app (uses the same `BottomSheet` primitive, `bg.glass` panel).
- All preset states load in under 1 second and route the user to the most relevant screen for that state (e.g., "Module completion ready" routes to the next question in Foundations; "Power user" routes to the progress screen).
- The keyboard shortcut works on every screen, including modals and the question screen.
- The reset is instant from the user's perspective — no page reload, just state clear and route to welcome.

---

## 8. File & Folder Structure

```
tailwind.config.ts          # at project root, where Tailwind expects it
vite.config.ts
src/
  components/
    ui/                     # primitives only
    layout/                 # PhoneFrame, StatusBar, TabBar
    puzzles/                # VisualPuzzle and renderers per type
    feedback/               # Toast, Confetti, RewardChip
    demo/                   # DemoMenu, preset state loaders
  screens/
    onboarding/
    home/
    module/
    question/
    progress/
    daily/
  store/                    # Zustand store + slices
  data/
    modules.json
    questions/              # one file per module
    badges.json
    presets.ts              # demo preset states
  lib/
    xp.ts                   # XP rules, level calc
    streak.ts               # streak math (local-calendar based)
    daily.ts                # daily challenge selection
    motion.ts               # shared spring presets
    sound.ts                # Howler instances + priority controller
  hooks/
    useKeyboardShortcut.ts
    useSound.ts
  assets/
    sounds/                 # short MP3/OGG files
  styles/
    globals.css
  App.tsx
  main.tsx
```

---

## 9. Demo Readiness Requirements

The prototype must satisfy these specifically because it will be demoed live:

1. **No console errors** at any point in any flow. Strict TypeScript build must pass.
2. **No layout shift** on any screen. Every section reserves its final height.
3. **Loads in under 2 seconds** on a typical laptop. Code-split routes if bundle size becomes an issue.
4. **Reset is fast and reliable** — see §7.
5. **Looks correct on first paint** — no flash of unstyled content, no late-loading fonts. Geist must be inlined or preloaded.
6. **Sounds preloaded before first interactive screen.**
7. **All four demo preset states reachable in under 2 seconds**, since live demos may switch between them.

---

## 10. Build Sequence

Each step is independently demoable. Visual puzzles and key preset states are pulled forward to ensure the app feels visually differentiated and demo-ready as early as possible.

1. Phone frame (black-glass hardware spec) + Eclipse Glass design tokens + UI primitives
2. Zustand store + persistence + reset action
3. Demo menu shell (keyboard shortcut + gear icon, reset only — presets added later)
4. Question engine shell (text MCQ, full lifecycle)
5. **First visual puzzle renderer (matrix)** — integrated into the question engine, even if crude. This locks in the SVG architecture and the neural-blue puzzle palette, ensuring the prototype feels visually distinctive from a generic quiz app from day one.
6. Module detail + home dashboard skeletons (with app background glow applied)
7. Onboarding flow end-to-end (3 narrative moments)
8. Remaining visual puzzle renderers (sequence, odd-one-out, rotation)
9. Question bank generation + integration (all 4 modules, with visual sprinkles in Foundations and Conditional Reasoning)
10. Streaks (local-calendar based, solar corona icon), XP count-up in solar, milestone toasts
11. **"Module completion ready" + "Power user" preset states** — built early so the most impressive screens (completion gradient, populated dashboard) can be tested without replaying the full app
12. Daily challenge + dailyEligible curation pass
13. Badges + module completion screen (corona gradient background)
14. Progress/profile screen (neural-blue heatmap and accuracy bars)
15. Remaining demo menu preset states ("Fresh user," "Mid-Foundations," "Streak day 6")
16. Sound design integration (preload, priority controller, all event mappings)
17. Hyper-interactivity polish pass: ambient motion, springs, glow tuning across active cards
18. Demo prep: dry runs, polish on the three screens most likely to be shown
