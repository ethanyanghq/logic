# Execution Prompts

This folder contains copy-paste-ready execution prompts derived from the execution packet.

These prompts preserve the same product target defined in [PRD_Logic.md](/Users/ethanyang/Documents/GitHub/logic/PRD_Logic.md) and the contracts under [execution/contracts](/Users/ethanyang/Documents/GitHub/logic/execution/contracts). They only operationalize the work split:
- Claude Code executes frontend tasks
- Codex executes backend tasks

In this packet revision, the active delivery path is:
- first-run personalization
- home launchpad
- question flow
- completion
- reset and preset jumps

## Files

- [claude-code-prompts.md](/Users/ethanyang/Documents/GitHub/logic/execution/prompts/claude-code-prompts.md)
  Exact prompts for Claude Code frontend execution.
- [codex-prompts.md](/Users/ethanyang/Documents/GitHub/logic/execution/prompts/codex-prompts.md)
  Exact prompts for Codex backend execution.

## Use Rules

1. Run active tasks in dependency order across both agents rather than forcing a full backend pass before any frontend work.
2. Any frontend task may begin only after its named backend dependencies are landed, and Claude Code MUST read `execution/handoffs/codex-to-claude.md` before each dependent frontend run.
3. Backend tasks that define shared contracts SHOULD land before the frontend tasks that consume them, even when the wave contains both backend and frontend work.
4. Do not merge multiple prompts into one run unless the relevant task docs explicitly allow wider scope.
5. Do not change product behavior, product scope, or the frontend/backend ownership split.
6. Do not revive de-scoped tasks as side work.
7. If an execution prompt conflicts with a contract, the contract wins.
8. When a task is fully complete, update the matching checkbox in `execution/checklists/02-task-status-checklist.md`.
