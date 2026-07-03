// scripts/socket-audit.mjs
import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

import { spawn } from 'node:child_process';

const child = spawn('socket', ['audit'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 1));
