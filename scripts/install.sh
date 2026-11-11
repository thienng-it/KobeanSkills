#!/usr/bin/env bash
# install.sh — Idempotent zero-config installer for KobeanSkills
# Makes KobeanSkills active across ALL repositories without per-repo setup:
#   1. Links shared resources into ~/.kobean/ (roles, references, templates, doctrine.md, rules)
#   2. Registers KobeanSkills as an enabled Antigravity plugin (~/.gemini/config/plugins/kobean-skills)
#      so rules/AGENTS.md is automatically injected into <user_rules> in every workspace.
#   3. Links global rule files (~/.gemini/GEMINI.md, ~/.gemini/config/AGENTS.md, ~/.claude/CLAUDE.md).
#   4. Symlinks ONLY skills/kb-* into ~/.gemini/config/skills/ and ~/.claude/skills/.
# Security rule: vendor/ is air-gapped and NEVER linked into agent discovery.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KOBEAN_HOME="${HOME}/.kobean"
AGY_CONFIG_DIR="${HOME}/.gemini/config"
AGY_SKILLS_DIR="${AGY_CONFIG_DIR}/skills"
AGY_PLUGINS_DIR="${AGY_CONFIG_DIR}/plugins"
CLAUDE_DIR="${HOME}/.claude"
CLAUDE_SKILLS_DIR="${CLAUDE_DIR}/skills"

echo "==> Installing KobeanSkills (Zero-Config Global Mode) from: ${REPO_DIR}"

# 1. Link shared dirs into ~/.kobean
mkdir -p "${KOBEAN_HOME}"
for item in doctrine.md roles references templates rules SOURCES.md; do
  ln -sfn "${REPO_DIR}/${item}" "${KOBEAN_HOME}/${item}"
done
echo "  [ok] Linked shared KobeanSkills resources into ${KOBEAN_HOME}/"

# 2. Register as an Antigravity global plugin so rules/AGENTS.md is always active
mkdir -p "${AGY_PLUGINS_DIR}"
ln -sfn "${REPO_DIR}" "${AGY_PLUGINS_DIR}/kobean-skills"

if [ -f "${AGY_CONFIG_DIR}/config.json" ]; then
  python3 - "${AGY_CONFIG_DIR}/config.json" <<'PY'
import json, sys
cfg_path = sys.argv[1]
with open(cfg_path, "r", encoding="utf-8") as f:
    data = json.load(f)
plugins = data.setdefault("plugins", {})
entry = plugins.get("kobean-skills", {})
entry["enabled"] = True
plugins["kobean-skills"] = entry
with open(cfg_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
    f.write("\n")
PY
  echo "  [ok] Enabled 'kobean-skills' plugin in ${AGY_CONFIG_DIR}/config.json (injects rules/AGENTS.md globally)"
fi

# 3. Link global rule files for Antigravity, Gemini CLI, and Claude Code
mkdir -p "${HOME}/.gemini" "${AGY_CONFIG_DIR}" "${CLAUDE_DIR}"
ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${HOME}/.gemini/GEMINI.md"
ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${AGY_CONFIG_DIR}/AGENTS.md"
ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${CLAUDE_DIR}/CLAUDE.md"
echo "  [ok] Linked global rules -> ~/.gemini/GEMINI.md, ~/.gemini/config/AGENTS.md, ~/.claude/CLAUDE.md"

# 4. Symlink only skills/kb-* into both skill directories
mkdir -p "${AGY_SKILLS_DIR}" "${CLAUDE_SKILLS_DIR}"
count=0
for skill_path in "${REPO_DIR}"/skills/kb-*; do
  [ -d "${skill_path}" ] || continue
  skill_name="$(basename "${skill_path}")"

  ln -sfn "${skill_path}" "${AGY_SKILLS_DIR}/${skill_name}"
  ln -sfn "${skill_path}" "${CLAUDE_SKILLS_DIR}/${skill_name}"
  count=$((count + 1))
done
echo "  [ok] Linked ${count} kb-* skills -> Antigravity & Claude Code"

echo "==> Done! KobeanSkills is now active globally across every repository you open."
