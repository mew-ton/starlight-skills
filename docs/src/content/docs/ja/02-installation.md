---
title: インストール
description: starlight-skills をプロジェクトに導入し設定する方法。
---

`starlight-skills` を Astro Starlight プロジェクトに追加するのは簡単な 2 ステップです。

## 1. パッケージのインストール

お使いのパッケージマネージャーを使用してプラグインをインストールします:

```bash
# npm
npm install starlight-skills

# yarn
yarn add starlight-skills

# pnpm
pnpm add starlight-skills
```

## 2. Astro への設定追加

`astro.config.ts` (または `astro.config.mjs`) の Starlight インテグレーションにプラグインを追加します:

```ts
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSkills from 'starlight-skills';

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			plugins: [
				// プラグインをここに追加します
				starlightSkills(),
			],
		}),
	],
});
```

追加完了後、`src/content/docs/` 配下のフロントマターに `skill: true` が設定されたファイルは自動的に処理されます。

出力先やページの生成挙動をカスタマイズする方法については、**設定**のセクションをご覧ください。
