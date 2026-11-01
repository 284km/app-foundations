import openapiTS, { astToString } from 'openapi-typescript';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { root, starters } from './create-app.mjs';
const ast = await openapiTS(pathToFileURL(join(root, 'contracts/openapi.json')));
const code = '// Generated from contracts/openapi.json. Run npm run generate at the repository root.\n' + astToString(ast);
for (const starter of starters) {
  const dir = join(root, 'starters', starter, 'src', 'generated');
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'api.ts'), code);
  // Keep a standalone copy for direct use, not only exported projects.
  await mkdir(join(root, 'starters', starter, 'contracts'), { recursive: true });
  await copyFile(join(root, 'contracts/openapi.json'), join(root, 'starters', starter, 'contracts/openapi.json'));
}
