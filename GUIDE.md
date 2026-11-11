# KobeanSkills — Developer Workflow Guide & Cheatsheet

This guide explains how to effectively use KobeanSkills across all daily engineering workflows.

---

## 1. Two Ways to Trigger Workflows

You never need to memorize complex syntax. You can trigger workflows in two ways:

1. **Natural Language (Intent-Based):** Just describe what you want naturally. The global rules in `AGENTS.md` automatically route the task to the right pipeline.
2. **Explicit Skill Invocations (Command-Style):** Mention the entry skill (e.g., `kb-spec`, `kb-ui`, `kb-review`) directly for explicit control.

---

## 2. The 6 Core Engineering Playbooks

### Playbook 1: Building a Feature End-to-End

When building a new capability, endpoint, or multi-file enhancement:

```text
Prompt:
"Use kb-router to build an invitation system where admins can invite teammates via email with expiring tokens."
```

**What the AI pipeline does step-by-step:**
1. **Spec Phase (`kb-spec`):** 
   - Checks if existing code/libraries already do this (Ponytail Ultra gate).
   - Asks you 1–3 clarifying questions via `ask_question` about edge cases (e.g., token expiration, duplicate invites).
   - Generates `specs/001-invites/spec.md` (and `threats.md` if touching auth/tokens).
2. **Architecture & Contracts Phase (`kb-plan`):**
   - Designs shared Zod/OpenAPI schemas in `contracts/`.
   - Defines database tables and indexes in `data-model.md`.
   - Generates dependency-ordered tasks in `.beads/` using `bd`.
3. **Execution Phase (`kb-build`):**
   - Fetches unblocked tasks (`bd ready`).
   - Writes automated tests *first* (Red phase), writes minimal code to pass (Green phase), and refactors.
   - Closes each task in `.beads/` automatically.
4. **Verification Phase (`kb-review`):**
   - Scans for hardcoded secrets (`betterleaks`).
   - Audits against Trail of Bits security rules and runs test suites.
5. **Ship Phase (`kb-ship`):**
   - Updates documentation and logs user-facing changes in `CHANGELOG.md`.

---

### Playbook 2: High-Craft UI/UX Design

When building frontend surfaces, landing pages, or product interfaces:

```text
# Standard Product UI (Dashboards, forms, settings, data tables):
"Use kb-ui to build the user analytics dashboard."

# Bold / High-Agency Art Direction (Landing pages, marketing, brand sites):
"Use kb-ui in bold mode to design the marketing homepage."
```

**Key rules the AI enforces:**
- **Zero AI-Slop:** Banned from using generic purple/blue neon gradients, 3-card marketing clichés, or filler text ("Supercharge your workflow").
- **Design Tokens First:** Creates or references `PRODUCT.md` for typographic scales, semantic color tokens, and spacing grids.
- **Complete States:** Generates all 4 required states: **Loading Skeleton** (zero layout shift, `CLS <= 0.1`), **Empty State**, **Error with Retry**, and **Populated**.
- **Live Verification:** Connects to your local dev server via `chrome-devtools-mcp` to verify mobile responsiveness (`390px`, `768px`, `1024px`, `1440px`) and accessibility (`WCAG 2.2 AA`).

---

### Playbook 3: Systematic Bug Fixing & Diagnostics

When fixing regressions, failing tests, or runtime exceptions:

```text
Prompt:
"Use kb-debug to investigate this error:
[Paste error log, stack trace, or failing test output]"
```

**What the AI does:**
- **Iron Law:** The agent is forbidden from applying random patches or guessing.
- **Reproduces First:** Runs the failing command or writes a reproduction script.
- **Traces Callers:** Uses `graphify` to inspect every caller of the broken function.
- **Regression Test First:** Adds a test that reproduces the bug (Red phase).
- **Minimal Fix:** Applies the smallest root-cause fix in shared code and proves both the new regression test and all existing test suites pass.

---

### Playbook 4: Code Review, Security & Pre-PR Gate

Before opening a pull request or merging a feature branch:

```text
Prompt:
"Use kb-review to audit my current git changes."
```

**Output provided:**
- **Secrets Gate:** Automated `betterleaks` scan output (0 leaks allowed).
- **Trail of Bits AppSec Audit:** Checks for IDOR, insecure defaults, timing attacks, and unvalidated inputs.
- **Code Economy Review:** Flags unnecessary wrappers, dead code, or bloat that can be deleted before shipping.
- **QA Verification:** Proves that all unit, integration, and E2E tests pass cleanly in the current turn.

---

### Playbook 5: Technical Debt & Simplification

When a codebase feels bloated or over-engineered:

```text
Prompt:
"Use kb-build with the refactorer role to clean up and simplify src/server/auth."
```

**What the AI does:**
- Runs the test suite before touching anything to establish a green baseline.
- Deletes dead code, collapses single-use abstractions, and simplifies control flow.
- Documents any remaining shortcuts or limits in `DEBT.md`.
- Proves zero change in functional behavior by re-running the test suite.

---

### Playbook 6: Unfamiliar Codebase Onboarding

When working on a new repository for the first time:

```text
Prompt:
"Use kb-router to onboard this repository."
```

**What the AI does:**
- Runs `graphify` (AST parser) to map modules, entry points, and dependency trees.
- Produces `CONTEXT.md` summarizing core directories, architectural patterns, shared helpers to reuse, and how to run tests.

---

## 3. Power Controls & Steering

| If you want to... | What to say |
| :--- | :--- |
| **Question whether a feature is necessary** | `"Run kb-spec with ponytail ultra"` |
| **Keep implementations ultra-minimal** | `"Use ponytail mode: smallest possible diff"` |
| **Inspect task status** | Run `bd ready` or `bd list` in terminal |
| **Check installed tools** | Run `npx kobean-skills doctor` |
| **Clean up global links** | Run `npx kobean-skills install --uninstall` |

---

## 4. Where Artifacts Live in Your Project

| File / Folder | Purpose |
| :--- | :--- |
| `.kobean/` | Engine folder containing skills, 22 role contracts, stack guides, and doctrine. |
| `.kobean/constitution.md` | Your project's explicit rules and non-goals. |
| `specs/NNN-<slug>/spec.md` | Requirements specifications with Given/When/Then acceptance tests. |
| `specs/NNN-<slug>/plan.md` | Technical plans and file-level write assignments. |
| `specs/NNN-<slug>/threats.md`| STRIDE threat models and DREAD security scoring. |
| `.beads/` | Version-controlled task dependency graph (managed by `bd`). |
| `PRODUCT.md` | Design system, brand voice, typography scale, and color tokens. |
| `CONTEXT.md` | High-level codebase architecture map generated by `graphify`. |
