import type { Plugin } from 'vite';
import type { SkillData } from './types.js';

export const VIRTUAL_MODULE_ID = 'virtual:starlight-skills/data';
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID;

/**
 * Vite plugin that provides the `virtual:starlight-skills/data` module.
 * Pages injected by starlight-skills import from this virtual module to access
 * the list of skills discovered at build time.
 */
export function starlightSkillsVitePlugin(skills: SkillData[]): Plugin {
  // Serialise once; skills are resolved at Astro config time.
  const moduleCode = `export const skills = ${JSON.stringify(skills, null, 2)};`;

  return {
    name: 'vite-plugin-starlight-skills',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) return moduleCode;
    },
  };
}
