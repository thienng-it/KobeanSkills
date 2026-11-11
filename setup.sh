#!/usr/bin/env bash
# setup.sh — Zero-clone web installer for KobeanSkills
#
# Install into the current repository with ONE command (NO git clone required):
#   curl -fsSL https://raw.githubusercontent.com/thienng-it/KobeanSkills/main/setup.sh | bash
#
# Machine-wide global installation:
#   curl -fsSL https://raw.githubusercontent.com/thienng-it/KobeanSkills/main/setup.sh | bash -s -- --global

set -euo pipefail

REPO="${KOBEAN_REPO:-thienng-it/KobeanSkills}"
BRANCH="${KOBEAN_BRANCH:-main}"
MODE="project"
TARGET_DIR="${PWD}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global|-g)
      MODE="global"
      shift
      ;;
    --repo)
      REPO="$2"
      shift 2
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    -h|--help)
      sed -n '2,8p' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *)
      TARGET_DIR="$1"
      shift
      ;;
  esac
done

TARGET_DIR="$(cd "${TARGET_DIR}" && pwd)"

echo "==> Fetching KobeanSkills (${REPO}@${BRANCH}) without git clone..."

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

TARBALL_URL="https://github.com/${REPO}/archive/refs/heads/${BRANCH}.tar.gz"

if ! curl -fsSL "${TARBALL_URL}" -o "${TMP_DIR}/kobean.tar.gz" 2>/dev/null; then
  # Fallback to codeload endpoint
  TARBALL_URL="https://codeload.github.com/${REPO}/tar.gz/refs/heads/${BRANCH}"
  curl -fsSL "${TARBALL_URL}" -o "${TMP_DIR}/kobean.tar.gz"
fi

mkdir -p "${TMP_DIR}/src"
tar -xzf "${TMP_DIR}/kobean.tar.gz" --strip-components=1 -C "${TMP_DIR}/src"

if [[ "${MODE}" == "global" ]]; then
  echo "==> Running global installation into ~/.gemini and ~/.claude..."
  bash "${TMP_DIR}/src/scripts/install.sh"
else
  echo "==> Installing into project: ${TARGET_DIR}..."
  bash "${TMP_DIR}/src/init.sh" "${TARGET_DIR}"
fi

echo "==> Installation successful! KobeanSkills is ready to use."

