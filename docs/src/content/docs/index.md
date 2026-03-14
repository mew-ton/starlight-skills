---
title: starlight-skills
description: A Starlight plugin that turns your documentation into AI-installable skills.
template: splash
hero:
  tagline: Document once — ship to humans and AI agents.
  actions:
    - text: Get started
      link: /installation/
      icon: right-arrow
    - text: View on GitHub
      link: https://github.com/mew-ton/starlight-skills
      icon: external
      variant: minimal
---

`starlight-skills` is a [Starlight](https://starlight.astro.build/) plugin that publishes your
documentation pages as spec-compliant AI skills conforming to the
[Agent Skills specification](https://agentskills.io/specification).

Add `skill: true` to any page's frontmatter and the plugin handles the rest:

- Generates `dist/.well-known/skills/` for deployed discovery
- Generates a committed `skills/` tree for `npx skills add owner/repo`
- Injects a skill catalog page and sidebar group

```bash
npx skills add owner/repo
```
