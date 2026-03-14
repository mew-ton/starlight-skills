---
title: Skill Catalog Page
description: The auto-generated skill catalog page added by starlight-skills.
---

The plugin automatically injects a skill catalog page at `/skills-catalog`
(configurable via the `catalogPath` option).

The catalog lists all skills in a table with their name, category, and description,
and links to each skill's documentation page.

## Customising the path

```ts
starlightSkills({
  catalogPath: '/my-skills',
})
```

## Sidebar group

Skills are also listed in a sidebar group called **Skills** (configurable via `sidebarLabel`).
If skills have categories, they appear as nested groups within the sidebar.
