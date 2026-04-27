# Design Contract

This document defines the non-negotiable visual and interaction system for implementation.

## 1. Design Intent

- The app MUST feel premium, serious, futuristic, minimal, and precise.
- The interface MUST read as a dark glass instrument, not a casual quiz game.
- Saturated color MUST be used sparingly.
- Visual polish on visible interactions takes precedence over hidden implementation complexity.

## 2. Token Rules

### Core Colors

- The implementation MUST preserve the PRD token names and values.
- Pure black `#000000` and pure white `#FFFFFF` MUST NOT appear in app UI surfaces or text.
- `brand.solar` MUST remain the primary accent.
- `brand.neural` MUST remain the secondary system/data accent.
- `semantic.success` MUST be reserved for correctness feedback.
- `semantic.error` MUST be reserved for incorrect/destructive states.
- `semantic.warning` MUST be used rarely and only for caution/streak-risk states.

### Spacing

- Only these spacing values are allowed: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
- Any spacing outside this set is a bug unless explicitly approved.

### Typography

- Use Geist Variable and Geist Mono only.
- Only the approved text scales may be used:
  - display
  - h1
  - h2
  - body
  - caption
  - mono

## 3. Surface Rules

- Cards MUST remain mostly dark.
- Selected cards MUST use border/tint/glow treatment, not bright solid fills.
- Large gradients MUST be limited to the four approved cases from the PRD.
- The phone shell MUST feel like black glass hardware with the specified border radius, border, and shadow language.

## 4. Primitive Component Rules

Only the primitives defined in the PRD may act as the default building blocks:
- Button
- Card
- Input
- RadioOption
- TextArea
- ProgressRing
- ProgressBar
- StatTile
- Badge
- Tag
- Skeleton
- Modal
- Toast
- BottomSheet
- IconButton
- Avatar

Rules:
- Screens SHOULD compose primitives rather than redefining local interaction patterns.
- Every primitive MUST define hover, press, focus, and disabled behavior where applicable.
- Inline styles SHOULD be avoided except for tightly scoped dynamic visual calculations.

## 5. Motion Contract

- Framer Motion spring presets from the PRD MUST be centralized.
- Linear easing MUST NOT be used except for shimmer loops and progress fills.
- Numeric counters MUST animate rather than snap.
- Progress indicators MUST animate on mount and update.
- Ambient motion MUST remain subordinate to user action.
- If two ambient animations compete, only one SHOULD run.

## 6. Interaction Feedback Contract

- Every tap-able control MUST show visible feedback within 100ms.
- Selection states MUST be sticky and obvious.
- Disabled states MUST be visually distinct and non-responsive.
- Correct/incorrect answer reveals MUST match the specified ring, tint, pulse, and shake behavior.

## 7. Sound Contract

- Sound MUST be supportive, not primary.
- All sounds MUST be short and cohesive in timbre.
- All sounds MUST preload before first interactive use.
- Lower-priority sounds MUST be dropped, not queued, when a higher-priority sound is active.
- Reduced motion / skip animations mode MUST also disable sound.

## 8. Screen Composition Rules

### Home

- Above-the-fold layout MUST prioritize greeting, streak, XP/level, and daily challenge.
- Continue-learning MUST be visually stronger than the generic module grid.

### Question

- Prompt and options MUST remain the primary focus.
- Explanation MUST appear only after answer reveal.
- Header/footer chrome MUST NOT distract from puzzle content.

### Progress

- Data visualizations MUST use `brand.neural` unless they represent achievement/reward totals.

### Completion

- Completion screen MUST be visually special but restrained.
- Confetti density MUST remain low.

## 9. Accessibility And Design

- Focus rings MUST use the solar border treatment.
- Motion-heavy features MUST degrade cleanly when reduced motion is active.
- Sound-only signaling is forbidden; every audio event MUST have a visual counterpart.

## 10. Design Review Checklist

Design review for any implemented surface MUST verify:
- token compliance
- spacing compliance
- typography compliance
- visible interactive states
- correct accent-color semantics
- absence of off-system gradients or illustrations
- premium restraint rather than game-like saturation
