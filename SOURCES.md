# KobeanSkills — Upstream Sources & Provenance Lock

This file records the exact upstream repositories, commits, and licenses from which `KobeanSkills` distills its methodologies, role contracts, and reference checklists.

> **Security Policy (Air-Gap):**
> 1. None of these upstream repositories are ever symlinked into `~/.gemini/config/skills/` or `~/.claude/skills/`.
> 2. Zero executable scripts (`.py`, `.sh`, `.mjs`, `.js`) or lifecycle `hooks.json` files are copied from upstreams.
> 3. Runtime skills (`skills/kb-*/`) never read from `vendor/` at execution time.

## Pinned Upstreams (Audited 2026-11-11)

| Upstream Repository | Pinned Commit SHA | Commit Date | License | Used For (Distilled Into) |
| :--- | :--- | :--- | :--- | :--- |
| [obra/superpowers](https://github.com/obra/superpowers) | `22f0b463e7a5e579904dd6211a520321035526f7` | 2026-11-03 | MIT | Process backbone: Socratic brainstorming, task decomposition, subagent-driven development, Red-Green-Refactor TDD, systematic debugging, verification gates (`kb-spec`, `kb-plan`, `kb-build`, `kb-debug`, `kb-review`, `kb-ship`). |
| [github/spec-kit](https://github.com/github/spec-kit) | `40dd00f39763ccf653ccb18deb684d006f522176` | 2026-11-11 | MIT | Artifact templates & Spec-Driven lifecycle: `constitution.md`, `spec.md`, `plan.md`, cross-artifact consistency analysis (`kb-spec`, `kb-plan`, `templates/`). |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | `96608e078b2d5ea607c5c3b8b5a54d1c1fba6846` | 2026-10-29 | MIT | YAGNI minimal-change doctrine (`lite`/`full`/`ultra`), diff review, repo audit, technical debt ledger (`doctrine.md`, `kb-build`, `kb-review`, `roles/refactorer.yaml`). |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `c1e0e5492fbb524f5df84d635ecfae7dc438ec45` | 2026-11-10 | Apache-2.0 | Primary UI/UX design doctrine, `PRODUCT.md` convention, anti-slop hard bans, critique/audit vocabulary (`kb-ui`, `roles/ui-ux-designer.yaml`, `references/design/`). |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | `f6b76575f949707b4e3c37cd86cb44b0b98643e8` | 2026-11-07 | MIT | Opt-in `bold` art-direction mode: 1-section-per-screen rhythm, equal edges, dealt visual moments, micro-interactions (`kb-ui`, `references/design/`). |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `6ae86f61f520d6ca229d2f40e070410638c908c5` | 2026-11-10 | MIT | Reference-only lookup catalog for industry color systems, font pairings, and layout patterns (`references/design/`). |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `301b02b12bff98e4688e6984af6556802322bbde` | 2026-11-01 | MIT | Craft reference library: API & interface design, ADRs, CI/CD & automation, observability, code simplification, shipping & launch (`roles/api-designer.yaml`, `roles/devops.yaml`, `roles/release-manager.yaml`). |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | `afa8da942115f2961fdbfa80807ea0b232ff6c00` | 2026-08-24 | MIT | Measurement-first Core Web Vitals (`LCP <= 2.5s`, `INP <= 200ms`, `CLS <= 0.1`) and WCAG 2.2 accessibility auditing (`roles/performance.yaml`, `roles/a11y-auditor.yaml`, `references/checklists/`). |
| [trailofbits/skills](https://github.com/trailofbits/skills) | `e4dd0bb5b15535f7c5a0834187dffba6ac37e4ff` | 2026-11-06 | CC-BY-SA-4.0 | Security auditing methodologies: differential review, insecure defaults, sharp edges, false-positive gate (`fp-check`), supply-chain risk, CI/CD agentic actions auditing (`roles/security.yaml`, `roles/supply-chain.yaml`, `roles/reviewer.yaml`). |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | 2026-10-27 | Unspecified | React & Next.js performance rules (async waterfalls, bundle size, RSC boundaries) and web design guidelines (`references/stacks/nextjs.md`, `roles/frontend.yaml`). |
| [anthropics/skills](https://github.com/anthropics/skills) | `2c5958ecac7cee2b583967a2c4981d0f4a75c579` | 2026-11-06 | Mixed | `doc-coauthoring` 3-stage workflow + reader-test verification, `webapp-testing` Playwright patterns (`roles/tech-writer.yaml`, `roles/qa.yaml`). |
| [supabase/agent-skills](https://github.com/supabase/agent-skills) | `c9be0e931b7930f7d02126d04774d904c381e7d7` | 2026-10-02 | MIT | PostgreSQL schema design, indexing (GIN/partial/composite), query plans, connection pooling, safe migrations (`references/stacks/postgres-drizzle.md`, `roles/data-engineer.yaml`). |
| [expo/skills](https://github.com/expo/skills) | `a9e5bd3fa00b4e61f632e43f85da73aee1942582` | 2026-11-01 | MIT | Official Expo Router, native UI patterns, dev client, SDK upgrades, EAS build/submit workflows (`references/stacks/expo.md`, `roles/mobile.yaml`). |
| [callstackincubator/agent-skills](https://github.com/callstackincubator/agent-skills) | `59e9d17446a248b21d86f078fcd0bd2d36db1ca4` | 2026-10-08 | MIT | React Native FPS/re-render optimization, FlashList, bundle size, TTI, Hermes profiling (`references/stacks/expo.md`, `roles/mobile.yaml`). |
| [huggingface/skills](https://github.com/huggingface/skills) | `25910b3d0ba31a2ba102f901cdc9e008c278a69c` | 2026-10-29 | Apache-2.0 | ML/AI dataset engineering, evaluation harnesses, TRL fine-tuning (SFT/DPO/GRPO), experiment tracking (`references/stacks/python-fastapi.md`, `roles/ml-engineer.yaml`). |
| [mrwadams/stride-gpt](https://github.com/mrwadams/stride-gpt) | `00e13a5daf61d23865a1d6c56eab2f77696fffa3` | 2026-11-08 | MIT | STRIDE threat modeling, trust boundary mapping, DREAD risk scoring, attack trees (`roles/threat-modeler.yaml`, `templates/threats.md`). |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | `62f3a995eb26ee23f784bdea4a7992340078e9be` | 2026-11-24 | Apache-2.0 | 10-mode diagram router, instrument semantic color doctrine, commit-pinned source provenance, Semantic Passport, Reader-Answer check, and `archify-pr` materiality filter (`skills/kb-atlas/`, `roles/atlas-architect.yaml`, `references/design/diagrams-and-workflows.md`, `templates/atlas-explainer.html`). |
| [AsyncFuncAI/deepwiki-open](https://github.com/AsyncFuncAI/deepwiki-open) | `f216676fa37042c04eba3ccef56098d011670913` | 2026-11-22 | MIT | Structured wiki section planning, 2-stage guided Codemaps (`skeleton -> enrich`), vertical Mermaid/sequence guardrails, and deterministic `Sources: [path:start-end]` link resolution (`skills/kb-atlas/`, `references/design/diagrams-and-workflows.md`). |
| [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | `b232f356446295e4eaa05b9b285e08ce5cd5e8a0` | 2026-11-25 | MIT | Business-domain extraction (`/understand-domain`: domains -> flows -> steps), architectural layer grouping, and incremental graph refresh (`skills/kb-atlas/`, `references/design/diagrams-and-workflows.md`). |
| [The-Pocket/PocketFlow-Tutorial-Codebase-Knowledge](https://github.com/The-Pocket/PocketFlow-Tutorial-Codebase-Knowledge) | `05b24cbbb0fe409c5e23c9791f0342f07524ffdc` | 2026-05-31 | MIT | Pedagogical codebase-to-tutorial synthesis: core domain abstraction extraction (5–12 concepts) and topological prerequisite chapter ordering (`skills/kb-atlas/`, `references/design/diagrams-and-workflows.md`). |
| [FSoft-AI4Code/CodeWiki](https://github.com/FSoft-AI4Code/CodeWiki) | `f07bb460b737c060745bf69514ee8302750e28ee` | 2026-11-23 | MIT | Artifact-aware dependency graphs (build/CI/Docker/schemas) and bottom-up leaf-to-parent recursive agent documentation for large monorepos (`skills/kb-atlas/`). |
| [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) | `e49079f3748b8431bd5d9c09c652461fb755cb86` | 2026-11-25 | MIT | Zero-ASCII standalone HTML visual explainers and interactive step-by-step state/flow replay UX (`templates/atlas-explainer.html`, `references/design/diagrams-and-workflows.md`). |
| [Agents365-ai/drawio-skill](https://github.com/Agents365-ai/drawio-skill) | `a8e83c75ad5385aea9a4e2e5b144947f1153fd17` | 2026-11-25 | MIT | Separation of semantic IR from editable layout, multi-view projection, and CI diagram freshness/drift verification (`bin/kobean.js` `atlas check`, `references/checklists/atlas-quality.md`). |
| [sopaco/deepwiki-rs](https://github.com/sopaco/deepwiki-rs) | `d0a009163938b561ef14b09a3a7ac671edc54041` | 2026-11-08 | MIT | Formal C4 Model documentation tiers (Context, Containers, Components, Code), boundary interface catalogs, and SQL ERD linkage (`references/design/diagrams-and-workflows.md`). |
| [CodeBoarding/CodeBoarding](https://github.com/CodeBoarding/CodeBoarding) | `b5341f2e2af2dd951a5bbe87cccee4c48eaf8bf8` | 2026-11-17 | MIT | Static-analysis-grounded subsystem boundaries and PR architectural impact reviews (`skills/kb-atlas/`, `skills/kb-git/`). |
| [haydenschmitty/floorplan](https://github.com/haydenschmitty/floorplan) | `94f81b463b7617e06d873ac71323ce716484399` | 2026-11-16 | MIT | Plain-English functional naming and end-to-end Screen -> API -> DB -> External service flow tracing (`references/design/diagrams-and-workflows.md`). |

## Vetted Local CLI & MCP Tools

| Tool | Source | Purpose |
| :--- | :--- | :--- |
| `bd` (Beads) | [gastownhall/beads](https://github.com/gastownhall/beads) | Single source of truth for task graph, dependencies, and ready-work detection (`.beads/`). |
| `graphify` | [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Tree-sitter structural AST + concept graph for repository orientation (`graphify-out/`). |
| `betterleaks` | [betterleaks/betterleaks](https://github.com/betterleaks/betterleaks) | Secret detection and validation gate. |
| `osv-scanner` | [google/osv-scanner](https://github.com/google/osv-scanner) | Supply-chain lockfile/manifest CVE scanning. |
| `semgrep` | [semgrep/semgrep](https://github.com/semgrep/semgrep) | Static analysis security rules. |
| `d2` *(optional)* | [d2lang/d2](https://github.com/d2lang/d2) | Declarative architecture diagram compiler with ELK/Dagre/TALA layout engines. |
| `mmdc` *(optional)* | [@mermaid-js/mermaid-cli](https://www.npmjs.com/package/@mermaid-js/mermaid-cli) | Deterministic Mermaid syntax validation and SVG/PNG export. |
| `drawio` MCP *(optional)* | [DayuanJiang/next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) | Live editable `.drawio` canvas via `@next-ai-drawio/mcp-server` (`kobean mcp add drawio`). |
| `deepwiki` MCP *(optional)* | [regenrek/deepwiki-mcp](https://github.com/regenrek/deepwiki-mcp) | Query external open-source repository documentation via `mcp-deepwiki` (`kobean mcp add deepwiki`). |
| `gitdiagram` MCP *(optional)* | [ahmedkhaleel2004/gitdiagram](https://github.com/ahmedkhaleel2004/gitdiagram) | Instant architecture lookup for external GitHub repositories (`kobean mcp add gitdiagram`). |
| `chrome-devtools-mcp` | Native Antigravity Plugin | Live DOM, accessibility tree, Core Web Vitals traces, visual diagram QA, and console/network inspection. |

