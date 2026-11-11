#!/usr/bin/env bash
# install.sh — Fast, portable, zero-config installer for KobeanSkills
#
# Usage:
#   ./scripts/install.sh                  # Global install (active across ALL repos automatically)
#   ./scripts/install.sh --with-tools     # Global install + auto-install CLI tools (bd, betterleaks, graphify, osv-scanner)
#   ./scripts/install.sh --project <dir>  # Install into a single target repository only (.agents/ & .claude/)
#   ./scripts/install.sh --uninstall      # Cleanly remove all global KobeanSkills symlinks

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KOBEAN_HOME="${HOME}/.kobean"
AGY_CONFIG_DIR="${HOME}/.gemini/config"
AGY_SKILLS_DIR="${AGY_CONFIG_DIR}/skills"
AGY_PLUGINS_DIR="${AGY_CONFIG_DIR}/plugins"
CLAUDE_DIR="${HOME}/.claude"
CLAUDE_SKILLS_DIR="${CLAUDE_DIR}/skills"

MODE="global"
WITH_TOOLS=false
TARGET_PROJECT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-tools)
      WITH_TOOLS=true
      shift
      ;;
    --project)
      MODE="project"
      TARGET_PROJECT="${2:-}"
      if [[ -z "${TARGET_PROJECT}" ]]; then
        echo "[error] --project requires a target directory path." >&2
        exit 1
      fi
      shift 2
      ;;
    --uninstall)
      MODE="uninstall"
      shift
      ;;
    -h|--help)
      sed -n '2,9p' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *)
      echo "[error] Unknown flag: $1 (run with --help)" >&2
      exit 1
      ;;
  esac
done

install_cli_tools() {
  echo "==> Checking companion CLI tools (bd, betterleaks, graphify, osv-scanner)..."
  if command -v brew >/dev/null 2>&1; then
    for pkg in bd betterleaks osv-scanner; do
      if ! command -v "${pkg}" >/dev/null 2>&1; then
        echo "  [install] brew install ${pkg}"
        brew install "${pkg}" || echo "  [warn] Could not brew install ${pkg}; install manually if needed."
      else
        echo "  [ok] ${pkg} already installed"
      fi
    done
  fi
  if ! command -v graphify >/dev/null 2>&1; then
    if command -v uv >/dev/null 2>&1; then
      echo "  [install] uv tool install graphifyy"
      uv tool install graphifyy || true
    else
      echo "  [info] Install 'uv' (brew install uv) then run 'uv tool install graphifyy' for graphify support."
    fi
  else
    echo "  [ok] graphify already installed"
  fi
}

link_kobean_home() {
  mkdir -p "${KOBEAN_HOME}"
  for item in doctrine.md GUIDE.md roles references templates rules SOURCES.md; do
    ln -sfn "${REPO_DIR}/${item}" "${KOBEAN_HOME}/${item}"
  done
  echo "  [ok] Linked shared resources into ${KOBEAN_HOME}/"
}

if [[ "${MODE}" == "uninstall" ]]; then
  echo "==> Uninstalling KobeanSkills global links..."
  for item in doctrine.md roles references templates rules SOURCES.md; do
    rm -f "${KOBEAN_HOME}/${item}"
  done
  rm -f "${AGY_PLUGINS_DIR}/kobean-skills"
  rm -f "${HOME}/.gemini/GEMINI.md" "${AGY_CONFIG_DIR}/AGENTS.md" "${CLAUDE_DIR}/CLAUDE.md"
  for skill_path in "${REPO_DIR}"/skills/kb-*; do
    skill_name="$(basename "${skill_path}")"
    rm -f "${AGY_SKILLS_DIR}/${skill_name}" "${CLAUDE_SKILLS_DIR}/${skill_name}"
  done
  if [[ -f "${AGY_CONFIG_DIR}/config.json" ]]; then
    python3 - "${AGY_CONFIG_DIR}/config.json" <<'PY'
import json, sys
p = sys.argv[1]
data = json.load(open(p, encoding="utf-8"))
data.get("plugins", {}).pop("kobean-skills", None)
json.dump(data, open(p, "w", encoding="utf-8"), indent=2)
PY
  fi
  echo "==> Uninstalled cleanly."
  exit 0
fi

if [[ "${WITH_TOOLS}" == true ]]; then
  install_cli_tools
fi

if [[ "${MODE}" == "project" ]]; then
  TARGET_PROJECT="$(cd "${TARGET_PROJECT}" && pwd)"
  echo "==> Installing KobeanSkills into project: ${TARGET_PROJECT}"
  link_kobean_home
  mkdir -p "${TARGET_PROJECT}/.agents/skills" "${TARGET_PROJECT}/.agents/rules" "${TARGET_PROJECT}/.claude/skills"
  for skill_path in "${REPO_DIR}"/skills/kb-*; do
    [ -d "${skill_path}" ] || continue
    skill_name="$(basename "${skill_path}")"
    ln -sfn "${skill_path}" "${TARGET_PROJECT}/.agents/skills/${skill_name}"
    ln -sfn "${skill_path}" "${TARGET_PROJECT}/.claude/skills/${skill_name}"
  done
  ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${TARGET_PROJECT}/.agents/rules/kobean.md"
  echo "==> Done! Project ${TARGET_PROJECT} now has kb-* skills and rules in .agents/ and .claude/."
  exit 0
fi

# Default: Global Zero-Config Install
echo "==> Installing KobeanSkills (Global Zero-Config Mode) from: ${REPO_DIR}"
link_kobean_home

mkdir -p "${AGY_PLUGINS_DIR}"
ln -sfn "${REPO_DIR}" "${AGY_PLUGINS_DIR}/kobean-skills"

if [[ -f "${AGY_CONFIG_DIR}/config.json" ]]; then
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
  echo "  [ok] Enabled 'kobean-skills' plugin in Antigravity (injects rules/AGENTS.md in all repos)"
fi

mkdir -p "${HOME}/.gemini" "${AGY_CONFIG_DIR}" "${CLAUDE_DIR}"
ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${HOME}/.gemini/GEMINI.md"
ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${AGY_CONFIG_DIR}/AGENTS.md"
ln -sfn "${REPO_DIR}/rules/AGENTS.md" "${CLAUDE_DIR}/CLAUDE.md"
echo "  [ok] Linked global rules -> ~/.gemini/GEMINI.md, ~/.gemini/config/AGENTS.md, ~/.claude/CLAUDE.md"

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
echo "==> Done! Open any repo in Antigravity or Claude Code—KobeanSkills is active automatically."
