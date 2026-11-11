# KobeanSkills

A universal engineering skill distribution and multi-role agent orchestrator natively supporting **Gemini CLI & Antigravity**, **Claude CLI (Claude Code)**, and **Codex CLI**.

KobeanSkills unifies modern agent methodologies—including **GitHub Spec-Kit**, **Superpowers**, **Beads**, **Ponytail**, **Impeccable**, **Taste-Skill**, and **Trail of Bits**—into an air-gapped, context-efficient architecture:

- **9 Entry Skills:** Progressive-disclosure interfaces that stay well within agent context limits.
- **22 Specialist Role Contracts:** Explicit YAML definitions declaring file-path ownership, allowed tooling, and strict completion gates.
- **Unified Doctrine:** Binding precedence rules that eliminate conflicts between process, task tracking, and design systems.
- **Zero-Config Project Operation:** Installs once into `.kobean/` in seconds; requires zero manual configuration.

---

## Quick Setup: No Cloning Required

Any developer can install KobeanSkills into their existing repository using **one command without cloning this repo**:

### Option 1: Via `bunx` or `npx` (Instant Zero-Clone Setup)

Run from the root of any repository:

```bash
# Using Bun (Fastest ~50ms startup):
bunx kobean-skills init

# Or using Node/npx (Universal, pre-installed everywhere):
npx kobean-skills init

# Verify companion CLI tools:
bunx kobean-skills doctor  # or npx kobean-skills doctor
```

### Option 2: Via `curl` (Zero dependencies — Works for Python, Go, Rust, etc.)

Run from the root of any repository:

```bash
curl -fsSL https://raw.githubusercontent.com/thienng-it/KobeanSkills/main/setup.sh | bash
```

### Option 3: Via Docker (Zero host tools needed)

Run in any project using Docker:

```bash
docker run --rm -v "$(pwd):/workspace" ghcr.io/thienng-it/kobean-skills:latest kobean init
```

### What these single commands do:
1. Unpacks all 9 entry skills, 22 role contracts, stack references, templates, and doctrine into **`.kobean/`** in your repository.
2. Automatically configures **Gemini CLI / Antigravity** (`.agents/` & `GEMINI.md`), **Claude CLI** (`.claude/` & `CLAUDE.md`), and **Codex CLI** (`.codex/` & `AGENTS.md`) discovery.
3. Leaves zero extra files or git bloat. Simply commit `.kobean/` to Git to share with your team.

---

## Local & Machine-Wide Setup Options

If you have already cloned KobeanSkills locally or want a machine-wide global installation:

```bash
# Apply to current project from a local clone:
~/Developer/KobeanSkills/init.sh

# Install globally across all repositories on your Mac (~/.gemini, ~/.claude, & ~/.codex):
~/Developer/KobeanSkills/scripts/install.sh
```

| Command | Description |
| :--- | :--- |
| `npx kobean-skills init` | Zero-clone project setup into `.kobean/` with automated MCP & rule wiring. |
| `npx kobean-skills help [cmd]` | Context-aware manual for any command (e.g. `init`, `mcp`, `skills`, `doctor`). |
| `npx kobean-skills skills [name]` | Terminal inspector for all 9 entry skills; `kobean skill <name>` prints runbook. |
| `npx kobean-skills roles [phase]` | Terminal inspector for 22 specialist roles; `kobean role <name>` prints YAML. |
| `npx kobean-skills playbooks [q]` | Browse 9 engineering playbooks; `kobean playbook <name>` extracts playbook. |
| `npx kobean-skills mcp` | Inspect configured MCP connectors, agent sync status, and environment variables. |
| `npx kobean-skills mcp marketplace` | Browse 38+ vetted MCP connectors across 6 categories in terminal. |
| `npx kobean-skills mcp search <query>` | Search marketplace connectors by keyword, technology, or provider. |
| `npx kobean-skills mcp add <name>` | Add a vetted or custom MCP connector and auto-sync across all 4 agent files. |
| `npx kobean-skills mcp sync` | Synchronize `.kobean/mcp.json` across Claude Code, Gemini CLI, Antigravity, and Codex. |
| `npx kobean-skills pr-template` | Scaffold clean, elegant GitHub PR template (`.github/pull_request_template.md`). |
| `npx kobean-skills docs` | Opens the interactive visual documentation site in your browser. |
| `npx kobean-skills guide` | Prints the complete developer playbook and prompt cheatsheet in terminal. |
| `npx kobean-skills doctor` | Verify status of companion CLI tools (`bd`, `betterleaks`, `graphify`) and MCP servers. |
| `npx kobean-skills install` | Machine-wide global installation into `~/.gemini`, `~/.claude`, and `~/.codex`. |
| `./scripts/install.sh --uninstall` | Cleanly removes all global symlinks and plugin registrations. |

---

## Universal Cross-Agent MCP & Connectors Manager

Different AI tools store Model Context Protocol (MCP) servers in incompatible locations and formats:
- **Claude Code:** `.mcp.json` (JSON `mcpServers`)
- **Antigravity & Gemini CLI:** `.agents/mcp.json` & `~/.gemini/config/mcp_config.json`
- **OpenAI Codex:** `.codex/config.toml` & `~/.codex/config.toml` (TOML `[mcp_servers.<name>]`)

KobeanSkills eliminates config drift by establishing a single source of truth in **`.kobean/mcp.json`** and providing a built-in catalog of **38+ pre-vetted connectors**:

```bash
# 1. Browse 38+ connectors in the Marketplace directory:
bunx kobean-skills mcp marketplace

# 2. Search for any connector (e.g. database, supabase, linear, search):
bunx kobean-skills mcp search database

# 3. Add connectors in one command (auto-syncs to all agents):
bunx kobean-skills mcp add postgres      # PostgreSQL database query engine
bunx kobean-skills mcp add supabase      # Supabase tables, auth & storage
bunx kobean-skills mcp add github        # PRs, issues, commits, branches
bunx kobean-skills mcp add playwright    # Headless browser testing & UI automation
bunx kobean-skills mcp add docker        # Container & compose lifecycle manager

# 4. Synchronize across Claude, Gemini, Antigravity, and Codex:
bunx kobean-skills mcp sync
```

### Marketplace Categories
1. **Databases & Storage (10):** `postgres`, `sqlite`, `mysql`, `supabase`, `neon`, `redis`, `mongodb`, `clickhouse`, `pinecone`, `qdrant`
2. **Developer Tools & CI (8):** `github`, `gitlab`, `linear`, `jira`, `docker`, `kubernetes`, `sentry`, `postman`
3. **Web & Testing (4):** `playwright`, `puppeteer`, `chrome-devtools`, `fetch`
4. **Search & Intelligence (5):** `brave-search`, `exa`, `tavily`, `memory`, `arxiv`
5. **Cloud & Big Data (4):** `cloudflare`, `bigquery`, `aws-kb`, `snowflake`
6. **Productivity & Comms (7):** `filesystem`, `slack`, `discord`, `notion`, `google-drive`, `google-maps`, `resend`

### Zero-Leak Credential Safety
KobeanSkills preserves `${ENV_VAR}` template references in all generated configs. Your API keys (`GITHUB_TOKEN`, `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are read securely from your environment or `.env` at runtime and are **never committed to Git in plaintext**. Kobean's `doctor` and `mcp list` audit missing variables automatically.

---

## Documentation & Developer Playbooks

KobeanSkills provides an **interactive documentation page** at [`docs/index.html`](docs/index.html) (viewable locally by running `npx kobean-skills docs` or hosted via GitHub Pages) with an interactive 22-role matrix filter, architecture diagrams, and pipeline tabs.

For quick reference in the terminal, see [GUIDE.md](GUIDE.md) (or run `npx kobean-skills guide`).

| Intent | Example Prompt | Pipeline Flow |
| :--- | :--- | :--- |
| **Repository Orientation** | `"Onboard this repo"` | `kb-router` &rarr; `explorer` (`graphify` &rarr; `CONTEXT.md`) |
| **Feature Development** | `"Build a webhook retry queue with backoff"` | `kb-spec` &rarr; `kb-plan` (`.beads/`) &rarr; `kb-build` (TDD + Ponytail) &rarr; `kb-review` |
| **Interface Design & Polish** | `"Redesign the dashboard"` *(or `"Build bold landing page"`)* | `kb-ui` (Impeccable / Taste-Skill + `chrome-devtools-mcp`) |
| **Root-Cause Debugging** | `"Fix the failing auth middleware test"` | `kb-debug` (Reproduce &rarr; Blast check &rarr; Regression test &rarr; Minimal fix) |
| **Verification & Security** | `"Review current diff and check security"` | `kb-review` (`betterleaks`, Trail of Bits AppSec, Ponytail bloat check, QA test gate) |
| **Git & Pull Requests** | `"Create branch, rebase on main, and open PR"` | `kb-git` (Branch lifecycle, Conventional Commits, rebase master/main, PR templates) |
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
| [`kb-git`](skills/kb-git/SKILL.md) | Branch lifecycle, conventional commits, rebase master/main, clean push, and GitHub PR templates. | `release-manager`, `devops` |
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
├── package.json             # npm package manifest (npx kobean-skills)
├── bin/
│   └── kobean.js            # Node CLI (init, doctor, install)
├── setup.sh                 # Zero-clone curl web installer
├── init.sh                  # Standalone repository initializer
├── Dockerfile               # Pre-baked sandbox container with bd, betterleaks, osv-scanner
├── docker-compose.yml       # Docker Compose service definition
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
