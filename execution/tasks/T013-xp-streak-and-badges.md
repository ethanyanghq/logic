# T013 XP, Streak, And Badges

## Objective

Implement progression rules, badge evaluation, derived streak/badge state, and UI-facing reward contracts.

## Assigned Agent

Codex (Backend)

## Ownership

Files:
- `src/lib/*`
- `src/store/*`

## Dependencies

- T004
- T012

## Must Do

- XP award rules
- level derivation
- streak updates and reset/freeze behavior
- milestone badge unlock evaluation
- typed selector/state outputs for streak-risk, milestones, earned badges, and reward summaries

## Done When

- progression behavior is deterministic from activity history
- frontend can consume stable reward and badge state without reimplementing logic
