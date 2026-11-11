#!/usr/bin/env node

/**
 * kobean CLI — zero-dependency manager for KobeanSkills
 * Multi-role engineering orchestration & Universal Cross-Agent MCP Manager
 * Natively supports Gemini CLI, Antigravity, Claude Code (Claude CLI), and OpenAI Codex.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const PKG_ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const command = args[0] || 'init';

// Built-in vetted MCP Presets catalog
const MCP_PRESETS = {
  postgres: {
    description: 'PostgreSQL database inspector and query runner',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-postgres', '${DATABASE_URL}']
    },
    requiredEnv: ['DATABASE_URL'],
    sampleEnv: 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"'
  },
  sqlite: {
    description: 'SQLite database inspector and SQL executor',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite', '--db-path', '${SQLITE_DB_PATH:-./dev.db}']
    },
    requiredEnv: [],
    sampleEnv: 'SQLITE_DB_PATH="./dev.db"'
  },
  github: {
    description: 'GitHub issues, pull requests, commits, and branch management',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-github'],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: '${GITHUB_TOKEN}'
      }
    },
    requiredEnv: ['GITHUB_TOKEN'],
    sampleEnv: 'GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"'
  },
  playwright: {
    description: 'Headless browser automation and end-to-end web testing',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-playwright']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  puppeteer: {
    description: 'Browser automation, screenshot rendering, and scraping',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-puppeteer']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  filesystem: {
    description: 'Secure, scoped local directory read/write access',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '.']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  fetch: {
    description: 'Web page fetching and HTML-to-Markdown conversion',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-fetch']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  'brave-search': {
    description: 'Real-time web search and news querying via Brave API',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-brave-search'],
      env: {
        BRAVE_API_KEY: '${BRAVE_API_KEY}'
      }
    },
    requiredEnv: ['BRAVE_API_KEY'],
    sampleEnv: 'BRAVE_API_KEY="BSAxxxxxxxxxxxx"'
  },
  memory: {
    description: 'Knowledge graph persistent memory server',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  slack: {
    description: 'Slack channel messaging and thread management',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-slack'],
      env: {
        SLACK_BOT_TOKEN: '${SLACK_BOT_TOKEN}',
        SLACK_TEAM_ID: '${SLACK_TEAM_ID}'
      }
    },
    requiredEnv: ['SLACK_BOT_TOKEN', 'SLACK_TEAM_ID'],
    sampleEnv: 'SLACK_BOT_TOKEN="xoxb-..."\nSLACK_TEAM_ID="T01234567"'
  },
  sentry: {
    description: 'Sentry issue retrieval and stack trace inspection',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sentry', '--auth-token', '${SENTRY_AUTH_TOKEN}']
    },
    requiredEnv: ['SENTRY_AUTH_TOKEN'],
    sampleEnv: 'SENTRY_AUTH_TOKEN="sntrys_..."'
  }
};

function showHelp() {
  console.log(`
KobeanSkills CLI

Usage:
  bunx kobean-skills [command] [options]  (fastest)
  npx kobean-skills [command] [options]
  kobean [command] [options]

Core Commands:
  init [dir]              Initialize .kobean/ in target repo (default: current directory)
  docs                    Open the interactive documentation web page in your browser
  guide                   Display the developer workflow guide and prompt cheatsheet
  install                 Install globally into ~/.gemini, ~/.claude, and ~/.codex
  doctor                  Check status of companion CLI tools and MCP connectors
  help                    Show this help message

MCP Connector Commands:
  mcp                     List configured MCP servers, sync status, and environment checks
  mcp list                Alias for 'mcp'
  mcp add <preset>        Add a vetted MCP preset (e.g. postgres, github, playwright) & sync
  mcp remove <name>       Remove an MCP server from configuration and update agent files
  mcp sync [--global]     Synchronize .kobean/mcp.json across Claude, Gemini, Antigravity & Codex
  mcp presets             List all available built-in vetted MCP presets

Examples:
  bunx kobean-skills init
  bunx kobean-skills mcp add postgres
  bunx kobean-skills mcp add github
  bunx kobean-skills mcp sync
  bunx kobean-skills doctor
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

// Helpers for MCP Management
function extractEnvVars(obj) {
  const vars = new Set();
  function traverse(item) {
    if (typeof item === 'string') {
      const regex = /\$\{([A-Z0-9_]+)(?::-([^}]+))?\}/g;
      let m;
      while ((m = regex.exec(item)) !== null) {
        vars.add(m[1]);
      }
    } else if (Array.isArray(item)) {
      for (const el of item) traverse(el);
    } else if (item && typeof item === 'object') {
      for (const val of Object.values(item)) traverse(val);
    }
  }
  traverse(obj);
  return Array.from(vars);
}

function loadDotEnv(projectDir) {
  const envPath = path.join(projectDir, '.env');
  const envVars = {};
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          envVars[key] = val;
        }
      }
    } catch {}
  }
  return envVars;
}

function findMcpConfigFile(targetDir) {
  const kobeanMcp = path.join(targetDir, '.kobean', 'mcp.json');
  if (fs.existsSync(kobeanMcp)) return kobeanMcp;

  const rootMcp = path.join(targetDir, '.mcp.json');
  if (fs.existsSync(rootMcp)) return rootMcp;

  return null;
}

function loadMcpConfig(targetDir) {
  const file = findMcpConfigFile(targetDir);
  if (!file) {
    // Return empty config
    return { path: path.join(targetDir, '.kobean', 'mcp.json'), servers: {}, exists: false };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return {
      path: file,
      servers: raw.mcpServers || {},
      raw,
      exists: true
    };
  } catch (err) {
    console.error(`[error] Failed to parse ${file}: ${err.message}`);
    return { path: file, servers: {}, exists: false };
  }
}

function serializeCodexToml(mcpServers) {
  let toml = '';
  for (const [name, cfg] of Object.entries(mcpServers)) {
    toml += `[mcp_servers.${name}]\n`;
    if (cfg.command) {
      toml += `command = ${JSON.stringify(cfg.command)}\n`;
    }
    if (Array.isArray(cfg.args)) {
      toml += `args = ${JSON.stringify(cfg.args)}\n`;
    }
    if (cfg.cwd) {
      toml += `cwd = ${JSON.stringify(cfg.cwd)}\n`;
    }
    if (cfg.env && Object.keys(cfg.env).length > 0) {
      toml += `\n[mcp_servers.${name}.env]\n`;
      for (const [k, v] of Object.entries(cfg.env)) {
        toml += `${k} = ${JSON.stringify(String(v))}\n`;
      }
    }
    toml += '\n';
  }
  return toml.trim();
}

function updateTomlWithMcpServers(existingContent, mcpServers) {
  const lines = existingContent.split('\n');
  const preservedLines = [];
  let skipping = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\[([^\]]+)\]/);
    if (match) {
      const section = match[1];
      if (section.startsWith('mcp_servers.')) {
        skipping = true;
      } else {
        skipping = false;
      }
    }
    if (!skipping) {
      preservedLines.push(line);
    }
  }

  let base = preservedLines.join('\n').trim();
  const mcpToml = serializeCodexToml(mcpServers);
  if (base.length > 0) {
    return base + '\n\n# KobeanSkills Managed MCP Servers\n' + mcpToml + '\n';
  }
  return '# KobeanSkills Managed MCP Servers\n' + mcpToml + '\n';
}

function runMcpSync(targetDirArg, isGlobal = false) {
  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  let configData = loadMcpConfig(targetDir);

  if (!configData.exists) {
    const templatePath = path.join(PKG_ROOT, 'templates', 'mcp.json');
    if (fs.existsSync(templatePath)) {
      const destDir = path.join(targetDir, '.kobean');
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(templatePath, path.join(destDir, 'mcp.json'));
      configData = loadMcpConfig(targetDir);
      console.log(`[info] Initialized .kobean/mcp.json from template.`);
    } else {
      console.error('[error] No MCP configuration found in .kobean/mcp.json or .mcp.json.');
      process.exit(1);
    }
  }

  const servers = configData.servers;
  const count = Object.keys(servers).length;
  console.log(`==> Synchronizing ${count} MCP server(s) across all supported agents...\n`);

  const formattedJson = JSON.stringify(
    {
      $schema: 'https://json.schemastore.org/mcp-server-config.json',
      mcpServers: servers
    },
    null,
    2
  );

  // 1. Claude Code: .mcp.json in target repo
  const claudePath = path.join(targetDir, '.mcp.json');
  fs.writeFileSync(claudePath, formattedJson + '\n', 'utf-8');
  console.log(`  [✓] Claude Code:         .mcp.json`);

  // 2. Antigravity: .agents/mcp.json
  const agyDir = path.join(targetDir, '.agents');
  fs.mkdirSync(agyDir, { recursive: true });
  fs.writeFileSync(path.join(agyDir, 'mcp.json'), formattedJson + '\n', 'utf-8');
  console.log(`  [✓] Antigravity:         .agents/mcp.json`);

  // 3. Gemini CLI: .gemini/mcp_config.json
  const geminiDir = path.join(targetDir, '.gemini');
  fs.mkdirSync(geminiDir, { recursive: true });
  fs.writeFileSync(path.join(geminiDir, 'mcp_config.json'), formattedJson + '\n', 'utf-8');
  console.log(`  [✓] Gemini CLI:          .gemini/mcp_config.json`);

  // 4. Codex CLI: .codex/config.toml
  const codexDir = path.join(targetDir, '.codex');
  fs.mkdirSync(codexDir, { recursive: true });
  const codexTomlPath = path.join(codexDir, 'config.toml');
  let existingCodex = '';
  if (fs.existsSync(codexTomlPath)) {
    existingCodex = fs.readFileSync(codexTomlPath, 'utf-8');
  }
  const updatedCodex = updateTomlWithMcpServers(existingCodex, servers);
  fs.writeFileSync(codexTomlPath, updatedCodex, 'utf-8');
  console.log(`  [✓] Codex CLI:           .codex/config.toml`);

  // 5. Global sync if requested
  if (isGlobal) {
    console.log('\n==> Applying global MCP sync to user home directories:');
    const home = process.env.HOME || '';

    // Global Gemini / Antigravity
    const globalGeminiMcp = path.join(home, '.gemini', 'config', 'mcp_config.json');
    if (fs.existsSync(globalGeminiMcp)) {
      try {
        const raw = JSON.parse(fs.readFileSync(globalGeminiMcp, 'utf-8'));
        raw.mcpServers = { ...(raw.mcpServers || {}), ...servers };
        fs.writeFileSync(globalGeminiMcp, JSON.stringify(raw, null, 2) + '\n', 'utf-8');
        console.log(`  [✓] Global Antigravity / Gemini: ~/.gemini/config/mcp_config.json`);
      } catch (err) {
        console.log(`  [!] Could not merge global Gemini config: ${err.message}`);
      }
    }

    // Global Codex
    const globalCodexToml = path.join(home, '.codex', 'config.toml');
    if (fs.existsSync(globalCodexToml)) {
      try {
        const existing = fs.readFileSync(globalCodexToml, 'utf-8');
        const updated = updateTomlWithMcpServers(existing, servers);
        fs.writeFileSync(globalCodexToml, updated, 'utf-8');
        console.log(`  [✓] Global Codex CLI:            ~/.codex/config.toml`);
      } catch (err) {
        console.log(`  [!] Could not merge global Codex config: ${err.message}`);
      }
    }
  }

  // Audit environment variables
  const dotEnv = loadDotEnv(targetDir);
  const referencedVars = extractEnvVars(servers);
  if (referencedVars.length > 0) {
    console.log('\nEnvironment Variable Audit:');
    for (const v of referencedVars) {
      const isSet = Boolean(process.env[v] || dotEnv[v]);
      const source = process.env[v] ? 'environment' : dotEnv[v] ? '.env file' : 'missing';
      if (isSet) {
        console.log(`  [✓] \${${v}} is provided (${source})`);
      } else {
        console.log(`  [!] \${${v}} is NOT set (agents may fail when calling servers that require it)`);
      }
    }
  }

  console.log('\n[ok] MCP synchronization complete! Zero drift between Claude, Gemini, Antigravity, and Codex.');
}

function runMcpList(targetDirArg) {
  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  const configData = loadMcpConfig(targetDir);

  console.log(`==> KobeanSkills Cross-Agent MCP Status:`);
  console.log(`  Target Directory: ${targetDir}`);
  console.log(`  Config file:      ${configData.exists ? configData.path : 'None found (run: kobean mcp add <preset>)'}\n`);

  if (!configData.exists || Object.keys(configData.servers).length === 0) {
    console.log('No MCP servers currently configured.');
    console.log('\nQuick Start:');
    console.log('  bunx kobean-skills mcp add postgres    # Add Postgres DB connector');
    console.log('  bunx kobean-skills mcp add github      # Add GitHub repository tools');
    console.log('  bunx kobean-skills mcp add playwright  # Add E2E browser automation');
    console.log('  bunx kobean-skills mcp presets         # List all available presets\n');
    return;
  }

  const dotEnv = loadDotEnv(targetDir);
  console.log('Active MCP Servers:');
  for (const [name, cfg] of Object.entries(configData.servers)) {
    const cmdStr = `${cfg.command || ''} ${(cfg.args || []).join(' ')}`.trim();
    console.log(`\n  • [${name}]`);
    console.log(`    Command: ${cmdStr}`);
    const vars = extractEnvVars(cfg);
    if (vars.length > 0) {
      const varStatus = vars
        .map((v) => {
          const isSet = Boolean(process.env[v] || dotEnv[v]);
          return isSet ? `\${${v}}: [✓]` : `\${${v}}: [MISSING]`;
        })
        .join(', ');
      console.log(`    Env Vars: ${varStatus}`);
    }
  }

  console.log('\nAgent Sync Status:');
  const claudeOk = fs.existsSync(path.join(targetDir, '.mcp.json'));
  const agyOk = fs.existsSync(path.join(targetDir, '.agents', 'mcp.json'));
  const geminiOk = fs.existsSync(path.join(targetDir, '.gemini', 'mcp_config.json'));
  const codexOk = fs.existsSync(path.join(targetDir, '.codex', 'config.toml'));

  console.log(`  Claude Code (.mcp.json):            ${claudeOk ? '[✓] In sync' : '[ ] Not synced (run: kobean mcp sync)'}`);
  console.log(`  Antigravity (.agents/mcp.json):     ${agyOk ? '[✓] In sync' : '[ ] Not synced (run: kobean mcp sync)'}`);
  console.log(`  Gemini CLI (.gemini/mcp_config.json): ${geminiOk ? '[✓] In sync' : '[ ] Not synced (run: kobean mcp sync)'}`);
  console.log(`  Codex CLI (.codex/config.toml):     ${codexOk ? '[✓] In sync' : '[ ] Not synced (run: kobean mcp sync)'}`);
}

function runMcpAdd(presetName, targetDirArg) {
  if (!presetName) {
    console.error('[error] Missing preset name. Example: kobean mcp add postgres');
    runMcpPresets();
    process.exit(1);
  }

  const preset = MCP_PRESETS[presetName.toLowerCase()];
  if (!preset) {
    console.error(`[error] Unknown preset '${presetName}'.`);
    runMcpPresets();
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  const configData = loadMcpConfig(targetDir);

  const mcpPath = configData.path;
  const servers = { ...configData.servers, [presetName]: preset.config };

  fs.mkdirSync(path.dirname(mcpPath), { recursive: true });
  fs.writeFileSync(
    mcpPath,
    JSON.stringify(
      {
        $schema: 'https://json.schemastore.org/mcp-server-config.json',
        mcpServers: servers
      },
      null,
      2
    ) + '\n',
    'utf-8'
  );

  console.log(`==> [✓] Added preset '${presetName}' to ${mcpPath}`);
  if (preset.sampleEnv) {
    console.log(`\nNote: If required, configure the environment variable:`);
    console.log(`  ${preset.sampleEnv.replace('\n', '\n  ')}`);
  }

  // Auto-sync across all agent files
  runMcpSync(targetDir);
}

function runMcpRemove(serverName, targetDirArg) {
  if (!serverName) {
    console.error('[error] Missing server name to remove. Example: kobean mcp remove postgres');
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  const configData = loadMcpConfig(targetDir);

  if (!configData.servers[serverName]) {
    console.error(`[error] Server '${serverName}' is not present in ${configData.path}`);
    process.exit(1);
  }

  delete configData.servers[serverName];
  fs.writeFileSync(
    configData.path,
    JSON.stringify(
      {
        $schema: 'https://json.schemastore.org/mcp-server-config.json',
        mcpServers: configData.servers
      },
      null,
      2
    ) + '\n',
    'utf-8'
  );

  console.log(`==> [✓] Removed '${serverName}' from ${configData.path}`);
  runMcpSync(targetDir);
}

function runMcpPresets() {
  console.log('\nAvailable KobeanSkills Vetted MCP Presets:');
  console.log('------------------------------------------------------------');
  for (const [name, p] of Object.entries(MCP_PRESETS)) {
    console.log(`  • ${name.padEnd(14)} ${p.description}`);
    if (p.requiredEnv.length > 0) {
      console.log(`    Requires:    ${p.requiredEnv.join(', ')}`);
    }
  }
  console.log('\nTo add a preset:');
  console.log('  bunx kobean-skills mcp add <preset-name>');
  console.log('  (e.g., bunx kobean-skills mcp add postgres)\n');
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

  console.log('\nMCP Connectors Status:');
  const targetDir = process.cwd();
  const configData = loadMcpConfig(targetDir);
  if (configData.exists) {
    const sCount = Object.keys(configData.servers).length;
    console.log(`  Source config:      [✓] ${configData.path} (${sCount} servers)`);
    const claudeOk = fs.existsSync(path.join(targetDir, '.mcp.json'));
    const agyOk = fs.existsSync(path.join(targetDir, '.agents', 'mcp.json'));
    const codexOk = fs.existsSync(path.join(targetDir, '.codex', 'config.toml'));
    console.log(`  Claude Code sync:   ${claudeOk ? '[✓] .mcp.json' : '[ ] Missing (run: kobean mcp sync)'}`);
    console.log(`  Antigravity sync:   ${agyOk ? '[✓] .agents/mcp.json' : '[ ] Missing (run: kobean mcp sync)'}`);
    console.log(`  Codex CLI sync:     ${codexOk ? '[✓] .codex/config.toml' : '[ ] Missing (run: kobean mcp sync)'}`);
  } else {
    console.log(`  Source config:      [ ] Not configured in this project (run: kobean mcp add <preset>)`);
  }
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

// Router
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
  case 'mcp':
    const subAction = args[1] || 'list';
    if (subAction === 'list' || subAction === 'status') {
      runMcpList(args[2]);
    } else if (subAction === 'add') {
      runMcpAdd(args[2], args[3]);
    } else if (subAction === 'remove' || subAction === 'rm') {
      runMcpRemove(args[2], args[3]);
    } else if (subAction === 'sync') {
      const isGlobal = args.includes('--global');
      const target = args.find((a, i) => i > 1 && !a.startsWith('--'));
      runMcpSync(target, isGlobal);
    } else if (subAction === 'presets') {
      runMcpPresets();
    } else {
      console.error(`[error] Unknown mcp subcommand: ${subAction}`);
      console.log('Available mcp actions: list, add, remove, sync, presets');
      process.exit(1);
    }
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
