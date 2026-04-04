import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import starlightSkills from 'starlight-skills';

const isCI = !!process.env.CI;

export default defineConfig({
  ...(isCI && {
    site: 'https://mew-ton.github.io',
    base: '/starlight-skills',
  }),
  integrations: [
    starlight({
      title: 'starlight-skills',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        ja: { label: '日本語', lang: 'ja' },
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mew-ton/starlight-skills' },
      ],
      sidebar: [
        {
          label: 'Guides',
          translations: { ja: 'ガイド' },
          items: [
            {
              label: 'Getting Started',
              translations: { ja: 'はじめに' },
              slug: '01-getting-started',
            },
            {
              label: 'Installation',
              translations: { ja: 'インストール' },
              slug: '02-installation',
            },
            {
              label: 'Authoring Skills',
              translations: { ja: 'スキルの作成' },
              slug: '03-authoring-skills',
            },
            {
              label: 'Companion Files',
              translations: { ja: '付随ファイル' },
              slug: '04-companion-files',
            },
            { label: 'Configuration', translations: { ja: '設定' }, slug: '05-configuration' },
            {
              label: 'Deployment & Installation',
              translations: { ja: 'デプロイとインストール' },
              slug: '06-deployment',
            },
          ],
        },
        {
          label: 'Best Practices',
          translations: { ja: 'ベストプラクティス' },
          items: [
            {
              label: 'One Instruction Per File',
              translations: { ja: '1タスク1ファイル' },
              slug: 'best-practices/01-one-instruction-per-file',
            },
            {
              label: 'Descriptive Frontmatter',
              translations: { ja: '詳細な Description' },
              slug: 'best-practices/02-descriptive-frontmatter',
            },
            {
              label: 'Semantic Markdown',
              translations: { ja: 'セマンティックな Markdown' },
              slug: 'best-practices/03-semantic-markdown',
            },
            {
              label: 'Separate UI',
              translations: { ja: 'UI の分離' },
              slug: 'best-practices/04-separate-ui',
            },
            {
              label: 'i18n and Locales',
              translations: { ja: '多言語(i18n)でのスキル' },
              slug: 'best-practices/05-i18n-skills',
            },
          ],
        },
      ],
      plugins: [
        starlightSkills({
          collocatedDir: '../skills',
        }),
      ],
    }),
  ],
});
