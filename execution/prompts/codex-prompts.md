# Codex Execution Prompts

Use these prompts exactly as written. They are for Codex only and cover the backend-owned tasks.

These prompts intentionally use "backend" to mean the in-repo state, logic, schema, preset, and validation layer. They do not authorize adding a real backend service.

Maintain `execution/handoffs/codex-to-claude.md` as you complete these tasks. Claude Code reads that file before any frontend task that depends on backend-owned contracts.
When a task is fully complete, also check its matching box in `execution/checklists/02-task-status-checklist.md`.

## T004

```text
You are Codex executing task T004 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/05-ambiguities-and-decisions.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T004-store-and-domain-foundation.md

Your scope is backend only. Do not implement final screen/UI behavior. Do not touch frontend-owned screen/component/styling files except for minimal shared type or integration glue that is strictly required.

Implement T004 exactly:
- create the persisted Zustand store under logic-app-v1
- support reset and preset application
- encode XP, level, streak, daily-selection, and onboarding recommendation rules
- include backend-owned demo-control preference state for sound, reduced motion, skip animations, and grid overlay

Own these areas:
- src/store/*
- src/lib/xp.ts
- src/lib/streak.ts
- src/lib/daily.ts
- related pure domain helpers in src/lib/*

Constraints:
- no duplicated business logic in screen components
- pure helper APIs should be stable and typed
- reset must clear state without reload
- persistence versioning should be supported

When finished:
- run any relevant local verification available for this repo
- manually exercise onboarding, question answer, reset, and preset state transitions if possible
- check the `T004` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- update the `## T004` section of `execution/handoffs/codex-to-claude.md`
- in that section, summarize what changed, what you verified, and any schema/contracts/selectors/actions frontend must consume
```

## T012

```text
You are Codex executing task T012 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/05-ambiguities-and-decisions.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T012-content-schema-and-bank-integration.md

Dependency T004 must already be landed.

Your scope is backend only. Define canonical content schemas and normalized authored data. Do not implement final screen presentation for this content.

Implement T012 exactly:
- integrate modules, questions, badges, and preset data into the app data layer
- encode data files to the agreed schema
- wire module/question relationships
- include canonical module concept-primer copy in module records
- preserve the exact five top-level question types, with rotation/transform specs modeled as visual-question subtypes rather than a sixth type
- flag curated daily-eligible questions

Own these files:
- src/data/modules.json
- src/data/questions/*
- src/data/badges.json
- src/data/presets.ts
- any schema-validation helpers

Constraints:
- preserve the exact product/module structure from the contracts
- visual question data should remain structured JSON specs, not image assets
- authored data should be normalized enough for frontend consumption without ad hoc reshaping

When finished:
- run any relevant validation available for schemas/data
- check the `T012` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- update the `## T012` section of `execution/handoffs/codex-to-claude.md`
- in that section, summarize what changed, what you verified, and any schema contracts frontend must consume
```

## T013

```text
You are Codex executing task T013 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/05-ambiguities-and-decisions.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T013-xp-streak-and-badges.md

Dependencies T004 and T012 must already be landed.

Your scope is backend only. Do not implement final toast/reveal UI behavior. Instead, expose stable UI-facing reward and badge contracts that frontend can consume.

Implement T013 exactly:
- implement XP award rules
- implement level derivation
- implement streak updates and reset/freeze behavior
- implement milestone badge unlock evaluation
- expose typed selector/state outputs for streak-risk, milestones, earned badges, reward summaries, and other derived activity read models consumed by home/progress surfaces

Own these areas:
- src/lib/*
- src/store/*

Constraints:
- progression behavior must be deterministic from activity history
- use the explicit ambiguity resolutions already recorded in the execution docs
- do not push rule duplication into the frontend

When finished:
- run any relevant pure-function or state verification available for this repo
- check the `T013` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- update the `## T013` section of `execution/handoffs/codex-to-claude.md`
- in that section, summarize what changed, what you verified, and the exact selectors/actions/state that frontend should use
```

## T016

```text
You are Codex executing task T016 for the Logic Learning App prototype.

Read these files first:
- execution/README.md
- execution/handoffs/codex-to-claude.md
- execution/contracts/01-product-contract.md
- execution/contracts/03-technical-architecture.md
- execution/contracts/05-ambiguities-and-decisions.md
- execution/contracts/06-delivery-ownership.md
- execution/tasks/T016-demo-presets.md

Dependencies T004, T012, and T013 must already be landed.

Your scope is backend only. Define preset states, normalized payloads, and preset loaders consumed by the demo UI. Do not implement the final demo menu UI here.

Implement T016 exactly:
- implement the five preset states
- provide normalized payloads and preset loaders
- ensure preset application is deterministic and coherent with current schemas/store contracts

Own these files:
- src/data/presets.ts
- store preset loaders

Required presets:
- Fresh user
- Mid-Foundations
- Streak day 6
- Module completion ready
- Power user

Constraints:
- every preset should load in under 1 second in normal local conditions
- preset payloads should already include the state shape frontend needs to route correctly
- target route identifiers must match the shared routing contract, even if some destination screens land later in the overall wave plan
- do not move routing or visible presentation logic into backend code

When finished:
- verify the preset payloads are coherent and internally consistent
- check the `T016` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- update the `## T016` section of `execution/handoffs/codex-to-claude.md`
- in that section, summarize what changed, what you verified, and the exact contract frontend should use to open each preset on the intended screen
```
