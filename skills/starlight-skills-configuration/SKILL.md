---
name: starlight-skills-configuration
description: "Provides all `astro.config.ts` plugin options for starlight-skills. Use this when you need to configure output modes, URL paths, automatic categories, sidebars, or other advanced build settings. Do not use this for frontmatter authoring rules or deployment procedures."
---

You can configure `starlight-skills` behavior using options in your `astro.config.ts`.

**Minimal setup** (all defaults):
```ts
starlightSkills()
```

**Monorepo** — output the collocated skills folder to the repository root instead of the docs package root:
```ts
starlightSkills({
  collocatedDir: '../../skills',
})
```

**Well-known only** — skip committing files to Git; rely solely on public hosting for skill discovery:
```ts
starlightSkills({
  outputMode: 'well-known-endpoint',
})
```

**Custom URL root** — host skill pages under `/agent-skills/` instead of `/__skills/`:
```ts
starlightSkills({
  skillsRoot: 'agent-skills',
  sidebarLabel: 'Agent Skills',
})
```

## Plugin Options

### targetLocale
Determines which locale to recognize skills from when using Starlight's i18n features.
- If specified, only pages inside the target locale's content directory will be processed as skills.
- **Default:** Derived from Starlight's default locale.

### outputMode
Controls where compilation artifacts (`SKILL.md`, `index.json`, etc.) are written.
- `'well-known-endpoint'`: Exports files exactly to `dist/.well-known/skills/`. This makes skills discoverable via a public URL immediately after deployment.
- `'collocated'`: Exports files exactly to `<projectRoot>/skills/`. This commits skills into your repository for usage without deployment.
- `'both'` (Default): Exports to both destinations.

### collocatedDir
Output directory for `collocated` (and `both`) output mode. Accepts a path relative to the Astro project root, or an absolute path.
Useful in monorepos where the project root is not the repository root.
**Default:** `'skills'`

### autoGeneratePages
Controls what additional UI the plugin injects into your Starlight documentation site.
```ts
autoGeneratePages?: {
  skill?: boolean;    // Generates the dedicated AI view page
  catalog?: boolean;  // Generates the visual listing page (Catalog)
}
```
**Default:** `{ skill: true, catalog: true }`

*(Note: dynamically generated pages are tagged with `<meta name="robots" content="noindex">` to prevent SEO duplicate content issues against your origin pages.)*

### skillsRoot
The base URL path where all dynamic pages (catalog, skill view pages, subfile explorer) reside.
**Default:** `'__skills'`

### catalogCategoryDisplay
How nested categories are displayed on the visual Catalog.
- `'nested'` (Default): Subcategories sit within parent category sections.
- `'flat'`: Renders exact full-path strings (e.g., `development/frontend`).

### autoCategoryMode
Determines how skills are automatically bucketed into categories when `skill-category` is absent.
- `'path'` (Default): Categories are auto-derived from the file system directory structure relative to the content root.
- `false`: Disables auto-derivation.

*(Note: When `'path'` is used alongside i18n locales, the locale subdirectory is automatically stripped from the category pathway).*

### sidebarLabel
Customizes the text label for the "Skills" group which is automatically injected into the Starlight Sidebar.
**Default:** `'Skills'`
