---
title: 設定
description: astro.config.ts で starlight-skills の振る舞いや出力をカスタマイズする方法。
---

`astro.config.ts` でプラグインのオプションを渡すことで、`starlight-skills` の出力先やサイト統合を細かく設定できます。

```ts
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSkills from 'starlight-skills';

export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			plugins: [
				starlightSkills({
					outputMode: 'both',
					skillsRoot: '__skills',
				}),
			]
		}),
	],
});
```

## プラグイン設定一覧

### targetLocale
多言語対応（i18n）が有効な場合に、スキルとして認識する対象の基本言語を指定します。
指定された場合、その言語のサブディレクトリ配下のページのみがスキル認識の対象となります。
**デフォルト:** サイトのデフォルト言語

### outputMode
スキルファイルの物理的な出力先（エクスポート先）を制御します。
- `'well-known-endpoint'`: `dist/.well-known/skills/` のみに出力します。本番環境にデプロイすることで、外部システムが URL 経由で直接取得できるようになります。
- `'collocated'`: プロジェクトルートの `skills/` のみに出力します。リポジトリにコミットすることで、デプロイなしで連携可能な状態を作ります。
- `'both'`（デフォルト）: 両方に出力します。

### collocatedDir
`collocated`（および `both`）出力モードの場合の出力先ディレクトリを指定します。Astro のプロジェクトルートからの相対パス、または絶対パスを受け取ります。
プロジェクトルートとリポジトリのルートが異なるモノレポ環境などで有用です。
**デフォルト:** `'skills'`

### autoGeneratePages
プラグインがドキュメントサイトに動的に生成するページの種類を制御します。
```ts
autoGeneratePages?: {
  skill?: boolean;    // AIスキルとしての見た目を確認できる専用ページの生成
  catalog?: boolean;  // スキルの一覧を閲覧するカタログページの生成
}
```
**デフォルト:** `{ skill: true, catalog: true }`

*(注: 自動生成されたページには、SEO 上の重複コンテンツ問題を避けるため `<meta name="robots" content="noindex">` が付与されます。)*

### skillsRoot
カタログ・専用ページ・付随ファイル閲覧ページが配置される、動的ルーティングのベースとなるパス。
**デフォルト:** `'__skills'`

### catalogCategoryDisplay
カタログページにおけるカテゴリの表示方針を制御します。
- `'nested'`（デフォルト）: 上位カテゴリのセクション内に下位カテゴリをネストして階層的に表示します。
- `'flat'`: カテゴリの階層パス文字列そのまま（例: `development/frontend`）をフラットなセクションとして表示します。

### autoCategoryMode
フロントマターの `skill-category` が未設定の場合の、カテゴリ自動導出の挙動です。
- `'path'`（デフォルト）: コンテンツルートから見たファイルのディレクトリパス構造からカテゴリを自動導出します。
- `false`: 自動導出を行いません。

*(注: 多言語と併用して `'path'` を利用する場合、ロケール指定のディレクトリ部分（例: `ja/`）は自動的に解決パスから除外されます。)*

### sidebarLabel
Starlight のサイドバーに自動追加される、スキル一覧メニューのメインラベルのテキストです。
**デフォルト:** `'Skills'`
