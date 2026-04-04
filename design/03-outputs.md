# ビルド出力

スキルの出力先は 2 種類あり、それぞれ独立して有効化できる。どちらか一方だけを使うことも、両方を同時に使うことも可能。

---

## 出力モード: `well-known-endpoint`（`dist/.well-known/skills/`）

ビルド成果物内に配置される静的ファイル群。サイトをデプロイすることで、公開 URL からスキルを発見・取得できるようになる。

### `index.json`

サイトが公開するすべてのスキルの機械可読レジストリ。

```json
{
  "skills": [
    {
      "name": "<スキル名>",
      "description": "<説明>",
      "files": ["SKILL.md", "references/api.md"]
    }
  ]
}
```

各エントリの `files` には、そのスキルディレクトリ内に存在するすべてのファイルの相対パスを列挙する。

### `<name>/SKILL.md`

スキルごとに 1 ディレクトリが生成され、Agent Skills 仕様に準拠した `SKILL.md` が配置される。

#### フォーマット

YAML フロントマター（`---` で囲まれたブロック）に続き、Markdown 本文を配置する。

```markdown
---
name: my-skill
description: "スキルの説明"
license: MIT
compatibility: "Node.js 18 以上"
allowed-tools: Bash(git:*) Read Write
metadata:
  version: "1.0"
  author: "example"
---

（スキルの本文）
```

#### フィールドマッピング

| SKILL.md フィールド | 出力条件 | 型 |
|---|---|---|
| `name` | 必須 | 文字列 |
| `description` | フロントマターに設定された場合 | クォートつき文字列 |
| `license` | フロントマターに設定された場合 | 文字列 |
| `compatibility` | フロントマターに設定された場合 | クォートつき文字列 |
| `allowed-tools` | フロントマターに設定された場合 | スペース区切り文字列（verbatim） |
| `metadata` | フロントマターに設定された場合 | YAML マッピング（文字列キー・文字列値） |

本文はページの Markdown 本文をそのまま出力する。Starlight 固有のフロントマターフィールド（`title`・`skill`・`skill-name` 等）は除外する。

### `<name>/<subfiles>`

`subfiles` で宣言された付随ファイルを、相対パス構造を保持したまま同ディレクトリ内にコピーする。

---

## 出力モード `collocated`（`<projectRoot>/skills/`）

プロジェクトルートの `skills/` ディレクトリに各スキルのファイルを書き出す。ソース管理に含めることで、デプロイなしにリポジトリからスキルを参照・取得できる。

構造は `well-known-endpoint` と同一（`index.json` を除く）。

---

## 比較

| | `well-known-endpoint` | `collocated` |
|---|---|---|
| 出力先 | `dist/.well-known/skills/` | `<projectRoot>/skills/` |
| 発見手段 | 公開 URL | リポジトリ |
| デプロイ必要 | あり | なし |
| `index.json` | あり | なし |
| ソース管理対象 | なし（生成物） | あり（コミット） |
