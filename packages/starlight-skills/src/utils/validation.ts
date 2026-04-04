import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { AstroError } from 'astro/errors';
import type { ResolvedSkill } from '../types.js';

// ---------------------------------------------------------------------------
// Skill name
// ---------------------------------------------------------------------------

/**
 * Skill name rules (from the Agent Skills specification):
 * - 1–64 characters
 * - Lowercase alphanumeric and hyphens only
 * - Must not start or end with a hyphen
 * - No consecutive hyphens
 */
const SKILL_NAME_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export function isValidSkillName(name: string): boolean {
  return (
    name.length >= 1 && name.length <= 64 && SKILL_NAME_REGEX.test(name) && !name.includes('--')
  );
}

/**
 * Convert an arbitrary title string to a valid skill name.
 * Returns an empty string if the result cannot be made valid.
 */
export function titleToSkillName(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 64);
}

// ---------------------------------------------------------------------------
// Duplicate detection
// ---------------------------------------------------------------------------

/**
 * Throws an AstroError if any two skills share the same name.
 */
export function checkDuplicateSkillNames(skills: Pick<ResolvedSkill, 'name' | 'filePath'>[]): void {
  const seen = new Map<string, string>();
  for (const skill of skills) {
    const existing = seen.get(skill.name);
    if (existing) {
      throw new AstroError(
        `Duplicate skill name "${skill.name}" found in two pages:\n  ${existing}\n  ${skill.filePath}`,
        'Rename one of the skills using the `skill-name` frontmatter field.',
      );
    }
    seen.set(skill.name, skill.filePath);
  }
}

// ---------------------------------------------------------------------------
// Binary file detection
// ---------------------------------------------------------------------------

const BINARY_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'ico',
  'bmp',
  'tiff',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'zip',
  'tar',
  'gz',
  'bz2',
  'xz',
  '7z',
  'rar',
  'mp3',
  'mp4',
  'wav',
  'ogg',
  'mov',
  'avi',
  'mkv',
  'woff',
  'woff2',
  'ttf',
  'otf',
  'eot',
  'exe',
  'dll',
  'so',
  'dylib',
  'pyc',
  'class',
]);

/**
 * Returns true if the file should be treated as binary.
 * Checks extension first, then falls back to null-byte detection.
 */
export function isBinaryFile(absolutePath: string): boolean {
  const ext = absolutePath.split('.').pop()?.toLowerCase() ?? '';
  if (BINARY_EXTENSIONS.has(ext)) return true;

  // Null-byte detection: inspect first 8 KB
  try {
    const buf = readFileSync(absolutePath);
    const sample = buf.slice(0, 8192);
    for (let i = 0; i < sample.length; i++) {
      if (sample[i] === 0) return true;
    }
  } catch {
    // If unreadable, let discovery surface the error
  }
  return false;
}

// ---------------------------------------------------------------------------
// skillsRoot conflict detection
// ---------------------------------------------------------------------------

/**
 * Throws an AstroError if the skillsRoot matches any existing content directory or file.
 */
export function checkSkillsRootConflict(skillsRoot: string, contentDocsDir: string): void {
  const dirConflict = path.join(contentDocsDir, skillsRoot);
  if (existsSync(dirConflict)) {
    throw new AstroError(
      `skillsRoot "${skillsRoot}" conflicts with an existing content directory:\n  ${dirConflict}`,
      'Choose a different `skillsRoot` value in your starlight-skills configuration.',
    );
  }

  for (const ext of ['md', 'mdx']) {
    const fileConflict = path.join(contentDocsDir, `${skillsRoot}.${ext}`);
    if (existsSync(fileConflict)) {
      throw new AstroError(
        `skillsRoot "${skillsRoot}" conflicts with an existing content file:\n  ${fileConflict}`,
        'Choose a different `skillsRoot` value in your starlight-skills configuration.',
      );
    }
  }
}
