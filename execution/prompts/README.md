# Execution Prompts

This folder contains copy-paste-ready execution prompts derived from the execution packet.

These prompts preserve the same product target defined in [PRD_Logic.md](/Users/ethanyang/Documents/GitHub/logic/PRD_Logic.md) and the contracts under [execution/contracts](/Users/ethanyang/Documents/GitHub/logic/execution/contracts). They only operationalize the work split:
- Claude Code executes frontend tasks
- Codex executes backend tasks

## Files

- [claude-code-prompts.md](/Users/ethanyang/Documents/GitHub/logic/execution/prompts/claude-code-prompts.md)
  Exact prompts for Claude Code frontend execution.
- [codex-prompts.md](/Users/ethanyang/Documents/GitHub/logic/execution/prompts/codex-prompts.md)
  Exact prompts for Codex backend execution.

## Use Rules

1. Use the prompts in task order unless a dependency says otherwise.
2. Do not merge multiple prompts into one run unless the relevant task docs explicitly allow wider scope.
3. Do not change product behavior, product scope, or the frontend/backend ownership split.
4. If an execution prompt conflicts with a contract, the contract wins.
