# T001 App Shell And Layout

## Objective

Create the app shell, phone-frame container, status bar, home indicator, and base layout structure.

## Assigned Agent

Claude Code (Frontend)

## Ownership

Files:
- `src/App.tsx`
- `src/main.tsx`
- `src/components/layout/*`
- `src/styles/globals.css`

## Dependencies

- contracts `01`, `02`, `03`, `05`, `06`

## Must Do

- Implement desktop phone frame and mobile edge-to-edge behavior
- Reserve sticky status bar and home-indicator regions
- Support scroll inside the frame content area
- Render a live clock updated every minute

## Must Not Do

- introduce feature-screen-specific business logic
- hardcode page content into layout primitives

## Done When

- app shell renders correctly in desktop and mobile modes
- frame chrome remains visible while content scrolls
- no layout shift occurs from status-bar updates

## Visual QA

- phone shell matches black-glass feel
- outer shadow and notch feel integrated, not decorative

## Verification

- render shell with placeholder screen content
- verify sticky top and bottom chrome during scroll
