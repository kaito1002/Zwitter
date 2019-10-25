# API リファレンス

## 認証

| メソッド | エンドポイント | 用途 |
| :---: |:---|:---|
| POST | /api-token-auth/ | トークンの取得(要: number, password) |

### 認証方式

``` markup
Authorization: TOKEN <authorization token>'
```

をヘッダーに含める

基本的に全てのエンドポイントは認証が必要.

## ユーザー

| メソッド | エンドポイント | 用途 |
| :---: |:---|:---|
| GET | /api/users/ | ユーザー一覧の取得 |
| POST | /api/users/ | 新規ユーザーの追加 |
| GET | /api/users/<user_id>/ | ユーザー情報の取得 |
| PUT | /api/users/<user_id>/ | ユーザー情報の更新 |
| DELETE | /api/users/<user_id>/ | ユーザーの削除 |

## 試験共有関連

| メソッド | エンドポイント | 用途 |
|:---:|:---|:---|
| GET | /api/contents/ | 試験関連の一覧を取得 |
| POST | /api/contents/ | コンテンツを投稿 |
| GET | /api/contents/user_related/ | 認証ユーザーに関連する試験の投稿一覧を取得 |
| GET | /api/exams/ | 試験一覧を取得 |
| GET | /api/exams/user_related/ | 認証ユーザーに関連する試験一覧を取得 |
| GET | /api/subjects/ | 科目一覧を取得 |
| GET | /api/subjects/user_related/ | 認証ユーザーに関連する科目一覧を取得 |
| GET | /api/subjects/user_related_exists/ | 認証ユーザーに関連しデータの存在する科目一覧を取得 |
| GET | /api/subjects/<subject_id>/years/ | データが存在する年度を取得 |
| GET | /api/subjects/search/?keyword=<検索ワード> | 科目の検索API |
| GET | /api/subjects/search_v2/?keyword=<検索ワード> | ユーザー関連の科目の検索API |
| POST | /api/comments/ | コメントを投稿 |
| GET | /api/comments/?exam=<exam_id>/ | Examに紐付いたコメント一覧を取得 |
| GET | /api/comments/?bef_comment=<comment_id>/ | コメントに対する返信一覧を取得 |

### パラメータ

| エンドポイント | パラメータ |
|:---|:---|
| /api/contents/ | subject: int, year: int, type: int, data: str |
| /api/comments/ | subject: int, bef_comment: int(null=>-1), data: str |
| /api/contents/ | bef_post: int(null->-1), content: str |
| /api/subjects/filter/ | grades: qs(array), quarters: qs(array) |

## Zwitter(SNS)

| メソッド | エンドポイント | 用途 |
| :---: |:---|:---|
| GET | api/posts/ | 投稿一覧を取得 |
| POST | api/posts/ | ズイート(仮名)を投稿 |
| GET | api/likes/ | いいね一覧 |
| POST | api/likes/ | いいねを追加 |
| GET | api/shares/ | シェア一覧 |
| POST | api/shares/ | シェアを追加 |
