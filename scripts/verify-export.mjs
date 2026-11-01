import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createApp, starters } from './create-app.mjs';
const selected = process.argv[2] ? [process.argv[2]] : starters;
const parent = await mkdtemp(join(tmpdir(), 'app-foundations-export-'));
for (const starter of selected) {
  const cwd = await createApp(starter, join(parent, starter));
  for (const args of [['ci', '--ignore-scripts', '--no-fund'], ['run', 'typecheck'], ['run', 'build']]) {
    const result = spawnSync('npm', args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    if (result.status !== 0) throw new Error(`${starter}: npm ${args.join(' ')} failed`);
  }
  console.log(`Verified standalone export: ${starter}`);
}
console.log('Temporary exports are retained for inspection:', parent);
