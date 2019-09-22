# API リファレンス

## ユーザー

| メソッド | エンドポイント | 用途 |
| :---: |:---:|:---:|
| GET | /api/users | ユーザー一覧の取得 |
| POST | /api/users | 新規ユーザーの追加 |
| GET | /api/users/<user_id> | ユーザー情報の取得 |
| PUT | /api/users/<user_id> | ユーザー情報の更新 |
| DELETE | /api/users/<user_id> | ユーザーの削除 |
| POST | /api/users/<user_id>/login | ユーザー認証 |

## コンテンツ

| メソッド | エンドポイント | 用途 |
|:---:|:---:|:---:|
| GET | /api/contents | 試験関連の投稿一覧を取得 |

## Zwitter(SNS)

| エンドポイント | 用途 |
|:---:|:---:|
| api/posts | 投稿一覧 |
| api/likes | いいね一覧 |
| api/shares | シェア一覧 |
