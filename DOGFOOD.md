# KobeanSkills — Dogfood & Iteration Log

Track real-world runs across projects here. Every change to a `kb-*` skill or role contract should be driven by a concrete failure or friction logged below.

| Date | Project / Task | Tool (AGY / Claude) | Pipeline / Role | What Broke or Felt Slow | Root Cause | Fix Applied |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-11-11 | Initial architecture & audit | AGY | All | Raw upstream repos had 266 skills (context overflow), 1,326 scripts (supply-chain risk), and hardcoded Claude tool names. | Direct installation without distillation. | Built air-gapped 8-skill + 22-role YAML architecture (`v0.2`). |
