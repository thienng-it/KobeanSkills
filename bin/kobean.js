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

// Built-in vetted MCP Marketplace Catalog (38 top connectors across 6 categories)
const MCP_PRESETS = {
  // Databases & Storage (10)
  postgres: {
    name: 'postgres',
    category: 'Databases & Storage',
    description: 'PostgreSQL database inspector and query runner',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-postgres', '${DATABASE_URL}']
    },
    requiredEnv: ['DATABASE_URL'],
    sampleEnv: 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"'
  },
  sqlite: {
    name: 'sqlite',
    category: 'Databases & Storage',
    description: 'SQLite database inspector and SQL executor',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sqlite', '--db-path', '${SQLITE_DB_PATH:-./dev.db}']
    },
    requiredEnv: [],
    sampleEnv: 'SQLITE_DB_PATH="./dev.db"'
  },
  mysql: {
    name: 'mysql',
    category: 'Databases & Storage',
    description: 'MySQL database runner, query execution, and schema analysis',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-mysql', '${MYSQL_URL}']
    },
    requiredEnv: ['MYSQL_URL'],
    sampleEnv: 'MYSQL_URL="mysql://user:password@localhost:3306/mydb"'
  },
  supabase: {
    name: 'supabase',
    category: 'Databases & Storage',
    description: 'Supabase Postgres tables, edge functions, auth, and storage management',
    config: {
      command: 'npx',
      args: ['-y', '@supabase/mcp-server-supabase@latest'],
      env: {
        SUPABASE_URL: '${SUPABASE_URL}',
        SUPABASE_SERVICE_ROLE_KEY: '${SUPABASE_SERVICE_ROLE_KEY}'
      }
    },
    requiredEnv: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
    sampleEnv: 'SUPABASE_URL="https://xxx.supabase.co"\nSUPABASE_SERVICE_ROLE_KEY="eyJ..."'
  },
  neon: {
    name: 'neon',
    category: 'Databases & Storage',
    description: 'Neon serverless Postgres branching, migrations, and query execution',
    config: {
      command: 'npx',
      args: ['-y', '@neondatabase/mcp-server-neon@latest'],
      env: {
        NEON_API_KEY: '${NEON_API_KEY}'
      }
    },
    requiredEnv: ['NEON_API_KEY'],
    sampleEnv: 'NEON_API_KEY="neon_api_..."'
  },
  redis: {
    name: 'redis',
    category: 'Databases & Storage',
    description: 'Redis in-memory key-value cache, pub/sub, and data structure inspection',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-redis', '${REDIS_URL}']
    },
    requiredEnv: ['REDIS_URL'],
    sampleEnv: 'REDIS_URL="redis://localhost:6379"'
  },
  mongodb: {
    name: 'mongodb',
    category: 'Databases & Storage',
    description: 'MongoDB document collection queries, aggregation, and index inspection',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-mongodb', '${MONGODB_URI}']
    },
    requiredEnv: ['MONGODB_URI'],
    sampleEnv: 'MONGODB_URI="mongodb://localhost:27017/mydb"'
  },
  clickhouse: {
    name: 'clickhouse',
    category: 'Databases & Storage',
    description: 'ClickHouse columnar analytics database query engine and table schema inspector',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-clickhouse'],
      env: {
        CLICKHOUSE_HOST: '${CLICKHOUSE_HOST}',
        CLICKHOUSE_PASSWORD: '${CLICKHOUSE_PASSWORD}'
      }
    },
    requiredEnv: ['CLICKHOUSE_HOST', 'CLICKHOUSE_PASSWORD'],
    sampleEnv: 'CLICKHOUSE_HOST="http://localhost:8123"\nCLICKHOUSE_PASSWORD="password"'
  },
  pinecone: {
    name: 'pinecone',
    category: 'Databases & Storage',
    description: 'Pinecone vector database index management, upserting, and similarity search',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-pinecone'],
      env: {
        PINECONE_API_KEY: '${PINECONE_API_KEY}'
      }
    },
    requiredEnv: ['PINECONE_API_KEY'],
    sampleEnv: 'PINECONE_API_KEY="pcsk_..."'
  },
  qdrant: {
    name: 'qdrant',
    category: 'Databases & Storage',
    description: 'Qdrant vector search engine collection management and vector payload filtering',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-qdrant'],
      env: {
        QDRANT_URL: '${QDRANT_URL}',
        QDRANT_API_KEY: '${QDRANT_API_KEY}'
      }
    },
    requiredEnv: ['QDRANT_URL'],
    sampleEnv: 'QDRANT_URL="http://localhost:6333"\nQDRANT_API_KEY="optional_api_key"'
  },

  // Developer Tools & CI (8)
  github: {
    name: 'github',
    category: 'Developer Tools & CI',
    description: 'GitHub issues, pull requests, commits, branches, and repository searching',
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
  gitlab: {
    name: 'gitlab',
    category: 'Developer Tools & CI',
    description: 'GitLab merge requests, pipelines, issues, and project repository access',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-gitlab'],
      env: {
        GITLAB_PERSONAL_ACCESS_TOKEN: '${GITLAB_TOKEN}'
      }
    },
    requiredEnv: ['GITLAB_TOKEN'],
    sampleEnv: 'GITLAB_TOKEN="glpat-xxxxxxxxxxxxxxxxxxxx"'
  },
  linear: {
    name: 'linear',
    category: 'Developer Tools & CI',
    description: 'Linear issue tracker, cycles, projects, and backlog task management',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-linear'],
      env: {
        LINEAR_API_KEY: '${LINEAR_API_KEY}'
      }
    },
    requiredEnv: ['LINEAR_API_KEY'],
    sampleEnv: 'LINEAR_API_KEY="lin_api_..."'
  },
  jira: {
    name: 'jira',
    category: 'Developer Tools & CI',
    description: 'Atlassian Jira enterprise issue tracking, sprints, and project boards',
    config: {
      command: 'npx',
      args: ['-y', '@atlassian/mcp-server-jira'],
      env: {
        JIRA_API_TOKEN: '${JIRA_API_TOKEN}',
        JIRA_DOMAIN: '${JIRA_DOMAIN}',
        JIRA_EMAIL: '${JIRA_EMAIL}'
      }
    },
    requiredEnv: ['JIRA_API_TOKEN', 'JIRA_DOMAIN', 'JIRA_EMAIL'],
    sampleEnv: 'JIRA_API_TOKEN="token"\nJIRA_DOMAIN="myorg.atlassian.net"\nJIRA_EMAIL="user@org.com"'
  },
  docker: {
    name: 'docker',
    category: 'Developer Tools & CI',
    description: 'Docker container, image, network, and compose service lifecycle manager',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-docker']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  kubernetes: {
    name: 'kubernetes',
    category: 'Developer Tools & CI',
    description: 'Kubernetes cluster introspection, pods, deployments, services, and event logs',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-kubernetes']
    },
    requiredEnv: [],
    sampleEnv: 'KUBECONFIG="~/.kube/config"'
  },
  sentry: {
    name: 'sentry',
    category: 'Developer Tools & CI',
    description: 'Sentry issue diagnostics, stack traces, and exception tag inspection for kb-debug',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-sentry', '--auth-token', '${SENTRY_AUTH_TOKEN}']
    },
    requiredEnv: ['SENTRY_AUTH_TOKEN'],
    sampleEnv: 'SENTRY_AUTH_TOKEN="sntrys_..."'
  },
  postman: {
    name: 'postman',
    category: 'Developer Tools & CI',
    description: 'Postman API collections, environments, workspaces, and mock server testing',
    config: {
      command: 'npx',
      args: ['-y', '@postman/postman-mcp-server'],
      env: {
        POSTMAN_API_KEY: '${POSTMAN_API_KEY}'
      }
    },
    requiredEnv: ['POSTMAN_API_KEY'],
    sampleEnv: 'POSTMAN_API_KEY="PMAK-..."'
  },

  // Web & Testing (4)
  playwright: {
    name: 'playwright',
    category: 'Web & Testing',
    description: 'Headless browser automation, navigation, element clicks, and end-to-end testing',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-playwright']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  puppeteer: {
    name: 'puppeteer',
    category: 'Web & Testing',
    description: 'Chrome browser automation, viewport screenshot rendering, and web scraping',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-puppeteer']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  'chrome-devtools': {
    name: 'chrome-devtools',
    category: 'Web & Testing',
    description: 'Chrome DevTools MCP protocol for live DOM, CSS, network requests, and performance',
    config: {
      command: 'npx',
      args: ['-y', 'chrome-devtools-mcp@latest']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  fetch: {
    name: 'fetch',
    category: 'Web & Testing',
    description: 'Web page fetching and HTML-to-Markdown conversion for clean agent consumption',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-fetch']
    },
    requiredEnv: [],
    sampleEnv: ''
  },

  // Search & Intelligence (5)
  'brave-search': {
    name: 'brave-search',
    category: 'Search & Intelligence',
    description: 'Real-time web search and news querying via privacy-focused Brave Search API',
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
  exa: {
    name: 'exa',
    category: 'Search & Intelligence',
    description: 'Exa AI neural web search engine optimized for LLM knowledge retrieval and scraping',
    config: {
      command: 'npx',
      args: ['-y', 'exa-mcp-server'],
      env: {
        EXA_API_KEY: '${EXA_API_KEY}'
      }
    },
    requiredEnv: ['EXA_API_KEY'],
    sampleEnv: 'EXA_API_KEY="your-exa-api-key"'
  },
  tavily: {
    name: 'tavily',
    category: 'Search & Intelligence',
    description: 'Tavily Search API built specifically for AI agents, research, and factual grounding',
    config: {
      command: 'npx',
      args: ['-y', 'tavily-mcp'],
      env: {
        TAVILY_API_KEY: '${TAVILY_API_KEY}'
      }
    },
    requiredEnv: ['TAVILY_API_KEY'],
    sampleEnv: 'TAVILY_API_KEY="tvly-..."'
  },
  memory: {
    name: 'memory',
    category: 'Search & Intelligence',
    description: 'Knowledge graph persistent associative memory storing entities and relations across sessions',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-memory']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  arxiv: {
    name: 'arxiv',
    category: 'Search & Intelligence',
    description: 'ArXiv scientific preprint search, abstract extraction, and academic paper retrieval',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-arxiv']
    },
    requiredEnv: [],
    sampleEnv: ''
  },

  // Cloud & Big Data (4)
  cloudflare: {
    name: 'cloudflare',
    category: 'Cloud & Big Data',
    description: 'Cloudflare Workers, KV, D1 databases, R2 storage, and DNS zone management',
    config: {
      command: 'npx',
      args: ['-y', '@cloudflare/mcp-server-cloudflare'],
      env: {
        CLOUDFLARE_API_TOKEN: '${CLOUDFLARE_API_TOKEN}'
      }
    },
    requiredEnv: ['CLOUDFLARE_API_TOKEN'],
    sampleEnv: 'CLOUDFLARE_API_TOKEN="token"'
  },
  bigquery: {
    name: 'bigquery',
    category: 'Cloud & Big Data',
    description: 'Google Cloud BigQuery datasets, tables, SQL queries, and schema discovery',
    config: {
      command: 'npx',
      args: ['-y', '@google-cloud/bigquery-mcp']
    },
    requiredEnv: [],
    sampleEnv: 'GOOGLE_APPLICATION_CREDENTIALS="~/.config/gcloud/application_default_credentials.json"'
  },
  'aws-kb': {
    name: 'aws-kb',
    category: 'Cloud & Big Data',
    description: 'AWS Bedrock Knowledge Base vector search and enterprise document retrieval',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-aws-kb-retrieval'],
      env: {
        AWS_ACCESS_KEY_ID: '${AWS_ACCESS_KEY_ID}',
        AWS_SECRET_ACCESS_KEY: '${AWS_SECRET_ACCESS_KEY}',
        AWS_REGION: '${AWS_REGION}'
      }
    },
    requiredEnv: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'],
    sampleEnv: 'AWS_ACCESS_KEY_ID="AKIA..."\nAWS_SECRET_ACCESS_KEY="..."\nAWS_REGION="us-east-1"'
  },
  snowflake: {
    name: 'snowflake',
    category: 'Cloud & Big Data',
    description: 'Snowflake enterprise data warehouse SQL execution, tables, and warehouse monitoring',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-snowflake'],
      env: {
        SNOWFLAKE_ACCOUNT: '${SNOWFLAKE_ACCOUNT}',
        SNOWFLAKE_USER: '${SNOWFLAKE_USER}',
        SNOWFLAKE_PASSWORD: '${SNOWFLAKE_PASSWORD}'
      }
    },
    requiredEnv: ['SNOWFLAKE_ACCOUNT', 'SNOWFLAKE_USER', 'SNOWFLAKE_PASSWORD'],
    sampleEnv: 'SNOWFLAKE_ACCOUNT="xy12345"\nSNOWFLAKE_USER="user"\nSNOWFLAKE_PASSWORD="pwd"'
  },

  // Productivity, Files & Comms (7)
  filesystem: {
    name: 'filesystem',
    category: 'Productivity & Comms',
    description: 'Secure, scoped local directory read/write file access within designated boundaries',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '.']
    },
    requiredEnv: [],
    sampleEnv: ''
  },
  slack: {
    name: 'slack',
    category: 'Productivity & Comms',
    description: 'Slack workspace channel messaging, threads, user lookup, and notification dispatch',
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
  discord: {
    name: 'discord',
    category: 'Productivity & Comms',
    description: 'Discord guild channel messages, voice channel info, and bot announcements',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-discord'],
      env: {
        DISCORD_BOT_TOKEN: '${DISCORD_BOT_TOKEN}'
      }
    },
    requiredEnv: ['DISCORD_BOT_TOKEN'],
    sampleEnv: 'DISCORD_BOT_TOKEN="OTkx..."'
  },
  notion: {
    name: 'notion',
    category: 'Productivity & Comms',
    description: 'Notion workspace database query, page content reading, and document updating',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-notion'],
      env: {
        NOTION_API_KEY: '${NOTION_API_KEY}'
      }
    },
    requiredEnv: ['NOTION_API_KEY'],
    sampleEnv: 'NOTION_API_KEY="secret_..."'
  },
  'google-drive': {
    name: 'google-drive',
    category: 'Productivity & Comms',
    description: 'Google Drive file listing, document search, and spreadsheet/doc content reading',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-google-drive'],
      env: {
        GOOGLE_DRIVE_CLIENT_ID: '${GOOGLE_DRIVE_CLIENT_ID}'
      }
    },
    requiredEnv: ['GOOGLE_DRIVE_CLIENT_ID'],
    sampleEnv: 'GOOGLE_DRIVE_CLIENT_ID="client_id"'
  },
  'google-maps': {
    name: 'google-maps',
    category: 'Productivity & Comms',
    description: 'Google Maps Places, Geocoding, Directions, and Distance Matrix API integration',
    config: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-google-maps'],
      env: {
        GOOGLE_MAPS_API_KEY: '${GOOGLE_MAPS_API_KEY}'
      }
    },
    requiredEnv: ['GOOGLE_MAPS_API_KEY'],
    sampleEnv: 'GOOGLE_MAPS_API_KEY="AIzaSy..."'
  },
  resend: {
    name: 'resend',
    category: 'Productivity & Comms',
    description: 'Resend transactional email delivery, template testing, and domain analytics',
    config: {
      command: 'npx',
      args: ['-y', '@resend/mcp-server-resend'],
      env: {
        RESEND_API_KEY: '${RESEND_API_KEY}'
      }
    },
    requiredEnv: ['RESEND_API_KEY'],
    sampleEnv: 'RESEND_API_KEY="re_placeholder_token"'
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

MCP Connector & Marketplace Commands:
  mcp                           List configured MCP servers, sync status, and environment checks
  mcp marketplace [category]    Browse 38+ vetted MCP servers grouped by category
  mcp search <keyword>          Search the marketplace for connectors (e.g. database, linear, cloud)
  mcp add <preset>              Add a preset connector and auto-sync across all 4 agent files
  mcp remove <name>             Remove an MCP server from configuration and update agent files
  mcp sync [--global]           Synchronize .kobean/mcp.json across Claude, Gemini, Antigravity & Codex
  mcp presets                   Alias for 'mcp marketplace'

Examples:
  bunx kobean-skills init
  bunx kobean-skills mcp marketplace
  bunx kobean-skills mcp search database
  bunx kobean-skills mcp add postgres
  bunx kobean-skills mcp add supabase
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
    console.log('  bunx kobean-skills mcp add postgres      # Add Postgres DB connector');
    console.log('  bunx kobean-skills mcp add supabase      # Add Supabase connector');
    console.log('  bunx kobean-skills mcp add github        # Add GitHub repository tools');
    console.log('  bunx kobean-skills mcp marketplace       # Browse 38+ marketplace connectors\n');
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

function runMcpMarketplace(filterCategory) {
  console.log('\n============================================================');
  console.log('  KOBEANSKILLS MCP MARKETPLACE & DIRECTORY (38 CONNECTORS)');
  console.log('============================================================\n');

  const categories = {};
  for (const [id, item] of Object.entries(MCP_PRESETS)) {
    const cat = item.category || 'Other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  }

  const selectedCategory = filterCategory ? filterCategory.toLowerCase().trim() : null;

  for (const [catName, items] of Object.entries(categories)) {
    if (selectedCategory) {
      const matchCat = catName.toLowerCase().includes(selectedCategory) ||
        selectedCategory.split(/\s+/).some(w => w.length > 2 && catName.toLowerCase().includes(w));
      if (!matchCat) {
        continue;
      }
    }

    console.log(`\x1b[1m\x1b[33m▶ ${catName.toUpperCase()} (${items.length})\x1b[0m`);
    console.log('------------------------------------------------------------');
    for (const p of items) {
      const envStr = p.requiredEnv.length > 0 ? `[Requires: ${p.requiredEnv.join(', ')}]` : '[Zero Config]';
      console.log(`  • \x1b[36m${p.name.padEnd(16)}\x1b[0m ${p.description}`);
      console.log(`    \x1b[90mCommand: ${p.config.command} ${(p.config.args || []).slice(0, 3).join(' ')}...  ${envStr}\x1b[0m`);
    }
    console.log('');
  }

  console.log('------------------------------------------------------------');
  console.log('Quick Install:');
  console.log('  bunx kobean-skills mcp add <name>');
  console.log('  (e.g., bunx kobean-skills mcp add supabase)');
  console.log('\nSearch Marketplace:');
  console.log('  bunx kobean-skills mcp search <query>');
  console.log('  (e.g., bunx kobean-skills mcp search database)\n');
}

function runMcpSearch(query) {
  if (!query) {
    console.log('[error] Please specify a search query. Example: kobean mcp search database');
    return;
  }

  const q = query.toLowerCase().trim();
  const matches = [];

  for (const [id, item] of Object.entries(MCP_PRESETS)) {
    const fullText = `${item.name} ${item.category} ${item.description} ${(item.config.args || []).join(' ')}`.toLowerCase();
    if (fullText.includes(q)) {
      matches.push(item);
    }
  }

  console.log(`\n==> MCP Marketplace Search Results for '${query}' (${matches.length} matches):\n`);

  if (matches.length === 0) {
    console.log(`  No matching connectors found for '${query}'.`);
    console.log('\nTip: Browse the full catalog with:');
    console.log('  bunx kobean-skills mcp marketplace');
    console.log('\nOr add any custom package using:');
    console.log('  bunx kobean-skills mcp add <name>');
    return;
  }

  for (const m of matches) {
    const envStr = m.requiredEnv.length > 0 ? `(Requires: ${m.requiredEnv.join(', ')})` : '(Zero Config)';
    console.log(`  • \x1b[36m${m.name.padEnd(16)}\x1b[0m [${m.category}] ${envStr}`);
    console.log(`    ${m.description}`);
    console.log(`    \x1b[32mbunx kobean-skills mcp add ${m.name}\x1b[0m\n`);
  }
}

function runMcpAdd(presetName, targetDirArg) {
  if (!presetName) {
    console.error('[error] Missing preset name. Example: kobean mcp add postgres');
    runMcpMarketplace();
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), targetDirArg || '.');
  const presetKey = presetName.toLowerCase();
  let preset = MCP_PRESETS[presetKey];

  if (!preset) {
    // Check if user is adding custom format: e.g. @package or custom name
    console.log(`[info] '${presetName}' is not in standard marketplace catalog.`);
    console.log('Searching for close matches...');
    const matches = Object.keys(MCP_PRESETS).filter((k) => k.includes(presetKey) || presetKey.includes(k));
    if (matches.length > 0) {
      console.log(`\nDid you mean:`);
      for (const m of matches) {
        console.log(`  bunx kobean-skills mcp add ${m}`);
      }
      console.log('');
      process.exit(1);
    }

    // Fallback: create custom server definition
    console.log(`[info] Configuring '${presetName}' as custom MCP server...`);
    preset = {
      name: presetName,
      category: 'Custom',
      description: `Custom MCP connector: ${presetName}`,
      config: {
        command: 'npx',
        args: ['-y', presetName]
      },
      requiredEnv: [],
      sampleEnv: ''
    };
  }

  const configData = loadMcpConfig(targetDir);
  const mcpPath = configData.path;
  const servers = { ...configData.servers, [preset.name]: preset.config };

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

  console.log(`==> [✓] Added connector '${preset.name}' to ${mcpPath}`);
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
    } else if (subAction === 'marketplace' || subAction === 'catalog' || subAction === 'market' || subAction === 'presets') {
      runMcpMarketplace(args[2]);
    } else if (subAction === 'search' || subAction === 'find') {
      runMcpSearch(args[2]);
    } else {
      console.error(`[error] Unknown mcp subcommand: ${subAction}`);
      console.log('Available mcp actions: list, marketplace, search, add, remove, sync');
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
