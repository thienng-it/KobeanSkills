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
  bunx kobean-skills [command] [options]  (fastest)
  npx kobean-skills [command] [options]
  kobean [command] [options]

Commands:
  init [dir]        Initialize .kobean/ in target repo (default: current directory)
  docs              Open the interactive documentation web page in your browser
  guide             Display the developer workflow guide and prompt cheatsheet
  install           Install globally into ~/.gemini, ~/.claude, and ~/.codex
  doctor            Check status of companion CLI tools (bd, betterleaks, graphify, etc.)
  help              Show this help message

Examples:
  npx kobean-skills init
  npx kobean-skills docs
  npx kobean-skills guide
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
    { name: 'bun', cmd: 'bun --version', install: 'curl -fsSL https://bun.sh/install | bash' },
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

  console.log('\nSupported Agent CLIs:');
  const agentClis = [
    { name: 'Gemini CLI', cmd: 'gemini --version' },
    { name: 'Claude CLI', cmd: 'claude --version' },
    { name: 'Codex CLI', cmd: 'codex --version' }
  ];
  for (const a of agentClis) {
    try {
      execSync(a.cmd, { stdio: 'ignore' });
      console.log(`  [✓] ${a.name} is installed`);
    } catch {
      console.log(`  [ ] ${a.name} is not installed (optional)`);
    }
  }

  console.log('\nGlobal Discovery:');
  const geminiRule = path.join(process.env.HOME || '', '.gemini', 'GEMINI.md');
  const agyPlugin = path.join(process.env.HOME || '', '.gemini', 'config', 'plugins', 'kobean-skills');
  const claudeRule = path.join(process.env.HOME || '', '.claude', 'CLAUDE.md');
  const codexRule = path.join(process.env.HOME || '', '.codex', 'AGENTS.md');
  console.log(`  Gemini CLI:         ${fs.existsSync(geminiRule) ? '[✓] Active (~/.gemini/GEMINI.md)' : '[ ] Not registered'}`);
  console.log(`  Antigravity plugin: ${fs.existsSync(agyPlugin) ? '[✓] Active (~/.gemini/config/plugins/)' : '[ ] Not registered'}`);
  console.log(`  Claude CLI:         ${fs.existsSync(claudeRule) ? '[✓] Active (~/.claude/CLAUDE.md)' : '[ ] Not registered'}`);
  console.log(`  Codex CLI:          ${fs.existsSync(codexRule) ? '[✓] Active (~/.codex/AGENTS.md)' : '[ ] Not registered'}`);
}

function runDocs() {
  const docPath = path.join(PKG_ROOT, 'docs', 'index.html');
  if (fs.existsSync(docPath)) {
    console.log(`==> Opening documentation page in your default browser: ${docPath}`);
    const startCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    spawnSync(startCmd, [docPath], { stdio: 'inherit' });
  } else {
    console.error(`[error] Could not locate docs/index.html at ${docPath}`);
  }
}

function runGuide() {
  const guidePath = path.join(PKG_ROOT, 'GUIDE.md');
  if (fs.existsSync(guidePath)) {
    console.log(fs.readFileSync(guidePath, 'utf-8'));
  } else {
    console.log('==> Guide file not found. Visit https://github.com/thienng-it/KobeanSkills for documentation.');
  }
}

switch (command) {
  case 'init':
    runInit(args[1]);
    break;
  case 'docs':
  case 'doc':
    runDocs();
    break;
  case 'guide':
  case 'cheatsheet':
    runGuide();
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

