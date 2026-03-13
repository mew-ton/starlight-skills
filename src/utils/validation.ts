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
    name.length >= 1 &&
    name.length <= 64 &&
    SKILL_NAME_REGEX.test(name) &&
    !name.includes('--')
  );
}

/**
 * Convert an arbitrary title string to a valid skill name.
 * Returns an empty string if the result cannot be made valid.
 */
export function titleToSkillName(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Collapse consecutive hyphens that may have formed
  const cleaned = slug.replace(/-{2,}/g, '-');
  return cleaned.slice(0, 64);
}
