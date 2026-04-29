# Execution Order

This file defines the recommended execution order for the reduced core-loop packet.

Active demo path:
- first-run personalization
- home launchpad
- question flow
- completion
- reset and preset jumps

## Recommended Order

1. `T012` Typed Content Pack Integration
   - Why first: this is the main backend blocker for real home/completion wiring.
   - Output: canonical module/question content, preview-module metadata, preset data foundation.

2. `T008` Home Launchpad
   - Depends on: `T003`, `T004`, `T012`
   - Why second: home becomes the primary launch surface for the playable loop once real content exists.

3. `T016` Demo Presets
   - Depends on: `T004`, `T012`
   - Why third: presets unblock fast verification and live-demo rehearsal without needing the whole loop replayed every time.

4. `T010` First-Run Personalization
   - Depends on: `T004`, `T008`
   - Why fourth: once home exists, fresh-user routing can land on a real destination instead of a placeholder.

5. `T015` Module Completion
   - Depends on: `T006`, `T008`, `T012`
   - Why fifth: this closes the playable loop after home and question entry are already real.

6. `T020` QA And Demo Hardening
   - Depends on: all active feature tasks above
   - Why last: hardening only makes sense after the core loop and presets are wired.

## Dependency Notes

- `T012` is the first active blocker.
- `T008` and `T016` can proceed independently after `T012` lands because they do not share ownership.
- `T010` should follow `T008` so first-launch users land on the real home launchpad.
- `T015` should land after `T008` because completion needs the end-to-end playable loop to be coherent.
- `T020` should not start early; it is a cleanup and rehearsal pass, not a feature-building task.

## Parallelization Guidance

- Safe parallel pair after `T012`: `T008` and `T016`
- Avoid parallelizing tasks that both need to reshape shared route wiring in `App.tsx`
- Keep backend contract changes ahead of any frontend integration that consumes them

## De-Scoped Tasks

These are not part of the active execution order:
- `T007`
- `T009`
- `T011`
- `T013`
- `T014`
- `T017`
- `T018`
- `T019`
