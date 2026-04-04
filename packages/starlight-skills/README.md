# starlight-skills

A [Starlight](https://starlight.astro.build/) plugin that turns your documentation into AI-installable skills.

Document once — ship to humans **and** AI agents.

```bash
npx skills add <your-github-repo>
```

---

## Installation

```bash
npm install starlight-skills
```

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSkills from 'starlight-skills';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        starlightSkills({
          // optional — see Options below
        }),
      ],
    }),
  ],
});
```

---

## Marking a page as a skill

Add `skill: true` to the frontmatter of any documentation page:

```md
---
title: React Component Guidelines
description: Rules and best practices for creating new React components.
skill: true
skill-name: react-components           # optional — derived from title if omitted
skill-category: development/frontend   # optional — auto-detected from file path
subfiles:
  - schemas/component.json             # companion files bundled with this skill
---

Your skill body goes here…
```

### Frontmatter reference

| Field | Required | Description |
|---|---|---|
| `skill` | **Yes** | Set to `true` to mark this page as a skill. |
| `description` | **Yes** | Human-readable summary. Used in the catalog and the exported skill file. |
| `title` | Recommended | Page title. Used to derive `skill-name` when not specified. |
| `skill-name` | No | Machine identifier (`[a-z0-9-]`, 1–64 chars). Derived from `title` when omitted. |
| `skill-category` | No | Category path, `/`-separated (e.g. `development/frontend`). |
| `skill-license` | No | License name or reference (e.g. `MIT`). |
| `skill-compatibility` | No | Environment requirements (max 500 chars). |
| `skill-allowed-tools` | No | Space-separated list of pre-approved tool identifiers. |
| `skill-metadata` | No | Arbitrary key-value pairs forwarded to the skill file. |
| `subfiles` | No | Glob patterns (relative to this file) for companion files to bundle. |

---

## Options

```ts
starlightSkills({
  /**
   * Where to write skill files at build time.
   * 'well-known-endpoint' | 'collocated' | 'both'
   * @default 'both'
   */
  outputMode: 'both',

  /**
   * Output directory for collocated skills.
   * Relative to the Astro project root, or absolute.
   * Useful in monorepos — e.g. '../../skills' to write outside the package.
   * @default 'skills'
   */
  collocatedDir: 'skills',

  /**
   * Base URL path for plugin-generated pages.
   * @default '__skills'
   */
  skillsRoot: '__skills',

  /**
   * Controls which pages the plugin generates.
   * @default { skill: true, catalog: true }
   */
  autoGeneratePages: { skill: true, catalog: true },

  /**
   * How hierarchical categories are shown in the catalog.
   * 'nested' | 'flat'
   * @default 'nested'
   */
  catalogCategoryDisplay: 'nested',

  /**
   * Auto-detect skill-category from the file path.
   * 'path' | false
   * @default 'path'
   */
  autoCategoryMode: 'path',

  /**
   * Sidebar group label for the Skills section.
   * @default 'Skills'
   */
  sidebarLabel: 'Skills',

  /**
   * Target locale for skill discovery when Starlight i18n is enabled.
   * Defaults to the Starlight default locale.
   */
  targetLocale: undefined,
})
```

---

## Build output

`astro build` produces skill files in two locations:

### `dist/.well-known/skills/` — HTTP discovery endpoint

Conforms to the [Agent Skills specification](https://agentskills.io/specification) (RFC 8615 well-known URI).

```
dist/
└── .well-known/
    └── skills/
        ├── index.json          ← skill registry
        ├── react-components/
        │   ├── SKILL.md        ← spec-compliant skill file
        │   └── schemas/component.json
        └── …
```

### `skills/` — collocated (committed to the repository)

Same structure, intended to be checked in so that `npx skills add owner/repo`
can install skills directly from the GitHub repository without a deployed site.

```
skills/
├── react-components/
│   ├── SKILL.md
│   └── …
└── …
```

---

## Virtual module

For use in custom Astro components:

```ts
import { skills } from 'virtual:starlight-skills/data';
// skills: SkillData[]
```

Add the type declaration to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["starlight-skills/virtual"]
  }
}
```

---

## Documentation

Full documentation is available at the [starlight-skills docs site](https://github.com/mew-ton/starlight-skills).

## License

MIT
