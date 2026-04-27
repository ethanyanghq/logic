# T020 QA And Demo Hardening

## Objective

Perform frontend demo hardening and close the gap between functional completeness and live-demo safety.

## Assigned Agent

Claude Code (Frontend)

## Ownership

Files:
- frontend-facing fixes as needed
- `execution/checklists/01-qa-and-demo-checklist.md` may be updated with findings

## Frontend Boundary

- Route backend defects back to the owning backend task rather than patching business logic in UI code.
- Focus this task on layout stability, visible polish, interaction safety, and demo rehearsal.

## Dependencies

- all major feature tasks complete

## Must Do

- eliminate frontend-originated console errors in primary flows
- audit layout stability
- verify first paint and preload behavior
- rehearse reset and all presets
- polish the most likely demo screens

## Done When

- a 3-minute demo can be completed cleanly without workaround narration
