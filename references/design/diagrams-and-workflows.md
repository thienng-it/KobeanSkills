# Diagrams, Business Workflows & Codebase Atlas Craft Doctrine

> Distilled from `tt-a1i/archify` (Apache-2.0), `AsyncFuncAI/deepwiki-open` (MIT), `Egonex-AI/Understand-Anything` (MIT), `The-Pocket/PocketFlow-Tutorial-Codebase-Knowledge` (MIT), `FSoft-AI4Code/CodeWiki` (MIT), `nicobailon/visual-explainer` (MIT), `sopaco/deepwiki-rs` (MIT), `Agents365-ai/drawio-skill` (MIT), `CodeBoarding/CodeBoarding` (MIT), and `haydenschmitty/floorplan` (MIT).

---

## 1. The 10-Mode Diagram Router

Never force every architectural question into a generic boxes-and-arrows flowchart. Select the exact canonical diagram type that matches the reader's question:

| Diagram Mode | Best Used For | Preferred Mermaid / D2 / HTML Target |
| :--- | :--- | :--- |
| **`c4-architecture`** | System context, runtime containers, service/module boundaries, trust boundaries, external dependencies | C4 `flowchart TD` (subgraphs by trust boundary), D2, or `atlas-explainer.html` |
| **`workflow`** | Business processes, approval gates, multi-step jobs, CI/CD pipelines, decision branches | `flowchart TD` with explicit branch labels on every outgoing edge |
| **`sequence`** | API request lifecycles, auth handshakes, webhook callbacks, async pub/sub round trips | `sequenceDiagram` with `autonumber`, typed `participant`s, `alt`/`opt`/`par`/`loop`, `+/-` activations |
| **`dataflow`** | ETL/ELT pipelines, event streams, lineage, transformations, read/write store ownership | `flowchart LR` (short linear stage chain $\le 8$ stages) or `flowchart TD` with distinct store shapes |
| **`lifecycle`** | Order, payment, job, or agent state machines, retries, timeouts, and terminal states | `stateDiagram-v2` with transition guard conditions and failure/terminal states |
| **`erd`** | Relational tables, primary/foreign/unique keys, and cardinality | `erDiagram` derived directly from SQL DDL / Drizzle / Prisma / migrations |
| **`class`** | Domain aggregates, interfaces, protocol implementations, composition hierarchies | `classDiagram` with selected public members only (never dump getters/setters) |
| **`tree`** | Capability/feature breakdown, repository module hierarchy, single-parent containment | `flowchart TD` tree or nested interactive perspective groups |
| **`timeline`** | Release histories, migration phases, timestamped incident sequences | Ordered milestone table or proportional horizontal lane in `atlas-explainer.html` |
| **`waterfall`** | Request latency breakdown, parallel spans, startup or agent execution timing | Timed span bars in `atlas-explainer.html` (mark `"illustrative"` if unmeasured) |

---

## 2. Instrument Aesthetic & Semantic Color System

Every diagram—whether rendered in `templates/atlas-explainer.html`, SVG, D2, or Mermaid `classDef`—must feel like a **precision engineering instrument**, never marketing AI slop.

### Semantic Color Rule
**Every saturated color maps strictly to an architectural category—never use color as arbitrary decoration.** Maintain theme parity across Dark, Light, and Blueprint modes:

| Semantic Category | Role / Meaning | Dark Stroke / Fill Tint | Light Stroke / Fill Tint |
| :--- | :--- | :--- | :--- |
| **`frontend`** (Ingress Sky) | Clients, browsers, mobile apps, CLI entry points | `#38BDF8` / `rgba(56,189,248,0.12)` | `#0284C7` / `#E0F2FE` |
| **`api`** (Verified Cyan) | API gateways, routers, HTTP/RPC/GraphQL contracts | `#06B6D4` / `rgba(6,182,212,0.12)` | `#0891B2` / `#CFFAFE` |
| **`backend`** (Logic Emerald) | Domain services, business rules, workers, handlers | `#10B981` / `rgba(16,185,129,0.12)` | `#059669` / `#D1FAE5` |
| **`database`** (Storage Violet) | PostgreSQL, Redis, object stores, persistent state | `#A78BFA` / `rgba(167,139,250,0.12)` | `#7C3AED` / `#EDE9FE` |
| **`security`** (Boundary Rose) | AuthN/AuthZ, RBAC, webhook signature checks, policies | `#F43F5E` / `rgba(244,63,94,0.12)` | `#E11D48` / `#FFE4E6` |
| **`queue`** (Transit Amber) | Queues, event buses, schedulers, retries, webhooks | `#F59E0B` / `rgba(245,158,11,0.12)` | `#D97706` / `#FEF3C7` |
| **`external`** (External Slate) | Third-party SaaS (Stripe, OAuth, LLMs, SMTP) | `#94A3B8` / `rgba(148,163,184,0.12)` | `#475569` / `#F1F5F9` |

### Hard Diagram Anti-Slop Bans
1. **No Hairballs (15-Node Cognitive Cap):** Never place more than **12–15 primary nodes** on a single canvas. If a subsystem has more, split hierarchically into an Overview diagram plus linked per-subsystem drilldown views (`overview` $\rightarrow$ `domain` $\rightarrow$ `sequence`).
2. **No ASCII Box-Drawing Art:** Never draw multi-box architecture diagrams with Unicode box characters (`+---+`, `|`) when Mermaid, D2, or `atlas-explainer.html` can be produced.
3. **No Unquoted Special Characters in Mermaid:** Always quote node labels containing parentheses, brackets, colons, or slashes: `api["API Router (/v1/orders)"]`. Keep node titles to **2–4 words** and put protocols/details in edge labels or the Semantic Passport.
4. **Strict Sequence Syntax:** Pre-declare all `participant` aliases at the top of `sequenceDiagram`, use `: Label` (never flowchart pipe syntax `-->|label|`), use `->>` (sync call), `-->>` (response), `->x` (error), `-)` (async event), and show `alt` / `opt` / `par` branches explicitly.
5. **No Decorative Gradients or Drop-Shadow Noise:** Diagrams stay flat-at-rest (`1px` structural borders, crisp contrast $\ge 4.5:1$). Shadows appear only on floating inspector drawers or active focus highlights.

---

## 3. Repository-Backed Grounding & Citation Rules

**The source code at a pinned Git revision is the sole authority.** Never invent a service, queue, or edge from a filename, folder name, or README sentence.

1. **Freeze Repository Identity:** Record `git rev-parse HEAD` (full 40-char SHA) and credential-stripped origin URL in `docs/atlas/atlas.json`. If the working tree is dirty, disclose uncommitted paths explicitly rather than attributing uncommitted edits to `HEAD`.
2. **Edge Provenance (`EXTRACTED` vs. `INFERRED`):**
   - Tag edges backed by direct AST imports, call sites, SQL foreign keys, or matched frontend-to-backend routes as **`EXTRACTED`**.
   - Tag dynamic dispatch, DI container wiring, or convention-based plugin hooks as **`INFERRED`** and explain the resolution rule.
   - Surface unresolved runtime questions explicitly (*"calls `enqueueJob()`; broker durability config lives outside repo"*).
3. **Strict Inline Citations:** Every significant claim, workflow step, table row, and diagram component must cite exact repository-relative paths and inclusive 1-based line ranges:
   - Markdown format: `Sources: [src/server/orders/checkout.ts:42-89](../../src/server/orders/checkout.ts#L42-L89)`
   - Manifest / HTML JSON format: `{"path": "src/server/orders/checkout.ts", "line": 42, "end_line": 89}`
   - Never cite bare filenames (`checkout.ts`); always use the repository-relative path.
4. **Trace Actual Ownership:** Distinguish the controller requesting an operation from the service executing the invariant and the store receiving bytes. For conditional branches, retries, or fallbacks, read and label the exact guard condition at the call site.

---

## 4. Business-Logic & Pedagogical Wiki Synthesis

When documenting an entire repository (`wiki` / `domain` mode), **never generate a folder-by-folder directory mirror** (`src/utils.md`, `src/helpers.md`). Organize knowledge around **how the product actually works**:

1. **Extract 5–12 Core Business Capabilities / Abstractions:** Translate technical wrappers into plain-English domain concepts (*"Checkout & Idempotent Payment Capture"*, not *"StripeService.ts"*), pairing business intent with the exact implementing symbols.
2. **Topological Prerequisite Ordering:** Order chapters from foundational domain concepts and entry surfaces $\rightarrow$ core business rules & state machines $\rightarrow$ persistence & async side-effects $\rightarrow$ operational/deployment topology, so Chapter 1 never depends on Chapter 6.
3. **Screen / Trigger $\rightarrow$ Side-Effect Traces (Codemaps):** For every primary feature, document:
   - **Entry Trigger:** UI screen/action, HTTP endpoint, webhook, CLI command, or cron schedule.
   - **Auth & Trust Boundary:** Who is permitted to trigger it and how inputs/signatures are validated.
   - **Business Rules & Invariants:** Exact validations, calculations, idempotency checks, and state transitions.
   - **Failure & Rollback Paths:** What happens on timeout, partial failure, or duplicate delivery.
   - **Data & External Effects:** Exact tables written, events published, and third-party APIs called.
4. **Artifact-Aware Coverage:** Always include database schemas/migrations, OpenAPI/GraphQL/Protobuf contracts, Dockerfiles, and CI workflows as first-class architectural nodes linked to the code they govern.

---

## 5. Output Format Selection

| Audience & Surface | Recommended Deliverable | Key Rule |
| :--- | :--- | :--- |
| **GitHub / GitLab / Backstage Wiki** | `docs/atlas/INDEX.md` + per-domain `.md` chapters with fenced Mermaid + `docs/atlas/atlas.json` | Max 15 nodes per diagram; verified via `kobean atlas check`. |
| **Deep Interactive Review / Onboarding** | Standalone `docs/atlas/<slug>.html` from `templates/atlas-explainer.html` | Offline-capable, Dark/Light/Blueprint toggle, clickable **Semantic Passport**, Flow Trace stepper, verified in `chrome-devtools-mcp`. |
| **Confluence / Manual Co-Editing** | Editable `.drawio` via `drawio` MCP (`@next-ai-drawio/mcp-server`) or `D2` source | Separate semantic facts in `atlas.json` so updates don't lose human layout edits. |
| **Pull Request Review (`pr-delta`)** | Change-marked merged-superset Mermaid (`ADDED`/`MODIFIED`/`REMOVED` classes) pinned to `merge-base...HEAD` | Run `kobean atlas pr-check` first; stay silent on trivial PRs; never issue subjective `SAFE`/`MERGEABLE` verdicts. |
