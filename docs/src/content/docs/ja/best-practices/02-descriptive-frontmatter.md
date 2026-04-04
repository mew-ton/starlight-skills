---
title: 詳細で自然な Description
---

フロントマターの `description` フィールドは、スキルにおいて最も重要なメタデータです。

AIエージェントは、自分がどのスキルを使うべきかを判断するために、全てのスぺージの本文をあらかじめ読むわけではありません。エージェントは**各スキルの `description` のみを見て**、そのスキルを利用（ロード）するかどうかを自律的に決定します。

AIがスキルを正確に発見して引き出せるようにするため、自然言語（原則として英語を推奨）で以下の3要素を明確に記述してください。

1. **What:** このスキルは何をするのか
2. **When:** どのような状況（ユーザーの要求）のときに使うべきか
3. **Do not:** どのような場合には**使うべきではないか**（ネガティブトリガー）

優れた `description` の例：
`Generates descriptive commit messages by analyzing git diffs. Use this when the user asks for help writing a commit message or reviewing staged changes. Do not use this for merging branches or rebasing.`
