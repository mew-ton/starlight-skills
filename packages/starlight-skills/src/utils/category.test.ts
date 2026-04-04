import { describe, expect, it } from 'vitest';
import { buildCategoryTree, flatCategoryLabel, getCategoryFromPath } from './category.js';

// ---------------------------------------------------------------------------
// getCategoryFromPath
// ---------------------------------------------------------------------------

describe('getCategoryFromPath', () => {
  const docsDir = '/project/src/content/docs';

  it('should return empty string for a file at the docs root', () => {
    expect(getCategoryFromPath(`${docsDir}/index.md`, docsDir)).toBe('');
  });

  it('should return the directory name for a file one level deep', () => {
    expect(getCategoryFromPath(`${docsDir}/guides/intro.md`, docsDir)).toBe('guides');
  });

  it('should return slash-separated path for nested directories', () => {
    expect(getCategoryFromPath(`${docsDir}/guides/frontend/react.md`, docsDir)).toBe(
      'guides/frontend',
    );
  });

  it('should strip locale prefix when locale matches the first segment', () => {
    expect(
      getCategoryFromPath(`${docsDir}/en/guides/frontend/react.md`, docsDir, 'en'),
    ).toBe('guides/frontend');
  });

  it('should not strip locale prefix when locale does not match first segment', () => {
    expect(
      getCategoryFromPath(`${docsDir}/guides/frontend/react.md`, docsDir, 'en'),
    ).toBe('guides/frontend');
  });

  it('should return empty string for a locale-root file (no subdirectory)', () => {
    expect(getCategoryFromPath(`${docsDir}/en/index.md`, docsDir, 'en')).toBe('');
  });

  it('should return single segment for a file one level under the locale prefix', () => {
    expect(getCategoryFromPath(`${docsDir}/ja/guides/intro.md`, docsDir, 'ja')).toBe(
      'guides',
    );
  });
});

// ---------------------------------------------------------------------------
// buildCategoryTree
// ---------------------------------------------------------------------------

describe('buildCategoryTree', () => {
  it('should return empty tree and uncategorised list for empty input', () => {
    const { tree, uncategorised, byCategoryPath } = buildCategoryTree([]);
    expect(tree).toEqual([]);
    expect(uncategorised).toEqual([]);
    expect(byCategoryPath.size).toBe(0);
  });

  it('should place skills with empty category into uncategorised', () => {
    const skills = [
      { name: 'alpha', category: '' },
      { name: 'beta', category: '' },
    ];
    const { uncategorised, tree } = buildCategoryTree(skills);
    expect(uncategorised).toHaveLength(2);
    expect(tree).toHaveLength(0);
  });

  it('should build a flat tree for single-level categories', () => {
    const skills = [
      { name: 'react', category: 'frontend' },
      { name: 'vue', category: 'frontend' },
      { name: 'express', category: 'backend' },
    ];
    const { tree, byCategoryPath } = buildCategoryTree(skills);

    // Tree should have two root nodes sorted alphabetically
    expect(tree.map((n) => n.label)).toEqual(['backend', 'frontend']);

    // byCategoryPath should group correctly
    expect(byCategoryPath.get('frontend')?.map((s) => s.name)).toEqual(['react', 'vue']);
    expect(byCategoryPath.get('backend')?.map((s) => s.name)).toEqual(['express']);
  });

  it('should build a nested tree for multi-level categories', () => {
    const skills = [
      { name: 'react', category: 'frontend/components' },
      { name: 'express', category: 'backend/rest' },
    ];
    const { tree } = buildCategoryTree(skills);

    const frontendNode = tree.find((n) => n.label === 'frontend');
    expect(frontendNode).toBeDefined();
    expect(frontendNode?.children.map((n) => n.label)).toContain('components');

    const backendNode = tree.find((n) => n.label === 'backend');
    expect(backendNode).toBeDefined();
    expect(backendNode?.children.map((n) => n.label)).toContain('rest');
  });

  it('should share intermediate nodes for siblings under the same parent', () => {
    const skills = [
      { name: 'react', category: 'frontend/react' },
      { name: 'vue', category: 'frontend/vue' },
    ];
    const { tree } = buildCategoryTree(skills);

    const frontendNode = tree.find((n) => n.label === 'frontend');
    expect(frontendNode?.children).toHaveLength(2);
    expect(frontendNode?.children.map((n) => n.label).sort()).toEqual(['react', 'vue']);
  });

  it('should sort root nodes alphabetically', () => {
    const skills = [
      { name: 'z', category: 'zzz' },
      { name: 'a', category: 'aaa' },
      { name: 'm', category: 'mmm' },
    ];
    const { tree } = buildCategoryTree(skills);
    expect(tree.map((n) => n.label)).toEqual(['aaa', 'mmm', 'zzz']);
  });

  it('should correctly assign fullPath to leaf category nodes', () => {
    const skills = [{ name: 'react', category: 'frontend/components' }];
    const { tree } = buildCategoryTree(skills);

    const frontendNode = tree.find((n) => n.label === 'frontend');
    const componentsNode = frontendNode?.children.find((n) => n.label === 'components');
    expect(componentsNode?.fullPath).toBe('frontend/components');
  });

  it('should mix categorised and uncategorised skills', () => {
    const skills = [
      { name: 'react', category: 'frontend' },
      { name: 'misc', category: '' },
    ];
    const { tree, uncategorised } = buildCategoryTree(skills);
    expect(tree).toHaveLength(1);
    expect(uncategorised).toHaveLength(1);
    expect(uncategorised[0]?.name).toBe('misc');
  });
});

// ---------------------------------------------------------------------------
// flatCategoryLabel
// ---------------------------------------------------------------------------

describe('flatCategoryLabel', () => {
  it('should return the category string unchanged', () => {
    expect(flatCategoryLabel('development/frontend')).toBe('development/frontend');
    expect(flatCategoryLabel('guides')).toBe('guides');
    expect(flatCategoryLabel('')).toBe('');
  });
});
