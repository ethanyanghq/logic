# T012 Content Schema And Bank Integration

## Objective

Integrate modules, questions, badges, and preset data into the app data layer.

## Ownership

Files:
- `src/data/modules.json`
- `src/data/questions/*`
- `src/data/badges.json`
- `src/data/presets.ts`
- any schema-validation helpers

## Dependencies

- T004
- T011

## Must Do

- encode data files to the agreed schema
- wire module/question relationships
- flag curated daily-eligible questions

## Done When

- app can navigate all modules using static data only
- schemas are stable enough for manual authoring and validation
