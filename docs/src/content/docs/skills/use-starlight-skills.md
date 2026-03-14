---
title: Use starlight-skills
description: Turn Starlight documentation pages into AI-installable skills using the starlight-skills plugin.
skill: true
skill-name: use-starlight-skills
skill-category: astro
skill-license: MIT
skill-compatibility: Requires Astro 4+ and @astrojs/starlight 0.21+
---

## What this skill does

`starlight-skills` is a Starlight plugin that publishes your documentation pages as
spec-compliant AI skills. Any page with `skill: true` in its frontmatter is output as
a `SKILL.md` file to both `dist/.well-known/skills/` (deployed discovery) and
`skills/` in the repository root (for `npx skills add owner/repo`).

## Install

```bash
npm install starlight-skills
```

## Configure

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
          autoCategoryMode: 'path', // 'path' | 'slug' | false
          catalogPath: '/skills-catalog',
          sidebarLabel: 'Skills',
        }),
      ],
    }),
  ],
});
```

## Mark a page as a skill

Add `skill: true` to any documentation page's frontmatter:

```md
---
title: My Skill
description: What this skill does.
skill: true
skill-name: my-skill          # optional; derived from title if omitted
skill-category: my/category   # optional; auto-detected from path
subfiles:
  - references/*.md           # companion files to bundle
---
```

## Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `skill` | ✅ | Marks this page as a skill |
| `skill-name` | — | Identifier (`[a-z0-9-]`, 1–64 chars) |
| `skill-category` | — | Slash-separated category hierarchy |
| `subfiles` | — | Glob patterns for companion files |
| `description` | — | Shared with Starlight page description |
| `skill-license` | — | License name or file reference |
| `skill-compatibility` | — | Environment requirements (max 500 chars) |
| `skill-metadata` | — | Arbitrary string key-value metadata |
| `skill-allowed-tools` | — | Pre-approved tools (experimental) |

## Build output

```
dist/
└── .well-known/
    └── skills/
        ├── index.json          ← skills registry
        └── my-skill/
            └── SKILL.md

skills/                         ← commit this to your repo
└── my-skill/
    └── SKILL.md
```

## Install from GitHub or deployed site

```bash
# From a GitHub repository (no deployment needed)
npx skills add owner/repo

# From a deployed site
npx skills add https://your-site.example.com
```
