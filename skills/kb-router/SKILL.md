---
name: kb-router
description: >-
  Primary orchestrator for the KobeanSkills engineering system. Use when starting
  a new task, feature, UI build, bugfix, refactor, code review, security audit,
  or release to classify the request, select the right pipeline and model tier,
  and dispatch specialist role contracts from .kobean/roles/ (or ~/.kobean/roles/).
---

# `kb-router` — Kobean Engineering & Multi-Agent Orchestrator

You are the entry-point orchestrator for **KobeanSkills**. Instead of jumping straight into writing code, classify the user's request, load `.kobean/doctrine.md` (or `~/.kobean/doctrine.md`), select the optimal orchestration level and model tier, and run the matching pipeline below.

## Step 1: Read Doctrine & Project Context

1. Read `.kobean/doctrine.md` (or `~/.kobean/doctrine.md` if not in project root) for authority hierarchy, Ponytail rules, UI bans, model selection matrix, and completion gates.
2. Check the current workspace for:
   - `.kobean/constitution.md` (project rules)
   - `CONTEXT.md` or `graphify-out/GRAPH_REPORT.md` (codebase map)
   - `.beads/` (`bd ready --json` for active tasks)
   - `PRODUCT.md` (design system, if UI work is involved)

## Step 2: Classify Request & Select Pipeline

| Request Type | Trigger Signals | Pipeline to Execute |
| :--- | :--- | :--- |
| **`help`** | "How do I use this?", "What skills are available?", "Show me the guide", "help" | Display the workflow playbooks from `GUIDE.md` (or `PROMPTING.md`) |
| **`onboard`** | Unfamiliar repo, "map this codebase", or no `CONTEXT.md` / `graphify-out/` on a large project | `explorer` (`flash`) -> `graphify` -> write `CONTEXT.md` |
| **`atlas`** | "Explain business logic/features", "generate wiki/codemap", "draw architecture/sequence/state/ERD/workflow diagram", "visualize PR diff" | [`kb-atlas`](../kb-atlas/SKILL.md) (`atlas-architect`, `pro` + `kobean atlas check` + `chrome-devtools-mcp`) |
| **`feature`** | New capability, multi-file change, new language/content pack, or ambiguous requirements | [`kb-spec`](../kb-spec/SKILL.md) -> [`kb-plan`](../kb-plan/SKILL.md) -> [`kb-build`](../kb-build/SKILL.md) -> [`kb-review`](../kb-review/SKILL.md) -> [`kb-ship`](../kb-ship/SKILL.md) |
| **`ui`** | Landing page, redesign, component craft, SVG diagram, design system, "make it bolder/cleaner" | [`kb-spec`](../kb-spec/SKILL.md) *(lite)* -> [`kb-ui`](../kb-ui/SKILL.md) -> [`kb-review`](../kb-review/SKILL.md) |
| **`bugfix`** | Failing test, error log, regression, broken behavior | [`kb-debug`](../kb-debug/SKILL.md) -> [`kb-review`](../kb-review/SKILL.md) |
| **`refactor`** | "Clean up", "simplify", "pay down debt", "ponytail audit" | `explorer` *(if needed)* -> [`kb-build`](../kb-build/SKILL.md) (`refactorer` role) -> [`kb-review`](../kb-review/SKILL.md) |
| **`review`** | "Review PR/diff", "audit security", "check performance/a11y" | [`kb-review`](../kb-review/SKILL.md) |
| **`git`** | "commit", "push", "branch", "create/delete branch", "rebase master/main", "PR" | [`kb-git`](../kb-git/SKILL.md) -> Conventional Commits, rebase & PR template |
| **`ship`** | "Prepare release", "update changelog/docs", "deploy/CI" | [`kb-ship`](../kb-ship/SKILL.md) |

> **Fast-Path Rule (Ponytail Economy):** If the user asks for a trivial, unambiguous 1-file fix (< 20 lines, no schema/auth change), skip `kb-spec` and `kb-plan` and go directly to `kb-build` or `kb-debug` using **Level 1 (Inline Role Adoption)**.

## Step 3: Choose Orchestration Level & Model Tier Wisely

Whenever a pipeline step invokes any of the 24 specialist roles:

1. Read `.kobean/roles/<role>.yaml` (or `~/.kobean/roles/<role>.yaml`), noting its `subagent_type` (`self` or `research`) and `model_tier` (`flash_lite`, `flash`, or `pro`).
2. Select the **Orchestration Level** (from `doctrine.md` Section 6.2):
   - **Level 1 — Inline:** Sequential or small task (`< 20` lines). Adopt the role contract directly in the current turn.
   - **Level 2 — Targeted Subagents (`invoke_subagent`):** Context-heavy discovery or 2–3 parallel non-overlapping tasks (e.g., `frontend` on `src/components/**` + `content-architect` on `src/data/**`).
     - Pass `TypeName: "research"` when `subagent_type: research` and `TypeName: "self"` when `subagent_type: self`.
     - Pass `Model` matching `model_tier` (`"flash_lite"`, `"flash"`, or `"pro"` / `"inherit"`).
   - **Level 3 — Programmatic Pipeline (`run_workflow`):** Fan-out/fan-in across $N \ge 3$ independent slices (e.g., multi-language content generation or parallel 5-role verification).
   - **Level 4 — Collaborative Swarm (`swarm`):** Large multi-agent feature requiring isolated `workspace: "share"` checkouts and a dedicated verifier.

## Verification

Before ending the turn, state in 1 line: `Pipeline | Active Role(s) | Orchestration Level | Model Tier`, and confirm that all required gates in `.kobean/doctrine.md` are scheduled.
