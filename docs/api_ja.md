# DNSHE ドメイン API リファレンス

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <strong>日本語</strong> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[サービス紹介に戻る](../README_JA.md)

ドメイン登録、DNS 管理、動的 IP の更新、アカウント操作を自動化できます。例では DNSHE の API ホストと仮の認証情報を使用しています。名前、ID、認証情報は自分のリソースに置き換えてください。

## 目次

- [はじめに](#はじめに)
- [認証とリクエストの規則](#認証とリクエストの規則)
- [ドメイン管理](#ドメイン管理)
- [DNS レコード管理](#dns-レコード管理)
- [動的 DNS（DDNS）](#動的-dnsddns)
- [API キー管理](#api-キー管理)
- [ドメインの譲渡](#ドメインの譲渡)
- [利用枠](#利用枠)
- [WHOIS 検索](#whois-検索)
- [エラーとレート制限](#エラーとレート制限)
- [クライアントの実装例](#クライアントの実装例)
- [セキュリティとよくある質問](#セキュリティとよくある質問)
- [サポート](#サポート)

## はじめに

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

ベース URL には `m=domain_hub` が含まれます。追加パラメーターには `&` を使ってください。GET のクエリ以外は JSON を使用します。通常の認証付き API は既定で毎分 60 リクエストですが、運営側で変更できます。機能の利用可否はアカウントと設定によります。シェル例は Bash/sh 用です。まず次の環境変数を設定してください。

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## 認証とリクエストの規則

最初の API キーはクライアントエリア → [ドメイン管理](https://my.dnshe.com/index.php?m=domain_hub) → API 管理で作成します。認証には `X-API-Key` と `X-API-Secret` ヘッダーを使います。URL やボディでの認証情報の送信は無効です。GET パラメーターはクエリ、書き込みパラメーターは `Content-Type: application/json` 付きの JSON ボディで送信します。`endpoint` はリソース、`action` は操作を指定します。`quota` と `whois` に `action` は不要です。DDNS は専用トークンを使用します。

## ドメイン管理

### 1.1 ドメイン一覧

`GET` · `endpoint=subdomains` · `action=list`

#### パラメーター

- `page` — `integer`; 任意; 初期値 / 範囲: `1`.
- `cursor_id` — `integer`; 任意.
- `per_page` — `integer`; 任意; 初期値 / 範囲: `200; 1–500`.
- `include_total` — `boolean`; 任意; 初期値 / 範囲: `false`.
- `search` — `string`; 任意.
- `rootdomain` — `string`; 任意.
- `status` — `string`; 任意; 初期値 / 範囲: `active | suspended | expired`.
- `created_from / created_to` — `string`; 任意; 初期値 / 範囲: `YYYY-MM-DD`.
- `sort_by` — `string`; 任意; 初期値 / 範囲: `id`.
- `sort_dir` — `string`; 任意; 初期値 / 範囲: `desc; asc | desc`.
- `fields` — `string`; 任意; 初期値 / 範囲: `all`.

`page` は 1 始まりの互換ページ番号です。大量データでは `cursor_id=0` から開始し、`pagination.has_more=true` の間は `pagination.next_cursor_id` を次のカーソルに使います。false で終了します。カーソルモードは OFFSET を使わず ID 順に処理します。`per_page` は既定 200、上限 500、目安は 50–100 です。`include_total=1` は負荷の高い総件数集計を追加します。`search` は接頭辞とルートドメインを検索し、`rootdomain`、`status`、`created_from`、`created_to` で絞り込みます。日付は YYYY-MM-DD です。`sort_by` は `id`、`created_at`、`updated_at`、`expires_at`、`subdomain`、`sort_dir` は `asc` / `desc` に対応します。

`fields` はカンマ区切り、または `all` です。対象は `id`、`subdomain`、`rootdomain`、`full_domain`、`status`、`created_at`、`updated_at`、`expires_at`、`never_expires`、`cloudflare_zone_id`、`provider_account_id` で、独自指定にも `id` が追加されます。`count` は今回返された件数で、検索対象全体の総数とは限りません。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list&cursor_id=0&per_page=100&fields=id,subdomain,rootdomain,status" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list&search=test&rootdomain=de5.net&status=active&sort_by=expires_at&sort_dir=asc&per_page=50" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "count": 2,
  "subdomains": [
    {
      "id": 1,
      "subdomain": "test",
      "rootdomain": "de5.net",
      "full_domain": "test.de5.net",
      "status": "active",
      "created_at": "2025-10-19 10:00:00",
      "updated_at": "2025-10-19 10:00:00"
    },
    {
      "id": 2,
      "subdomain": "api",
      "rootdomain": "de5.net",
      "full_domain": "api.de5.net",
      "status": "active",
      "created_at": "2025-10-19 11:00:00",
      "updated_at": "2025-10-19 11:00:00"
    }
  ]
}
```

```json
{
  "success": true,
  "count": 1,
  "subdomains": [
    {
      "id": 901,
      "subdomain": "test",
      "rootdomain": "de5.net",
      "full_domain": "test.de5.net",
      "status": "active"
    }
  ],
  "pagination": {
    "mode": "cursor",
    "page": 1,
    "per_page": 100,
    "has_more": true,
    "cursor_id": 0,
    "next_cursor_id": 901
  }
}
```

### 1.2 ドメイン登録

`POST` · `endpoint=subdomains` · `action=create`

#### パラメーター

- `subdomain` — `string`; 必須.
- `domain` — `string`; 必須.

`subdomain` は `myapp` などの接頭辞、`domain` は `de5.net` などの利用可能なルートドメインです。登録には `action=create` と `domain` を使います。レスポンスと一覧フィルターの `rootdomain` は登録用フィールドではありません。空き状況と利用枠の制限が適用されます。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=create" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "myapp",
    "domain": "de5.net"
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 ドメイン詳細

`GET` · `endpoint=subdomains` · `action=get`

#### パラメーター

- `subdomain_id` — `integer`; 必須.

認証したアカウントが所有するドメイン ID を指定します。ドメイン情報、`dns_records`、`dns_count` が返されます。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "subdomain": {
    "id": 1,
    "subdomain": "test",
    "rootdomain": "de5.net",
    "full_domain": "test.de5.net",
    "status": "active",
    "created_at": "2025-10-19 10:00:00",
    "updated_at": "2025-10-19 10:00:00"
  },
  "dns_records": [
    {
      "id": 1,
      "name": "test.de5.net",
      "type": "A",
      "content": "203.0.113.10",
      "ttl": 600,
      "priority": null,
      "status": "active",
      "created_at": "2025-10-19 10:05:00"
    }
  ],
  "dns_count": 1
}
```

### 1.4 ドメイン削除

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### パラメーター

- `subdomain_id` — `integer`; 必須.

所有ドメインと関連 DNS レコードを削除し、`dns_records_deleted` で削除数を返します。送信前に対象 ID を確認してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 ドメイン更新

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### パラメーター

- `subdomain_id` — `integer`; 必須.

通常の DNSHE 無料更新は無料で、例の `charged_amount` は 0 です。汎用プラグインでは有料の復旧を設定できるため、復旧期間中は管理画面の状態と規則を確認してください。結果は `previous_expires_at`、`new_expires_at`、`never_expires`、`remaining_days`、`charged_amount` で判断します。

更新エラーには HTTP 403 の `renewal disabled`、`redemption period requires administrator`、`renewal window expired`、HTTP 422 の `renewal_not_yet_available`、HTTP 402 の `insufficient balance for redemption renewal`、未存在・非所有ドメインの HTTP 404 があります。期間を確認するかサポートに連絡し、連続再試行は避けてください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "Subdomain renewed successfully",
  "subdomain_id": 3,
  "subdomain": "myapp",
  "previous_expires_at": "2027-05-01 00:00:00",
  "new_expires_at": "2028-05-01 00:00:00",
  "renewed_at": "2027-04-30 00:00:00",
  "never_expires": 0,
  "status": "active",
  "remaining_days": 367,
  "charged_amount": 0
}
```

## DNS レコード管理

### 2.1 DNS レコード一覧

`GET` · `endpoint=dns_records` · `action=list`

#### パラメーター

- `subdomain_id` — `integer`; 必須.

一覧・作成で返るモジュールの `id` を優先してください。新しい公開レコードでは 15 桁の ID です。`record_id` は DNS プロバイダーの識別子です。変更・削除には少なくとも一方が必要で、両方指定する場合は同じレコードを指す必要があります。不一致は `dns_record_identifier_mismatch` です。旧内部 ID は互換対応し、数字のみの `record_id` は少なくとも 2027-06-12 までの互換性が記載されています。新規実装ではモジュール ID を `id` に指定してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "count": 2,
  "records": [
    {
      "id": 1,
      "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997",
      "name": "test.de5.net",
      "type": "A",
      "content": "203.0.113.10",
      "ttl": 600,
      "priority": null,
      "line": null,
      "proxied": false,
      "status": "active",
      "created_at": "2025-10-19 10:05:00",
      "updated_at": "2025-10-19 10:05:00"
    },
    {
      "id": 2,
      "name": "www.test.de5.net",
      "type": "CNAME",
      "content": "test.de5.net",
      "ttl": 600,
      "priority": null,
      "proxied": false,
      "status": "active",
      "created_at": "2025-10-19 10:10:00"
    }
  ]
}
```

### 2.2 DNS レコード作成

`POST` · `endpoint=dns_records` · `action=create`

#### パラメーター

- `subdomain_id` — `integer`; 必須.
- `type` — `string`; 必須.
- `name` — `string`; 任意; 初期値 / 範囲: `@`.
- `content` — `string`; 任意.
- `ttl` — `integer`; 任意; 初期値 / 範囲: `600`.
- `priority` — `integer`; 任意; 初期値 / 範囲: `MX: 10; SRV: 0`.
- `line` — `string`; 任意.
- `record_weight / weight` — `integer`; 任意.
- `record_port / port` — `integer`; 任意; 初期値 / 範囲: `1–65535`.
- `record_target / target` — `string`; 任意.
- `caa_flag` — `integer`; 任意; 初期値 / 範囲: `0; 0–255`.
- `caa_tag` — `string`; 任意; 初期値 / 範囲: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; 任意.

`type` は A、AAAA、CNAME、MX、TXT、NS、SRV、CAA に対応します。`name` は登録ドメインからの相対名で、省略・空・`@` はドメイン自体を表します。完全なドメイン名は指定できず、`*` は左端ラベルのみです。`content` は SRV/CAA の構造化入力から組み立てる場合を除き必須です。`ttl` は既定 600 秒、`priority` は MX で 10、SRV で 0 です。

SRV の `record_weight`/`weight`、`record_port`/`port`、`record_target`/`target` は重み、ポート（1–65535）、対象ホストです。対象 `.` はサービス利用不可を表します。CAA は `caa_flag`（0–255、既定 0）、`caa_tag`（英数字 1–15 文字、既定 `issue`）、`caa_value` を使います。`line` は AliDNS 専用で、他のプロバイダーでは空以外の値が拒否されます。

`disable_ns_management` により NS 書き込みが無効な場合があります。外部 DNS に委任されたドメインで非 NS レコードを作成・変更すると `external_dns_delegated` になります。旧レコードの削除、整合処理、期限切れクリーンアップは対象外です。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=create" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1,
    "type": "A",
    "content": "203.0.113.10",
    "ttl": 600
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 DNS レコード変更

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### パラメーター

- `id` — `integer`; 任意.
- `record_id` — `string`; 任意.
- `type / name / content` — `string`; 任意.
- `ttl / priority` — `integer`; 任意.
- `line` — `string`; 任意.
- `record_weight / weight` — `integer`; 任意.
- `record_port / port` — `integer`; 任意.
- `record_target / target` — `string`; 任意.
- `caa_flag` — `integer`; 任意.
- `caa_tag / caa_value` — `string`; 任意.

`id` または `record_id` と変更対象フィールドを送信します。名前や SRV/CAA の規則は作成と同じです。両識別子は同じレコードを指す必要があります。レスポンスには両方の ID が返ります。

一覧・作成で返るモジュールの `id` を優先してください。新しい公開レコードでは 15 桁の ID です。`record_id` は DNS プロバイダーの識別子です。変更・削除には少なくとも一方が必要で、両方指定する場合は同じレコードを指す必要があります。不一致は `dns_record_identifier_mismatch` です。旧内部 ID は互換対応し、数字のみの `record_id` は少なくとも 2027-06-12 までの互換性が記載されています。新規実装ではモジュール ID を `id` に指定してください。

`disable_ns_management` により NS 書き込みが無効な場合があります。外部 DNS に委任されたドメインで非 NS レコードを作成・変更すると `external_dns_delegated` になります。旧レコードの削除、整合処理、期限切れクリーンアップは対象外です。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=modify" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 738492016583241,
    "type": "A",
    "content": "203.0.113.20",
    "ttl": 600
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 DNS レコード削除

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### パラメーター

- `id` — `integer`; 任意.
- `record_id` — `string`; 任意.

一覧・作成で返るモジュールの `id` を優先してください。新しい公開レコードでは 15 桁の ID です。`record_id` は DNS プロバイダーの識別子です。変更・削除には少なくとも一方が必要で、両方指定する場合は同じレコードを指す必要があります。不一致は `dns_record_identifier_mismatch` です。旧内部 ID は互換対応し、数字のみの `record_id` は少なくとも 2027-06-12 までの互換性が記載されています。新規実装ではモジュール ID を `id` に指定してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1
  }'
```

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## 動的 DNS（DDNS）

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

ドメイン管理 → DDNS で特定の A/AAAA レコード用トークンを作成します。`Authorization: Bearer <DDNS_TOKEN>` または `X-DDNS-Token` で送信し、URL やボディには入れないでください。トークンは紐づくレコードの IP のみ変更できます。GET、POST、PUT に対応し、例は POST です。任意の `ip` で IPv4/IPv6 を指定でき、省略時は直接接続の送信元 IP を使います。AAAA 更新では対応する IPv6 を使ってください。

`status=good` は変更成功、`status=nochg` と `changed=false` は変更不要の成功で、DNS プロバイダーは呼び出されません。DDNS のホストはクライアントエリアと独立した `https://api005.dnshe.com` です。

#### リクエスト例

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update" \
  -H "Authorization: Bearer ${DNSHE_DDNS_TOKEN}"
```

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update" \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"ip":"203.0.113.10"}'
```

#### レスポンス例

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

Synology DSM などではヘッダーを送れる定期実行スクリプトを使い、トークンを DDNS URL テンプレートに入れないでください。トークンを保存し、タスクを設定して手動テストします。5 分間隔を目安にできますが、設定された最短間隔を下回らないでください。保護されたタスク環境にトークンを保存します。

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## API キー管理

### 3.1 API キー一覧

`GET` · `endpoint=keys` · `action=list`

キー ID、名前、状態、利用回数、最終利用時刻を返します。既存 Secret は取得できません。最初の認証情報は管理画面で作成します。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "count": 2,
  "keys": [
    {
      "id": 1,
      "key_name": "Production",
      "api_key": "cfsd_xxxxxxxxxx",
      "status": "active",
      "request_count": 1523,
      "last_used_at": "2025-10-19 15:30:00",
      "created_at": "2025-10-19 10:00:00"
    },
    {
      "id": 2,
      "key_name": "Test",
      "api_key": "cfsd_yyyyyyyyyy",
      "status": "active",
      "request_count": 45,
      "last_used_at": "2025-10-19 14:00:00",
      "created_at": "2025-10-19 11:00:00"
    }
  ]
}
```

### 3.2 API キー作成

`POST` · `endpoint=keys` · `action=create`

#### パラメーター

- `key_name` — `string`; 必須.
- `ip_whitelist` — `string`; 任意.

`key_name` はキー名です。IP 許可リストが有効な場合、`ip_whitelist` には IP/CIDR をカンマ・改行・セミコロン区切りで指定できます。例の IP は実際の送信元 IP に置き換えてください。`api_secret` は一度だけ表示されるため、すぐに保存してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=create" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_name": "Deployment",
    "ip_whitelist": "203.0.113.10/32"
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 API キー削除

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### パラメーター

- `key_id` — `integer`; 必須.

`key_id` のキーを失効させます。現在の処理が意図せず停止しないよう、別の有効なキーで認証情報を管理してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 API Secret 再生成

`POST` · `endpoint=keys` · `action=regenerate`

#### パラメーター

- `key_id` — `integer`; 必須.

`key_id` の Secret を再生成し、旧 Secret を無効にします。新値を保存して関連サービスを更新してください。有効な認証情報をすべて失った場合は、未認証 API ではなく管理画面から復旧します。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## ドメインの譲渡

### 4.1 譲渡の開始

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### パラメーター

- `subdomain_id` — `integer`; 必須.

`subdomain_id` は認証アカウントの所有ドメインである必要があります。譲渡コードと期限が返ります。コードは予定した受取人だけに共有してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "data": {
    "gift_id": 88,
    "subdomain_id": 123,
    "full_domain": "demo.de5.net",
    "code": "AB12CD34EF56GH78IJ",
    "expires_at": "2026-05-12 08:00:00"
  }
}
```

### 4.2 譲渡の受け取り

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### パラメーター

- `code` — `string`; 必須.

受取人自身のキーで認証し、送信者の `code` を送ります。受け取りでドメインが移転するため、返されたドメインと元アカウントを確認してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "data": {
    "gift_id": 88,
    "subdomain_id": 123,
    "full_domain": "demo.de5.net",
    "from_userid": 1001
  }
}
```

### 4.3 譲渡の取り消し

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### パラメーター

- `gift_id` — `integer`; 必須.

`gift_id` は現在のユーザーが開始した pending 状態の譲渡である必要があります。取り消しでその譲渡は無効になります。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### レスポンス例

```json
{
  "success": true,
  "data": {
    "gift_id": 88,
    "subdomain_id": 123,
    "full_domain": "demo.de5.net"
  }
}
```

### 4.4 譲渡記録一覧

`GET` · `endpoint=gifts` · `action=list`

譲渡記録と状態を返します。`initiate`、`accept`、`cancel` はレート制限付きの書き込みです。タイムアウト時は未実行と決めつけず、状態を確認してから再試行してください。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "count": 1,
  "gifts": [
    {
      "id": 88,
      "code": "AB12CD34EF56GH78IJ",
      "full_domain": "demo.de5.net",
      "status": "pending",
      "from_userid": 1001,
      "to_userid": 0,
      "expires_at": "2026-05-12 08:00:00",
      "created_at": "2026-05-11 08:00:00"
    }
  ]
}
```

## 利用枠

### 5.1 利用枠の確認

`GET` · `endpoint=quota`

`quota` 内に `used`、`base`、`invite_bonus`、`total`、`available` を返します。例の値を固定せず、実際の応答を使ってください。`action` は不要です。

#### リクエスト例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "quota": {
    "used": 3,
    "base": 5,
    "invite_bonus": 2,
    "total": 7,
    "available": 4
  }
}
```

## WHOIS 検索

`GET` · `endpoint=whois`

#### パラメーター

- `domain` — `string`; 必須.

必須の `domain` に完全な名前を指定し、内部ドメインと外部 WHOIS を検索します。公開モードは既定で認証不要、IP ごとに毎分 2 回です。通常 API とは別に設定できます。認証必須の場合は通常の 2 ヘッダーを使います。`action` は不要です。

メールと郵便番号の表示はプライバシー設定によります。`registrant_postal_code` と旧 `registrant_address` は別フィールドです。内部ドメインの `owner_userid` は既定では認証した所有者のみへの表示ですが、運営側で変更できます。公開 WHOIS は既定で内部ユーザー ID を公開しません。任意の本人情報が必ず返るとは限りません。

状態は `Registered`、`RenewalGracePeriod`、`RedemptionPeriod`、`ServerHold`、`PendingDelete`、`unregistered` などです。`nameservers` と別名 `name_servers` は実 NS を優先し、なければ既定値を使います。永久ドメインは `expires_at="2999-12-31 23:59"` を返し、`never_expires` は返しません。未登録は `registered=false` と `status=unregistered` です。公開モードの `rate_limit` は現在の IP の残り枠です。

#### リクエスト例

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### レスポンス例

```json
{
  "success": true,
  "domain": "foo.de5.net",
  "status": "Registered",
  "registered_at": "2025-01-10 08:30:00",
  "expires_at": "2026-01-10 08:30:00",
  "registrant_email": "whois@example.com",
  "privacy_enabled": false,
  "registrant_postal_code": "797653",
  "owner_userid": 123,
  "nameservers": [
    "ns1.example.net",
    "ns2.example.net"
  ],
  "rate_limit": {
    "limit": 2,
    "remaining": 1,
    "reset_at": "2025-01-10 08:31:00"
  }
}
```

```json
{
  "success": true,
  "domain": "foo.de5.net",
  "registered": false,
  "status": "unregistered",
  "message": "domain not registered"
}
```

## エラーとレート制限

HTTP ステータスと JSON の `success` を確認し、変わり得るメッセージではなく安定した `error_code` で処理します。`message` は説明、`details` は任意の補足、旧 `error` は message と同じ意味です。JSON でない上流応答も失敗として扱います。主なコードと HTTP ステータスを以下に示します。更新固有のエラーは更新の項を参照してください。

- `bad_request` — HTTP `400`.
- `auth_invalid_credentials` — HTTP `401`.
- `auth_ip_not_allowed` — HTTP `403`.
- `api_access_disabled` — HTTP `403`.
- `not_found / subdomain_not_found / dns_record_not_found` — HTTP `404`.
- `quota_exceeded` — HTTP `429`.
- `rate_limit_exceeded` — HTTP `429`.
- `provider_operation_failed` — HTTP `502`.
- `internal_error` — HTTP `500`.
- `renewal_not_yet_available` — HTTP `422`.

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key",
  "details": {
    "request_id": "example-request-id"
  },
  "error": "Invalid API key"
}
```

通常 API は既定毎分 60 回、公開 WHOIS は IP ごとに毎分 2 回で、実設定は異なる場合があります。返された `details.limit`、`details.remaining`、`details.reset_at` を使います。HTTP 429 は利用枠不足とレート制限の両方に使われるため、`quota_exceeded` と `rate_limit_exceeded` を区別してください。

```json
{
  "success": false,
  "error_code": "rate_limit_exceeded",
  "message": "Rate limit exceeded",
  "details": {
    "limit": 60,
    "remaining": 0,
    "reset_at": "2026-10-07 12:31:00"
  },
  "error": "Rate limit exceeded"
}
```

読み取りの制限時はリセットまで待つか、上限とランダムな揺らぎのある指数バックオフを使います。作成、削除、更新、譲渡受け取り、Secret 変更のタイムアウト後は状態を確認し、即座に再送しないでください。実装例は書き込みを自動再試行しません。

## クライアントの実装例

公式 SDK ではなく、小さな参考クライアントです。クエリのエンコード、JSON、タイムアウト、HTTP/API エラーに対応します。リポジトリのルートから実行してください。Node.js は組み込み fetch と AbortSignal.timeout、Python は標準ライブラリ、PHP は cURL と JSON を使います。認証情報は信頼できるサーバーに保管し、ブラウザーの JavaScript に入れないでください。

### Node.js

[client.cjs](../examples/client.cjs)

```javascript
const { DNSHEClient } = require('./examples/client.cjs');
const client = new DNSHEClient(
  'https://api005.dnshe.com/index.php?m=domain_hub',
  process.env.DNSHE_API_KEY, process.env.DNSHE_API_SECRET
);
client.request('subdomains', 'list', 'GET', { cursor_id: 0, per_page: 100 })
  .then(console.log)
  .catch(error => { console.error(error.code || 'request_failed', error.message); process.exitCode = 1; });
```

### Python

[client.py](../examples/client.py)

```python
import os
from examples.client import DNSHEClient

client = DNSHEClient(
    'https://api005.dnshe.com/index.php?m=domain_hub',
    os.environ['DNSHE_API_KEY'], os.environ['DNSHE_API_SECRET']
)
print(client.request('subdomains', 'list', data={'cursor_id': 0, 'per_page': 100}))
```

### PHP

[client.php](../examples/client.php)

```php
<?php
require __DIR__ . '/examples/client.php';
$client = new DNSHEClient(
    'https://api005.dnshe.com/index.php?m=domain_hub',
    getenv('DNSHE_API_KEY') ?: '', getenv('DNSHE_API_SECRET') ?: ''
);
try {
    print_r($client->request('subdomains', 'list', 'GET', ['cursor_id' => 0, 'per_page' => 100]));
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . PHP_EOL);
    exit(1);
}
```

## セキュリティとよくある質問

HTTPS、保護された環境変数、用途別キー、利用可能な最小権限を使ってください。本番では可能なら IP 許可リストを有効化し、Secret の更新、不要キーの失効、ログの確認を行います。API/DDNS トークンをリポジトリ、URL、スクリーンショット、公開ログに含めないでください。

Secret 紛失時は別の有効な認証情報か管理画面で再生成し、旧値は無効になります。レート上限変更はサポートへ依頼してください。参照実装ではキー作成・利用はメインアカウントのみです。一括 API は記載されていないため個別に呼び出します。利用回数と最終利用時刻は API 管理かキー一覧で確認できます。

## サポート

アカウント、利用可能な API、更新の質問は [support@dnshe.com](mailto:support@dnshe.com) へ。環境固有の設定は [オンライン API マニュアル](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) と [ドメイン管理](https://my.dnshe.com/index.php?m=domain_hub) を参照してください。

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
