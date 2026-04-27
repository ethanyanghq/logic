# Technical Architecture

This document defines the target architecture and implementation boundaries.

## 1. Core Stack

- Vite
- React 18
- TypeScript with strict mode
- Tailwind CSS
- Framer Motion
- Howler.js
- Lucide React
- Zustand with persist middleware
- React Router memory router

No additional core runtime libraries should be introduced unless approved.

## 2. Directory Contract

Target structure:

```text
src/
  components/
    ui/
    layout/
    puzzles/
    feedback/
    demo/
  screens/
    onboarding/
    home/
    module/
    question/
    progress/
    daily/
  store/
  data/
    questions/
  lib/
  hooks/
  assets/
    sounds/
  styles/
```

Rules:
- `components/ui` owns reusable primitives only.
- `components/puzzles` owns renderers and puzzle-specific typed SVG logic.
- `screens/*` own screen composition, not cross-screen business logic.
- `lib/*` owns pure domain logic and helpers.
- `store/*` owns persisted app state and mutations.
- `data/*` owns authored static content and presets.

## 3. Routing Contract

- Routing MUST use a memory router.
- Root routing MUST support:
  - first-launch detection
  - onboarding flow
  - tab surfaces
  - modal-style question presentation
- URL semantics are internal-only and MUST NOT be treated as user-facing navigation.

## 4. Store Contract

The store SHOULD be split into coherent slices or modules, but MUST present one persisted app state.

Suggested domains:
- profile/onboarding
- progress/XP/streak
- modules/questions
- badges
- daily challenge
- preferences/demo controls

Rules:
- persistence versioning MUST be supported
- reset MUST clear the persisted namespace safely
- preset application MUST be deterministic and idempotent

## 5. Data Contracts

### Module Schema

Each module record MUST include:
- `id`
- `title`
- `subtitle`
- `iconName`
- `accentShape`
- `difficulty`
- `questionIds`
- `prerequisiteModuleId` when applicable

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
- `dailyEligible`

### Badge Schema

Each badge record SHOULD include:
- `id`
- `category`
- `label`
- `description`
- `unlockRule`
- `artworkSpec`

### Demo Preset Contract

Each preset MUST define:
- target route/screen
- persisted store payload or patch
- required derived values already normalized
- optional explanatory label for demo menu

## 6. Domain Logic Boundaries

Pure library modules SHOULD be used for:
- XP calculation
- level derivation
- streak math based on local calendar dates
- daily challenge selection
- badge evaluation
- onboarding recommendation selection

Rules:
- these modules SHOULD be side-effect free
- UI code MUST NOT reimplement the same business rule ad hoc

## 7. Visual Puzzle Architecture

- All visual puzzles MUST be rendered from structured JSON spec.
- `VisualPuzzle` SHOULD dispatch by question type/spec subtype.
- Renderer outputs MUST be deterministic SVG.
- Theme colors SHOULD be injected from tokens, not hardcoded at renderer call sites.

Suggested renderer split:
- `MatrixPuzzleRenderer`
- `SequencePuzzleRenderer`
- `OddOneOutRenderer`
- `RotationPuzzleRenderer`
- shared geometry/spec helpers

## 8. Demo/Reset Architecture

- Keyboard shortcut handling SHOULD live in a reusable hook.
- Demo menu UI SHOULD live under `components/demo`.
- Preset state definitions SHOULD live in `data/presets.ts`.
- Reset and preset application MUST work without page reload.
- Global skip-animations mode SHOULD feed both motion and sound suppression.

## 9. Performance Contract

- All static content SHOULD be imported at build time.
- Screens MAY be code-split if needed.
- Fonts and sound assets SHOULD be preloaded.
- Skeletons SHOULD reserve final space to prevent layout shift.

## 10. Testing And Verification Expectations

Even if formal tests are not fully built at first, the architecture SHOULD make room for:
- schema validation for data files
- pure-function tests for XP/streak/daily/badge logic
- smoke verification of preset loading
- strict type checks

## 11. Agent Implementation Rules

- Each agent task SHOULD own a narrow file set.
- Shared contracts MUST be centralized before feature screens are built.
- If a task requires touching multiple ownership zones, it SHOULD be split unless the integration point is inseparable.
