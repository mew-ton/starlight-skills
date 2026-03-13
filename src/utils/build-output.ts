import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'glob';
import type { SkillData } from '../types.js';

// ---------------------------------------------------------------------------
// SKILL.md generation
// ---------------------------------------------------------------------------

/**
 * Build a SKILL.md file body conforming to the Agent Skills specification.
 * Only `name` and `description` from the source frontmatter are forwarded;
 * Starlight-specific fields (skill, skill-name, etc.) are stripped.
 */
function buildSkillMarkdown(skill: SkillData): string {
  const lines: string[] = ['---', `name: ${skill.name}`];
  if (skill.description) {
    lines.push(`description: ${JSON.stringify(skill.description)}`);
  }
  if (skill.license) {
    lines.push(`license: ${skill.license}`);
  }
  if (skill.compatibility) {
    lines.push(`compatibility: ${JSON.stringify(skill.compatibility)}`);
  }
  if (skill.allowedTools) {
    lines.push(`allowed-tools: ${skill.allowedTools}`);
  }
  if (skill.metadata && Object.keys(skill.metadata).length > 0) {
    lines.push('metadata:');
    for (const [k, v] of Object.entries(skill.metadata)) {
      lines.push(`  ${k}: ${JSON.stringify(v)}`);
    }
  }
  lines.push('---');
  // Preserve one blank line between frontmatter and body
  const body = skill.bodyContent.startsWith('\n')
    ? skill.bodyContent
    : '\n' + skill.bodyContent;
  lines.push(body);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Subfile helpers
// ---------------------------------------------------------------------------

async function copySubfiles(
  skill: SkillData,
  destDir: string,
): Promise<void> {
  const sourceDir = path.dirname(skill.filePath);
  for (const pattern of skill.subfiles) {
    const matches = await glob(pattern, { cwd: sourceDir, absolute: true });
    for (const src of matches) {
      const rel = path.relative(sourceDir, src);
      const dest = path.join(destDir, rel);
      await mkdir(path.dirname(dest), { recursive: true });
      await copyFile(src, dest);
    }
  }
}

// ---------------------------------------------------------------------------
// index.json  (WellKnownIndex spec — vercel-labs/skills)
// ---------------------------------------------------------------------------

/** Matches the WellKnownSkillEntry interface from vercel-labs/skills. */
interface WellKnownSkillEntry {
  name: string;
  description: string;
  /** Paths of all files in this skill's directory, relative to that directory. */
  files: string[];
}

interface WellKnownIndex {
  skills: WellKnownSkillEntry[];
}

/**
 * Resolve the full set of files that will be written for a skill.
 * Returns paths relative to the skill's own directory (e.g. "SKILL.md",
 * "references/api.md", "scripts/run.js").
 */
async function resolveSkillFiles(skill: SkillData): Promise<string[]> {
  const files: string[] = ['SKILL.md'];
  const sourceDir = path.dirname(skill.filePath);
  for (const pattern of skill.subfiles) {
    const matches = await glob(pattern, { cwd: sourceDir });
    // glob returns paths relative to cwd when absolute is not set
    files.push(...matches.map((m) => m.replace(/\\/g, '/')));
  }
  return files;
}

async function buildIndexJson(skills: SkillData[]): Promise<WellKnownIndex> {
  const entries: WellKnownSkillEntry[] = await Promise.all(
    skills.map(async (s) => ({
      name: s.name,
      description: s.description,
      files: await resolveSkillFiles(s),
    })),
  );
  return { skills: entries };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Write the two output trees produced by starlight-skills after an Astro build:
 *
 * 1. `<dist>/.well-known/skills/` — deployed discovery endpoint
 *    - index.json (skill registry)
 *    - <name>/SKILL.md (spec-compliant skill file)
 *    - <name>/<subfile> (companion files)
 *
 * 2. `<projectRoot>/skills/` — committed to the repository
 *    - <name>/SKILL.md
 *    - <name>/<subfile>
 */
export async function writeBuildOutput(
  skills: SkillData[],
  distDir: string,
  projectRoot: string,
): Promise<void> {
  // 1. .well-known/skills/
  const wellKnownSkillsDir = path.join(distDir, '.well-known', 'skills');
  await mkdir(wellKnownSkillsDir, { recursive: true });

  // index.json
  await writeFile(
    path.join(wellKnownSkillsDir, 'index.json'),
    JSON.stringify(await buildIndexJson(skills), null, 2),
    'utf-8',
  );

  for (const skill of skills) {
    const skillWellKnownDir = path.join(wellKnownSkillsDir, skill.name);
    await mkdir(skillWellKnownDir, { recursive: true });
    await writeFile(
      path.join(skillWellKnownDir, 'SKILL.md'),
      buildSkillMarkdown(skill),
      'utf-8',
    );
    await copySubfiles(skill, skillWellKnownDir);
  }

  // 2. <projectRoot>/skills/
  const projectSkillsDir = path.join(projectRoot, 'skills');
  await mkdir(projectSkillsDir, { recursive: true });

  for (const skill of skills) {
    const skillProjectDir = path.join(projectSkillsDir, skill.name);
    await mkdir(skillProjectDir, { recursive: true });
    await writeFile(
      path.join(skillProjectDir, 'SKILL.md'),
      buildSkillMarkdown(skill),
      'utf-8',
    );
    await copySubfiles(skill, skillProjectDir);
  }
}
