# T016 Demo Presets

## Objective

Implement the five preset states, normalized payloads, and preset loaders consumed by the demo UI.

## Assigned Agent

Codex (Backend)

## Ownership

Files:
- `src/data/presets.ts`
- store preset loaders

## Dependencies

- T004
- T012
- T013

## Coordination Note

- Preset target routes MUST follow the shared routing contract; destination screens do not all need to be visually complete before backend preset payloads are defined.

## Must Do

- Fresh user
- Mid-Foundations
- Streak day 6
- Module completion ready
- Power user

## Done When

- every preset loads in under 1 second in normal local conditions
- frontend can open every preset on the intended screen with coherent visible state using backend-defined payloads
