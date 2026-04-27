# T014 Daily Challenge

## Objective

Implement the dedicated daily challenge surface on top of the backend daily-selection contract.

## Assigned Agent

Claude Code (Frontend)

## Ownership

Files:
- `src/screens/daily/*`

## Frontend Boundary

- Consume deterministic daily-selection outputs from backend helpers/store selectors.
- Do not redefine daily-pool selection or persistence rules in the screen layer.

## Dependencies

- T004
- T006
- T012

## Must Do

- daily tab screen
- deterministic question selection from eligible pool
- completion state on home and daily screens
- 7-day result strip

## Done When

- same local date produces same challenge across reloads
- daily completion does not mutate module progress
