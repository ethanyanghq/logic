# Technical Architecture

This document defines the target architecture and implementation boundaries for the reduced core-loop packet.

## 1. Core Stack

- Vite
- React 18
- TypeScript with strict mode
- Tailwind CSS
- Zustand with persist middleware
- React Router memory router

No additional core runtime libraries should be introduced unless approved. Motion and sound libraries are not required by this packet revision.

## 2. Directory Contract

Target structure for the active demo path:

```text
src/
  components/
    ui/
    layout/
    feedback/
    demo/
  screens/
    onboarding/
    home/
    question/
    completion/
  store/
  data/
  lib/
  hooks/
  styles/
```

Future or unused directories such as `screens/module`, `screens/daily`, `screens/progress`, and `assets/sounds` MAY exist, but they are not required for this packet to be considered complete.

Rules:
- `components/ui` owns reusable primitives only.
- `screens/*` own screen composition, not cross-screen business logic.
- `lib/*` owns pure domain logic and helpers.
- `store/*` owns persisted app state and mutations.
- `data/*` owns authored static content and presets.

## 3. Delivery Ownership Model

The implementation MUST follow a strict frontend/backend split without changing the shipped product.

### Backend Ownership: Codex

Codex owns:
- `src/store/*`
- `src/lib/*`
- `src/data/*`
- preset-state definitions and loaders
- selector and state-contract definitions consumed by UI

Backend rules:
- backend code MUST NOT own screen composition or visual styling
- backend code SHOULD expose stable, typed inputs/outputs for frontend consumption
- backend changes that alter public state shape or selector contracts MUST update the execution docs or shared types before frontend integration

### Frontend Ownership: Claude Code

Claude Code owns:
- `src/screens/*`
- `src/components/*`
- `src/hooks/*` except hooks that are pure backend adapters
- `src/styles/*`
- visible interaction behavior in the active demo path

Frontend rules:
- frontend code MUST consume business rules from backend contracts rather than reimplement them
- frontend code MUST NOT mutate canonical data contracts ad hoc
- frontend code MAY add presentation-only adapters when they do not redefine backend logic

### Handoff Boundary

Frontend/backend handoff SHOULD happen through:
- TypeScript types
- store actions and selectors
- pure helper APIs
- content exports and preset payloads
- the running backend handoff doc at `execution/handoffs/codex-to-claude.md`

If a change requires edits on both sides:
- Codex lands the backend contract first
- Claude Code integrates it into the UI second
- neither side should silently expand the other's scope

## 4. Routing Contract

- Routing MUST use a memory router.
- Root routing MUST support:
  - first-run personalization
  - home
  - question presentation
  - completion
- URL semantics are internal-only and MUST NOT be treated as user-facing navigation.

## 5. Store Contract

The store SHOULD be split into coherent slices or modules, but MUST present one persisted app state.

Suggested active domains:
- profile/first-run completion
- progress/XP
- modules/questions
- preferences/demo controls

Rules:
- persistence versioning MUST be supported
- reset MUST clear the persisted namespace safely
- preset application MUST be deterministic and idempotent
- the preferences/demo-controls domain SHOULD own reduced-motion, skip-animations, and grid-overlay state rather than ad hoc component-local toggles

## 6. Data Contracts

### Content Pack Contract

Canonical content SHOULD be authored in typed TypeScript exports rather than JSON plus schema tooling.

The active content pack MUST include:
- four module records
- exactly one playable module
- exactly five authored Foundations questions
- concept-primer copy for Foundations
- preview metadata for the other three modules

### Module Schema

Each module record MUST include:
- `id`
- `title`
- `subtitle`
- `difficulty`
- `conceptPrimer`
- `isPlayable`
- `questionIds`

Module rule:
- exactly one module record MUST have `isPlayable: true`
- the playable module MUST contain exactly 5 authored question IDs
- preview-only module records MAY use an empty `questionIds` array

### Question Schema

Each question record MUST include:
- `id`
- `moduleId`
- `type`
- `difficulty`
- `prompt`
- `options`
- `correctIndex`
- `explanation`
- `tags`

Question-type rule:
- only text multiple-choice questions are in scope for the reduced demo build

### Demo Preset Contract

Each preset MUST define:
- target screen identifier
- persisted store payload or patch
- optional explanatory label for the demo menu

Preset payloads SHOULD be plain snapshots or shallow patches, not a generalized preset framework.

## 7. Domain Logic Boundaries

Pure library modules SHOULD be used for:
- XP calculation
- level derivation
- any lightweight question progression helpers still needed by the store

Rules:
- these modules SHOULD be side-effect free
- UI code MUST NOT reimplement the same business rule ad hoc
- advanced daily, badge, and recommendation systems are not required by this packet revision

## 8. Demo/Reset Architecture

- Keyboard shortcut handling SHOULD live in a reusable hook.
- Demo menu UI SHOULD live under `components/demo`.
- Preset state definitions SHOULD live in `data/presets.ts`.
- Reset and preset application MUST work without page reload.
- Presets SHOULD be treated as the primary route into completion-ready and power-user demo states.

## 9. Performance Contract

- All static content SHOULD be imported at build time.
- Screens MAY be code-split if needed.
- Skeletons SHOULD reserve final space to prevent layout shift.

## 10. Testing And Verification Expectations

Even if formal tests are not fully built at first, the architecture SHOULD make room for:
- smoke verification of content exports
- smoke verification of preset loading
- strict type checks

## 11. Agent Implementation Rules

- Each agent task SHOULD own a narrow file set.
- Shared contracts MUST be centralized before feature screens are built.
- If a task requires touching multiple ownership zones, it SHOULD be split unless the integration point is inseparable.
- Backend tasks SHOULD land state/data contracts before frontend screens depend on them.
- Frontend tasks SHOULD treat backend selectors, content exports, and state actions as the source of truth.
