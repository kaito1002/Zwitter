# API リファレンス

## 認証

| メソッド | エンドポイント | 用途 |
| :---: |:---|:---|
| POST | /api-token-auth/ | トークンの取得(要: number, password) |

## ユーザー

| メソッド | エンドポイント | 用途 |
| :---: |:---|:---|
| GET | /api/users | ユーザー一覧の取得 |
| POST | /api/users | 新規ユーザーの追加 |
| GET | /api/users/<user_id> | ユーザー情報の取得 |
| PUT | /api/users/<user_id> | ユーザー情報の更新 |
| DELETE | /api/users/<user_id> | ユーザーの削除 |
| POST | /api/users/<user_id>/login | ユーザー認証 |

## コンテンツ

| メソッド | エンドポイント | 用途 |
|:---:|:---|:---|
| GET | /api/contents | 試験関連の投稿一覧を取得 |

## Zwitter(SNS)

| メソッド | エンドポイント | 用途 |
| :---: |:---|:---|
| GET | api/posts | 投稿一覧 |
| GET | api/likes | いいね一覧 |
| GET | api/shares | シェア一覧 |
