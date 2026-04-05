# starlight-skills

[![npm version](https://img.shields.io/npm/v/starlight-skills?style=flat-square)](https://www.npmjs.com/package/starlight-skills)
[![npm downloads](https://img.shields.io/npm/dm/starlight-skills?style=flat-square)](https://www.npmjs.com/package/starlight-skills)
[![license](https://img.shields.io/npm/l/starlight-skills?style=flat-square)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/mew-ton/starlight-skills/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/mew-ton/starlight-skills/actions/workflows/ci.yml)

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

## Documentation

Full documentation, including getting started guides, frontmatter schemas, and configuration options, is available on our dedicated documentation site:

👉 **[starlight-skills Documentation](https://mew-ton.github.io/starlight-skills/)**
