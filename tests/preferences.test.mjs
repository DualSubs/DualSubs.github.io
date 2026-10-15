import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

test('both deployment channels copy the framework unchanged and package only provided content', async () => {
  const templateSource = process.env.PREFERENCE_PANES_HOME ?? 'https://github.com/NSNanoCat/PreferencePanes/releases/download/v1.3.2/home.html';
  let template;
  if (templateSource.startsWith('https://')) {
    const response = await fetch(templateSource);
    assert.equal(response.status, 200);
    template = Buffer.from(await response.arrayBuffer());
  } else template = await readFile(templateSource);
  const source = JSON.parse(await readFile(new URL('../preferences/home.json', import.meta.url), 'utf8'));
  const optional = [];
  for (const name of ['theme.css', 'bridge.mjs']) {
    try {
      await readFile(new URL(`../preferences/${name}`, import.meta.url));
      optional.push(name);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const images = [...new Set([source.logo, ...source.sections.flatMap(section => section.items.map(item => item.icon.src))].filter(Boolean))];
  for (const directory of process.env.PREFERENCES_TEST_DIRS?.split(',') ?? ['docs/public', 'doc_build']) {
    const base = new URL(`../${directory}/preferences/`, import.meta.url);
    assert.deepEqual(await readFile(new URL('index.html', base)), template);
    const generated = JSON.parse(await readFile(new URL('home.json', base), 'utf8'));
    const { footer, ...content } = generated;
    const { footer: originalFooter, ...originalContent } = source;
    assert.deepEqual(content, originalContent);
    assert.deepEqual(footer.slice(0, -1), originalFooter ?? []);
    assert.match(footer.at(-1), directory === 'doc_build' ? /^构建于 .* UTC\+8 · [a-f\d]{7,}$/ : /^本地预览（未构建）$/);
    assert.deepEqual((await readdir(base)).sort(), ['assets', 'home.json', 'index.html', ...optional].sort());
    assert.deepEqual((await readdir(new URL('assets/', base))).sort(), images.map(image => image.slice('assets/'.length)).sort());
    for (const name of [...optional, ...images])
      assert.deepEqual(await readFile(new URL(name, base)), await readFile(new URL(`../preferences/${name}`, import.meta.url)));
  }
});
