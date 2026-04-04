/**
 * Type declarations for the virtual module exposed by the starlight-skills
 * Vite plugin. Add this file to the `types` or `typeRoots` in your project's
 * tsconfig.json if you import from the virtual module in custom page components.
 *
 * Example tsconfig.json:
 *   { "compilerOptions": { "types": ["starlight-skills/virtual"] } }
 */
declare module 'virtual:starlight-skills/data' {
  import type { SkillData, ResolvedOptions } from 'starlight-skills';

  /** All skills discovered in the Starlight project (resolved at build time). */
  export const skills: SkillData[];

  /** Resolved plugin options (with all defaults applied). */
  export const options: ResolvedOptions;
}
