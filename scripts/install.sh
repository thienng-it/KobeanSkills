#!/usr/bin/env bash
# install.sh — Idempotent installer for KobeanSkills
# Links ~/.kobean -> repo root, and symlinks ONLY skills/kb-* into:
#   1. Antigravity global skills: ~/.gemini/config/skills/
#   2. Claude Code global skills: ~/.claude/skills/
# Security rule: vendor/ is air-gapped and NEVER linked into agent discovery.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KOBEAN_HOME="${HOME}/.kobean"
AGY_SKILLS_DIR="${HOME}/.gemini/config/skills"
CLAUDE_SKILLS_DIR="${HOME}/.claude/skills"

echo "==> Installing KobeanSkills from: ${REPO_DIR}"

# 1. Link shared dirs (doctrine.md, roles, references, templates) into ~/.kobean
mkdir -p "${KOBEAN_HOME}"
for item in doctrine.md roles references templates SOURCES.md; do
  ln -sfn "${REPO_DIR}/${item}" "${KOBEAN_HOME}/${item}"
done
echo "  [ok] Linked shared KobeanSkills resources into ${KOBEAN_HOME}/"

# 2. Ensure target skill directories exist
mkdir -p "${AGY_SKILLS_DIR}"
mkdir -p "${CLAUDE_SKILLS_DIR}"

# 3. Symlink only skills/kb-* (never vendor/)
count=0
for skill_path in "${REPO_DIR}"/skills/kb-*; do
  [ -d "${skill_path}" ] || continue
  skill_name="$(basename "${skill_path}")"

  ln -sfn "${skill_path}" "${AGY_SKILLS_DIR}/${skill_name}"
  ln -sfn "${skill_path}" "${CLAUDE_SKILLS_DIR}/${skill_name}"
  count=$((count + 1))
  echo "  [ok] Linked ${skill_name} -> Antigravity & Claude Code"
done

echo "==> Installed ${count} kb-* entry skills (22 role contracts available via ${KOBEAN_HOME}/roles)."
