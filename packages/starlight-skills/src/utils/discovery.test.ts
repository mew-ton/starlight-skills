import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ResolvedOptions } from '../types.js';
import { discoverSkills } from './discovery.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeOptions(overrides: Partial<ResolvedOptions> = {}): ResolvedOptions {
  return {
    targetLocale: '',
    outputMode: 'both',
    autoGeneratePages: { skill: true, catalog: true },
    skillsRoot: '__skills',
    catalogCategoryDisplay: 'nested',
    autoCategoryMode: 'path',
    sidebarLabel: 'Skills',
    collocatedDir: 'skills',
    ...overrides,
  };
}

function write(dir: string, relPath: string, content: string): string {
  const abs = join(dir, relPath);
  mkdirSync(join(dir, relPath, '..'), { recursive: true });
  writeFileSync(abs, content, 'utf-8');
  return abs;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('discoverSkills', () => {
  let docsDir: string;

  beforeEach(() => {
    docsDir = mkdtempSync(join(tmpdir(), 'starlight-skills-discovery-'));
  });

  afterEach(() => {
    rmSync(docsDir, { recursive: true, force: true });
  });

  it('should return an empty array when no files have skill: true', async () => {
    write(docsDir, 'index.md', '---\ntitle: Home\n---\nHello.');
    const skills = await discoverSkills(docsDir, makeOptions());
    expect(skills).toHaveLength(0);
  });

  it('should discover a valid skill file', async () => {
    write(
      docsDir,
      'my-skill.md',
      '---\nskill: true\ntitle: My Skill\ndescription: "Does something."\n---\nBody.',
    );
    const skills = await discoverSkills(docsDir, makeOptions());
    expect(skills).toHaveLength(1);
    expect(skills[0]?.name).toBe('my-skill');
    expect(skills[0]?.description).toBe('Does something.');
    expect(skills[0]?.bodyContent.trim()).toBe('Body.');
  });

  it('should throw when description is missing', async () => {
    write(docsDir, 'no-desc.md', '---\nskill: true\ntitle: No Desc\n---\nBody.');
    await expect(discoverSkills(docsDir, makeOptions())).rejects.toThrow('description');
  });

  it('should throw when description is blank', async () => {
    write(docsDir, 'blank-desc.md', '---\nskill: true\ntitle: Blank\ndescription: "   "\n---\nBody.');
    await expect(discoverSkills(docsDir, makeOptions())).rejects.toThrow('description');
  });

  it('should use skill-name from frontmatter when provided', async () => {
    write(
      docsDir,
      'override.md',
      '---\nskill: true\ntitle: Override Me\nskill-name: custom-name\ndescription: "Desc."\n---\nBody.',
    );
    const skills = await discoverSkills(docsDir, makeOptions());
    expect(skills[0]?.name).toBe('custom-name');
  });

  it('should throw when frontmatter YAML is invalid', async () => {
    write(
      docsDir,
      'bad-yaml.md',
      '---\nskill: true\ndescription: add `skill: true` here\n---\nBody.',
    );
    await expect(discoverSkills(docsDir, makeOptions())).rejects.toThrow();
  });

  it('should throw on duplicate skill names', async () => {
    write(docsDir, 'a.md', '---\nskill: true\ntitle: Same\ndescription: "First."\n---');
    write(docsDir, 'b.md', '---\nskill: true\ntitle: Same\ndescription: "Second."\n---');
    await expect(discoverSkills(docsDir, makeOptions())).rejects.toThrow('same');
  });

  it('should filter by targetLocale', async () => {
    write(docsDir, 'en/skill-en.md', '---\nskill: true\ntitle: English\ndescription: "EN."\n---');
    write(docsDir, 'ja/skill-ja.md', '---\nskill: true\ntitle: Japanese\ndescription: "JA."\n---');
    const skills = await discoverSkills(docsDir, makeOptions({ targetLocale: 'en' }));
    expect(skills).toHaveLength(1);
    expect(skills[0]?.name).toBe('english');
  });

  it('should derive category from path when autoCategoryMode is path', async () => {
    write(
      docsDir,
      'frontend/react.md',
      '---\nskill: true\ntitle: React\ndescription: "A UI lib."\n---',
    );
    const skills = await discoverSkills(docsDir, makeOptions({ autoCategoryMode: 'path' }));
    expect(skills[0]?.category).toBe('frontend');
  });

  it('should use skill-category from frontmatter over path derivation', async () => {
    write(
      docsDir,
      'frontend/react.md',
      '---\nskill: true\ntitle: React\ndescription: "A UI lib."\nskill-category: ui/components\n---',
    );
    const skills = await discoverSkills(docsDir, makeOptions({ autoCategoryMode: 'path' }));
    expect(skills[0]?.category).toBe('ui/components');
  });
});
