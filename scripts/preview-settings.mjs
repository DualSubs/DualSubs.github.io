import { readFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import vm from 'node:vm';

// 预览真实发布产物；预览服务器逐文件加载通用资源、配置和固定存储 API。
// Preview the real deployment artifacts by loading common resources, configuration and the fixed storage API per file.
const publicDir = path.resolve(import.meta.dirname, process.env.SETTINGS_PUBLIC_DIR ?? '../docs/public');
const store = new Map();
const channel = process.env.SETTINGS_CHANNEL ?? 'dev';
if (!['formal', 'dev'].includes(channel)) throw new TypeError('SETTINGS_CHANNEL must be formal or dev');

const execute = (script, request) =>
  new Promise((resolve) =>
    vm.runInNewContext(script, {
      $environment: { 'surge-version': 'preview' },
      $script: { startTime: Date.now() / 1000 },
      $persistentStore: {
        read: (key) => store.get(key),
        write: (value, key) => {
          store.set(key, value);
          return true;
        },
      },
      $request: request,
      $done: (value) => resolve(value.response),
      console,
    }),
  );

async function configResponse(resource) {
  const url = new URL(resource.url);
  const panel = url.pathname.slice('/api/'.length);
  let owner;
  switch (panel) {
    case 'YouTube':
    case 'Netflix':
    case 'Spotify':
      owner = panel;
      break;
    default:
      owner = 'Universal';
  }
  let body;
  try {
    body = await readFile(
      path.resolve(
        import.meta.dirname,
        `../../${owner}/dist/DualSubs.${panel.replaceAll('_', '.')}${channel === 'dev' ? '.dev' : ''}.PreferencePanes.json`,
      ),
      'utf8',
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { status: 404, headers: {}, body: '' };
  }
  return {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-PreferencePanes-Version': `local.${channel}`,
      'Cache-Control': 'no-store',
    },
    body: resource.method === 'HEAD' ? '' : body,
  };
}

const server = http.createServer(async (request, reply) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/') {
      reply.writeHead(302, { Location: '/settings/' });
      reply.end();
      return;
    }
    const config = /^\/api\/([a-zA-Z0-9_-]+)$/.exec(url.pathname) && !/^\/api\/(?:get|set|delete)$/.test(url.pathname);
    const api = /^\/api\/(?:get|set|delete)$/.test(url.pathname);
    if (config || api) {
      let body = '';
      for await (const chunk of request) body += chunk;
      let result;
      if (config)
        result = await configResponse({ url: url.href, method: request.method, headers: request.headers, body });
      else {
        const file = path.resolve(import.meta.dirname, '../../../NSNanoCat/PreferencePanes/dist/api.js');
        const script = await readFile(file, 'utf8');
        result = await execute(script, { url: url.href, method: request.method, headers: request.headers, body });
      }
      reply.writeHead(result?.status ?? 404, result?.headers);
      reply.end(result?.body);
      return;
    }
    if (
      (!url.pathname.startsWith('/settings/') && !url.pathname.startsWith('/static/font/')) ||
      !['GET', 'HEAD'].includes(request.method)
    ) {
      reply.writeHead(404);
      reply.end();
      return;
    }
    let target = path.join(
      url.pathname.startsWith('/static/font/') ? path.resolve(import.meta.dirname, '../doc_build') : publicDir,
      url.pathname.slice(1),
    );
    if (!path.extname(target)) target = path.join(target, 'index.html');
    try {
      const body = await readFile(target);
      const mime =
        {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'text/javascript',
          '.mjs': 'text/javascript',
          '.json': 'application/json',
          '.png': 'image/png',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
        }[path.extname(target)] ?? 'text/plain';
      reply.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' });
      reply.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
      reply.writeHead(404);
      reply.end();
    }
  } catch (error) {
    console.error(error);
    reply.writeHead(500);
    reply.end('Preview failed');
  }
});
server.listen(Number(process.env.PORT ?? 0), '127.0.0.1', () =>
  console.log(`DualSubs settings: http://127.0.0.1:${server.address().port}/settings/`),
);
