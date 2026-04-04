---
title: デプロイとインストール
description: サイトのデプロイ方法と、AIエージェントによるスキルのインストール手順。
---

スキルの作成が完了したら、最後にそれらをAIエージェントが利用できる状態にします。

## 出力モードとインストール方式の対応

提供できるインストール方法は、`astro.config.ts` の `outputMode` の設定内容に依存します。`skills` CLI は内部仕様として、**「URLが指定された場合は well-known endpoint を参照する」「リポジトリが指定された場合はリポジトリルートの skills フォルダを参照する」** という挙動を持っています。

### 公開 URL を使用する場合（`well-known-endpoint`）
`outputMode` が `well-known-endpoint` （または `both`）の場合、スキルファイル群は `dist/.well-known/skills/` に出力されます。

- **デプロイ要件**: 生成された `dist` フォルダを GitHub Pages や Vercel、Cloudflare Pages などの静的ホスティングで**インターネット上に一般公開してデプロイ**する必要があります。
- **インストール方法**: コマンドにサイトの URL をそのまま渡します。CLI は URL が渡された場合、内部的に対象ドメインの `.well-known/skills/` エンドポイントを参照して解決します。

```bash
npx skills add https://your-starlight-site.example.com
```

### リポジトリを使用する場合（`collocated`）
`outputMode` が `collocated` （または `both`）の場合、スキルファイル群はプロジェクトルートの `/skills/` フォルダに出力されます。

- **デプロイ要件**: 生成された `/skills/` フォルダ自体を Git リポジトリ（GitHubなど）にコミットしておく必要があります（サイト自体のWebデプロイは必須ではありません）。
- **インストール方法**: リポジトリ指定（`user/repo`）やリポジトリURLを渡します。CLI はリポジトリ・ソースコード指定を受け取った場合、内部的にルートの `skills/` ディレクトリを参照して解決します。

```bash
npx skills add your-name/your-docs-repo
```
