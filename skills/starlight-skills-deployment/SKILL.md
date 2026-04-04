---
name: starlight-skills-deployment
description: "Provides deployment scenarios and Agent CLI installation methods for generated skills. Use this when you need to know about `well-known-endpoint` vs `collocated` output modes, or how an agent installs external skills."
---

Once you have authored your skills, the final step is making them available to AI agents.

## Output Modes and CLI Behaviors

The way you configure the `outputMode` in your `astro.config.ts` dictates what installation methods are available to consumers. The `skills` CLI has internal specifications for resolving skills: it looks for a well-known endpoint if given a web URL, and looks for a root folder if given a code repository.

### Public URLs (`well-known-endpoint`)
If your mode is set to `well-known-endpoint` (or `both`), the plugin generates skills into `dist/.well-known/skills/`.

- **Deployment Requirement**: You **must** deploy your `dist` folder to a public static hosting provider (e.g., GitHub Pages, Vercel, Cloudflare Pages) so that it is openly accessible on the internet.
- **Installation Method**: Provide the live URL to the `skills` CLI. The CLI internally understands that a regular URL implies it should check the `.well-known/skills` endpoint on that domain.

```bash
npx skills add https://your-starlight-site.example.com
```

### Source Repositories (`collocated`)
If your mode is set to `collocated` (or `both`), the plugin generates skills directly into your project's root `/skills/` directory.

- **Deployment Requirement**: You must commit the generated `/skills/` folder directly into your Git repository (e.g., pushed to GitHub). You do not necessarily need to host or deploy the actual website.
- **Installation Method**: Provide the repository identifier or repository URL. The CLI internally understands that a repository reference implies it should check the root `/skills/` directory of the codebase.

```bash
npx skills add github:mew-ton/your-docs-repo
```
