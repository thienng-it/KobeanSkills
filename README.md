# KobeanSkills

Portable, Antigravity-first (and Claude Code-compatible) engineering skills and 22-role orchestration system.

---

## 1-Minute Setup (For You or Any Friend)

Clone once and run `install.sh`. **Zero files need to be added to your other repositories.**

```bash
git clone <your-repo-url> ~/Developer/KobeanSkills
cd ~/Developer/KobeanSkills

# Option A: Global Zero-Config Install (Recommended — active in ALL repos automatically)
./scripts/install.sh

# Option B: Global Install + auto-install companion CLI tools (bd, betterleaks, graphify, osv-scanner)
./scripts/install.sh --with-tools
```

Need to scope it to **just one specific project** instead of globally, or remove it cleanly?
```bash
# Scope to a single project (.agents/ and .claude/ inside that repo only)
./scripts/install.sh --project /path/to/target-repo

# Uninstall all global links cleanly
./scripts/install.sh --uninstall
```

---

## How to Use in Any Repository (Zero Per-Repo Config)

Once installed, open **any** project in **Antigravity** or **Claude Code** and chat normally. Global rules (`rules/AGENTS.md`) and the 8 `kb-*` entry skills are active automatically:

| What you want | Example prompt in any repo | Pipeline triggered |
| :--- | :--- | :--- |
| **Map an unfamiliar repo** | `"Onboard this repo"` | `kb-router` -> `explorer` (`graphify` -> `CONTEXT.md`) |
| **Build a feature** | `"Build a webhook retry queue with exponential backoff"` | `kb-spec` -> `kb-plan` (`.beads/`) -> `kb-build` (TDD + Ponytail) -> `kb-review` |
| **Design / polish UI** | `"Redesign the dashboard"` *(or `"Build a bold landing page"`)* | `kb-ui` (Impeccable / Taste-Skill + `chrome-devtools-mcp`) |
| **Fix a bug / failing test** | `"Fix the failing auth middleware test"` | `kb-debug` (reproduce -> caller trace -> regression test -> minimal fix) |
| **Audit PR / security** | `"Review my current diff"` | `kb-review` (`betterleaks`, Trail of Bits AppSec, Ponytail bloat, QA gate) |
| **Prepare a release** | `"Prepare release and update docs/changelog"` | `kb-ship` (Diátaxis docs, CI audit, SemVer `CHANGELOG.md`, rollback note) |

---

## Architecture Overview

| Entry Skill | Purpose | Specialist Roles Loaded On Demand (`~/.kobean/roles/*.yaml`) |
| :--- | :--- | :--- |
| [`kb-router`](skills/kb-router/SKILL.md) | Classifies requests and selects the execution pipeline | All 22 roles |
| [`kb-spec`](skills/kb-spec/SKILL.md) | Ponytail Ultra existence check, Socratic clarification, `spec.md`, STRIDE `threats.md` | `explorer`, `po`, `threat-modeler` |
| [`kb-plan`](skills/kb-plan/SKILL.md) | `plan.md`, OpenAPI/Zod contracts, Postgres data model, `.beads/` task graph | `architect`, `api-designer`, `data-engineer` |
| [`kb-build`](skills/kb-build/SKILL.md) | Red-Green-Refactor TDD + Ponytail Full Mode execution over `.beads/` ready queue | `data-engineer`, `backend`, `frontend`, `mobile`, `ml-engineer`, `devops`, `refactorer` |
| [`kb-ui`](skills/kb-ui/SKILL.md) | Impeccable (default) + Taste-Skill (`bold` mode) + live `chrome-devtools-mcp` inspection | `ui-ux-designer`, `frontend`, `a11y-auditor` |
| [`kb-review`](skills/kb-review/SKILL.md) | Two-stage review, `betterleaks`, Trail of Bits AppSec, `osv-scanner`, CWV perf, WCAG 2.2, QA gate | `reviewer`, `security`, `supply-chain`, `performance`, `a11y-auditor`, `qa` |
| [`kb-debug`](skills/kb-debug/SKILL.md) | Reproduce-first root-cause diagnostics and regression test creation | `debugger` |
| [`kb-ship`](skills/kb-ship/SKILL.md) | Diátaxis documentation, ADRs, CI/CD hardening, SemVer changelog, rollback plan | `tech-writer`, `devops`, `release-manager` |

See [`doctrine.md`](doctrine.md) for the precedence hierarchy and [`SOURCES.md`](SOURCES.md) for upstream commit locks and licenses.
