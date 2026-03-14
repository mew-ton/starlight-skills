/**
 * Frontmatter fields recognized by starlight-skills.
 * These extend the standard Starlight/Astro frontmatter.
 */
export interface SkillFrontmatter {
  /** Mark this page as a skill. Required to enable skill processing. */
  skill: true;
  /**
   * Explicit skill name (lowercase alphanumeric + hyphens).
   * Derived from `title` when omitted.
   */
  'skill-name'?: string;
  /**
   * Category hierarchy for the skills sidebar and catalog.
   * Use "/" as separator for nested categories (e.g. "development/frontend").
   * Auto-detected from file path when `autoCategoryMode` is enabled.
   */
  'skill-category'?: string;
  /**
   * Glob patterns (relative to this file) for companion files to include
   * in the skill distribution (e.g. "references/*.md", "scripts/*.js").
   */
  subfiles?: string[];
  /** Human-readable description. Used in the catalog table and as the skill description. */
  description?: string;
  /** Page title — fallback source for `skill-name` when omitted. */
  title?: string;

  // --- Optional Agent Skills spec fields forwarded verbatim to SKILL.md ---

  /** License name or reference to a bundled license file (e.g. "MIT", "LICENSE"). */
  'skill-license'?: string;
  /**
   * Environment requirements (max 500 chars).
   * Describe the intended product, required system packages, network access, etc.
   */
  'skill-compatibility'?: string;
  /**
   * Arbitrary key-value metadata forwarded to the output SKILL.md.
   * Values must be strings.
   */
  'skill-metadata'?: Record<string, string>;
  /**
   * Space-delimited list of pre-approved tools (experimental).
   * Example: "Bash(git:*) Bash(jq:*) Read"
   */
  'skill-allowed-tools'?: string;
}

/** Processed, validated skill metadata resolved during configuration. */
export interface SkillData {
  /** Validated skill name (lowercase alphanumeric + hyphens). */
  name: string;
  /** Original title from frontmatter. */
  title: string;
  /** Skill description. */
  description: string;
  /** Optional spec fields forwarded to the output SKILL.md. */
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  allowedTools?: string;
  /**
   * Category string, "/" separated (e.g. "development/frontend").
   * Empty string when uncategorized.
   */
  category: string;
  /** Starlight page URL for this skill (e.g. "/skills/frontend/react-component/"). */
  url: string;
  /** Absolute path to the source markdown file. */
  filePath: string;
  /** Raw file content (including frontmatter) for build-time processing. */
  rawContent: string;
  /** Markdown body without frontmatter. */
  bodyContent: string;
  /** Glob patterns for subfiles, relative to the source file's directory. */
  subfiles: string[];
}

/** Plugin configuration options. */
export interface StarlightSkillsOptions {
  /**
   * How to auto-detect `skill-category` when not set in frontmatter.
   * - `'path'`  — derived from the file's directory path relative to content/docs
   * - `'slug'`  — derived from the URL slug segments
   * - `false`   — disabled; category is only taken from frontmatter
   * @default 'path'
   */
  autoCategoryMode?: 'path' | 'slug' | false;

  /**
   * URL path for the generated skills catalog page.
   * @default '/skills-catalog'
   */
  catalogPath?: string;

  /**
   * Sidebar group label for the Skills section.
   * @default 'Skills'
   */
  sidebarLabel?: string;
}
