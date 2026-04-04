---
name: starlight-skills-bp-one-instruction
description: "Provides rules for scoping skill files. Use this when creating or refactoring agent skill documents using starlight-skills. Do not use this for general Markdown formatting or frontmatter configuration."
---

When writing a skill, limit the scope of a single file to one specific instruction or context. Don't combine multiple unrelated rules into a single massive document.

If you include too many contexts in one file, it becomes difficult for humans to find what they need, and it severely degrades the AI agent's ability to determine which rules apply to the user's current request. 

For example, do not merge "Frontend Routing Rules" and "Database Migration Rules" into a single `development-rules.md` skill. Instead, separate them into `frontend-routing.md` and `db-migrations.md`.
