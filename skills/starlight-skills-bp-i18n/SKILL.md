---
name: starlight-skills-bp-i18n
description: "Provides rules for handling multi-language documentation. Use this when configuring agent skill documents using starlight-skills on an i18n-enabled project. Do not use this for standard single-language sites or plugin configuration options."
---

If you are using Starlight's i18n features to publish your documentation in multiple languages (e.g., English and Japanese), **you should only set `skill: true` on the English pages**.

## Why Default to English?

System prompts and base tools for most modern LLMs (including Claude) are primarily tuned in English. Providing the skill's instructions, frontmatter descriptions, and rules in English yields the highest accuracy and reduces localized misinterpretation.

Therefore, do not set `skill: true` on your translated pages (e.g., `ja/best-practices/01-one-instruction-per-file.md`). 

Instead, maintain the English document as the sole machine-readable skill, while keeping the translated pages as human-readable documents only. This ensures that regardless of the user's localized browser language, the AI agent always references the optimal English instructions.
