# KobeanSkills

An Antigravity-native and Claude Code-compatible engineering skill distribution and multi-role agent orchestration system.

KobeanSkills unifies modern agent methodologies—including **GitHub Spec-Kit**, **Superpowers**, **Beads**, **Ponytail**, **Impeccable**, **Taste-Skill**, and **Trail of Bits**—into an air-gapped, context-efficient architecture:

- **8 Entry Skills:** Progressive-disclosure interfaces that stay well within agent context limits.
- **22 Specialist Role Contracts:** Explicit YAML definitions declaring file-path ownership, allowed tooling, and strict completion gates.
- **Unified Doctrine:** Binding precedence rules that eliminate conflicts between process, task tracking, and design systems.
- **Zero-Config Global Operation:** Installs once per machine; active across all workspaces without modifying target repositories.

---

## Installation

Clone the repository and run the setup script:

```bash
git clone <repo-url> ~/Developer/KobeanSkills
cd ~/Developer/KobeanSkills

# Standard installation (enables global discovery across all projects)
./scripts/install.sh
```

### Installation Options

| Command | Description |
| :--- | :--- |
| `./scripts/install.sh` | Global installation linking entry skills and system rules into Antigravity and Claude Code. |
| `./scripts/install.sh --with-tools` | Global installation plus automated check/install of companion CLIs (`bd`, `betterleaks`, `graphify`, `osv-scanner`). |
| `./scripts/install.sh --project <dir>` | Project-scoped installation targeting only `<dir>/.agents/` and `<dir>/.claude/`. |
| `./scripts/install.sh --uninstall` | Removes all global symlinks and plugin registrations cleanly. |

---

## Workflow Reference

Workflows activate automatically through request intent or by invoking the corresponding `kb-*` skill:

| Intent | Example Prompt | Pipeline Flow |
| :--- | :--- | :--- |
| **Repository Orientation** | `"Onboard this repo"` | `kb-router` &rarr; `explorer` (`graphify` &rarr; `CONTEXT.md`) |
| **Feature Development** | `"Build a webhook retry queue with backoff"` | `kb-spec` &rarr; `kb-plan` (`.beads/`) &rarr; `kb-build` (TDD + Ponytail) &rarr; `kb-review` |
| **Interface Design & Polish** | `"Redesign the dashboard"` *(or `"Build bold landing page"`)* | `kb-ui` (Impeccable / Taste-Skill + `chrome-devtools-mcp`) |
| **Root-Cause Debugging** | `"Fix the failing auth middleware test"` | `kb-debug` (Reproduce &rarr; Blast check &rarr; Regression test &rarr; Minimal fix) |
| **Verification & Security** | `"Review current diff and check security"` | `kb-review` (`betterleaks`, Trail of Bits AppSec, Ponytail bloat check, QA test gate) |
| **Release & Documentation** | `"Prepare release and update docs"` | `kb-ship` (Diátaxis docs, CI hardening, SemVer `CHANGELOG.md`, rollback plan) |

---

## Architecture

### Entry Skills (`skills/`)

| Skill | Primary Focus | Active Roles Loaded on Demand |
| :--- | :--- | :--- |
| [`kb-router`](skills/kb-router/SKILL.md) | Request classification, pipeline selection, and subagent dispatching. | All 22 roles |
| [`kb-spec`](skills/kb-spec/SKILL.md) | Problem validation (Ponytail Ultra), Socratic clarification, `spec.md`, and STRIDE `threats.md`. | `explorer`, `po`, `threat-modeler` |
| [`kb-plan`](skills/kb-plan/SKILL.md) | Architecture planning, contract definitions, data models, and Beads (`.beads/`) task graph generation. | `architect`, `api-designer`, `data-engineer` |
| [`kb-build`](skills/kb-build/SKILL.md) | Red-Green-Refactor TDD execution against `.beads/` ready queue enforcing Ponytail minimal diffs. | `data-engineer`, `backend`, `frontend`, `mobile`, `ml-engineer`, `devops`, `refactorer` |
| [`kb-ui`](skills/kb-ui/SKILL.md) | Impeccable craft, optional Taste-Skill bold art direction, and live browser verification. | `ui-ux-designer`, `frontend`, `a11y-auditor` |
| [`kb-review`](skills/kb-review/SKILL.md) | Differential review, automated secrets gate, supply-chain checks, CWV performance, and accessibility. | `reviewer`, `security`, `supply-chain`, `performance`, `a11y-auditor`, `qa` |
| [`kb-debug`](skills/kb-debug/SKILL.md) | Systematic reproduction, caller blast-radius tracing, and regression test implementation. | `debugger` |
| [`kb-ship`](skills/kb-ship/SKILL.md) | Diátaxis documentation, ADRs, CI workflow hardening, SemVer changelogs, and rollback runbooks. | `tech-writer`, `devops`, `release-manager` |

### Specialist Roles (`roles/`)

Each role is defined in a strict YAML contract declaring write permissions, forbidden paths, allowed tooling, and completion criteria:

- **Discovery & Specification:** `explorer`, `po`, `threat-modeler`
- **Architecture & Schema:** `architect`, `api-designer`, `data-engineer`
- **Engineering & Implementation:** `frontend`, `backend`, `mobile`, `ml-engineer`, `devops`, `refactorer`, `debugger`
- **Quality & Security Gates:** `reviewer`, `security`, `supply-chain`, `performance`, `a11y-auditor`, `qa`
- **Documentation & Release:** `tech-writer`, `release-manager`

---

## Repository Structure

```text
KobeanSkills/
├── doctrine.md              # Precedence rules and core engineering doctrine
├── plugin.json              # Antigravity plugin manifest
├── rules/
│   └── AGENTS.md            # Global engineering rules injected across all workspaces
├── skills/                  # The 8 public entry skills
│   └── kb-*/SKILL.md
├── roles/                   # 22 specialist role contracts (*.yaml)
├── references/              # Curated technology & audit references
│   ├── checklists/          # OWASP, WCAG 2.2 AA, performance budgets, release checklists
│   ├── design/              # Impeccable and Taste-Skill art direction standards
│   └── stacks/              # Next.js, Node/Hono, PostgreSQL/Drizzle, Expo, Python/FastAPI
├── templates/               # Standardized artifacts (spec, plan, threats, ADR, PRODUCT.md)
├── scripts/
│   ├── install.sh           # Portable installer (global, project-specific, or uninstall)
│   └── lint.sh              # Schema, write-isolation, and frontmatter validation
└── SOURCES.md               # Audited upstream repositories, pinned SHAs, and license ledger
```

---

## Verification & Integrity

The repository includes automated checks for rule coherence, schema validity, write-path isolation, and secret prevention:

```bash
# Validate skill frontmatter, role schemas, and ensure zero write-glob collisions
./scripts/lint.sh

# Scan for credentials or leaks
betterleaks dir . -v
```

For license details and upstream source provenance, refer to [SOURCES.md](SOURCES.md). Operational doctrine and precedence standards are defined in [doctrine.md](doctrine.md).
