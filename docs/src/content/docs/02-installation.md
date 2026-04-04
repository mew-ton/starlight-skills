---
title: Installation
description: Provides installation and basic setup instructions for starlight-skills. Use this when you need to add the plugin to a new Astro Starlight project or configure its initial setup. Do not use this if the plugin is already installed, or for frontmatter authoring rules.
skill: true
skill-name: starlight-skills-installation
skill-category: usage
---

Adding `starlight-skills` to your Astro Starlight project is a simple two-step process.

## 1. Install the Package

Install the plugin using your preferred package manager:

```bash
# npm
npm install starlight-skills

# yarn
yarn add starlight-skills

# pnpm
pnpm add starlight-skills
```

## 2. Configure Astro

Add the plugin to your Starlight integration configuration inside `astro.config.ts` (or `astro.config.mjs`):

```ts
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSkills from 'starlight-skills';

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			plugins: [
				// Add the starlight-skills plugin here!
				starlightSkills(),
			],
		}),
	],
});
```

Once added, any `.md` or `.mdx` file under `src/content/docs/` with `skill: true` in its frontmatter will be automatically processed. 

See the **Configuration** chapter to learn how to customize where your skills are output and how the site integration behaves.
