---
title: Configuration
description: All available options for the starlight-skills plugin.
---

Pass options to `starlightSkills()` in your Astro config:

```ts
starlightSkills({
  autoCategoryMode: 'path',
  catalogPath: '/skills-catalog',
  sidebarLabel: 'Skills',
})
```

## Options

### `autoCategoryMode`

**Type:** `'path' | 'slug' | false`
**Default:** `'path'`

Controls how `skill-category` is automatically derived when not set in frontmatter.

| Value | Behaviour |
|-------|-----------|
| `'path'` | Uses the directory path relative to `src/content/docs/` |
| `'slug'` | Uses the page slug |
| `false` | No auto-detection; `skill-category` must be set explicitly |

### `catalogPath`

**Type:** `string`
**Default:** `'/skills-catalog'`

URL for the generated skill catalog page.

### `sidebarLabel`

**Type:** `string`
**Default:** `'Skills'`

Label for the sidebar group that lists all skills.
