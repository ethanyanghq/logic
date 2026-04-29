# T016 Demo Presets

## Objective

Implement four plain snapshot presets and preset loaders consumed by the demo UI as the primary route into advanced demo moments.

## Assigned Agent

Codex (Backend)

## Ownership

Files:
- `src/data/presets.ts`
- store preset loaders

## Dependencies

- T004
- T012

## Coordination Note

- Preset target routes MUST follow the shared routing contract for active screens only.
- Presets are the intended path into completion-ready and power-user states in the reduced demo build.

## Must Do

- Fresh user
- Mid-Foundations
- Completion ready
- Power user

## Done When

- every preset loads in under 1 second in normal local conditions
- frontend can open every preset on the intended screen with coherent visible state using backend-defined payloads
- preset payloads may be plain snapshots or shallow patches rather than a generalized preset framework
