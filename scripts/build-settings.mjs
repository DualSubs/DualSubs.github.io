import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const stamp = process.argv.includes('--stamp');
// 原样复制同版框架；项目差异只来自固定路径的内容资源。
// Copy the same framework unchanged; project differences come only from content at fixed paths.
const templateSource = process.env.PREFERENCE_PANES_HOME ?? 'https://github.com/NSNanoCat/PreferencePanes/releases/download/v1.3.1/home.html';
let template;
if (templateSource.startsWith('https://')) {
  const response = await fetch(templateSource);
  if (!response.ok) throw new Error(`PreferencePanes home.html: HTTP ${response.status}`);
  template = Buffer.from(await response.arrayBuffer());
} else template = await readFile(path.resolve(templateSource));
if (template.toString().includes('__PREFERENCE_PANES_')) throw new Error('Expected a compiled PreferencePanes homepage');
const outputs = new Map([['settings/index.html', template]]);
const config = JSON.parse(await readFile(path.join(root, 'settings/home.json'), 'utf8'));
// 构建信息属于 JSON 页脚，不能改写共用 HTML。
// Build information belongs to the JSON footer and must not rewrite the shared HTML.
let label = '本地预览（未构建）';
if (stamp) {
  const builtAt = new Date();
  const revision = execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  label = `构建于 ${builtAt.toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' })} UTC+8 · ${revision}`;
}
config.footer = [...(config.footer ?? []), label];
outputs.set('settings/home.json', Buffer.from(`${JSON.stringify(config, null, 2)}\n`));
for (const name of ['theme.css', 'bridge.mjs']) {
  try {
    outputs.set(`settings/${name}`, await readFile(path.join(root, 'settings', name)));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const jsonURL = new URL('https://settings.invalid/settings/home.json');
for (const source of [config.logo, ...config.sections.flatMap(section => section.items.map(item => item.icon.src))].filter(Boolean)) {
  const url = new URL(source, jsonURL);
  if (url.origin !== jsonURL.origin) continue;
  const name = path.posix.normalize(decodeURIComponent(url.pathname.slice(1)));
  if (!name.startsWith('settings/assets/')) throw new Error(`Local homepage image must be inside settings/assets: ${source}`);
  outputs.set(name, await readFile(path.join(root, name)));
}
const targetRoot = path.join(root, stamp ? 'doc_build/settings' : 'docs/public/settings');
if (!check) await rm(targetRoot, { recursive: true, force: true });
for (const [name, body] of outputs) {
  const target = path.join(root, stamp ? 'doc_build' : 'docs/public', name);
  if (check) {
    if (!(await readFile(target)).equals(body)) throw new Error(`Stale settings asset: ${name}`);
  } else {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body);
  }
}
console.log(JSON.stringify({ outputs: outputs.size, check }));
