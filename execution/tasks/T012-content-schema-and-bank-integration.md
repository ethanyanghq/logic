# T012 Content Schema And Bank Integration

## Objective

Integrate modules, questions, badges, and preset data into the app data layer.

## Assigned Agent

Codex (Backend)

## Ownership

Files:
- `src/data/modules.json`
- `src/data/questions/*`
- `src/data/badges.json`
- `src/data/presets.ts`
- any schema-validation helpers

## Dependencies

- T004

## Backend Boundary

- Define canonical content schemas and normalized authored data.
- Do not implement final screen presentation for this content.

## Must Do

- encode data files to the agreed schema
- author exactly 5 text multiple-choice questions for the playable module
- include canonical concept-primer copy in module records
- wire module/question relationships
- mark exactly one module as playable and represent the other three as preview-only module cards
- flag curated daily-eligible questions

## Done When

- app can navigate the playable module and render the three preview cards using static data only
- schemas are stable enough for manual authoring and validation
