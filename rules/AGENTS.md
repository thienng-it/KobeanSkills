# KobeanSkills — Always-On Engineering Rules

For every coding, architecture, UI/UX, diagramming/wiki, debugging, code review, security, or release task in any repository, follow `.kobean/doctrine.md` (or `~/.kobean/doctrine.md`) and route workflows through the `kb-*` skills (`kb-router`, `kb-spec`, `kb-plan`, `kb-build`, `kb-ui`, `kb-atlas`, `kb-review`, `kb-debug`, `kb-git`, `kb-ship`).

## Core Defaults (Active Across All Repositories)

1. **Automatic Routing (`kb-router`):**
   - **Multi-file feature or ambiguous request:** Run `kb-spec` (`specs/NNN-<slug>/spec.md`) -> `kb-plan` (`plan.md` + `.beads/` issues via `bd`) -> `kb-build` -> `kb-review`.
   - **Trivial 1-file change (< 20 lines, clear scope):** Skip spec/plan and execute directly inline with Ponytail economy + verification.
   - **UI / Frontend work:** Follow `kb-ui` (Impeccable craft by default; Taste-Skill `bold` mode for landing pages/brand sites; zero generic AI-slop gradients or 3-icon filler cards; verify in `chrome-devtools-mcp`).
   - **Diagrams, Business Workflows & Codebase Wiki:** Follow `kb-atlas` (`atlas-architect`, `graphify` AST truth, 10-mode diagram router, $\le 15$ nodes per view, commit-pinned `file:start-end` citations verified via `kobean atlas check` + `chrome-devtools-mcp`).
   - **Bug / Failing test:** Follow `kb-debug` (reproduce first, trace callers via `graphify`, write a failing regression test before editing implementation code).
2. **Smart Model & Multi-Agent Selection (`.kobean/doctrine.md` Section 6):**
   - Match model tier to role `model_tier`: `flash_lite` (trivial scans), `flash` (`explorer`, `a11y-auditor`, `performance`, `supply-chain`, `tech-writer`, `release-manager`), `pro` / `inherit` (architecture, `atlas-architect`, TDD build, UI craft, security `fp-check`).
   - Escalate orchestration cleanly: **Level 1 Inline** (small tasks) -> **Level 2 `invoke_subagent`** (isolated research or 2–3 parallel non-overlapping roles like `frontend` + `content-architect`) -> **Level 3 `run_workflow`** ($N \ge 3$ fan-out/fan-in slices) -> **Level 4 `swarm`** (isolated `workspace: "share"` multi-worker branches).
3. **Single Source of Task State:** Use `bd` (`.beads/`) when tracking multi-step tasks—never create `tasks.md` or `progress.md`.
4. **Ponytail Economy in Build/Review:** Reuse existing codebase helpers and standard library first; write the smallest complete change; end build/review replies with 1–2 lines noting what was intentionally skipped and any residual risk.
5. **Role Isolation (`.kobean/roles/*.yaml`):** When spawning subagents for any of the 24 specialist roles, load its YAML contract from `.kobean/roles/<role>.yaml` (or `~/.kobean/roles/<role>.yaml`) and enforce non-overlapping `writes` paths.
6. **Hard Completion Gates:** Never mark work ready to ship if `betterleaks` finds secrets, tests fail, or `CRITICAL`/`HIGH` review/security findings remain open.
