---
name: starlight-skills-bp-separate-ui
description: "Provides rules for handling interactive frontend components in skill documents. Use this when migrating heavily interactive Astro or React pages into agent skill documents using starlight-skills. Do not use this to format plain text Markdown or configure frontmatter."
---

If your documentation relies heavily on interactive UI components, such as live code REPLs, Starlight's `<Tabs>`, or complex MDX layouts, it will introduce massive amounts of noise directly into the LLM's context window.

LLMs read the raw textual string of your Markdown. Here is what an agent sees when you use a Starlight `Tabs` component:

```mdx
<Tabs>
  <TabItem label="npm">
    `npm install`
  </TabItem>
  <TabItem label="yarn">
    `yarn add`
  </TabItem>
</Tabs>
```

This specific markup does not intuitively convey logical branching or clear instructions to an AI. If interactivity is absolutely required for the human reader and makes the raw markdown excessively noisy, **do not combine them**. 

Instead, opt to split the AI skill into its own dedicated `.md` file, separate from the highly interactive human documentation page.
