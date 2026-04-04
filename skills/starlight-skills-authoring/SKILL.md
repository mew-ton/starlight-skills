---
name: starlight-skills-authoring
description: "Provides rules and frontmatter schema for writing AI skills. Use this when you need to know how to add `skill: true`, configure skill metadata, or understand the naming constraints. Do not use this for plugin configuration options or deployment instructions."
---

Authoring a skill is as simple as creating a standard Starlight documentation page and adding a few specific fields to its frontmatter.

## Defining a Skill Page

By declaring `skill: true` in the frontmatter of any document page, you mark that page as an AI Skill. The marked page continues to function as a normal documentation page for humans, but it will also be processed as a skill during the build.

**The body of the page is distributed directly as the body of the skill.** We do not provide a mechanism to filter the body text solely for AI usage—you maintain a single source of truth.

## Frontmatter Fields

You must define your skills using the frontmatter of your Markdown or MDX file:

| Field | Required | Description |
|---|---|---|
| `skill` | **Yes** | Set to `true` to mark the page as a skill. |
| `description` | **Yes** | A human-readable summary. Used for the visual catalog page and the exported AI skill metadata. |
| `title` | Recommended | The page title. Used to auto-derive the skill name if not specified. |
| `skill-name` | No | Explicit mechanical identifier for the skill (1 to 64 characters, lowercase alphanumeric and hyphens only). If not provided, it is derived from the title. |
| `skill-category` | No | Explicit category path separated by `/` (e.g., `development/frontend`). |
| `skill-license` | No | License name or reference (e.g., `MIT`). |
| `skill-compatibility` | No | Environment compatibility details (max 500 characters). |
| `skill-metadata` | No | Any arbitrary key-value pairs to add to the exported skill metadata. |
| `skill-allowed-tools` | No | A space-separated verbatim string of pre-approved tool identifiers for the agent. |

*(Note: Companion files and schema references are supported via the `subfiles` field. See the **Companion Files** chapter for detailed usage.)*

### Full Frontmatter Example

Here is a full-size example of what a skill page's frontmatter might look like:

```yaml
---
title: "React Component Guidelines"
description: "Rules and best practices for creating new React components in this project."
skill: true
skill-name: "react-components"
skill-category: "frontend/react"
skill-license: "MIT"
skill-compatibility: "React 18.x with TypeScript"
skill-allowed-tools: "Bash(git:*) Read Write"
skill-metadata:
  version: "1.2.0"
  author: "Frontend Team"
subfiles:
  - "schemas/component.json"
---
```

## Rule Basics

### Skill Name Rules
Skill names are machine-readable identifiers and must be unique across the site. Duplicate skill names will result in a build error.
- **Allowed characters:** Lowercase letters (`a-z`), numbers (`0-9`), and hyphens (`-`).
- **Length:** 1 to 64 characters.
- **Constraints:** Cannot begin or end with a hyphen. Cannot contain consecutive hyphens (`--`).

### Category Resolution
Categories dictate how your skills are grouped in the sidebar and catalog. The category is determined in this order:
1. `skill-category` inside the frontmatter.
2. Auto-derived from the file path if `autoCategoryMode` is enabled.
3. Empty string (Uncategorized).

## Frontmatter JSON Schema

A machine-readable JSON Schema for all frontmatter fields is available as a companion file: `_assets/skill-frontmatter.schema.json`.

Use this schema to validate frontmatter values programmatically or to understand the exact constraints (allowed characters, length limits, required fields) for each field without reading prose documentation.
