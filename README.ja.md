# starlight-skills

*[Read this in English (英語) 🇺🇸](./README.md)*

ドキュメントを AI インストール可能なスキルに変換する [Starlight](https://starlight.astro.build/) プラグイン。

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

## ドキュメント

セットアップガイド、フロントマターの詳細なスキーマ、設定項目のオプションリストなど、さらに詳しいドキュメントは以下の専用サイトをご覧ください。

👉 **[starlight-skills 公式ドキュメント](https://mew-ton.github.io/starlight-skills/)**
