# KobeanSkills — Dogfood & Iteration Log

Track real-world runs across projects here. Every change to a `kb-*` skill or role contract should be driven by a concrete failure or friction logged below.

| Date | Project / Task | Tool (AGY / Claude) | Pipeline / Role | What Broke or Felt Slow | Root Cause | Fix Applied |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-11-11 | Initial architecture & audit | AGY | All | Raw upstream repos had 266 skills (context overflow), 1,326 scripts (supply-chain risk), and hardcoded Claude tool names. | Direct installation without distillation. | Built air-gapped 8-skill + 22-role YAML architecture (`v0.2`). |
| 2026-11-25 | Codebase-to-diagrams & business-logic atlas integration | AGY | `kb-atlas` / `atlas-architect` | `explorer` (`CONTEXT.md`) was too terse for business workflows and agents emitted unvalidated Mermaid hairballs with broken line links and no freshness checks. | No dedicated diagram/wiki craft doctrine or deterministic citation verifier. | Added air-gapped `kb-atlas` skill, `atlas-architect` role (`pro`), 10-mode diagram doctrine, offline `atlas-explainer.html` template, and zero-dep `kobean atlas check/status/pr-check` CLI + Architecture MCP presets. |

