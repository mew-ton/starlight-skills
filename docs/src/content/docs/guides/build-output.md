---
title: Build Output
description: What astro build produces for skills.
---

Running `astro build` produces two skill trees in addition to the normal Starlight output.

## `dist/.well-known/skills/`

Deployed to your site as a discovery endpoint.
Conforms to the [Agent Skills specification](https://agentskills.io/specification) (RFC 8615 well-known URI).

```
dist/
└── .well-known/
    └── skills/
        ├── index.json
        ├── react-component/
        │   ├── SKILL.md
        │   ├── references/api.md
        │   └── scripts/scaffold.js
        └── ...
```

### `index.json` format

```json
{
  "skills": [
    {
      "name": "react-component",
      "description": "Guidelines for creating consistent React components.",
      "files": ["SKILL.md", "references/api.md"]
    }
  ]
}
```

## `skills/`

Written to your project root and intended to be committed to the repository.
This allows `npx skills add owner/repo` to install skills directly from GitHub
without needing a deployed site.

```
skills/
├── react-component/
│   ├── SKILL.md
│   └── references/api.md
└── ...
```

## Installing skills

```bash
# From a deployed site (uses .well-known/skills)
npx skills add https://your-site.example.com

# From a GitHub repository (uses skills/ in the repo)
npx skills add owner/repo
```
