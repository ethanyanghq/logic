# Ambiguities And Decisions

This document records contradictions, inferred defaults, and open questions from the PRD. Agents MUST read this before implementing.

## 1. Resolved For Execution

### A1. Active demo path reduction

PRD ambiguity:
- The PRD describes a broader app experience than the current delivery budget allows.

Execution decision:
- The active demo path is reduced to `first-run personalization -> home -> question -> completion`.
- Other surfaces may exist in code, but they are not part of the delivery contract for this packet revision.

Reason:
- This is the highest-leverage scope cut for engineering time.

### A2. Module detail removal

PRD ambiguity:
- The PRD expects a module detail screen before question entry.

Execution decision:
- The reduced demo skips a separate module-detail screen.
- Home routes directly into the playable Foundations question flow.

Reason:
- Module detail adds routing, composition, and state surface area without improving the core demo as much as polishing home and completion.

### A3. Onboarding reduction

PRD ambiguity:
- The PRD and older execution docs included sample questions, diagnostic logic, profile setup, and recommendations.

Execution decision:
- Onboarding is reduced to first-run personalization only.
- The flow collects display name and one goal, persists across reload, and routes to home.

Reason:
- This keeps personalization while removing the most expensive low-value path.

### A4. Preview-only module behavior

PRD ambiguity:
- The PRD describes sequential unlocks across four modules, but the simplified demo keeps only one module playable.

Execution decision:
- Foundations is the only playable module.
- Conditional Reasoning, Logical Fallacies, and Visual Patterns remain visible as preview cards.
- Preview cards do not use locked progression logic and do not open question flow.

Reason:
- This preserves product breadth visually while removing cross-module progression work from the demo build.

### A5. Daily challenge removal from live path

PRD ambiguity:
- Daily challenge exists in the broader product vision.

Execution decision:
- The reduced demo has no standalone daily screen and no daily-specific acceptance gates.
- Existing daily-related backend code MAY remain, but frontend work MUST NOT depend on it.

Reason:
- Daily is breadth, not the shortest path to a strong demo.

### A6. Progress/profile removal from live path

PRD ambiguity:
- The PRD includes a deeper progress screen.

Execution decision:
- The reduced demo removes progress/profile from the active delivery path.
- Any later progress surface would be an explicit packet revision, not incidental scope creep.

Reason:
- The screen is expensive and non-essential for the core learning-loop demo.

### A7. Badges and advanced progression breadth

PRD ambiguity:
- The PRD includes richer streak, badge, and reward systems than the current demo needs.

Execution decision:
- Advanced badge and progression breadth are no longer release gates.
- The reduced packet may use fixed or preset-backed visible reward states instead of fully computed badge flows.

Reason:
- This preserves perceived reward without forcing a larger backend surface.

### A8. Motion and sound de-prioritization

PRD ambiguity:
- The original packet dedicated separate waves to motion polish and sound.

Execution decision:
- Motion may be added opportunistically within active feature work.
- Dedicated motion and sound tasks are de-scoped from the critical path.

Reason:
- Separate polish waves are not justified until the core loop is complete and wired.

### A9. Typed content pack instead of schema-heavy authoring

PRD ambiguity:
- Earlier docs expected JSON files plus schema-validation helpers.

Execution decision:
- T012 should use typed TypeScript content exports when that is faster and safer for this repo.
- Canonical content still needs stable shapes, but not a generalized authoring system.

Reason:
- The project only needs a small, static content pack for the demo.

### A10. Preset-driven demo progression

PRD ambiguity:
- The PRD emphasizes live progression, but the simplified demo target prioritizes polish and fast state changes.

Execution decision:
- Completion-ready and power-user moments SHOULD primarily be reached through presets.
- Presets should be plain store snapshots or shallow patches with a target screen identifier.

Reason:
- Presets preserve demo impressiveness while avoiding unnecessary live setup work.

### A11. Preset count

PRD ambiguity:
- Older docs referenced both four and five presets.

Execution decision:
- The reduced packet targets four presets:
  - Fresh user
  - Mid-Foundations
  - Completion ready
  - Power user

Reason:
- Four presets cover the required demo moments without extra state-authoring cost.

### A12. Meaning of "backend" in this prototype plan

PRD ambiguity:
- The product has no real backend, but the execution plan splits frontend and backend ownership.

Execution decision:
- "Backend" means the in-repo data, persistence, domain logic, selectors, typed content exports, and preset-state layer.
- "Frontend" means the visible app shell, screens, components, and active demo-path behavior.
- This ownership split MUST NOT add any external service or alter product behavior.

### A13. Visual-question scope reduction

PRD ambiguity:
- The PRD includes visual question types, but the simplified demo scope prioritizes minimum engineering time.

Execution decision:
- Visual-based questions are removed from the simplified demo build.
- The only authored playable-module questions are text multiple-choice questions.

Reason:
- The current shared question shell already supports the text path and this preserves the strongest demo loop for the least engineering cost.

## 2. Still Open But Non-Blocking

These can be implemented with placeholders or conservative defaults if product signoff is pending.

### O1. Final question-bank copy

Need:
- finalized wording for the five Foundations questions and concept primer copy

Safe default:
- ship the current authored development-quality set if it is internally coherent and polished enough for demo use

### O2. Completion celebration copy

Need:
- final completion headline and optional reward language

Safe default:
- fixed copy that celebrates completion and routes back home cleanly

## 3. Blocking If Changed Later

Changing these after implementation will cause rework:
- active demo path reduction
- module-detail removal
- onboarding reduction
- preview-only module behavior
- typed content pack approach
- preset-driven demo progression
- four-preset target
- visual-question removal

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
