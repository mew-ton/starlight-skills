import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import type { ResolvedOptions, ResolvedSkill } from './types.js';
import { writeBuildOutput } from './utils/build-output.js';
import { checkSkillsRootConflict } from './utils/validation.js';
import { starlightSkillsVitePlugin } from './vite-plugin.js';

/** Absolute path to the src/components/ directory shipped with this package. */
const pagesDir = new URL('../src/components/', import.meta.url);

function pageEntrypoint(name: string): string {
  return fileURLToPath(new URL(`${name}.astro`, pagesDir));
}

/**
 * Internal Astro integration added by the starlight-skills Starlight plugin.
 *
 * Responsibilities:
 *  - Register the Vite virtual module
 *  - Inject catalog / skill / subfile pages via injectRoute
 *  - Check for skillsRoot conflicts with author content
 *  - Write build output on astro:build:done
 *
 * @param localePrefixes  Non-root locale codes (e.g. ['ja', 'fr']) from
 *   Starlight's `locales` config. Routes are injected for each prefix so that
 *   Starlight's automatic locale-prefixing of sidebar links doesn't produce 404s.
 */
export function starlightSkillsIntegration(
  options: ResolvedOptions,
  skills: ResolvedSkill[],
  localePrefixes: string[] = [],
): AstroIntegration {
  let projectRoot = '';
  let contentDocsDir = '';

  return {
    name: 'starlight-skills-integration',
    hooks: {
      'astro:config:setup': ({ config, updateConfig, injectRoute, logger }) => {
        projectRoot = fileURLToPath(config.root);
        const srcDir = fileURLToPath(config.srcDir);
        contentDocsDir = path.join(srcDir, 'content', 'docs');

        // --- skillsRoot conflict check ---
        checkSkillsRootConflict(options.skillsRoot, contentDocsDir);

        // --- Vite virtual module ---
        updateConfig({
          vite: {
            plugins: [starlightSkillsVitePlugin(skills, options)],
          },
        });

        // --- Route injection ---
        // Inject at the bare root AND under every locale prefix.
        // Starlight automatically prepends the active locale to sidebar links
        // (e.g. /__skills/foo → /ja/__skills/foo), so the locale-prefixed
        // routes must exist to avoid 404s.
        const root = options.skillsRoot;
        const routeRoots = ['', ...localePrefixes].map((lp) => (lp ? `${lp}/${root}` : root));
        const hasSubfiles = skills.some((s) => s.subfiles.length > 0);

        for (const routeRoot of routeRoots) {
          if (options.autoGeneratePages.catalog) {
            injectRoute({
              pattern: `/${routeRoot}`,
              entrypoint: pageEntrypoint('catalog'),
              prerender: true,
            });
          }

          if (options.autoGeneratePages.skill && skills.length > 0) {
            injectRoute({
              pattern: `/${routeRoot}/[skill]`,
              entrypoint: pageEntrypoint('skill'),
              prerender: true,
            });

            if (hasSubfiles) {
              injectRoute({
                pattern: `/${routeRoot}/[skill]/[...subfilePath]`,
                entrypoint: pageEntrypoint('subfile'),
                prerender: true,
              });
            }
          }
        }

        logger.info(`Injecting skill routes under: ${routeRoots.map((r) => `/${r}`).join(', ')}`);
      },

      'astro:build:done': async ({ dir, logger }) => {
        if (skills.length === 0) return;

        const distDir = fileURLToPath(dir);
        logger.info('Writing skills build output…');
        try {
          await writeBuildOutput(skills, options, distDir, projectRoot);
          logger.info(
            `Skills build output written: ${skills.length} skill(s) ` +
              `(mode: ${options.outputMode})`,
          );
        } catch (err) {
          logger.error(`Failed to write skills build output: ${String(err)}`);
          throw err;
        }
      },
    },
  };
}
