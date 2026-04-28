# QA And Demo Checklist

Use this checklist at the end of each wave and before any live demo.

## 1. Global App Checks

- No console errors on load, navigation, question answer, reset, preset load, or modal open/close
- No obvious layout shift on first paint or during state reveals
- Fonts appear correctly on first paint
- Sticky status bar and home indicator remain stable during scroll
- Desktop frame and mobile edge-to-edge modes both render correctly

## 2. Reset And Preset Checks

- `Cmd/Ctrl + Shift + R` opens Demo Controls from every major screen
- Gear icon opens Demo Controls from home
- Reset to first launch clears all persisted progress without full reload
- All 5 presets load in under 2 seconds
- Presets route to intended screens with coherent visible state

## 3. Onboarding Checks

- Fresh user enters onboarding from first launch
- Goal selection is single-select and visibly sticky
- Sample puzzle can be completed end-to-end
- Diagnostic resumes correctly after reload at every checkpoint boundary
- Completing onboarding lands on home with recommendation highlight
- Onboarding XP is present while module progress remains at zero

## 4. Home Checks

- Greeting uses profile name
- Current date is present
- Streak and XP render with correct values
- Daily challenge card reflects incomplete/completed state correctly
- Continue-learning hero points to the right module/question
- Preview-only module cards are visible and clearly marked as non-playable
- Weekly heatmap renders with coherent activity intensity

## 5. Module Checks

- Module detail shows stats, primer, and CTA
- Only Foundations enters module detail and question flow
- Preview-only modules do not behave like locked progression
- Re-entering a module resumes at next unanswered question

## 6. Question Engine Checks

- Skeleton appears before content reveal
- Submit is disabled until selection
- Correct path shows success treatment and explanation
- Incorrect path shows error treatment, then correct answer highlight
- Continue advances correctly
- Reload mid-question preserves in-progress state
- Reload after submit preserves answered state without editability

## 7. Daily Challenge Checks

- Same local date yields same challenge across reloads
- Daily completion updates home and daily surfaces
- Daily answer affects XP/streak but not module progress
- 7-day strip shows complete/incomplete outcomes coherently

## 8. Progression Checks

- XP totals and derived level are correct
- Streak increments on new active dates only
- Missed day resets streak or consumes freeze correctly
- Milestone badges unlock at 3, 7, 14, 30, 100 day streaks
- Module-completion and accuracy badges unlock deterministically

## 9. Completion Checks

- Final module question routes into completion screen
- Completion stats are coherent with actual module activity
- New badges show correctly if earned
- Next-module CTA routes correctly

## 10. Sound And Motion Checks

- Tap feedback appears within 100ms
- Count-up and progress animations feel smooth and consistent
- Ambient motion does not compete for attention
- Reduced motion disables nonessential motion
- Skip animations disables motion and sound
- Manual sound toggle persists
- Higher-priority sounds suppress lower-priority ones

## 11. Likely Demo Script Rehearsal

Run this exact walkthrough:
1. Reset to first launch
2. Complete onboarding quickly
3. Show personalized home and daily challenge card
4. Enter module detail
5. Answer a question correctly
6. Return home and confirm preview-only module cards are present
7. Load `Module completion ready`
8. Show the completion screen
9. Load `Power user`
10. Show badges, streak, and populated progress views

The demo is not ready if any step requires explanation like "ignore that" or "that part isn't wired yet."
