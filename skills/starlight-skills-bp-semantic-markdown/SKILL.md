---
name: starlight-skills-bp-semantic-markdown
description: "Provides rules for writing semantic Markdown to maximize agent comprehension. Use this when formatting the textual body of agent skill documents using starlight-skills. Do not use this for configuring YAML metadata or plugin options."
---

AI agents process the raw text of your document. To ensure they parse your instructions accurately, you must write highly structured, semantic Markdown.

Great skills are concise, well-structured, and easy to parse. Utilize headings (`##`), bullet points (`-`), and numbered lists (`1.`) aggressively to break down complex workflows into logical step-by-step procedures.

Avoid deep nesting or overly complex internal references. If you ask an agent to jump back and forth between heavily nested Markdown sections, it may lose context. 

Instead of writing a dense paragraph explaining a procedure, use a definitive checklist pattern. Checklists guide the Claude agent through complex operational workflows explicitly, preventing skipped validations or ignored rules.
