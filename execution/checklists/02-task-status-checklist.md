# Task Status Checklist

Use this checklist to track task-level completion across both agents.

Rule:
- Check a task only when its implementation, verification, and required handoff updates are complete.
- Leave the box unchecked if the task is only partially implemented or still has blockers.
- Treat each task file under `execution/tasks/*` as the source of truth for dependencies, "Done When", and verification requirements.

## Wave 1

- [x] T001 App shell and layout
- [x] T002 Design tokens and Tailwind
- [x] T003 UI primitives

## Wave 2

- [x] T004 Store and domain foundation
- [x] T005 Demo controls shell

## Wave 3

- [x] T006 Question engine shell
- T007 First visual puzzle renderer (de-scoped by simplified demo contract)

## Wave 4

- [x] T012 Content schema and bank integration
- [x] T008 Home dashboard
- T009 Module detail (de-scoped by reduced core-loop contract)

## Wave 5

- [x] T010 First-run personalization
- [x] T015 Module completion
- [x] T016 Demo presets

Note:
The active delivery path after Wave 3 is:
- `T010` to route fresh users into a lightweight personalization flow and then home
- `T015` to close the playable loop without dead-end behavior
- `T016` to provide fast jumps into key demo states for rehearsal and live use

## De-Scoped

- T011 Remaining puzzle renderers (de-scoped by simplified demo contract)
- T013 XP, streak, and badges expansion (de-scoped by reduced core-loop contract)
- T014 Daily challenge (de-scoped by reduced core-loop contract)
- T017 Progress/profile screen (de-scoped by reduced core-loop contract)
- T018 Motion polish (de-scoped by reduced core-loop contract)
- T019 Sound system (de-scoped by reduced core-loop contract)

## Wave 6

- [ ] T020 QA and demo hardening
