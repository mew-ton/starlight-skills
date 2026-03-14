---
title: Marking a Page as a Skill
description: How to mark a Starlight documentation page as an AI skill.
---

Add `skill: true` to the frontmatter of any documentation page to publish it as a skill.

```md
---
title: Write a React Component
description: Guidelines for creating consistent, testable React components.
skill: true
skill-name: react-component
skill-category: development/frontend
subfiles:
  - references/*.md
  - scripts/*.js
---
```

## Frontmatter reference

### `skill`

**Type:** `true` **Required**

Marks this page as a skill. The page is rendered normally in Starlight and is also
output as a `SKILL.md` file in the build.

### `skill-name`

**Type:** `string`

Skill identifier used as the directory name in the build output.
Must match `[a-z0-9][a-z0-9-]*[a-z0-9]` and be 1–64 characters.

When omitted, the value is derived from the page `title` by lowercasing
and replacing spaces and special characters with hyphens.

### `skill-category`

**Type:** `string`

Slash-separated category hierarchy (e.g. `development/frontend`).
Used to group skills in the sidebar and catalog.

When `autoCategoryMode` is set, this is derived automatically from
the file path or slug.

### `subfiles`

**Type:** `string[]`

Glob patterns (relative to this file) for companion files to bundle
alongside `SKILL.md` in the build output.

```yaml
subfiles:
  - references/*.md
  - scripts/scaffold.js
```

### `description`

**Type:** `string`

Shared with the Starlight page description. Becomes the skill's
`description` field in `index.json`.

### Optional spec fields

These are forwarded verbatim to the output `SKILL.md`:

| Field | Description |
|-------|-------------|
| `skill-license` | License name or reference (e.g. `MIT`) |
| `skill-compatibility` | Environment requirements, max 500 chars |
| `skill-metadata` | Arbitrary string key-value pairs |
| `skill-allowed-tools` | Space-delimited pre-approved tool list (experimental) |
