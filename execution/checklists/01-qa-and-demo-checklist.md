# QA And Demo Checklist

Use this checklist at the end of each wave and before any live demo.

## 1. Global App Checks

- No console errors on load, navigation, question answer, reset, preset load, or modal open/close
- No obvious layout shift on first paint or during state reveals
- Fonts appear correctly on first paint
- Sticky status bar and home indicator remain stable during scroll
- Desktop frame and mobile edge-to-edge modes both render correctly

## 2. Reset And Preset Checks

- `Cmd/Ctrl + Shift + R` opens Demo Controls from every active screen
- Gear icon opens Demo Controls from home
- Reset to first launch clears all persisted progress without full reload
- All 4 presets load in under 2 seconds
- Presets route to intended active screens with coherent visible state

## 3. First-Run Personalization Checks

- Fresh user enters first-run personalization from first launch
- Goal selection is single-select and visibly sticky
- Display name persists across reload before completion
- Completing personalization lands on home immediately

## 4. Home Checks

- Greeting uses profile name
- Current date is present
- Foundations is the strongest CTA above the fold
- XP and/or level context renders coherently
- Preview-only module cards are visible and clearly marked as non-playable
- Home routes directly into the playable question flow

## 5. Question Engine Checks

- Skeleton appears before content reveal
- Submit is disabled until selection
- Correct path shows success treatment and explanation
- Incorrect path shows error treatment, then correct answer highlight
- Continue advances correctly
- Reload mid-question preserves in-progress state
- Reload after submit preserves answered state without editability

## 6. Completion Checks

- Final module question routes into completion screen
- Completion screen feels definitive and not like a dead end
- Back-home CTA returns to home cleanly

## 7. Likely Demo Script Rehearsal

Run this exact walkthrough:
1. Reset to first launch
2. Complete first-run personalization quickly
3. Show personalized home
4. Enter Foundations
5. Answer a question correctly
6. Return home and confirm preview-only module cards are present
7. Load `Completion ready`
8. Show the completion screen
9. Load `Power user`
10. Reset again

The demo is not ready if any step requires explanation like "ignore that" or "that part isn't wired yet."
