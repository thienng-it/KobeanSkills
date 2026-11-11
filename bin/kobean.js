#!/usr/bin/env node

/**
 * kobean CLI — zero-dependency manager for KobeanSkills
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const PKG_ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const command = args[0] || 'init';

function showHelp() {
  console.log(`
KobeanSkills CLI

Usage:
  npx kobean-skills [command] [options]
  kobean [command] [options]

Commands:
  init [dir]        Initialize .kobean/ in target repo (default: current directory)
  install           Install globally into ~/.gemini and ~/.claude
  doctor            Check status of companion CLI tools (bd, betterleaks, graphify, etc.)
  help              Show this help message

Examples:
  npx kobean-skills init
  npx kobean-skills doctor
  npx kobean-skills install
`);
}

function runInit(targetDirArg) {
  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  console.log(`==> Initializing KobeanSkills in: ${targetDir}`);

  const initScript = path.join(PKG_ROOT, 'init.sh');
  if (fs.existsSync(initScript)) {
    const res = spawnSync('bash', [initScript, targetDir], { stdio: 'inherit' });
    if (res.status !== 0) {
      process.exit(res.status || 1);
    }
  } else {
    console.error(`[error] Could not locate init.sh at ${initScript}`);
    process.exit(1);
  }
}

function runInstall() {
  console.log('==> Running global KobeanSkills installation...');
  const installScript = path.join(PKG_ROOT, 'scripts', 'install.sh');
  const res = spawnSync('bash', [installScript], { stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

function runDoctor() {
  console.log('==> Checking KobeanSkills environment and companion tools:\n');

  const tools = [
    { name: 'bd (Beads)', cmd: 'bd --version', install: 'npm install -g @beads/bd OR brew install bd' },
    { name: 'betterleaks', cmd: 'betterleaks --version', install: 'brew install betterleaks' },
    { name: 'graphify', cmd: 'graphify --help', install: 'uv tool install graphifyy' },
    { name: 'osv-scanner', cmd: 'osv-scanner --version', install: 'brew install osv-scanner' },
    { name: 'semgrep', cmd: 'semgrep --version', install: 'brew install semgrep' },
    { name: 'node', cmd: 'node --version', install: 'https://nodejs.org' },
    { name: 'git', cmd: 'git --version', install: 'brew install git' }
  ];

  for (const t of tools) {
    try {
      execSync(t.cmd, { stdio: 'ignore' });
      console.log(`  [✓] ${t.name} is installed`);
    } catch {
      console.log(`  [✗] ${t.name} is missing (Install: ${t.install})`);
    }
  }

  console.log('\nGlobal Discovery:');
  const agyRule = path.join(process.env.HOME || '', '.gemini', 'config', 'plugins', 'kobean-skills');
  const claudeRule = path.join(process.env.HOME || '', '.claude', 'CLAUDE.md');
  console.log(`  Antigravity plugin: ${fs.existsSync(agyRule) ? '[✓] Active' : '[ ] Not registered (run npx kobean install)'}`);
  console.log(`  Claude Code rule:   ${fs.existsSync(claudeRule) ? '[✓] Active' : '[ ] Not registered (run npx kobean install)'}`);
}

switch (command) {
  case 'init':
    runInit(args[1]);
    break;
  case 'install':
  case 'setup':
    runInstall();
    break;
  case 'doctor':
  case 'check':
    runDoctor();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    console.error(`[error] Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
