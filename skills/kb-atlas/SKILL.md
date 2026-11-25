---
name: kb-atlas
description: >-
  Codebase-to-diagrams, business-logic workflows, C4 architecture maps, guided
  codemaps, PR architecture deltas, and interactive HTML explainers. Use when
  explaining features/business logic, generating living wikis, drawing
  architecture/sequence/state/ERD diagrams, or visualizing PR diffs.
---

# `kb-atlas` — Codebase Intelligence, Business Workflows & Visual Diagrams

Distilled from **Archify** (`tt-a1i/archify` — 10-type diagram router, instrument design system, commit-pinned source provenance, Semantic Passport, `archify-pr`), **DeepWiki-Open** (`AsyncFuncAI/deepwiki-open` — structured wiki planning, line-cited codemaps), **Understand-Anything** (`Egonex-AI/Understand-Anything` — business-domain flow extraction), **PocketFlow Tutorial** (`The-Pocket/PocketFlow-Tutorial-Codebase-Knowledge` — pedagogical abstraction ordering), **CodeWiki** (`FSoft-AI4Code/CodeWiki` — recursive monorepo clustering & artifact-aware graphs), **Visual-Explainer** (`nicobailon/visual-explainer`), **Litho** (`sopaco/deepwiki-rs` — C4 model), **Floorplan**, **CodeBoarding**, and **drawio-skill**.

## Active Roles Loaded by This Skill
- [`~/.kobean/roles/explorer.yaml`](../../roles/explorer.yaml) *(Layer 1 fast `graphify` AST scout when `graphify-out/` is missing)*
- [`~/.kobean/roles/atlas-architect.yaml`](../../roles/atlas-architect.yaml) *(primary `pro` role owning `docs/atlas/**` & `docs/architecture/**`)*

---

## Step 1: Select Mode & Read Craft References

1. Read `references/design/diagrams-and-workflows.md` and `references/checklists/atlas-quality.md` (from `.kobean/` or `~/.kobean/`).
2. Classify the user's request into one of four modes:

| Mode | Trigger Examples | Primary Outputs |
| :--- | :--- | :--- |
| **`wiki` / `domain`** | "Document all business logic & features", "Generate a living codebase wiki", "Explain how this entire app works" | `docs/atlas/INDEX.md`, `docs/atlas/atlas.json`, prerequisite-ordered domain chapters (`docs/atlas/domains/*.md`), optional `docs/atlas/index.html` |
| **`diagram` / `flow`** | "Draw the system architecture / ERD / state machine / checkout sequence", "Make an interactive HTML diagram" | Validated Mermaid/D2 Markdown or self-contained `docs/atlas/<slug>.html` (from `templates/atlas-explainer.html`) or `.drawio` via `drawio` MCP |
| **`codemap` / `explainer`** | "Trace how a refund works end-to-end", "Create a 1-page visual explainer of feature X" | Step-numbered execution trace (`docs/atlas/codemaps/<slug>.md` or 1-page interactive `docs/atlas/<slug>.html`) |
| **`pr-delta`** | "Visualize this PR / git diff", "Show architectural impact of my branch" | 3-dot merge-base change-marked diagram (`ADDED`/`MODIFIED`/`REMOVED`) gated by `kobean atlas pr-check` |

---

## Step 2: Establish Deterministic Structural Truth (Zero Hallucination)

Never invent components or edges from directory names or README prose alone:
1. **Freeze Git Identity:** Run `git rev-parse HEAD` (40-char SHA) and `git status --short`. Record the SHA in `docs/atlas/atlas.json`; explicitly disclose any uncommitted paths rather than attributing them to `HEAD`.
2. **AST & Artifact Graph First:**
   - Check for `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md`. If missing and `graphify` is installed, run `graphify` (or dispatch `explorer` on `flash`) to extract deterministic AST communities and god-nodes.
   - Inspect non-code architectural artifacts alongside source code: SQL/Drizzle/Prisma schemas, OpenAPI/GraphQL/Protobuf contracts, queue/cron registrations, `Dockerfile`, and CI workflows.
3. **Trace Actual Call Sites & Ownership:** Read the exact entry point, auth/validation middleware, domain rules, state transitions, error/rollback branches, and persistence writers with real 1-based line numbers. Tag direct AST/call/schema edges `EXTRACTED` and dynamic/config wiring `INFERRED`.

---

## Step 3: Execute by Mode & Codebase Scale

### A. `wiki` / `domain` Mode (Business Logic & Living Atlas)
1. **Ban Folder Mirrors:** Extract **5–12 Core Business Capabilities / Abstractions** (plain-English domain intent paired with implementing symbols) and order chapters by **topological prerequisite dependency**.
2. **Scale-Adaptive Orchestration (`doctrine.md` Section 6.2):**
   - **Small/Medium repos (`< 20k LOC` or `< 3` major domains):** Execute inline (Level 1) or with a single `atlas-architect` subagent (Level 2).
   - **Large repos / Monorepos (`>= 20k LOC` or `>= 3` subsystems):** Escalate to **Level 3 (`run_workflow`)** bottom-up recursive synthesis:
     1. Partition `graphify` communities into balanced domain clusters.
     2. Fan out parallel leaf `atlas-architect` agents to write verified leaf domain pages + sequence/state diagrams (`docs/atlas/domains/<domain>.md`).
     3. Fan in a parent `atlas-architect` synthesis pass to compose `docs/atlas/INDEX.md` (C4 System Context + Containers + Cross-Domain Workflows + Navigation) and `docs/atlas/atlas.json`.
3. **Incremental Refresh:** When `docs/atlas/atlas.json` already exists, run `kobean atlas check` first and regenerate **only the stale pages** whose cited source files changed since `headSha`.

### B. `diagram` / `flow` & `codemap` / `explainer` Modes
1. Pick the exact mode from the **10-Mode Diagram Router** (`c4-architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`, `erd`, `class`, `tree`, `timeline`, `waterfall`).
2. Enforce the **15-Node Cognitive Cap** per canvas; split denser systems into Overview + linked drilldowns.
3. For **interactive HTML explainers** (`docs/atlas/<slug>.html`), start from `.kobean/templates/atlas-explainer.html` (or `~/.kobean/templates/atlas-explainer.html`), populate the `<script id="atlas-manifest" type="application/json">` payload (nodes, semantic categories, edges with `EXTRACTED`/`INFERRED` tags, Flow Trace steps, and `sources: [{path, line, end_line}]`), and wire Dark/Light/Blueprint instrument tokens.
4. For **editable `.drawio` diagrams**, use the `drawio` MCP server (`kobean mcp add drawio`) when configured so humans can co-edit layout in draw.io without losing semantics.

### C. `pr-delta` Mode (Material Pull Request Visuals)
1. Run `kobean atlas pr-check --json` (or `git merge-base origin/main HEAD`).
2. Respect the **Materiality Filter**: stay silent on trivial (<40-line single-file, docs/test/lockfile-only) diffs unless the user explicitly requested a diagram.
3. Draw a **merged-superset view** with 1 hop of unchanged context and explicit `ADDED` (emerald), `MODIFIED` (amber), and `REMOVED` (rose) styling pinned to `baseSha...headSha`. Report observed blast radius and counts only—never stamp `SAFE` or `MERGEABLE`.

---

## Step 4: Mandatory 3-Gate Verification Before Delivery

1. **Deterministic Citation & Drift Gate:** Run `kobean atlas check` (or `node bin/kobean.js atlas check` / `npx kobean-skills atlas check`) and fix every missing file or out-of-bounds line range until it exits `0`.
2. **Reader-Answer Check:** Answer the user's question by reading *only* the rendered diagram arrows and labels; repair any reversed data/control arrow or unlabeled branch condition.
3. **Live Visual QA Gate (`chrome-devtools-mcp`):** For any HTML/SVG artifact, open it in `chrome-devtools-mcp`, test Dark and Light themes at `1440px` and `768px`, and verify 0 console errors, 0 label overlaps/clipping, and working Semantic Passport / Flow Trace interactions.

## Required Output Footer
Return clickable links to the generated `docs/atlas/` artifacts, the `kobean atlas check` result, and a 1–2 line Ponytail note naming any intentionally omitted abstraction layers or unresolved runtime unknowns.
