import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ResolvedOptions, ResolvedSkill } from '../types.js';
import { writeBuildOutput } from './build-output.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeSkill(overrides: Partial<ResolvedSkill> = {}): ResolvedSkill {
  return {
    name: 'my-skill',
    title: 'My Skill',
    description: 'A test skill.',
    category: 'testing',
    sourceUrl: '/guides/my-skill/',
    skillPageUrl: '/__skills/my-skill/',
    filePath: '/project/src/content/docs/guides/my-skill.md',
    rawContent: '---\nskill: true\ntitle: My Skill\n---\nBody text.',
    bodyContent: 'Body text.',
    subfiles: [],
    ...overrides,
  };
}

function makeOptions(overrides: Partial<ResolvedOptions> = {}): ResolvedOptions {
  return {
    targetLocale: '',
    outputMode: 'collocated',
    autoGeneratePages: { skill: true, catalog: true },
    skillsRoot: '__skills',
    catalogCategoryDisplay: 'nested',
    autoCategoryMode: 'path',
    sidebarLabel: 'Skills',
    collocatedDir: 'skills',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readText(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('writeBuildOutput', () => {
  let distDir: string;
  let projectDir: string;

  beforeEach(() => {
    distDir = mkdtempSync(join(tmpdir(), 'starlight-skills-dist-'));
    projectDir = mkdtempSync(join(tmpdir(), 'starlight-skills-project-'));
  });

  afterEach(() => {
    rmSync(distDir, { recursive: true, force: true });
    rmSync(projectDir, { recursive: true, force: true });
  });

  it('should produce no output for an empty skills list', async () => {
    await expect(writeBuildOutput([], makeOptions(), distDir, projectDir)).resolves.toBeUndefined();
  });

  describe('collocated mode', () => {
    it('should write SKILL.md under <collocatedDir>/<name>/', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'collocated' }),
        distDir,
        projectDir,
      );

      const skillMd = readText(join(projectDir, 'skills', 'my-skill', 'SKILL.md'));
      expect(skillMd).toContain('name: my-skill');
    });

    it('should include description in the SKILL.md frontmatter', async () => {
      const skill = makeSkill({ description: 'A test skill.' });
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'collocated' }),
        distDir,
        projectDir,
      );

      const skillMd = readText(join(projectDir, 'skills', 'my-skill', 'SKILL.md'));
      expect(skillMd).toContain('"A test skill."');
    });

    it('should include body content after the frontmatter', async () => {
      const skill = makeSkill({ bodyContent: 'Do the thing.\n' });
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'collocated' }),
        distDir,
        projectDir,
      );

      const skillMd = readText(join(projectDir, 'skills', 'my-skill', 'SKILL.md'));
      expect(skillMd).toContain('Do the thing.');
    });

    it('should respect a custom collocatedDir relative to projectRoot', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'collocated', collocatedDir: 'custom/output' }),
        distDir,
        projectDir,
      );

      const skillMd = readText(join(projectDir, 'custom', 'output', 'my-skill', 'SKILL.md'));
      expect(skillMd).toContain('name: my-skill');
    });

    it('should not create .well-known in dist', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'collocated' }),
        distDir,
        projectDir,
      );

      expect(() => readText(join(distDir, '.well-known', 'skills', 'index.json'))).toThrow();
    });

    it('should write multiple skills', async () => {
      const skills = [makeSkill({ name: 'skill-a' }), makeSkill({ name: 'skill-b' })];
      await writeBuildOutput(
        [...skills],
        makeOptions({ outputMode: 'collocated' }),
        distDir,
        projectDir,
      );

      expect(readText(join(projectDir, 'skills', 'skill-a', 'SKILL.md'))).toContain(
        'name: skill-a',
      );
      expect(readText(join(projectDir, 'skills', 'skill-b', 'SKILL.md'))).toContain(
        'name: skill-b',
      );
    });

    it('should include optional fields when present', async () => {
      const skill = makeSkill({
        license: 'MIT',
        compatibility: 'Node.js >= 18',
        allowedTools: 'Bash Read',
        metadata: { version: '1.0' },
      });
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'collocated' }),
        distDir,
        projectDir,
      );

      const skillMd = readText(join(projectDir, 'skills', 'my-skill', 'SKILL.md'));
      expect(skillMd).toContain('license: MIT');
      expect(skillMd).toContain('compatibility:');
      expect(skillMd).toContain('allowed-tools: Bash Read');
      expect(skillMd).toContain('version:');
    });
  });

  describe('well-known-endpoint mode', () => {
    it('should write index.json under dist/.well-known/skills/', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'well-known-endpoint' }),
        distDir,
        projectDir,
      );

      const raw = readText(join(distDir, '.well-known', 'skills', 'index.json'));
      const index = JSON.parse(raw) as { skills: Array<{ name: string }> };
      expect(index.skills).toHaveLength(1);
      expect(index.skills[0]?.name).toBe('my-skill');
    });

    it('should list SKILL.md in the index.json files array', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'well-known-endpoint' }),
        distDir,
        projectDir,
      );

      const raw = readText(join(distDir, '.well-known', 'skills', 'index.json'));
      const index = JSON.parse(raw) as { skills: Array<{ files: string[] }> };
      expect(index.skills[0]?.files).toContain('SKILL.md');
    });

    it('should write SKILL.md under dist/.well-known/skills/<name>/', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'well-known-endpoint' }),
        distDir,
        projectDir,
      );

      const skillMd = readText(join(distDir, '.well-known', 'skills', 'my-skill', 'SKILL.md'));
      expect(skillMd).toContain('name: my-skill');
    });

    it('should not create collocated skills dir', async () => {
      const skill = makeSkill();
      await writeBuildOutput(
        [skill],
        makeOptions({ outputMode: 'well-known-endpoint' }),
        distDir,
        projectDir,
      );

      expect(() => readText(join(projectDir, 'skills', 'my-skill', 'SKILL.md'))).toThrow();
    });
  });

  describe('both mode', () => {
    it('should write both collocated and well-known outputs', async () => {
      const skill = makeSkill();
      await writeBuildOutput([skill], makeOptions({ outputMode: 'both' }), distDir, projectDir);

      expect(readText(join(projectDir, 'skills', 'my-skill', 'SKILL.md'))).toContain(
        'name: my-skill',
      );
      expect(readText(join(distDir, '.well-known', 'skills', 'my-skill', 'SKILL.md'))).toContain(
        'name: my-skill',
      );
    });
  });
});
