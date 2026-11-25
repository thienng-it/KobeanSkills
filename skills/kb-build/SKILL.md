---
name: kb-build
description: >-
  Subagent-driven TDD implementation and Ponytail minimal-change execution. Use
  to execute ready tasks from .beads/ (or direct coding/refactoring requests)
  across frontend, content-architect, backend, data-engineer, mobile,
  ml-engineer, devops, and refactorer roles.
---

# `kb-build` — TDD Execution & Ponytail Build Loop

Distilled from **Superpowers** (`subagent-driven-development`, `test-driven-development`, `dispatching-parallel-agents`), **Ponytail** (`full` minimal-change mode, `audit`, `debt`), and official stack skills (**Vercel**, **Supabase**, **Expo**, **Callstack**, **Hugging Face**).

## Active Roles Loaded by This Skill
- [`~/.kobean/roles/data-engineer.yaml`](../../roles/data-engineer.yaml) (`migrations/**`, `src/db/**`)
- [`~/.kobean/roles/backend.yaml`](../../roles/backend.yaml) (`src/server/**`, `tests/server/**`)
- [`~/.kobean/roles/frontend.yaml`](../../roles/frontend.yaml) (`src/web/**`, `src/components/**`, `src/App.tsx`, `app/**`)
- [`~/.kobean/roles/content-architect.yaml`](../../roles/content-architect.yaml) (`src/data/**`, `src/content/**`, `src/test/data.test.ts`)
- [`~/.kobean/roles/mobile.yaml`](../../roles/mobile.yaml) (`src/mobile/**`, `apps/mobile/**`)
- [`~/.kobean/roles/ml-engineer.yaml`](../../roles/ml-engineer.yaml) (`src/ml/**`, `evals/**`)
- [`~/.kobean/roles/devops.yaml`](../../roles/devops.yaml) (`.github/**`, `Dockerfile*`, `infra/**`)
- [`~/.kobean/roles/refactorer.yaml`](../../roles/refactorer.yaml) (`DEBT.md`, behavior-preserving simplification)

---

## Procedure

### 1. Fetch Ready Work from Beads
1. If `.beads/` exists in the project, query unblocked work:
   ```bash
   bd ready --json
   ```
2. Claim the target issue(s) before editing any files:
   ```bash
   bd update <id> --claim
   ```

### 2. Load Role Contract, Stack References & Select Model/Orchestration
1. Identify the role owning the task (`data-engineer`, `backend`, `frontend`, `content-architect`, `mobile`, `ml-engineer`, `devops`, or `refactorer`).
2. Read `.kobean/roles/<role>.yaml` (or `~/.kobean/roles/<role>.yaml`) and every file listed in its `references:` array under `.kobean/references/stacks/`.
3. **If multiple independent tasks with non-overlapping `writes` globs are ready simultaneously** (e.g., `frontend` in `src/components/**` and `content-architect` in `src/data/**`, or `backend` in `src/server/**` and `frontend` in `src/web/**`):
   - For 2–3 tasks: dispatch parallel subagents using `invoke_subagent(TypeName="self", Role="<Role Title>", Model="pro", Prompt="...")`, passing each subagent its claimed Bead ID, role contract path, and `spec.md`/`plan.md` paths.
   - For $N \ge 3$ homogeneous or staged slices (e.g., building multiple language packs across CEFR A1–C2): use `run_workflow` to fan out in parallel and aggregate test verification.

### 3. Enforce Red-Green-Refactor TDD (Mandatory)
For every task:
1. **RED:** Write a small automated test (or self-check assertion) that reproduces the required behavior and **run it to watch it fail** for the expected reason.
2. **GREEN (Ponytail Full Mode):**
   - Write the **smallest complete change** that makes the test pass.
   - Reuse existing codebase helpers -> standard library -> already-installed packages. Never add a new dependency for a few lines of logic.
   - Zero unrequested wrappers, config flags, or "for later" abstractions.
   - Update all affected callers, types, and fixtures.
3. **REFACTOR:** Clean up duplication while keeping all tests green.

### 4. Close the Bead & Report Ponytail Summary
1. Run the relevant test suite and linter to confirm clean execution.
2. Close the claimed Bead issue with a concrete reason:
   ```bash
   bd close <id> --reason "Implemented <summary>; tests passing in <test-file>"
   ```
3. Repeat with `bd ready --json` until all planned tasks are closed, then hand off to [`kb-review`](../kb-review/SKILL.md).

## Required Output Footer (Ponytail Rule)
End every build turn with **1–2 lines**:
- **Skipped / Cut:** What optional complexity or unrequested flexibility was intentionally omitted.
- **Residual Risk:** Any edge case or operational constraint the user should know.
