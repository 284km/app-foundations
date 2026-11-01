import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './create-app.mjs';
// Scan tracked files, including files that are ignored by mistake after being committed.
const paths = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
if (!paths.length) throw new Error('No tracked files to scan. Stage the public allowlist first.');
const forbiddenPath = /(^|\/)(\.env(?:\..*)?|\.aws|\.ssh|\.npmrc|\.pypirc|\.netrc|\.DS_Store|node_modules|target|\.next|\.expo|\.artifacts|coverage)(\/|$)|\.(?:p12|pfx|jks|keystore|mobileprovision|log|pem|key)$/i;
const checks = [
  ['absolute local home path', /\/(?:Users|home)\/[A-Za-z0-9_.-]+\//],
  ['private key', /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/],
  ['GitHub credential', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
  ['AWS access key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['Slack credential', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
];
for (const path of paths) {
  if (forbiddenPath.test(path) && !path.endsWith('/.env.example')) throw new Error(`Forbidden public file: ${path}`);
  const staged = execFileSync('git', ['show', ':' + path], { cwd: root });
  const working = await readFile(join(root, path));
  // Inspect both snapshots so a clean working file cannot hide a staged secret.
  for (const bytes of staged.equals(working) ? [staged] : [staged, working]) {
  if (bytes.includes(0)) throw new Error(`Binary file requires explicit public review: ${path}`);
  const body = bytes.toString('utf8');
  for (const [label, pattern] of checks) if (pattern.test(body)) throw new Error(`${label}: ${path}`);
  for (const match of body.matchAll(/https?:\/\/[^\s"'<>`),]+/g)) {
    const url = new URL(match[0]);
    const host = url.hostname;
    const local = ['localhost', '127.0.0.1', '0.0.0.0', '10.0.2.2', 'tauri.localhost', '[::1]'].includes(host);
    if (!local && /(?:^10\.|^192\.168\.|^172\.(?:1[6-9]|2\d|3[01])\.|\.(?:internal|local|corp)$)/i.test(host)) throw new Error(`Private network URL: ${path}`);
    if (url.username || url.password) throw new Error(`Credentials in URL: ${path}`);
  }
  }
}
console.log(`Public-content policy passed for ${paths.length} tracked text files. Run Gitleaks and human review separately.`);
