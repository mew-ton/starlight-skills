import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { StarlightPlugin } from '@astrojs/starlight/types';
import { discoverSkills } from './utils/discovery.js';
import { starlightSkillsIntegration } from './integration.js';
import type { SkillData, StarlightSkillsOptions } from './types.js';

export type { SkillData, StarlightSkillsOptions, SkillFrontmatter } from './types.js';

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULTS: Required<StarlightSkillsOptions> = {
  autoCategoryMode: 'path',
  catalogPath: '/skills-catalog',
  sidebarLabel: 'Skills',
};

// ---------------------------------------------------------------------------
// Sidebar helpers
// ---------------------------------------------------------------------------

type SidebarItem =
  | { label: string; link: string }
  | { label: string; items: SidebarItem[] };

/** Build a nested sidebar group from the discovered skills. */
function buildSidebarGroup(
  skills: SkillData[],
  label: string,
): { label: string; items: SidebarItem[] } {
  // Group by top-level category
  const byCategory = new Map<string, SkillData[]>();
  for (const skill of skills) {
    const cat = skill.category || '';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(skill);
  }

  const items: SidebarItem[] = [];

  for (const [cat, catSkills] of byCategory) {
    const links: SidebarItem[] = catSkills.map((s) => ({
      label: s.title,
      link: s.url,
    }));

    if (cat === '') {
      // Uncategorised skills go directly into the Skills group
      items.push(...links);
    } else {
      // Each category segment creates a nested group
      const segments = cat.split('/').filter(Boolean);
      // Nest from deepest up
      let group: SidebarItem = {
        label: segments[segments.length - 1]!,
        items: links,
      };
      for (let i = segments.length - 2; i >= 0; i--) {
        group = { label: segments[i]!, items: [group] };
      }
      items.push(group);
    }
  }

  return { label, items };
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

/**
 * `starlight-skills` — Starlight plugin
 *
 * Turns skill-annotated documentation pages into distributable AI skills:
 *
 * - Adds a sidebar group listing all skills
 * - Injects a `/skills-catalog` page with a searchable skill table
 * - On `astro build`, writes:
 *   - `dist/.well-known/skills/` (discovery endpoint for `npx skills add`)
 *   - `skills/` in the project root (committed companion files)
 */
export default function starlightSkills(
  userOptions: StarlightSkillsOptions = {},
): StarlightPlugin {
  const options: Required<StarlightSkillsOptions> = {
    ...DEFAULTS,
    ...userOptions,
  };

  // Path to the pages/ directory shipped with this package.
  // After compilation: dist/index.js → ../pages/
  const pagesDir = new URL('../pages/', import.meta.url);

  return {
    name: 'starlight-skills',
    hooks: {
      'config:setup': async ({
        config,
        updateConfig,
        addIntegration,
        injectRoute,
        astroConfig,
        logger,
      }) => {
        // Resolve content/docs directory
        const srcDir = fileURLToPath(astroConfig.srcDir);
        const contentDocsDir = path.join(srcDir, 'content', 'docs');

        // Discover skill files
        let skills: SkillData[] = [];
        try {
          skills = await discoverSkills(contentDocsDir, options);
        } catch (err) {
          logger.warn(
            `Could not scan content directory (${contentDocsDir}): ${String(err)}`,
          );
        }

        if (skills.length === 0) {
          logger.warn(
            'No skills found. Add `skill: true` to the frontmatter of skill pages.',
          );
        } else {
          logger.info(`Found ${skills.length} skill(s).`);
        }

        // Register Astro integration (Vite virtual module + build output)
        addIntegration(starlightSkillsIntegration(options, skills));

        // Inject the catalog page
        injectRoute({
          pattern: options.catalogPath,
          entrypoint: fileURLToPath(new URL('catalog.astro', pagesDir)),
          prerender: true,
        });

        // Add Skills sidebar group if we have skills
        if (skills.length > 0) {
          const skillsGroup = buildSidebarGroup(skills, options.sidebarLabel);
          updateConfig({
            sidebar: [...(config.sidebar ?? []), skillsGroup],
          });
        }
      },
    },
  };
}
