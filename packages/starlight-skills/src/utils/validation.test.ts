import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  checkDuplicateSkillNames,
  checkSkillsRootConflict,
  isBinaryFile,
  isValidSkillName,
  titleToSkillName,
} from './validation.js';

// ---------------------------------------------------------------------------
// isValidSkillName
// ---------------------------------------------------------------------------

describe('isValidSkillName', () => {
  it('should accept single lowercase letter', () => {
    expect(isValidSkillName('a')).toBe(true);
  });

  it('should accept single digit', () => {
    expect(isValidSkillName('1')).toBe(true);
  });

  it('should accept lowercase alphanumeric with hyphens', () => {
    expect(isValidSkillName('hello-world')).toBe(true);
    expect(isValidSkillName('react-18')).toBe(true);
    expect(isValidSkillName('my-awesome-skill')).toBe(true);
  });

  it('should accept 64-character name', () => {
    expect(isValidSkillName('a'.repeat(64))).toBe(true);
  });

  it('should reject empty string', () => {
    expect(isValidSkillName('')).toBe(false);
  });

  it('should reject name longer than 64 characters', () => {
    expect(isValidSkillName('a'.repeat(65))).toBe(false);
  });

  it('should reject uppercase letters', () => {
    expect(isValidSkillName('Hello')).toBe(false);
    expect(isValidSkillName('HELLO')).toBe(false);
  });

  it('should reject leading hyphen', () => {
    expect(isValidSkillName('-hello')).toBe(false);
  });

  it('should reject trailing hyphen', () => {
    expect(isValidSkillName('hello-')).toBe(false);
  });

  it('should reject consecutive hyphens', () => {
    expect(isValidSkillName('hello--world')).toBe(false);
  });

  it('should reject spaces', () => {
    expect(isValidSkillName('hello world')).toBe(false);
  });

  it('should reject underscores', () => {
    expect(isValidSkillName('hello_world')).toBe(false);
  });

  it('should reject dots', () => {
    expect(isValidSkillName('hello.world')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// titleToSkillName
// ---------------------------------------------------------------------------

describe('titleToSkillName', () => {
  it('should lowercase and hyphenate words', () => {
    expect(titleToSkillName('Hello World')).toBe('hello-world');
  });

  it('should replace non-alphanumeric sequences with a single hyphen', () => {
    expect(titleToSkillName('React & Redux!')).toBe('react-redux');
  });

  it('should collapse multiple hyphens', () => {
    expect(titleToSkillName('a -- b')).toBe('a-b');
  });

  it('should strip leading and trailing hyphens', () => {
    expect(titleToSkillName('  Leading Trailing  ')).toBe('leading-trailing');
  });

  it('should truncate to 64 characters', () => {
    const long = 'word '.repeat(20); // 100 chars after conversion
    expect(titleToSkillName(long).length).toBeLessThanOrEqual(64);
  });

  it('should return empty string for titles that produce no valid chars', () => {
    expect(titleToSkillName('!!!')).toBe('');
  });

  it('should handle Japanese or mixed characters by stripping them', () => {
    expect(titleToSkillName('React コンポーネント')).toBe('react');
  });
});

// ---------------------------------------------------------------------------
// checkDuplicateSkillNames
// ---------------------------------------------------------------------------

describe('checkDuplicateSkillNames', () => {
  it('should not throw when all names are unique', () => {
    const skills = [
      { name: 'foo', filePath: '/a/foo.md' },
      { name: 'bar', filePath: '/a/bar.md' },
    ];
    expect(() => checkDuplicateSkillNames(skills)).not.toThrow();
  });

  it('should throw when two skills share the same name', () => {
    const skills = [
      { name: 'foo', filePath: '/a/foo.md' },
      { name: 'foo', filePath: '/b/foo.md' },
    ];
    expect(() => checkDuplicateSkillNames(skills)).toThrow('foo');
  });

  it('should include both file paths in the error message', () => {
    const skills = [
      { name: 'dup', filePath: '/a/dup.md' },
      { name: 'dup', filePath: '/b/dup.md' },
    ];
    expect(() => checkDuplicateSkillNames(skills)).toThrow('/a/dup.md');
    expect(() => checkDuplicateSkillNames(skills)).toThrow('/b/dup.md');
  });

  it('should handle an empty list without throwing', () => {
    expect(() => checkDuplicateSkillNames([])).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// isBinaryFile
// ---------------------------------------------------------------------------

describe('isBinaryFile', () => {
  describe('extension-based detection', () => {
    it.each(['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'zip', 'mp4', 'woff2'])(
      'should return true for .%s files',
      (ext) => {
        expect(isBinaryFile(`/fake/file.${ext}`)).toBe(true);
      },
    );

    it.each(['ts', 'js', 'md', 'mdx', 'json', 'txt', 'css', 'html'])(
      'should return false for .%s files (extension)',
      (ext) => {
        // File does not exist → readFileSync throws → returns false
        expect(isBinaryFile(`/nonexistent/file.${ext}`)).toBe(false);
      },
    );
  });

  describe('null-byte detection', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = mkdtempSync(join(tmpdir(), 'starlight-skills-isBinaryFile-'));
    });

    afterEach(() => {
      rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should return true for a file containing a null byte', () => {
      const filePath = join(tmpDir, 'nullbyte.bin');
      const buf = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x77, 0x6f, 0x72, 0x6c, 0x64]);
      writeFileSync(filePath, buf);
      expect(isBinaryFile(filePath)).toBe(true);
    });

    it('should return false for a plain text file', () => {
      const filePath = join(tmpDir, 'text.data');
      writeFileSync(filePath, 'just some text content\nno null bytes here\n');
      expect(isBinaryFile(filePath)).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// checkSkillsRootConflict
// ---------------------------------------------------------------------------

describe('checkSkillsRootConflict', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'starlight-skills-conflict-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should not throw when skillsRoot does not conflict', () => {
    expect(() => checkSkillsRootConflict('__skills', tmpDir)).not.toThrow();
  });

  it('should throw when a directory with the skillsRoot name exists', () => {
    mkdirSync(join(tmpDir, '__skills'));
    expect(() => checkSkillsRootConflict('__skills', tmpDir)).toThrow('__skills');
  });

  it('should throw when a .md file with the skillsRoot name exists', () => {
    writeFileSync(join(tmpDir, '__skills.md'), '');
    expect(() => checkSkillsRootConflict('__skills', tmpDir)).toThrow('__skills');
  });

  it('should throw when a .mdx file with the skillsRoot name exists', () => {
    writeFileSync(join(tmpDir, '__skills.mdx'), '');
    expect(() => checkSkillsRootConflict('__skills', tmpDir)).toThrow('__skills');
  });
});
