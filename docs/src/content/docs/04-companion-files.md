---
title: Companion Files
description: "Provides instructions on how to use the `subfiles` frontmatter field. Use this when you need to attach external schemas, scripts, or large datasets to a skill without polluting the main markdown file. Do not use this for main skill body authoring or plugin configuration."
skill: true
skill-name: starlight-skills-companion-files
skill-category: usage
---

When authoring a skill, there is often a limit to how much information should be written directly into the main `.md` document.

If an AI agent needs to understand a massive API schema, a JSON configuration format, or an entire script template, pasting hundreds of lines of code into your main document makes it incredibly difficult for a human to read.

## The `subfiles` Field

A skill can possess supplementary text files. You define these via the `subfiles` array inside your frontmatter using glob patterns.

```yaml
---
title: System Configuration Skill
description: Instructions on how to update our internal system configuration.
skill: true
subfiles:
  - "schemas/config-schema.json"
  - "examples/**/*.yml"
---
```

## What are Companion Files?

In the context of AI Agents, companion files specified in `subfiles` are exactly analogous to **Support Files** (e.g., in Claude Skills). They allow you to pass external knowledge, strict schemas, or necessary reference material to the agent without cluttering the prompt itself.

### Concrete Example: API Schema

Imagine you are creating a skill that writes API requests. Providing the entire OpenAPI schema inside the markdown file would make the document thousands of lines long.

Instead, separate it:

**`src/content/docs/api-client-rules.md` (The Skill)**
```md
---
title: "API Client Rules"
description: "Rules for writing new API queries to our internal system."
skill: true
subfiles:
  - "schemas/internal-api.yaml"
---

When generating API requests, ALWAYS reference the exact endpoints and required parameters defined in `schemas/internal-api.yaml`. Do not invent endpoints.
```

**`src/content/docs/schemas/internal-api.yaml` (The Companion File)**
```yaml
openapi: 3.0.0
info:
  title: Internal API
paths:
  /v1/users: ...
```

By separating them, the AI agent receives both the clear text rules and the strict structured data, while human readers only need to read the short markdown rules.

## Why Separate Companion Files?

Separating your skill into the main document and companion `subfiles` offers massive benefits:

1. **Context Window Efficiency**: The agent reads the concise instructions in the main `.md` page, and only references the strict `subfiles` (like the JSON schema) when explicitly needed, saving its token window.
2. **Human Readability**: By moving gigantic datasets or strict mechanical schemas out of the prose, human developers can easily read the document's concepts without scrolling past walls of JSON.
3. **Perfect Formatting**: Exporting your mechanical datasets completely intact as secondary files avoids tricky Markdown string-formatting issues.

## Usage Rules

- They must be **text files**. Including binary files (like images, zip files, or PDFs) in the matched glob pattern will purposefully trigger a build error to prevent corrupting the AI's string-based payload.
- Unmatched glob patterns are simply ignored.
- Over on the doc's website, the plugin automatically generates sub-pages for these files. Markdown/MDX files render normally, while scripts and schemas display as formatted code blocks.
- When outputting for agent consumption (`SKILL.md`), the `subfiles` are copied alongside the skill, preserving their relative directory structures. See the **Deployment** chapter for details on the output file format.
