import path from 'node:path';

// ---------------------------------------------------------------------------
// Category resolution from file path
// ---------------------------------------------------------------------------

/**
 * Derive a category string from the file's directory path relative to the
 * content/docs root, stripping an optional locale prefix.
 *
 * Example (no i18n):
 *   filePath       = "/project/src/content/docs/skills/frontend/react.md"
 *   contentDocsDir = "/project/src/content/docs"
 *   locale         = undefined
 *   → "skills/frontend"
 *
 * Example (i18n, targetLocale = "en"):
 *   filePath       = "/project/src/content/docs/en/skills/frontend/react.md"
 *   contentDocsDir = "/project/src/content/docs"
 *   locale         = "en"
 *   → "skills/frontend"
 */
export function getCategoryFromPath(
  filePath: string,
  contentDocsDir: string,
  locale?: string,
): string {
  const relative = path.relative(contentDocsDir, filePath);
  // Normalise to forward slashes
  const parts = relative.replace(/\\/g, '/').split('/').filter(Boolean);

  // Remove the filename
  parts.pop();

  // Strip locale prefix if present
  if (locale && parts[0] === locale) {
    parts.shift();
  }

  return parts.join('/');
}

// ---------------------------------------------------------------------------
// Category tree for sidebar / catalog
// ---------------------------------------------------------------------------

export interface CategoryNode {
  /** Segment label for this node. */
  label: string;
  /** Full category path up to this node (e.g. "development/frontend"). */
  fullPath: string;
  children: CategoryNode[];
}

export interface CategorisedSkill<T> {
  skill: T;
  /** Category path segments. Empty array = uncategorised. */
  segments: string[];
}

/**
 * Group skills by category and return a tree of category nodes,
 * along with a flat list of categorised skill entries.
 *
 * Skills with an empty category are uncategorised.
 */
export function buildCategoryTree<T extends { category: string; name: string }>(
  skills: T[],
): { tree: CategoryNode[]; uncategorised: T[]; byCategoryPath: Map<string, T[]> } {
  const uncategorised: T[] = [];
  const byCategoryPath = new Map<string, T[]>();

  for (const skill of skills) {
    if (!skill.category) {
      uncategorised.push(skill);
    } else {
      const existing = byCategoryPath.get(skill.category) ?? [];
      existing.push(skill);
      byCategoryPath.set(skill.category, existing);
    }
  }

  // Build tree from category paths
  const root: CategoryNode[] = [];

  function ensureNode(segments: string[], parent: CategoryNode[]): CategoryNode {
    const [head, ...tail] = segments;
    let node = parent.find((n) => n.label === head);
    if (!node) {
      const fullPath = segments.join('/');
      // Compute fullPath from parent context — simpler to track separately
      node = { label: head!, fullPath, children: [] };
      parent.push(node);
    }
    if (tail.length > 0) {
      return ensureNode(tail, node.children);
    }
    return node;
  }

  // Walk categories in sorted order for deterministic output
  const sortedCategories = [...byCategoryPath.keys()].sort();
  for (const cat of sortedCategories) {
    const segments = cat.split('/').filter(Boolean);
    if (segments.length > 0) {
      const node = ensureNode(segments, root);
      // Assign full path correctly
      node.fullPath = cat;
    }
  }

  return { tree: root, uncategorised, byCategoryPath };
}

/**
 * Flatten a category path into a label for `catalogCategoryDisplay: 'flat'`.
 * "development/frontend" → "development/frontend" (unchanged, used as section label).
 */
export function flatCategoryLabel(category: string): string {
  return category;
}
