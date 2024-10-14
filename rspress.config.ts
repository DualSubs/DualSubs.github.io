import fs from 'node:fs';
import path from 'node:path';
import type { UrlWithStringQuery } from 'node:url';
import { pluginChangelog } from 'rspress-plugin-changelog';
import type { ChangelogPluginOptions } from 'rspress-plugin-changelog';
import { pluginFontOpenSans } from 'rspress-plugin-font-open-sans';
import pluginSitemap from 'rspress-plugin-sitemap';
import { defineConfig } from 'rspress/config';

const siteUrl = 'https://DualSubs.github.io';

const generateChangelogParams = (items: Omit<ChangelogPluginOptions['items'][number], 'type'>[]) =>
  items.map<ChangelogPluginOptions['items'][number]>((item) => ({
    type: 'github-releases',
    templatePath: './changelog.handlebars',
    ...item,
  }));

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'DualSubs',
  description: '双语及增强字幕生成工具',
  icon: 'https://avatars.githubusercontent.com/u/100578089?s=200&v=4',
  logo: 'https://avatars.githubusercontent.com/u/100578089?s=80&v=4',
  // logo: {
  //   light: '/rspress-light-logo.png',
  //   dark: '/rspress-dark-logo.png',
  // },
  globalStyles: path.resolve('./assets/styles/global.css'),
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/DualSubs' },
      {
        icon: {
          svg: fs.readFileSync(path.join(__dirname, 'docs', 'public', 'telegram.svg'), 'utf-8'),
        },
        mode: 'link',
        content: 'https://t.me/GetSomeFries',
      },
    ],
  },
  builderConfig: {
    source: {
      alias: {},
    },
  },
  markdown: {
    mdxRs: false,
    remarkPlugins: [[require('remark-github')]],
    rehypePlugins: [
      [
        require('rehype-urls'),
        (url: UrlWithStringQuery, node: any) => {
          switch (url.host) {
            case 't.me':
            case 'github.com':
              node.properties.target = '_blank';
              break;
            case null:
              //console.log(url);
              break;
            default:
              //console.log(url);
              break;
          }
        },
      ],
    ],
  },
  plugins: [
    pluginFontOpenSans(),
    pluginSitemap({
      domain: siteUrl,
    }),
    pluginChangelog({
      fetchOnDev: false,
      items: generateChangelogParams([
        {
          title: '🎦 Universal',
          routePath: 'universal',
          repo: 'DualSubs/Universal',
        },
        {
          title: '🇳 Netflix',
          routePath: 'netflix',
          repo: 'DualSubs/Netflix',
        },
        {
          title: '▶️ YouTube (Music)',
          routePath: 'youtube',
          repo: 'DualSubs/YouTube',
        },
        {
          title: '🎵 Spotify',
          routePath: 'spotify',
          repo: 'DualSubs/Spotify',
        },
        {
          title: '➕ AddOn',
          routePath: 'addon',
          repo: 'DualSubs/AddOn',
        },
      ]),
    }),
  ],
});
