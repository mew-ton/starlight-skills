import type { Plugin } from 'vite';
import type { ResolvedSkill, SkillData, ResolvedOptions } from './types.js';

export const VIRTUAL_MODULE_ID = 'virtual:starlight-skills/data';
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID;

/**
 * Map internal ResolvedSkill to the public SkillData shape,
 * stripping absolute file paths and raw source content.
 */
function toSkillData(skill: ResolvedSkill): SkillData {
  return {
    name: skill.name,
    title: skill.title,
    description: skill.description,
    category: skill.category,
    sourceUrl: skill.sourceUrl,
    skillPageUrl: skill.skillPageUrl,
    bodyContent: skill.bodyContent,
    subfiles: skill.subfiles.map((sf) => ({
      relativePath: sf.relativePath,
      ext: sf.ext,
      content: sf.content,
      viewerUrl: sf.viewerUrl,
    })),
    license: skill.license,
    compatibility: skill.compatibility,
    metadata: skill.metadata,
    allowedTools: skill.allowedTools,
  };
}

/**
 * Vite plugin that provides `virtual:starlight-skills/data`.
 *
 * Exposes:
 *   export const skills: SkillData[]
 *   export const options: ResolvedOptions
 */
export function starlightSkillsVitePlugin(
  skills: ResolvedSkill[],
  options: ResolvedOptions,
): Plugin {
  const skillData: SkillData[] = skills.map(toSkillData);

  const moduleCode = [
    `export const skills = ${JSON.stringify(skillData, null, 2)};`,
    `export const options = ${JSON.stringify(options, null, 2)};`,
  ].join('\n');

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
