#!/usr/bin/env bash
# init.sh — Single-command setup to install KobeanSkills into any repository.
#
# Usage (run inside your target repository):
#   ~/Developer/KobeanSkills/init.sh
#   OR pass a target path:
#   ~/Developer/KobeanSkills/init.sh /path/to/my-repo
#
# What it does in 1 second:
#   1. Creates ONE clean, self-contained folder: `.kobean/` in your repository.
#   2. Installs all 8 entry skills, 22 role contracts, references, templates, and doctrine.
#   3. Wires Antigravity (.agents/), Claude Code (.claude/), and Codex (.codex/) so they discover all skills automatically.

set -euo pipefail

# 1. Determine source and target directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# If init.sh is located inside .kobean/ of a target repo, the target is the parent dir
if [[ "$(basename "${SCRIPT_DIR}")" == ".kobean" ]]; then
  DEFAULT_TARGET="$(cd "${SCRIPT_DIR}/.." && pwd)"
else
  DEFAULT_TARGET="${PWD}"
fi

TARGET_DIR="${1:-${DEFAULT_TARGET}}"
TARGET_DIR="$(cd "${TARGET_DIR}" && pwd)"

# If running directly inside the source KobeanSkills repo without arguments, show usage
if [[ "${SCRIPT_DIR}" == "${TARGET_DIR}" && $# -eq 0 ]]; then
  echo "==> KobeanSkills Repository Initializer"
  echo ""
  echo "To initialize KobeanSkills in any repository, run:"
  echo "  cd /path/to/your-repo && ${SCRIPT_DIR}/init.sh"
  echo "  OR:"
  echo "  ${SCRIPT_DIR}/init.sh /path/to/your-repo"
  exit 0
fi

echo "==> Initializing KobeanSkills in: ${TARGET_DIR}"

KOBEAN_DIR="${TARGET_DIR}/.kobean"

# 2. Populate .kobean/ (skip copying if already running from inside .kobean/)
mkdir -p "${KOBEAN_DIR}"
if [[ "${SCRIPT_DIR}" != "${KOBEAN_DIR}" ]]; then
  for item in doctrine.md GUIDE.md roles references templates skills rules SOURCES.md; do
    if [[ -e "${SCRIPT_DIR}/${item}" ]]; then
      rm -rf "${KOBEAN_DIR:?}/${item}"
      cp -R "${SCRIPT_DIR}/${item}" "${KOBEAN_DIR}/${item}"
    fi
  done
fi

# 3. Wire Antigravity discovery (.agents/)
mkdir -p "${TARGET_DIR}/.agents/skills" "${TARGET_DIR}/.agents/rules"
for skill_path in "${KOBEAN_DIR}"/skills/kb-*; do
  [ -d "${skill_path}" ] || continue
  skill_name="$(basename "${skill_path}")"
  ln -sfn "../../.kobean/skills/${skill_name}" "${TARGET_DIR}/.agents/skills/${skill_name}"
done
ln -sfn "../../.kobean/rules/AGENTS.md" "${TARGET_DIR}/.agents/rules/kobean.md"

# 4. Wire Claude Code discovery (.claude/)
mkdir -p "${TARGET_DIR}/.claude/skills"
for skill_path in "${KOBEAN_DIR}"/skills/kb-*; do
  [ -d "${skill_path}" ] || continue
  skill_name="$(basename "${skill_path}")"
  ln -sfn "../../.kobean/skills/${skill_name}" "${TARGET_DIR}/.claude/skills/${skill_name}"
done

# 5. Wire Codex discovery (.codex/)
mkdir -p "${TARGET_DIR}/.codex/skills"
for skill_path in "${KOBEAN_DIR}"/skills/kb-*; do
  [ -d "${skill_path}" ] || continue
  skill_name="$(basename "${skill_path}")"
  ln -sfn "../../.kobean/skills/${skill_name}" "${TARGET_DIR}/.codex/skills/${skill_name}"
done

# 6. Wire workspace rule (AGENTS.md / CLAUDE.md) if not already present
RULE_LINE="For every task, follow .kobean/doctrine.md and route workflows through the kb-* skills."

if [[ ! -f "${TARGET_DIR}/AGENTS.md" ]]; then
  ln -sfn ".kobean/rules/AGENTS.md" "${TARGET_DIR}/AGENTS.md"
elif ! grep -q "kb-router" "${TARGET_DIR}/AGENTS.md" 2>/dev/null; then
  printf "\n\n<!-- KobeanSkills -->\n%s\n" "${RULE_LINE}" >> "${TARGET_DIR}/AGENTS.md"
fi

if [[ ! -f "${TARGET_DIR}/CLAUDE.md" ]]; then
  ln -sfn ".kobean/rules/AGENTS.md" "${TARGET_DIR}/CLAUDE.md"
elif ! grep -q "kb-router" "${TARGET_DIR}/CLAUDE.md" 2>/dev/null; then
  printf "\n\n<!-- KobeanSkills -->\n%s\n" "${RULE_LINE}" >> "${TARGET_DIR}/CLAUDE.md"
fi

if [[ ! -f "${TARGET_DIR}/GEMINI.md" ]]; then
  ln -sfn ".kobean/rules/AGENTS.md" "${TARGET_DIR}/GEMINI.md"
elif ! grep -q "kb-router" "${TARGET_DIR}/GEMINI.md" 2>/dev/null; then
  printf "\n\n<!-- KobeanSkills -->\n%s\n" "${RULE_LINE}" >> "${TARGET_DIR}/GEMINI.md"
fi

echo "  [ok] Installed self-contained .kobean/ folder"
echo "  [ok] Wired Gemini CLI & Antigravity (.agents/skills & GEMINI.md / AGENTS.md)"
echo "  [ok] Wired Claude CLI (.claude/skills & CLAUDE.md)"
echo "  [ok] Wired Codex CLI (.codex/skills & AGENTS.md)"
echo "==> Setup complete! Commit .kobean/ and agent links to share with your team."
