---
title: Getting Started
description: Provides core concepts and use cases for the starlight-skills plugin. Use this when you need to understand the philosophy or general purpose of dual-publishing documents and skills.
skill: true
skill-name: starlight-skills-started
skill-category: usage
---

`starlight-skills` is a plugin for [Astro Starlight](https://starlight.astro.build/) that allows documentation authors to centrally manage both documentation pages and **installable AI Agent Skills**.

## The Philosophy of starlight-skills

Recently, AI-assisted development has become mainstream in many areas such as design, coding, and review, but there are still areas that remain heavily reliant on human hands. 

While there is a growing movement to delegate everything to AI, this has sometimes led to more frequent failures, sparking a counter-movement to bring control and oversight back to humans. With no definitive conclusion yet, **documentation should be optimized for both contexts**. This assertion is the origin of this plugin and its core concept.

With this plugin, a single repository and a single Markdown file can act both as a human-readable knowledge source and as a machine-readable skill instruction set.

## Two Core Use Cases

This plugin assumes two distinctly different use cases. In both cases, **a single page functions as both a document and a skill**, so the author does not need to duplicate their work in multiple places.

### Axis A: Turning Documents into Skills

When your primary audience is human, but you want AI agents to use that documentation as their rule set.

- **Primary Audience:** Human readers.
- **AI Role:** Utilizes the content as procedures, rules, and fundamental knowledge.
- **Structure:** Follows standard documentation conventions (including explanations, examples, background, and rationale).
- **Author's Focus:** Writing comprehensive human documentation. The plugin handles the mechanical transformation into an AI skill under the hood.

### Axis B: Publishing Skills as Documents

When your primary artifact is an AI prompt/skill, but you want to expose it to humans as a readable guideline or convention.

- **Primary Audience:** AI Agents.
- **Human Role:** Refers to the published skill content as conventions, internal rules, or regulations.
- **Structure:** Follows AI skill conventions (concise, imperative, heavily bulleted with clear do's and don'ts).
- **Author's Focus:** Writing highly optimized AI skill instructions. The plugin handles making them look beautiful and discoverable on your Starlight documentation site.
