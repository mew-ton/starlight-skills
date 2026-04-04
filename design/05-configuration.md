# プラグイン設定

## `targetLocale`

スキルとして認識する対象の言語を指定する。Starlight の i18n が有効な場合に使用する。

- 指定した言語のコンテンツディレクトリ配下のページのみをスキル認識の対象とする
- 未指定の場合は Starlight のデフォルト言語を使用する
- i18n が無効な場合、このオプションは無視される
- `autoCategoryMode: 'path'` でカテゴリを導出する際、ロケールのサブディレクトリ部分はカテゴリパスから除外する（例: `en/skills/frontend` → `skills/frontend`）

**デフォルト:** Starlight のデフォルト言語

---

## `outputMode`

スキルファイルの出力先を制御する。

| 値 | 動作 |
|---|---|
| `'well-known-endpoint'` | `dist/.well-known/skills/` にのみ出力する |
| `'collocated'` | リポジトリルートの `skills/` にのみ出力する |
| `'both'` | 両方に出力する |

**デフォルト:** `'both'`

---

## `autoGeneratePages`

プラグインが自動生成するページの種類を制御する。

```ts
autoGeneratePages?: {
  skill?: boolean;    // スキルページの生成
  catalog?: boolean;  // カタログページの生成
}
```

### `skill`

`true` にすると、`skill: true` のページごとに AI スキルとしての見え方を示すスキルページを `/<skillsRoot>/<skill-name>` に生成する。元ページとは別の URL に配置される。

### `catalog`

`true` にすると、スキルの一覧を表示するカタログページを `/<skillsRoot>/` に生成する。

**デフォルト:** `{ skill: true, catalog: true }`

---

## `skillsRoot`

プラグインが生成するすべてのページのベースパス。カタログ・スキルページ・付随ファイル閲覧ページはすべてこのパス配下に配置される。

**デフォルト:** `'__skills'`

---

## `catalogCategoryDisplay`

カタログページでの階層カテゴリの表示方法を制御する。

| 値 | 動作 |
|---|---|
| `'nested'`（デフォルト） | 上位カテゴリのセクション内に下位カテゴリをネストして表示する |
| `'flat'` | カテゴリパス全体をフラットなセクションラベルとして表示する（例: `development/frontend`） |

**デフォルト:** `'nested'`

---

## `autoCategoryMode`

スキルページに `skill-category` が設定されていない場合に、カテゴリを自動導出する方法を制御する。

| 値 | 動作 |
|---|---|
| `'path'`（デフォルト） | コンテンツルートを基準としたファイルのディレクトリパスからカテゴリを導出する |
| `false` | 自動導出を無効化する。カテゴリはフロントマターの明示指定のみから取得する |

---

## `sidebarLabel`

Starlight サイドバーのスキルグループのラベル。

**デフォルト:** `'Skills'`
