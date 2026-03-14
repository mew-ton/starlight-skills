import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { isValidSkillName, titleToSkillName } from './validation.js';
import { getCategoryFromPath, getCategoryFromSlug } from './category.js';
import type { SkillData, SkillFrontmatter, StarlightSkillsOptions } from '../types.js';

/**
 * Convert a content-docs-relative file path to a Starlight page URL.
 *
 * Example:
 *   relative = "skills/frontend/react-component.md"
 *   → "/skills/frontend/react-component/"
 */
function filePathToUrl(filePath: string, contentDocsDir: string): string {
  const relative = path.relative(contentDocsDir, filePath);
  // Normalise Windows path separators
  const posix = relative.replace(/\\/g, '/');
  // Strip extension
  const withoutExt = posix.replace(/\.(md|mdx)$/, '');
  // "index" files map to their directory
  const slug = withoutExt === 'index' ? '' : withoutExt;
  return `/${slug}/`;
}

/**
 * Scan the content/docs directory for markdown files that have `skill: true`
 * in their frontmatter, parse them, and return validated SkillData objects.
 */
export async function discoverSkills(
  contentDocsDir: string,
  options: StarlightSkillsOptions,
): Promise<SkillData[]> {
  const files = await glob('**/*.{md,mdx}', {
    cwd: contentDocsDir,
    absolute: true,
    ignore: ['**/node_modules/**'],
  });

  const skills: SkillData[] = [];

  for (const filePath of files) {
    const rawContent = await readFile(filePath, 'utf-8');
    const parsed = matter(rawContent);
    const fm = parsed.data as Partial<SkillFrontmatter>;

    if (!fm.skill) continue;

    // --- Resolve skill name ---
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

    // --- Resolve category ---
    let category = fm['skill-category'] ?? '';

    if (!category) {
      const autoCategoryMode = options.autoCategoryMode ?? 'path';
      if (autoCategoryMode === 'path') {
        category = getCategoryFromPath(filePath, contentDocsDir);
      } else if (autoCategoryMode === 'slug') {
        const url = filePathToUrl(filePath, contentDocsDir);
        const slug = url.replace(/^\/|\/$/g, '');
        category = getCategoryFromSlug(slug);
      }
    }

    const url = filePathToUrl(filePath, contentDocsDir);

    skills.push({
      name: skillName,
      title: fm.title ?? skillName,
      description: fm.description ?? '',
      category,
      url,
      filePath,
      rawContent,
      bodyContent: parsed.content,
      subfiles: fm.subfiles ?? [],
      license: fm['skill-license'],
      compatibility: fm['skill-compatibility'],
      metadata: fm['skill-metadata'],
      allowedTools: fm['skill-allowed-tools'],
    });
  }

  return skills;
}
