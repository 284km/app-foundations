import { copyFile, mkdir, readFile, lstat, realpath, writeFile } from 'node:fs/promises';
import { resolve, dirname, join, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const starters = ['web', 'mobile', 'desktop'];
function git(args) { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
function outside(source, target) {
  const rel = relative(source, target);
  return isAbsolute(rel) || rel === '..' || rel.startsWith('../') || rel.startsWith('..\\');
}
export async function createApp(starter, destination) {
  if (!starters.includes(starter)) throw new Error('Choose web, mobile, or desktop.');
  const target = resolve(destination);
  if (!outside(root, target) || !outside(await realpath(root), join(await realpath(dirname(target)), target.split(/[\\/]/).at(-1)))) {
    throw new Error('Destination must be outside the source repository.');
  }
  const prefix = `starters/${starter}/`;
  // The Git index is the public allowlist. Never copy untracked or ignored local files.
  const files = git(['ls-files', '-z', '--', prefix, 'contracts/', 'LICENSE']).split('\0').filter(Boolean);
  if (!files.includes(`${prefix}package-lock.json`)) throw new Error('Tracked starter lockfile is missing. Use a Git checkout of the source repository.');
  await mkdir(target, { recursive: false });
  for (const file of files) {
    const path = join(root, file);
    if (!(await lstat(path)).isFile()) throw new Error(`Only regular tracked files can be exported: ${file}`);
    const local = file.startsWith(prefix) ? file.slice(prefix.length) : file;
    const output = join(target, local);
    await mkdir(dirname(output), { recursive: true });
    await copyFile(path, output);
  }
  let commit = 'unreleased';
  try { commit = git(['rev-parse', 'HEAD']).trim(); } catch {}
  const dirty = Boolean(git(['status', '--porcelain', '--untracked-files=no', '--', prefix, 'contracts/', 'LICENSE', 'package.json']).trim());
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  await writeFile(join(target, '.app-foundations.json'), JSON.stringify({
    repository: 'https://github.com/284km/app-foundations', version: manifest.version, commit, dirty, starter,
  }, null, 2) + '\n');
  return target;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 4) throw new Error('Usage: node scripts/create-app.mjs <web|mobile|desktop> <new-directory>');
    console.log(await createApp(process.argv[2], process.argv[3]));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
