// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSkills from 'starlight-skills';

export default defineConfig({
  integrations: [
    starlight({
      title: 'starlight-skills',
      description: 'A Starlight plugin that turns your documentation into AI-installable skills.',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mew-ton/starlight-skills',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/' },
            { label: 'Installation', link: '/installation/' },
            { label: 'Configuration', link: '/configuration/' },
          ],
        },
        {
          label: 'Guides',
          autogenerate: {
            directory: 'guides',
            collapsed: false,
          }
        },
      ],
      plugins: [
        starlightSkills({
          autoCategoryMode: 'path',
          catalogPath: '/skills-catalog',
          sidebarLabel: 'Skills',
        }),
      ],
    }),
  ],
});
