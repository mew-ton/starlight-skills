import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ResolvedSkill, ResolvedOptions } from '../types.js';

// ---------------------------------------------------------------------------
// SKILL.md generation
// ---------------------------------------------------------------------------

/**
 * Build a SKILL.md file conforming to the Agent Skills specification.
 * Only skill-relevant frontmatter fields are forwarded; Starlight-specific
 * fields (skill, skill-name, title, skill-category, subfiles, etc.) are stripped.
 */
function buildSkillMarkdown(skill: ResolvedSkill): string {
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

  // Ensure a blank line between frontmatter and body
  const body = skill.bodyContent.startsWith('\n')
    ? skill.bodyContent
    : '\n' + skill.bodyContent;
  lines.push(body);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Subfile copying
// ---------------------------------------------------------------------------

async function copySubfiles(skill: ResolvedSkill, destDir: string): Promise<void> {
  for (const subfile of skill.subfiles) {
    const dest = path.join(destDir, subfile.relativePath);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(subfile.absolutePath, dest);
  }
}

// ---------------------------------------------------------------------------
// index.json
// ---------------------------------------------------------------------------

interface WellKnownSkillEntry {
  name: string;
  description: string;
  files: string[];
}

interface WellKnownIndex {
  skills: WellKnownSkillEntry[];
}

function buildIndexJson(skills: ResolvedSkill[]): WellKnownIndex {
  return {
    skills: skills.map((s) => ({
      name: s.name,
      description: s.description,
      files: ['SKILL.md', ...s.subfiles.map((f) => f.relativePath)],
    })),
  };
}

// ---------------------------------------------------------------------------
// well-known-endpoint output
// ---------------------------------------------------------------------------

async function writeWellKnown(skills: ResolvedSkill[], distDir: string): Promise<void> {
  const wellKnownDir = path.join(distDir, '.well-known', 'skills');
  await mkdir(wellKnownDir, { recursive: true });

  // index.json
  await writeFile(
    path.join(wellKnownDir, 'index.json'),
    JSON.stringify(buildIndexJson(skills), null, 2),
    'utf-8',
  );

  for (const skill of skills) {
    const skillDir = path.join(wellKnownDir, skill.name);
    await mkdir(skillDir, { recursive: true });
    await writeFile(path.join(skillDir, 'SKILL.md'), buildSkillMarkdown(skill), 'utf-8');
    await copySubfiles(skill, skillDir);
  }
}

// ---------------------------------------------------------------------------
// collocated output
// ---------------------------------------------------------------------------

async function writeCollocated(
  skills: ResolvedSkill[],
  projectRoot: string,
  collocatedDir: string,
): Promise<void> {
  // Resolve relative paths against the Astro project root; absolute paths pass through as-is.
  const skillsDir = path.resolve(projectRoot, collocatedDir);
  await mkdir(skillsDir, { recursive: true });

  for (const skill of skills) {
    const skillDir = path.join(skillsDir, skill.name);
    await mkdir(skillDir, { recursive: true });
    await writeFile(path.join(skillDir, 'SKILL.md'), buildSkillMarkdown(skill), 'utf-8');
    await copySubfiles(skill, skillDir);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function writeBuildOutput(
  skills: ResolvedSkill[],
  options: ResolvedOptions,
  distDir: string,
  projectRoot: string,
): Promise<void> {
  if (skills.length === 0) return;

  const { outputMode } = options;

  if (outputMode === 'well-known-endpoint' || outputMode === 'both') {
    await writeWellKnown(skills, distDir);
  }
  if (outputMode === 'collocated' || outputMode === 'both') {
    await writeCollocated(skills, projectRoot, options.collocatedDir);
  }
}
