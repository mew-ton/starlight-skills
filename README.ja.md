# starlight-skills

ドキュメントを AI インストール可能なスキルに変換する [Starlight](https://starlight.astro.build/) プラグイン。

一度書けば、人間にも AI エージェントにも届く。

```
npx skills add <your-github-repo>
```

## 思想

AI がコーディングやレビューを担う割合が増えるにつれ、頼りすぎることのリスクも高まっています。
人間による最終確認がまだ必要な今だからこそ、スキルは人間と AI の両方に、同じ情報源からインストールできるべきです。

このプラグインを使えば、スキルを通常の Starlight ドキュメントページとして管理しながら、
仕様準拠のスキルファイルとして自動的に公開できます。

---

## インストール

```bash
npm install starlight-skills
```

```ts
// astro.config.mjs
import starlight from '@astrojs/starlight';
import starlightSkills from 'starlight-skills';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Docs',
      plugins: [
        starlightSkills({
          // オプション — 下記「オプション」を参照
        }),
      ],
    }),
  ],
});
```

---

## ページをスキルとしてマークする

任意のドキュメントページの frontmatter に `skill: true` を追加します。

```md
---
title: React コンポーネントを書く
description: 一貫性のある、テスト可能な React コンポーネントを作るためのガイドライン。
skill: true
skill-name: react-component          # 省略可 — title から自動生成
skill-category: development/frontend # 省略可 — ファイルパスから自動検出
subfiles:
  - references/*.md                  # スキルに同梱する付随ファイル
  - scripts/*.js
---

# React コンポーネントを書く

...
```

### frontmatter フィールド一覧

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `skill` | `true` | ✅ | このページをスキルとしてマーク |
| `skill-name` | `string` | — | スキル識別子（`[a-z0-9-]`、1〜64文字）。省略時は `title` から自動生成。 |
| `skill-category` | `string` | — | カテゴリ階層（`/` 区切り、例: `development/frontend`）。`autoCategoryMode` 設定時は自動検出。 |
| `subfiles` | `string[]` | — | スキルに同梱する付随ファイルのグロブパターン（このファイルからの相対パス）。 |
| `description` | `string` | — | スキルの説明。Starlight ページの description と共用。 |
| `skill-license` | `string` | — | ライセンス名またはライセンスファイルへの参照（例: `MIT`）。 |
| `skill-compatibility` | `string` | — | 動作環境の要件（最大500文字）。対象プロダクト、必要パッケージ等を記述。 |
| `skill-metadata` | `object` | — | 任意のキー値メタデータ（値は文字列）。出力 SKILL.md にそのまま転記。 |
| `skill-allowed-tools` | `string` | — | 事前承認するツールのスペース区切りリスト（実験的）。例: `"Bash(git:*) Read"` |

---

## オプション

```ts
starlightSkills({
  /** skill-category の自動検出方法。'path' | 'slug' | false。デフォルト: 'path' */
  autoCategoryMode: 'path',

  /** 生成されるカタログページの URL。デフォルト: '/skills-catalog' */
  catalogPath: '/skills-catalog',

  /** サイドバーのグループラベル。デフォルト: 'Skills' */
  sidebarLabel: 'Skills',
})
```

---

## ビルド出力

`astro build` を実行すると、2つのスキルツリーが生成されます。

### `dist/.well-known/skills/` — デプロイ用ディスカバリーエンドポイント

[Agent Skills 仕様](https://agentskills.io/specification)（RFC 8615 well-known URI）に準拠。

```
dist/
└── .well-known/
    └── skills/
        ├── index.json                   ← スキルレジストリ
        ├── react-component/
        │   ├── SKILL.md                 ← 仕様準拠のスキルファイル
        │   ├── references/api.md
        │   └── scripts/scaffold.js
        └── ...
```

### `skills/` — プロジェクトルート（リポジトリにコミットする想定）

同じ構造を持ち、デプロイ済みサイトがなくても `npx skills add <owner/repo>` で
GitHub リポジトリから直接スキルをインストールできるようにするためのものです。

```
skills/
├── react-component/
│   ├── SKILL.md
│   └── ...
└── ...
```

### インストール方法

```bash
# デプロイ済みサイトから（.well-known/skills を使用）
npx skills add https://your-site.example.com

# GitHub リポジトリから（skills/ を使用）
npx skills add owner/repo
```

---

## 追加ページ

| パス | 説明 |
|---|---|
| `/skills-catalog` | 全スキルをスキル名・カテゴリ・説明のテーブルで一覧表示 |

各スキルは通常の Starlight コンテンツ URL にも表示され、サイドバーの **Skills** グループにもカテゴリ階層付きでリストされます。

---

## TypeScript — 仮想モジュール

カスタムコンポーネント内で `virtual:starlight-skills/data` をインポートする場合は、
`tsconfig.json` に型宣言を追加してください。

```json
{
  "compilerOptions": {
    "types": ["starlight-skills/virtual"]
  }
}
```

```ts
import { skills } from 'virtual:starlight-skills/data';
// skills: SkillData[]
```
