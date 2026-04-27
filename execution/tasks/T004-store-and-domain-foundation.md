# T004 Store And Domain Foundation

## Objective

Implement the persisted Zustand store and pure domain helpers.

## Assigned Agent

Codex (Backend)

## Ownership

Files:
- `src/store/*`
- `src/lib/xp.ts`
- `src/lib/streak.ts`
- `src/lib/daily.ts`
- `src/lib/*` for related pure rules

## Dependencies

- contracts `01`, `03`, `05`, `06`

## Must Do

- create the persisted app store under `logic-app-v1`
- support reset and preset application
- encode XP, level, streak, daily-selection, and onboarding recommendation rules

## Must Not Do

- duplicate business logic inside screen components

## Done When

- persisted state survives reload
- reset clears state without reload
- pure functions can be verified with example inputs/outputs

## Verification

- exercise onboarding, question answer, reset, and preset state transitions manually
