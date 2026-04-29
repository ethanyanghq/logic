# T010 First-Run Personalization

## Objective

Implement a lightweight first-run personalization flow that persists across reload and routes directly to home.

## Assigned Agent

Claude Code (Frontend)

## Ownership

Files:
- `src/screens/onboarding/*`

## Dependencies

- T004
- T008

## Must Do

- welcome and goal selection
- display-name entry
- persist in-progress state across reload
- route directly to home on completion

## Done When

- fresh users complete personalization quickly without a long flow
- personalization resumes correctly after reload
- completion lands directly on home
- no sample-question, diagnostic, avatar, or recommendation work remains in scope

## Verification

- exit/reload before completion
- verify returning users bypass the flow once complete
