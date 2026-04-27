# T019 Sound System

## Objective

Implement preload, priority, and event mappings for the app sound system.

## Ownership

Files:
- `src/lib/sound.ts`
- `src/hooks/useSound.ts`
- `src/assets/sounds/*`
- related integration points

## Dependencies

- T004
- T005
- major interaction surfaces implemented

## Must Do

- preload sounds
- priority drop logic
- event mapping for required interactions
- respect effective sound-enabled rules

## Done When

- first-use sound lag is absent
- lower-priority sounds do not overlap higher-priority ones
