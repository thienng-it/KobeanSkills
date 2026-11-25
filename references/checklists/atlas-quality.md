# Atlas, Diagrams & Business-Logic Documentation Quality Checklist

> Companion verification checklist for `kb-atlas` and the `atlas-architect` role (`references/design/diagrams-and-workflows.md`).

## 1. Deterministic Provenance & Citation Gate
- [ ] `docs/atlas/atlas.json` pins the 40-char `headSha` (`git rev-parse HEAD`) and credential-free repository identity (or explicitly discloses dirty working-tree paths).
- [ ] `kobean atlas check` (or `node .kobean/bin/kobean.js atlas check` / `npx kobean-skills atlas check`) exits `0` with **0 missing files** and **0 out-of-bounds line citations**.
- [ ] Every non-obvious cross-module edge is backed by real AST/import/call-site evidence (`EXTRACTED`) or explicitly labeled `INFERRED` with its resolution mechanism.
- [ ] Unmeasured latencies, throughput figures, or timings in waterfall/timeline views are explicitly labeled `illustrative`.

## 2. Business-Logic & Workflow Completeness
- [ ] Documentation is organized by **Business Capabilities & Domain Mental Models**, not a mechanical mirror of raw directory names.
- [ ] Every core user or system workflow traces end-to-end: **Entry Trigger $\rightarrow$ Auth/Validation $\rightarrow$ Domain Invariants $\rightarrow$ State Transitions $\rightarrow$ Persistence / External Side-Effects**.
- [ ] Conditional branches, retries, idempotency guards, and error/rollback paths reflect actual source branches rather than optimistic happy-path assumptions.
- [ ] Database schemas/migrations, API contracts (OpenAPI/GraphQL/Protobuf), queues, and CI/Docker runtime topology are linked to the code that owns them.

## 3. Cognitive Density & Diagram Craft
- [ ] Every single diagram canvas stays at **$\le 15$ primary nodes** (complex systems decompose into an Overview + linked drilldown diagrams).
- [ ] The diagram mode matches the question (`c4-architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`, `erd`, `class`, `tree`, `timeline`, or `waterfall`).
- [ ] Semantic colors encode architectural layers consistently (`frontend`, `api`, `backend`, `database`, `security`, `queue`, `external`) with zero decorative gradients or AI-slop cards.
- [ ] Mermaid node labels with parentheses, slashes, or colons are properly quoted, and `sequenceDiagram` blocks declare participants and use colon labels (`A->>B: Action`).

## 4. Reader-Answer & Live Visual QA Gate
- [ ] **Reader-Answer Check:** Answer the user's original question using *only* the rendered diagram arrows and labels (without reading surrounding prose). Fix any inverted read/write arrow, ambiguous hop, or missing branch guard.
- [ ] **Interactive HTML / SVG Verification (`chrome-devtools-mcp`):** For any generated `docs/atlas/*.html` or SVG artifact:
  - [ ] Opens cleanly with **0 console errors** and **0 broken external requests** (works offline).
  - [ ] Verified in both **Dark** and **Light** themes at `1440px` and `768px` (`resize_page` + `take_screenshot`).
  - [ ] Zero overlapping text labels, clipped cards, or unreadable contrast (< WCAG AA `4.5:1`).
  - [ ] Keyboard focus (`:focus-visible`), pan/zoom, Flow Trace controls, and Semantic Passport citations work interactively.
- [ ] **PR Delta Rule (if `pr-delta` mode):** Uses 3-dot `git merge-base` diff (`baseSha...headSha`), marks `ADDED`/`MODIFIED`/`REMOVED` elements accurately, omits unchanged noise views, and states facts without issuing subjective `SAFE` / `MERGEABLE` risk verdicts.
