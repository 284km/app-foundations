import { readFile, readdir } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { root } from './create-app.mjs';
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(p));
    else if (p.endsWith('.md')) result.push(p);
  }
  return result;
}
const en = await walk(join(root, 'docs/en'));
const ja = await walk(join(root, 'docs/ja'));
if (en.length !== ja.length) throw new Error('English/Japanese document counts differ.');
for (const path of en) {
  const source = await readFile(path, 'utf8');
  const translationPath = path.replace('/docs/en/', '/docs/ja/');
  const translation = await readFile(translationPath, 'utf8');
  const hash = createHash('sha256').update(source).digest('hex');
  if (!translation.includes(`translation_source_sha256: ${hash}`)) throw new Error(`Stale translation: ${relative(root, translationPath)}`);
  for (const file of [path, translationPath]) {
    const body = await readFile(file, 'utf8');
    for (const match of body.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(match[1])) continue;
      await readFile(join(dirname(file), match[1].split('#')[0]));
    }
  }
}
console.log(`Checked ${en.length} English/Japanese document pairs and local links. Translation meaning still requires review.`);
