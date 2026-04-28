# Ambiguities And Decisions

This document records contradictions, inferred defaults, and open questions from the PRD. Agents MUST read this before implementing.

## 1. Resolved For Execution

### A1. Demo preset count contradiction

PRD conflict:
- §7.2 defines 5 preset states
- §9 says "All four demo preset states reachable in under 2 seconds"

Execution decision:
- Implement 5 presets.
- Treat the §9 count of 4 as a stale reference.

Reason:
- §7.2 is explicit and enumerated.

### A2. Daily challenge interaction with module progress

PRD ambiguity:
- Daily questions are selected from the authored question bank.
- It is not explicit whether answering a daily question also advances module progress.

Execution decision:
- Daily challenge completion DOES NOT affect module progression or module question completion.
- It DOES affect XP, streak, badge counters tied to total answered volume, and daily history.

Reason:
- Daily is a distinct surface and reward loop. Sharing completion with modules would create confusing cross-surface side effects in demos.

### A3. Onboarding checkpoint granularity

PRD ambiguity:
- "Checkpointed per step" is specified, but step boundaries are not fully enumerated.

Execution decision:
- Checkpoints occur after:
  - welcome CTA
  - goal selection
  - sample puzzle completion
  - each diagnostic question submission
  - profile setup completion

Reason:
- This is fine-grained enough to survive interruptions without replaying meaningful work.

### A4. Baseline level thresholds

PRD ambiguity:
- Baseline quiz yields level 1-3, but thresholds are unspecified.

Execution decision:
- Diagnostic score thresholds:
  - `0-2 correct -> level 1`
  - `3-4 correct -> level 2`
  - `5 correct -> level 3`

Reason:
- Simple, demo-friendly, and stable.

### A5. Recommended starting module behavior

PRD ambiguity:
- Baseline level affects recommended starting module, but not the exact mapping.

Execution decision:
- Foundations is always the recommended starting module in the simplified demo build.
- Baseline level is still computed and stored, but it does not change the starting-module recommendation.

Reason:
- Foundations is the only playable module, so the recommendation must stay actionable.

### A6. Preview-only module behavior

PRD ambiguity:
- The PRD describes sequential unlocks across four modules, but the simplified demo keeps only one module playable.

Execution decision:
- Foundations is the only playable module.
- Conditional Reasoning, Logical Fallacies, and Visual Patterns remain visible as preview cards.
- Preview cards do not use locked progression logic and do not open question flow.

Reason:
- This preserves product breadth visually while removing cross-module progression work from the demo build.

### A7. Streak freeze earning rule

PRD ambiguity:
- Freeze usage is defined; earning criteria are not.

Execution decision:
- Award one streak-freeze badge at the first 7-day streak milestone.
- User can hold at most one unused freeze at a time.
- Freeze is consumed automatically on the first missed eligible day.

Reason:
- Supports the PRD behavior without adding a separate progression system.

### A8. Reduced motion and sound precedence

PRD ambiguity:
- Reduced motion disables sound; there is also a manual sound toggle and skip-animations mode.

Execution decision:
- Effective sound enabled = `soundEnabled && !reducedMotion && !skipAnimations`.
- Effective motion enabled = `!reducedMotion && !skipAnimations`.

Reason:
- Keeps system preference and demo mode higher priority than user toggle.

### A9. Member-since date

PRD ambiguity:
- Member-since date is "faked: derived from baseline-quiz-date" without exact rule.

Execution decision:
- Member-since equals the local date on which diagnostic/profile completion occurs.

### A10. Recent activity strip generation

PRD ambiguity:
- Event taxonomy for milestones is unspecified.

Execution decision:
- Populate from a derived event log composed of:
  - question answered
  - module completed
  - badge earned
  - daily challenge completed
- Show the most recent 3 human-readable events.

### A11. Meaning of "backend" in this prototype plan

PRD ambiguity:
- The product has no real backend, but the execution plan now splits frontend and backend ownership.

Execution decision:
- "Backend" means the in-repo data, persistence, domain logic, selectors, schemas, and preset-state layer.
- "Frontend" means the visible app shell, screens, components, animation, sound integration, and SVG presentation layer.
- This ownership split MUST NOT add any external service or alter product behavior.

### A12. Visual-question scope reduction

PRD ambiguity:
- The PRD includes visual question types, but the simplified demo scope prioritizes minimum engineering time.

Execution decision:
- Visual-based questions are removed from the simplified demo build.
- The only authored playable-module questions are text multiple-choice questions.

Reason:
- The current shared question shell already supports the text path and this preserves the strongest demo loop for the least engineering cost.

### A13. Preset-driven demo progression

PRD ambiguity:
- The PRD emphasizes live progression, but the simplified demo target prioritizes polish and fast state changes.

Execution decision:
- Completion-ready, high-progress, and power-user moments SHOULD primarily be reached through presets.
- Live play still needs to support the core Foundations loop end to end.

Reason:
- Presets preserve demo impressiveness while avoiding unnecessary dependency on fully earned state transitions during rehearsal and live demos.

## 2. Still Open But Non-Blocking

These can be implemented with placeholders or conservative defaults if product signoff is pending.

### O1. Exact badge artwork spec

Need:
- final visual system for each badge family

Safe default:
- geometric solar/neural line art with locked/earned state variants

### O2. Final question bank content

Need:
- authored and validated 5-question playable-module dataset plus preview-card metadata for the other three modules

Safe default:
- scaffold schema and integrate sample content for development

### O3. Sound asset production

Need:
- final MP3/OGG assets under bundle budget

Safe default:
- wire the system with placeholder silent or temporary assets

## 3. Blocking If Changed Later

Changing these after implementation will cause rework:
- baseline level thresholds
- module recommendation mapping
- streak freeze earning/consumption rule
- preview-only module behavior
- visual-question removal
- preset-driven demo progression

## 4. Decision Request Template

If an agent encounters a missing rule, it SHOULD log it in this form:

```text
Decision ID:
Area:
Observed ambiguity:
Why it blocks or risks drift:
Proposed default:
Impact if changed later:
```
