import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { AstroError } from 'astro/errors';
import { glob } from 'glob';
import matter from 'gray-matter';
import {
  isValidSkillName,
  titleToSkillName,
  checkDuplicateSkillNames,
  isBinaryFile,
} from './validation.js';
import { getCategoryFromPath } from './category.js';
import type {
  ResolvedSkill,
  ResolvedSubfile,
  SkillFrontmatter,
  ResolvedOptions,
} from '../types.js';

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

/**
 * Convert a content-docs-relative file path to a Starlight page URL.
 *
 * Example:
 *   filePath       = "/project/src/content/docs/skills/react.md"
 *   contentDocsDir = "/project/src/content/docs"
 *   → "/skills/react/"
 */
function filePathToSourceUrl(filePath: string, contentDocsDir: string): string {
  const relative = path.relative(contentDocsDir, filePath);
  const posix = relative.replace(/\\/g, '/');
  const withoutExt = posix.replace(/\.(md|mdx)$/, '');
  const slug = withoutExt === 'index' ? '' : withoutExt;
  return `/${slug}/`;
}

// ---------------------------------------------------------------------------
// Subfile resolution
// ---------------------------------------------------------------------------

async function resolveSubfiles(
  patterns: string[],
  skillFilePath: string,
  skillName: string,
  skillPageUrlBase: string,
): Promise<ResolvedSubfile[]> {
  const sourceDir = path.dirname(skillFilePath);
  const result: ResolvedSubfile[] = [];

  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: sourceDir, absolute: true });

    for (const absPath of matches) {
      // Binary check — build error
      if (isBinaryFile(absPath)) {
        throw new AstroError(
          `Binary file found in subfiles of skill "${skillName}":\n  ${absPath}`,
          'Remove the binary file from the `subfiles` glob patterns. Only text files are supported.',
        );
      }

      const relativePath = path.relative(sourceDir, absPath).replace(/\\/g, '/');
      const ext = absPath.split('.').pop()?.toLowerCase() ?? '';
      const content = await readFile(absPath, 'utf-8');
      const viewerUrl = `${skillPageUrlBase}${relativePath}`;

      result.push({ relativePath, absolutePath: absPath, ext, content, viewerUrl });
    }
    // No match → silent skip (per spec)
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main discovery function
// ---------------------------------------------------------------------------

/**
 * Scan the content/docs directory for skill-annotated pages and return
 * fully resolved skill data ready for use in the build.
 */
export async function discoverSkills(
  contentDocsDir: string,
  options: ResolvedOptions,
): Promise<ResolvedSkill[]> {
  const files = await glob('**/*.{md,mdx}', {
    cwd: contentDocsDir,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  const skills: ResolvedSkill[] = [];

  for (const filePath of files) {
    const rawContent = await readFile(filePath, 'utf-8');

    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(rawContent);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      throw new AstroError(
        `Failed to parse frontmatter in:\n  ${filePath}\n\n${detail}`,
        'YAML frontmatter values that contain a colon (e.g. inside backticks) must be quoted.\n' +
          'Example:  description: "Add `skill: true` to the frontmatter."',
      );
    }

    const fm = parsed.data as Partial<SkillFrontmatter>;

    if (!fm.skill) continue;

    // --- Locale filter ---
    if (options.targetLocale) {
      const relative = path.relative(contentDocsDir, filePath).replace(/\\/g, '/');
      const firstSegment = relative.split('/')[0];
      if (firstSegment !== options.targetLocale) continue;
    }

    // --- Skill name ---
    let skillName = fm['skill-name'];
    if (!skillName && fm.title) {
      skillName = titleToSkillName(fm.title);
    }

    if (!skillName || !isValidSkillName(skillName)) {
      console.warn(
        `[starlight-skills] Skipping ${filePath}: ` +
          `missing or invalid skill-name "${skillName}". ` +
          `Names must be lowercase alphanumeric with hyphens (1–64 chars, no leading/trailing/consecutive hyphens).`,
      );
      continue;
    }

    // --- Category ---
    let category = fm['skill-category'] ?? '';
    if (!category && options.autoCategoryMode === 'path') {
      category = getCategoryFromPath(filePath, contentDocsDir, options.targetLocale);
    }

    // --- URLs ---
    const sourceUrl = filePathToSourceUrl(filePath, contentDocsDir);
    const skillPageUrl = `/${options.skillsRoot}/${skillName}/`;

    // --- Subfiles ---
    const subfiles = await resolveSubfiles(
      fm.subfiles ?? [],
      filePath,
      skillName,
      skillPageUrl,
    );

    skills.push({
      name: skillName,
      title: fm.title ?? skillName,
      description: fm.description ?? '',
      category,
      sourceUrl,
      skillPageUrl,
      filePath,
      rawContent,
      bodyContent: parsed.content,
      subfiles,
      license: fm['skill-license'],
      compatibility: fm['skill-compatibility'],
      metadata: fm['skill-metadata'],
      allowedTools: fm['skill-allowed-tools'],
    });
  }

  // Duplicate name check — build error on collision
  checkDuplicateSkillNames(skills);

  return skills;
}
