---
title: Publish a Skills Site
description: How to deploy a Starlight site with starlight-skills so AI agents can discover and install your skills.
skill: true
skill-name: publish-skills-site
skill-category: astro
skill-license: MIT
---

## What this skill does

Guides you through deploying a Starlight + starlight-skills site so that
`npx skills add https://your-site.example.com` works for AI agents.

## Prerequisites

- A Starlight project with `starlight-skills` installed and at least one skill page
- A hosting platform (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.)

## 1. Build the project

```bash
astro build
```

After the build, verify that `dist/.well-known/skills/index.json` exists and lists your skills.

## 2. Ensure `.well-known/` is served correctly

Most static hosting platforms serve any file under `dist/` as-is, so no extra
configuration is needed. If your platform strips dot-prefixed directories, add a
rewrite rule:

**Vercel (`vercel.json`)**
```json
{
  "headers": [
    {
      "source": "/.well-known/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ]
}
```

**Netlify (`netlify.toml`)**
```toml
[[headers]]
  for = "/.well-known/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

## 3. Commit the `skills/` directory

The build also writes a `skills/` directory to your project root.
Commit it so agents can install from GitHub without needing the deployed site:

```bash
git add skills/
git commit -m "chore: update skill files"
git push
```

## 4. Verify discovery

```bash
# Should return your index.json
curl https://your-site.example.com/.well-known/skills/index.json

# Install from the deployed site
npx skills add https://your-site.example.com

# Install from GitHub
npx skills add owner/repo
```
