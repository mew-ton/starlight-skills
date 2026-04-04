import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types';
import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from 'astro';
import { starlightSkillsIntegration } from './integration.js';
import type { ResolvedOptions, ResolvedSkill, StarlightSkillsOptions } from './types.js';
import { discoverSkills } from './utils/discovery.js';

export type {
  ResolvedOptions,
  SkillData,
  SkillFrontmatter,
  StarlightSkillsOptions,
} from './types.js';

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULTS: ResolvedOptions = {
  targetLocale: '',
  outputMode: 'both',
  autoGeneratePages: { skill: true, catalog: true },
  skillsRoot: '__skills',
  catalogCategoryDisplay: 'nested',
  autoCategoryMode: 'path',
  sidebarLabel: 'Skills',
  collocatedDir: 'skills',
};

function resolveOptions(userOptions: StarlightSkillsOptions): ResolvedOptions {
  return {
    ...DEFAULTS,
    ...userOptions,
    autoGeneratePages: {
      ...DEFAULTS.autoGeneratePages,
      ...userOptions.autoGeneratePages,
    },
  };
}

// ---------------------------------------------------------------------------
// Sidebar helpers
// ---------------------------------------------------------------------------

type SidebarItem =
  | { label: string; link: string }
  | { label: string; items: SidebarItem[]; collapsed?: boolean };

function buildSidebarItems(skills: ResolvedSkill[], options: ResolvedOptions): SidebarItem[] {
  const useSkillPage = options.autoGeneratePages.skill;

  const linkFor = (skill: ResolvedSkill): SidebarItem => ({
    label: skill.name,
    link: useSkillPage ? skill.skillPageUrl : skill.sourceUrl,
  });

  // Group by category
  const byCategory = new Map<string, ResolvedSkill[]>();
  const uncategorised: ResolvedSkill[] = [];

  for (const skill of skills) {
    if (!skill.category) {
      uncategorised.push(skill);
    } else {
      const arr = byCategory.get(skill.category) ?? [];
      arr.push(skill);
      byCategory.set(skill.category, arr);
    }
  }

  const items: SidebarItem[] = [];

  // Build nested category tree
  const catMap = new Map<string, SidebarItem & { items: SidebarItem[] }>();

  const ensureCatItem = (cat: string): SidebarItem & { items: SidebarItem[] } => {
    if (catMap.has(cat)) return catMap.get(cat)!;
    const segments = cat.split('/');
    const label = segments[segments.length - 1]!;
    const node: SidebarItem & { items: SidebarItem[] } = {
      label,
      items: [],
      collapsed: true,
    };
    catMap.set(cat, node);

    if (segments.length > 1) {
      const parentCat = segments.slice(0, -1).join('/');
      const parent = ensureCatItem(parentCat);
      parent.items.push(node);
    } else {
      items.push(node);
    }
    return node;
  };

  for (const [cat, catSkills] of [...byCategory.entries()].sort()) {
    const catItem = ensureCatItem(cat);
    for (const skill of catSkills) {
      catItem.items.push(linkFor(skill));
    }
  }

  // Uncategorised go directly under the root group
  for (const skill of uncategorised) {
    items.push(linkFor(skill));
  }

  return items;
}

function buildSidebarGroup(
  skills: ResolvedSkill[],
  options: ResolvedOptions,
): { label: string; items: SidebarItem[] } {
  return {
    label: options.sidebarLabel,
    items: buildSidebarItems(skills, options),
  };
}

// ---------------------------------------------------------------------------
// Plugin hook parameter type
// ---------------------------------------------------------------------------

interface ConfigSetupParameter {
  config: StarlightUserConfig;
  updateConfig: (newConfig: Partial<StarlightUserConfig>) => void;
  addIntegration: (integration: AstroIntegration) => void;
  astroConfig: AstroConfig;
  command: 'dev' | 'build' | 'preview';
  isRestart: boolean;
  logger: AstroIntegrationLogger;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

/**
 * `starlight-skills` — Starlight plugin
 *
 * Recognises `skill: true` pages in `src/content/docs` and:
 *  - Adds a Skills sidebar group
 *  - Generates a catalog page at `/<skillsRoot>/`
 *  - Generates individual skill pages at `/<skillsRoot>/<name>`
 *  - Writes Agent Skills–compliant output at build time
 */
export default function starlightSkills(userOptions: StarlightSkillsOptions = {}): StarlightPlugin {
  const options = resolveOptions(userOptions);

  return {
    name: 'starlight-skills',
    hooks: {
      'config:setup': async ({
        config,
        updateConfig,
        addIntegration,
        astroConfig,
        logger,
      }: ConfigSetupParameter) => {
        const srcDir = fileURLToPath(astroConfig.srcDir);
        const contentDocsDir = path.join(srcDir, 'content', 'docs');

        // Discover skills
        let skills: ResolvedSkill[] = [];
        skills = await discoverSkills(contentDocsDir, options);

        if (skills.length === 0) {
          logger.warn('No skills found. Add `skill: true` to the frontmatter of skill pages.');
        } else {
          logger.info(`Found ${skills.length} skill(s).`);
        }

        // Collect non-root locale prefixes so the integration can inject
        // locale-prefixed routes (e.g. /ja/__skills/...) alongside the bare
        // root routes. Starlight auto-prefixes sidebar links with the active
        // locale, so those paths must exist to avoid 404s.
        const localePrefixes = Object.keys(config.locales ?? {}).filter((k) => k !== 'root');

        // Register Astro integration (routes, virtual module, build output)
        addIntegration(starlightSkillsIntegration(options, skills, localePrefixes));

        // Add Skills sidebar group
        if (skills.length > 0) {
          const skillsGroup = buildSidebarGroup(skills, options);
          updateConfig({
            sidebar: [...(config.sidebar ?? []), skillsGroup],
          });
        }
      },
    },
  } satisfies StarlightPlugin;
}
