---
title: Installation
description: How to install and configure the starlight-skills plugin.
---

## Requirements

- Astro 4.0+
- `@astrojs/starlight` 0.21+

## Install the package

```bash
npm install starlight-skills
```

## Add the plugin

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
        starlightSkills(),
      ],
    }),
  ],
});
```

That's it. Run `astro build` and the plugin will scan your `src/content/docs/` directory
for pages with `skill: true` in their frontmatter.
