import path from 'node:path';

/**
 * Derive a category string from the file's directory path relative to the
 * content/docs root.  The skill's own file name segment is stripped so only
 * the parent directories remain.
 *
 * Example:
 *   filePath      = "/project/src/content/docs/skills/frontend/react.md"
 *   contentDocsDir= "/project/src/content/docs"
 *   → "skills/frontend"
 */
export function getCategoryFromPath(
  filePath: string,
  contentDocsDir: string,
): string {
  const relative = path.relative(contentDocsDir, filePath);
  const parts = relative.split(path.sep).filter(Boolean);
  // Remove the filename
  parts.pop();
  return parts.join('/');
}

/**
 * Derive a category string from a URL slug.
 * Strips the last segment (the skill name itself).
 *
 * Example:
 *   slug = "skills/frontend/react-component"
 *   → "skills/frontend"
 */
export function getCategoryFromSlug(slug: string): string {
  const parts = slug.split('/').filter(Boolean);
  parts.pop();
  return parts.join('/');
}
