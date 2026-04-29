# T020 QA And Demo Hardening

## Objective

Perform core-loop demo hardening and close the gap between functional completeness and live-demo safety.

## Assigned Agent

Claude Code (Frontend)

## Ownership

Files:
- frontend-facing fixes as needed
- `execution/checklists/01-qa-and-demo-checklist.md` may be updated with findings

## Frontend Boundary

- Route backend defects back to the owning backend task rather than patching business logic in UI code.
- Focus this task on layout stability, visible polish, interaction safety, and rehearsal of the active demo path only.

## Dependencies

- active feature tasks complete

## Must Do

- eliminate frontend-originated console errors in the active flows
- audit layout stability
- verify first paint behavior
- rehearse reset and all presets
- polish the active demo screens

## Done When

- a 3-minute demo can be completed cleanly without workaround narration
- no blocked or half-wired surfaces remain in the active path
