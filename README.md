# KobeanSkills

Private, Antigravity-first (and Claude Code-compatible) engineering skills and multi-role orchestration system.

Instead of loading 250+ noisy upstream skills into the context window or running untrusted third-party hook scripts, **KobeanSkills** distills 16 vetted open-source repositories into:
- **8 Entry Skills (`skills/kb-*/SKILL.md`)** — lightweight progressive-disclosure entry points that fit easily inside the agent's context budget.
- **22 Specialist Role Contracts (`roles/*.yaml`)** — strict read/write/tool/verification contracts loaded on demand when spawning subagents.
- **1 Unified Precedence Doctrine (`doctrine.md`)** — resolves conflicts between Spec-Kit, Superpowers, Ponytail, Impeccable, Taste-Skill, and Trail of Bits.
- **Vetted Local Tooling Only** — integrates `bd` (Beads), `graphify`, `betterleaks`, `osv-scanner`, `semgrep`, and Antigravity's native `chrome-devtools-mcp`.

---

## Architecture Overview

| Entry Skill | Purpose | Roles Loaded On Demand |
| :--- | :--- | :--- |
| [`kb-router`](skills/kb-router/SKILL.md) | Classifies requests and selects the execution pipeline | All 22 roles |
| [`kb-spec`](skills/kb-spec/SKILL.md) | Ponytail Ultra existence check, Socratic clarification, `spec.md`, STRIDE `threats.md` | `explorer`, `po`, `threat-modeler` |
| [`kb-plan`](skills/kb-plan/SKILL.md) | `plan.md`, OpenAPI/Zod contracts, Postgres data model, `.beads/` task graph | `architect`, `api-designer`, `data-engineer` |
| [`kb-build`](skills/kb-build/SKILL.md) | Red-Green-Refactor TDD + Ponytail Full Mode execution over `.beads/` ready queue | `data-engineer`, `backend`, `frontend`, `mobile`, `ml-engineer`, `devops`, `refactorer` |
| [`kb-ui`](skills/kb-ui/SKILL.md) | Impeccable (default) + Taste-Skill (`bold` mode) + live `chrome-devtools-mcp` inspection | `ui-ux-designer`, `frontend`, `a11y-auditor` |
| [`kb-review`](skills/kb-review/SKILL.md) | Two-stage review, `betterleaks`, Trail of Bits AppSec, `osv-scanner`, CWV perf, WCAG 2.2, QA gate | `reviewer`, `security`, `supply-chain`, `performance`, `a11y-auditor`, `qa` |
| [`kb-debug`](skills/kb-debug/SKILL.md) | Reproduce-first root-cause diagnostics and regression test creation | `debugger` |
| [`kb-ship`](skills/kb-ship/SKILL.md) | Diátaxis documentation, ADRs, CI/CD hardening, SemVer changelog, rollback plan | `tech-writer`, `devops`, `release-manager` |

---

## Quick Start

```bash
# 1. Lint all skills, role schemas, and write-isolation rules
./scripts/lint.sh

# 2. Install symlinks into Antigravity (~/.gemini/config/skills) and Claude Code (~/.claude/skills)
./scripts/install.sh
```

See [`doctrine.md`](doctrine.md) for the precedence hierarchy and [`SOURCES.md`](SOURCES.md) for upstream commit locks and licenses.
