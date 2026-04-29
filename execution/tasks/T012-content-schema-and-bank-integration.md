# T012 Typed Content Pack Integration

## Objective

Integrate the canonical module and question content pack plus preset data into the app data layer with minimal authoring overhead.

## Assigned Agent

Codex (Backend)

## Ownership

Files:
- `src/data/content.ts`
- `src/data/presets.ts`
- small supporting types/helpers if needed

## Dependencies

- T004

## Backend Boundary

- Define stable typed content exports and authored data.
- Do not implement final screen presentation for this content.

## Must Do

- encode the content pack to stable typed exports
- author exactly 5 text multiple-choice questions for the playable module
- include canonical concept-primer copy in module records
- wire module/question relationships
- mark exactly one module as playable and represent the other three as preview-only module cards
- provide only the metadata needed by home, question, and completion flows

## Done When

- app can navigate the playable module and render the three preview cards using static data only
- content is stable enough for frontend consumption without ad hoc reshaping
- no badge schema or generalized validation framework is required to ship this task
