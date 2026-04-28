# Demo Simplifications

This list prioritizes simplifications that retain demo impressiveness while minimizing or avoiding changes to the existing codebase.

## Recommended Simplifications

1. Cut all visual-based questions entirely.
   - Code impact: none to current landed code.
   - Why: the current implemented question shell is text-first, and the visual renderer work is mostly future scope. This removes T007/T011 complexity, visual-spec authoring, SVG rendering edge cases, and visual QA.

2. Keep only one playable module in the demo, with the other three shown as static or "coming next".
   - Code impact: none if treated as product/demo scope and content reduction.
   - Why: this preserves the impression of a larger product, but only requires one module's content and one end-to-end learning loop.

3. Make the other modules non-interactive demo cards rather than true locked progression.
   - Code impact: little to none if handled in future UI scope rather than modifying current store code.
   - Why: this keeps breadth visually, but removes unlock-threshold logic, prerequisite messaging, and cross-module progression QA.

4. Use preset-driven demo states instead of requiring real end-to-end progression.
   - Code impact: no immediate change to existing code; mainly reduces future implementation depth.
   - Why: this allows onboarding-complete, mid-module, completion, and power-user states without fully implementing every rule path behind them.

5. Treat the progress/profile screen as static demo composition.
   - Code impact: no change to existing landed code.
   - Why: heatmap, badges, activity, and per-module accuracy can be mocked or preset-backed later, avoiding derived analytics/read-model work.

6. Drop daily challenge from the live demo path.
   - Code impact: none to current landed code.
   - Why: daily selection, persistence, and the 7-day strip add complexity but are not necessary to demonstrate the core product loop.

7. Keep onboarding, but reduce it to welcome, one sample question, and profile name.
   - Code impact: mostly future-scope reduction.
   - Why: this retains personalization and polish while avoiding diagnostic branching and recommendation logic pressure.

8. Defer badge logic to purely visual badges shown in presets.
   - Code impact: no immediate change.
   - Why: badges still make the product feel rewarding, but deterministic unlock rule implementation is unnecessary for the demo.

9. Remove module-completion rewards as a computed system; show a fixed completion celebration.
   - Code impact: no immediate change.
   - Why: the moment still feels polished, but deeper reward-summary plumbing is avoided.

10. Freeze content scope at 5 text questions total for the entire demo, not 5 per module.
    - Code impact: only future content/doc changes.
    - Why: if the goal is demo impressiveness rather than product completeness, one tight bank is enough to prove the experience.

## Best Zero-Change Options

If the goal is maximum simplification with effectively zero changes to existing code, prioritize:

- cut visual questions entirely
- drop daily challenge from the demo
- make progress/profile preset-driven or static rather than fully derived

## Adopted In Execution Packet

The current `/execution` packet now adopts these simplifications:

- cut all visual-based questions entirely
- keep only one playable module in the demo
- present the other three modules as preview-only cards rather than locked progression
- use presets as the primary route into advanced demo states
