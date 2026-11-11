#!/usr/bin/env bash
# lint.sh — Structural, schema, write-isolation, and security linter for KobeanSkills

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_DIR}"

python3 - <<'PY'
import glob
import os
import re
import sys

errors = []
warnings = []

# 1. Validate 8 entry skills
skill_dirs = sorted(glob.glob("skills/kb-*"))
if len(skill_dirs) != 8:
    errors.append(f"Expected 8 entry skills in skills/kb-*, found {len(skill_dirs)}")

for sdir in skill_dirs:
    folder_name = os.path.basename(sdir)
    skill_md = os.path.join(sdir, "SKILL.md")
    if not os.path.isfile(skill_md):
        errors.append(f"Missing {skill_md}")
        continue
    text = open(skill_md, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        errors.append(f"{skill_md}: missing YAML frontmatter block")
        continue
    fm = m.group(1)
    name_m = re.search(r"^name:\s*(\S+)", fm, re.M)
    desc_m = re.search(r"^description:\s*(.+)", fm, re.M | re.S)
    if not name_m or name_m.group(1) != folder_name:
        errors.append(f"{skill_md}: frontmatter name does not match folder '{folder_name}'")
    if not desc_m:
        errors.append(f"{skill_md}: missing description in frontmatter")
    else:
        desc_clean = re.sub(r"\s+", " ", desc_m.group(1)).strip()
        if len(desc_clean) > 350:
            errors.append(f"{skill_md}: description too long ({len(desc_clean)} chars > 350 budget)")
    if "vendor/" in text:
        errors.append(f"{skill_md}: runtime skill must never reference air-gapped vendor/")

# 2. Security check: zero executable scripts inside skills/, roles/, references/, templates/
for root_dir in ("skills", "roles", "references", "templates"):
    for root, _, files in os.walk(root_dir):
        for f in files:
            if f.endswith((".sh", ".py", ".js", ".mjs", ".ts")) and not f.endswith(".d.ts"):
                errors.append(f"Disallowed executable script in content directory: {os.path.join(root, f)}")

# 3. Validate 22 role contracts
role_files = sorted(glob.glob("roles/*.yaml"))
if len(role_files) != 22:
    errors.append(f"Expected 22 role YAML files in roles/, found {len(role_files)}")

required_keys = [
    "name:", "title:", "phase:", "subagent_type:", "mission:",
    "reads:", "writes:", "forbidden:", "tools:", "doctrine:",
    "references:", "done_when:", "output:"
]

parallel_build_roles = {"frontend", "backend", "mobile", "ml-engineer", "data-engineer", "devops"}
build_writes = {}

for rfile in role_files:
    expected_name = os.path.splitext(os.path.basename(rfile))[0]
    text = open(rfile, encoding="utf-8").read()
    for k in required_keys:
        if not re.search(rf"^{re.escape(k)}", text, re.M):
            errors.append(f"{rfile}: missing required key '{k}'")
    nm = re.search(r"^name:\s*(\S+)", text, re.M)
    if not nm or nm.group(1) != expected_name:
        errors.append(f"{rfile}: name field does not match filename '{expected_name}'")
    st = re.search(r"^subagent_type:\s*(\S+)", text, re.M)
    if not st or st.group(1) not in ("self", "research"):
        errors.append(f"{rfile}: subagent_type must be 'self' or 'research'")
    if st and st.group(1) == "research":
        if "writes: []" not in text:
            errors.append(f"{rfile}: read-only 'research' role must have 'writes: []'")

    # Parse writes list for parallel build roles to ensure non-overlapping write paths
    if expected_name in parallel_build_roles:
        m_writes = re.search(r"^writes:\n((?:  - .*\n)+)", text, re.M)
        globs = []
        if m_writes:
            for line in m_writes.group(1).strip().splitlines():
                globs.append(line.split("-", 1)[1].strip().strip('"').strip("'"))
        build_writes[expected_name] = set(globs)

    # Check referenced files exist
    m_refs = re.search(r"^references:\n((?:  - .*\n)+)", text, re.M)
    if m_refs:
        for line in m_refs.group(1).strip().splitlines():
            ref_rel = line.split("-", 1)[1].strip().strip('"').strip("'")
            ref_path = os.path.join("references", ref_rel)
            if not os.path.isfile(ref_path):
                errors.append(f"{rfile}: missing referenced file '{ref_path}'")

# Check pairwise overlap among parallel build roles
roles_list = sorted(build_writes.keys())
for i in range(len(roles_list)):
    for j in range(i + 1, len(roles_list)):
        r1, r2 = roles_list[i], roles_list[j]
        overlap = build_writes[r1] & build_writes[r2]
        if overlap:
            errors.append(f"Write glob collision between parallel build roles {r1} and {r2}: {overlap}")

if errors:
    print("LINT FAILED:")
    for e in errors:
        print(f"  [ERROR] {e}")
    sys.exit(1)

print(f"LINT PASSED: {len(skill_dirs)} entry skills, {len(role_files)} role contracts, 0 write collisions, 0 unsafe scripts.")
PY
