# starlight-skills

*[Read this in Japanese (日本語) 🇯🇵](./README.ja.md)*

A [Starlight](https://starlight.astro.build/) plugin that turns your documentation into AI-installable skills.

Document once — ship to humans **and** AI agents.

```
npx skills add <your-github-repo>
```

## Philosophy

As AI takes on more of the coding and review work, the risk of over-reliance grows.
While human oversight is still essential, skills should be installable by both humans
and AI agents from the same source of truth.

This plugin lets you maintain your skills as normal Starlight documentation pages and
automatically publishes them as discoverable, spec-compliant skill files.

---

## Installation

```bash
npm install starlight-skills
```

```ts
// astro.config.mjs
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
title: Write a React Component
description: Guidelines for creating consistent, testable React components.
skill: true
skill-name: react-component        # optional — derived from title if omitted
skill-category: development/frontend  # optional — auto-detected from file path
subfiles:
  - references/*.md                # companion files bundled with this skill
  - scripts/*.js
---

# Write a React Component

...
```

### Frontmatter reference

| Field | Type | Required | Description |
|---|---|---|---|
| `skill` | `true` | ✅ | Marks this page as a skill |
| `skill-name` | `string` | — | Skill identifier (`[a-z0-9-]`, 1–64 chars). Derived from `title` when omitted. |
| `skill-category` | `string` | — | Category hierarchy, `/`-separated (e.g. `development/frontend`). Auto-detected when `autoCategoryMode` is set. |
| `subfiles` | `string[]` | — | Glob patterns (relative to this file) for companion files to bundle with the skill. |
| `description` | `string` | — | Skill description — shared with the Starlight page description. |
| `skill-license` | `string` | — | License name or reference to a bundled license file (e.g. `MIT`). |
| `skill-compatibility` | `string` | — | Environment requirements (max 500 chars). Product target, network access, etc. |
| `skill-metadata` | `object` | — | Arbitrary key-value metadata forwarded to output SKILL.md. |
| `skill-allowed-tools` | `string` | — | Pre-approved tools list (experimental). Example: `"Bash(git:*) Read"` |

---

## Options

```ts
starlightSkills({
  /** Target locale for skill discovery. Default: Starlight default locale */
  targetLocale: 'en',

  /** Output locations. 'well-known-endpoint' | 'collocated' | 'both'. Default: 'both' */
  outputMode: 'both',

  /** Pages to generate. Default: { skill: true, catalog: true } */
  autoGeneratePages: { skill: true, catalog: true },

  /** Auto-detect skill-category. 'path' | 'slug' | false. Default: 'path' */
  autoCategoryMode: 'path',

  /** Base URL path for all generated pages. Default: '__skills' */
  skillsRoot: '__skills',

  /** Display style for catalog categories. 'nested' | 'flat'. Default: 'nested' */
  catalogCategoryDisplay: 'nested',

  /** Sidebar group label. Default: 'Skills' */
  sidebarLabel: 'Skills',

  /** Where to write 'collocated' output. Default: 'skills' */
  collocatedDir: 'skills',
})
```

---

## Build output

Running `astro build` produces two skill trees:

### `dist/.well-known/skills/` — deployed discovery endpoint

Conforms to the [Agent Skills specification](https://agentskills.io/specification) (RFC 8615 well-known URI).

```
dist/
└── .well-known/
    └── skills/
        ├── index.json                   ← skills registry
        ├── react-component/
        │   ├── SKILL.md                 ← spec-compliant skill file
        │   ├── references/api.md
        │   └── scripts/scaffold.js
        └── ...
```

### `skills/` — project root (committed to the repository)

Same structure, intended to be checked in so that `npx skills add <owner/repo>`
can install skills directly from the GitHub repository without a deployed site.

```
skills/
├── react-component/
│   ├── SKILL.md
│   └── ...
└── ...
```

### Install from GitHub

```bash
# From a deployed site (uses .well-known/skills)
npx skills add https://your-site.example.com

# From a GitHub repository (uses skills/ in the repo)
npx skills add owner/repo
```

---

## Added pages

| Path | Description |
|---|---|
| `/skills-catalog` | Table listing all skills with name, category, and description |

The skills themselves appear at their normal Starlight content URLs and are also
listed in a **Skills** sidebar group, grouped by category.

---

## TypeScript — virtual module

If you import from `virtual:starlight-skills/data` in a custom component,
add the type declaration to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["starlight-skills/virtual"]
  }
}
```

```ts
import { skills } from 'virtual:starlight-skills/data';
// skills: SkillData[]
```
