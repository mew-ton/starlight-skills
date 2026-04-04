// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

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

  // --- Agent Skills spec fields forwarded verbatim to SKILL.md ---

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
   * Space-delimited list of pre-approved tools.
   * Example: "Bash(git:*) Bash(jq:*) Read"
   */
  'skill-allowed-tools'?: string;
}

// ---------------------------------------------------------------------------
// Internal resolved skill (used at build time, not exposed via virtual module)
// ---------------------------------------------------------------------------

/** Resolved companion file entry. */
export interface ResolvedSubfile {
  /** Relative path from the skill's source directory (e.g. "references/api.md"). */
  relativePath: string;
  /** Absolute path to the source file. */
  absolutePath: string;
  /** File extension without leading dot (e.g. "md", "ts"). */
  ext: string;
  /** UTF-8 text content of the file. */
  content: string;
}

/** Full skill data retained internally throughout the build process. */
export interface ResolvedSkill {
  /** Validated skill name. */
  name: string;
  /** Original title from frontmatter. */
  title: string;
  /** Skill description. */
  description: string;
  /** Category string, "/" separated. Empty string when uncategorized. */
  category: string;
  /** Starlight page URL for the original authored page (e.g. "/guides/react/"). */
  sourceUrl: string;
  /** Generated skill page URL (e.g. "/__skills/react/"). */
  skillPageUrl: string;
  /** Absolute path to the source markdown file. */
  filePath: string;
  /** Raw file content including frontmatter — for SKILL.md generation only. */
  rawContent: string;
  /** Markdown body without frontmatter — rendered on skill pages. */
  bodyContent: string;
  /** Resolved companion files. */
  subfiles: ResolvedSubfile[];
  /** Optional spec fields forwarded to SKILL.md. */
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  allowedTools?: string;
}

// ---------------------------------------------------------------------------
// Public skill data (exposed via virtual module, safe for client bundles)
// ---------------------------------------------------------------------------

/**
 * Skill data exposed to page components via `virtual:starlight-skills/data`.
 * Excludes absolute file paths and raw source content.
 */
export interface SkillData {
  name: string;
  title: string;
  description: string;
  category: string;
  /** URL of the original authored documentation page. */
  sourceUrl: string;
  /** URL of the generated skill page (under skillsRoot). */
  skillPageUrl: string;
  /** Markdown body content, for rendering on the skill page. */
  bodyContent: string;
  /** Companion file metadata (no absolute paths). */
  subfiles: Array<{
    relativePath: string;
    ext: string;
    content: string;
    /** Viewer page URL under the skill page. */
    viewerUrl: string;
  }>;
  license?: string;
  compatibility?: string;
  metadata?: Record<string, string>;
  allowedTools?: string;
}

// ---------------------------------------------------------------------------
// Plugin options
// ---------------------------------------------------------------------------

export interface StarlightSkillsOptions {
  /**
   * Target locale for skill discovery when Starlight i18n is enabled.
   * Only pages under this locale's content directory are processed.
   * Defaults to the Starlight default locale.
   */
  targetLocale?: string;

  /**
   * Where to write skill files at build time.
   * - `'well-known-endpoint'` — `dist/.well-known/skills/` only (HTTP discovery)
   * - `'collocated'`          — `<projectRoot>/skills/` only (VCS-friendly)
   * - `'both'`                — both outputs
   * @default 'both'
   */
  outputMode?: 'well-known-endpoint' | 'collocated' | 'both';

  /**
   * Controls which pages the plugin generates.
   * @default { skill: true, catalog: true }
   */
  autoGeneratePages?: {
    /** Generate a dedicated skill page at `/<skillsRoot>/<skill-name>`. */
    skill?: boolean;
    /** Generate the skills catalog page at `/<skillsRoot>/`. */
    catalog?: boolean;
  };

  /**
   * Base URL path for all plugin-generated pages.
   * Must not conflict with existing content pages.
   * @default '__skills'
   */
  skillsRoot?: string;

  /**
   * How hierarchical categories are displayed in the catalog.
   * - `'nested'` — nest sub-categories under their parent section
   * - `'flat'`   — show full category path as a flat section label
   * @default 'nested'
   */
  catalogCategoryDisplay?: 'nested' | 'flat';

  /**
   * How to auto-detect `skill-category` when not set in frontmatter.
   * - `'path'` — derived from file's directory path relative to content root
   * - `false`  — disabled; category is taken from frontmatter only
   * @default 'path'
   */
  autoCategoryMode?: 'path' | false;

  /**
   * Sidebar group label for the Skills section.
   * @default 'Skills'
   */
  sidebarLabel?: string;

  /**
   * Output directory for `collocated` (and `both`) output mode.
   * Accepts a path relative to the Astro project root, or an absolute path.
   * Useful in monorepos where the project root is not the repository root.
   * @example '../../skills'   // two levels up from the Astro package
   * @default 'skills'
   */
  collocatedDir?: string;
}

/** Fully resolved options with all defaults applied. */
export type ResolvedOptions = Required<StarlightSkillsOptions> & {
  autoGeneratePages: Required<NonNullable<StarlightSkillsOptions['autoGeneratePages']>>;
};
