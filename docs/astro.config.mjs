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
          items: [
            { label: 'Marking a Page as a Skill', link: '/guides/marking-skills/' },
            { label: 'Build Output', link: '/guides/build-output/' },
            { label: 'Skill Catalog Page', link: '/guides/catalog/' },
          ],
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
