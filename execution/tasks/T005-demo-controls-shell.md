# T005 Demo Controls Shell

## Objective

Implement the Demo Controls bottom sheet, keyboard shortcut entry, and basic toggles/reset flow.

## Assigned Agent

Claude Code (Frontend)

## Ownership

Files:
- `src/components/demo/*`
- `src/hooks/useKeyboardShortcut.ts`

## Frontend Boundary

- Consume reset actions, preset metadata, and preference selectors defined by backend tasks.
- Do not redefine preset payloads or persistence rules in UI code.

## Dependencies

- T003
- T004

## Must Do

- open from `Cmd/Ctrl + Shift + R`
- open from home-screen gear icon
- include reset, sound, skip animations, grid overlay, and version surfaces

## Done When

- menu opens reliably from any screen
- reset path confirms then clears app state

## Verification

- test shortcut from screen, modal, and question contexts
