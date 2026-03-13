import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { starlightSkillsVitePlugin } from './vite-plugin.js';
import { writeBuildOutput } from './utils/build-output.js';
import type { SkillData, StarlightSkillsOptions } from './types.js';

/**
 * Internal Astro integration added by the starlight-skills plugin.
 * Handles:
 *  - Registering the Vite virtual module for page components
 *  - Writing .well-known/skills/ and /skills/ after a production build
 */
export function starlightSkillsIntegration(
  _options: StarlightSkillsOptions,
  skills: SkillData[],
): AstroIntegration {
  let projectRoot = '';

  return {
    name: 'starlight-skills-integration',
    hooks: {
      'astro:config:setup': ({ config, updateConfig }) => {
        projectRoot = fileURLToPath(config.root);
        updateConfig({
          vite: {
            plugins: [starlightSkillsVitePlugin(skills)],
          },
        });
      },

      'astro:build:done': async ({ dir, logger }) => {
        if (skills.length === 0) return;

        const distDir = fileURLToPath(dir);
        logger.info('Writing skills build output…');
        try {
          await writeBuildOutput(skills, distDir, projectRoot);
          logger.info(
            `Skills build output written: ${skills.length} skill(s) → dist/.well-known/skills/ and skills/`,
          );
        } catch (err) {
          logger.error(`Failed to write skills build output: ${String(err)}`);
        }
      },
    },
  };
}
