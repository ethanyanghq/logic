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
- encode the lightweight progression and first-run state needed by the active demo path
- include backend-owned demo-control preference state for reduced motion, skip animations, and grid overlay

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
- manually exercise first-run personalization, question answer, reset, and preset state transitions if possible
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
- integrate a typed content pack and preset data into the app data layer
- encode data as stable typed exports instead of a generalized schema-heavy authoring system
- author exactly 5 text multiple-choice questions for the playable module
- wire module/question relationships
- include canonical module concept-primer copy in module records
- mark exactly one module as playable and represent the other three as preview-only module cards

Own these files:
- src/data/content.ts
- src/data/presets.ts
- small supporting types/helpers if needed

Constraints:
- preserve the exact product/module structure from the contracts
- authored data should be direct enough for frontend consumption without ad hoc reshaping
- do not spend time building badge schemas or a generalized validation framework unless clearly necessary

When finished:
- run any relevant validation available for the content exports/data
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

This task is de-scoped in the reduced core-loop packet.
Do not expand badge, streak, or reward breadth unless the execution packet is revised again.
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

Dependencies T004 and T012 must already be landed.

Your scope is backend only. Define plain snapshot preset states and preset loaders consumed by the demo UI. Do not implement the final demo menu UI here.

Implement T016 exactly:
- implement the four preset states
- provide plain snapshots or shallow patches plus preset loaders
- ensure preset application is deterministic and coherent with current schemas/store contracts
- treat presets as the primary route into completion-ready and power-user demo moments

Own these files:
- src/data/presets.ts
- store preset loaders

Required presets:
- Fresh user
- Mid-Foundations
- Completion ready
- Power user

Constraints:
- every preset should load in under 1 second in normal local conditions
- preset payloads should already include the state shape frontend needs to route correctly
- target route identifiers must match the active shared routing contract
- do not move routing or visible presentation logic into backend code

When finished:
- verify the preset payloads are coherent and internally consistent
- check the `T016` box in `execution/checklists/02-task-status-checklist.md` only if the task is fully complete
- update the `## T016` section of `execution/handoffs/codex-to-claude.md`
- in that section, summarize what changed, what you verified, and the exact contract frontend should use to open each preset on the intended screen
```
