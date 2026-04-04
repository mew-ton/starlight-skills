---
title: Descriptive Frontmatter
description: Provides rules for writing effective skill descriptions. Use this when setting up frontmatter properties for agent skill documents using starlight-skills. Do not use this for structuring the actual text body or plugin configuration options.
skill: true
skill-name: starlight-skills-bp-descriptive-frontmatter
---

The `description` field in the frontmatter is the most critical piece of metadata for your skill. 

AI agents do not read the entire body of every skill in your repository to figure out what they do. Instead, the agent looks **solely at the description** to autonomously decide whether to load and execute that skill.

To ensure the agent discovers and uses your skill correctly, your natural language description (written in English) must clearly explain three things:
1. **What** the skill does.
2. **When** it should be triggered.
3. **When NOT to** use it (a negative trigger).

Example of a great description:
`Generates descriptive commit messages by analyzing git diffs. Use this when the user asks for help writing a commit message or reviewing staged changes. Do not use this for merging branches or rebasing.`
