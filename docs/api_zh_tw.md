# DNSHE 網域 API 使用文件

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <strong>繁體中文</strong> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[返回專案介紹](../README_ZH_TW.md)

透過 API 註冊網域、管理 DNS、更新動態 IP，並自動化帳號操作。示例統一使用 DNSHE API 地址和佔位憑據；請將示例網域、ID 和金鑰替換為你自己的資源。

## 目錄

- [快速開始](#快速開始)
- [認證與請求約定](#認證與請求約定)
- [網域管理](#網域管理)
- [DNS 記錄管理](#dns-記錄管理)
- [動態 DNS（DDNS）](#動態-dnsddns)
- [API 金鑰管理](#api-金鑰管理)
- [網域轉贈](#網域轉贈)
- [配額查詢](#配額查詢)
- [WHOIS 查詢](#whois-查詢)
- [錯誤處理與速率限制](#錯誤處理與速率限制)
- [用戶端示例](#用戶端示例)
- [安全建議與常見問題](#安全建議與常見問題)
- [技術支援](#技術支援)

## 快速開始

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

基礎地址已包含 `m=domain_hub`，追加路由引數時使用 `&`。除 GET 查詢引數外，請求與響應使用 JSON。普通鑑權請求預設每分鐘 60 次，運營方可調整；功能可用性取決於帳號和部署配置。命令示例使用 Bash/sh，請先配置下列環境變數。

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## 認證與請求約定

首次金鑰請在客戶中心 → [管理網域](https://my.dnshe.com/index.php?m=domain_hub) → API 管理中建立。鑑權請求必須攜帶 `X-API-Key` 和 `X-API-Secret` 請求頭，URL 或請求體傳遞憑據的方式已禁用。GET 引數放在查詢字串中，寫操作使用 JSON 並設定 `Content-Type: application/json`。`endpoint` 選擇資源，`action` 選擇操作；`quota` 和 `whois` 無需 `action`。DDNS 使用單獨的 Token。

## 網域管理

### 1.1 列出網域

`GET` · `endpoint=subdomains` · `action=list`

#### 引數

- `page` — `integer`; 可選; 預設值 / 範圍: `1`.
- `cursor_id` — `integer`; 可選.
- `per_page` — `integer`; 可選; 預設值 / 範圍: `200; 1–500`.
- `include_total` — `boolean`; 可選; 預設值 / 範圍: `false`.
- `search` — `string`; 可選.
- `rootdomain` — `string`; 可選.
- `status` — `string`; 可選; 預設值 / 範圍: `active | suspended | expired`.
- `created_from / created_to` — `string`; 可選; 預設值 / 範圍: `YYYY-MM-DD`.
- `sort_by` — `string`; 可選; 預設值 / 範圍: `id`.
- `sort_dir` — `string`; 可選; 預設值 / 範圍: `desc; asc | desc`.
- `fields` — `string`; 可選; 預設值 / 範圍: `all`.

`page` 是從 1 開始的相容頁碼。大資料量推薦首次傳 `cursor_id=0`；當 `pagination.has_more=true` 時，將 `pagination.next_cursor_id` 用作下次遊標，變為 false 時停止。遊標模式固定按 ID 排序，不使用 OFFSET。`per_page` 預設 200、最大 500，建議先用 50–100。`include_total=1` 會額外統計總數，大資料量時可能較慢。`search` 匹配字首或根網域；`rootdomain`、`status`、`created_from`、`created_to` 用於過濾，日期格式為 YYYY-MM-DD。`sort_by` 支援 `id`、`created_at`、`updated_at`、`expires_at`、`subdomain`；`sort_dir` 為 `asc` 或 `desc`。

`fields` 為逗號分隔的欄位列表或 `all`，支援 `id`、`subdomain`、`rootdomain`、`full_domain`、`status`、`created_at`、`updated_at`、`expires_at`、`never_expires`、`cloudflare_zone_id`、`provider_account_id`。自定義選擇仍會補充 `id`。`count` 表示本次返回集合的數量，不應當作所有匹配網域的總數。

#### 請求示例

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

#### 響應示例

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

### 1.2 註冊網域

`POST` · `endpoint=subdomains` · `action=create`

#### 引數

- `subdomain` — `string`; 必填.
- `domain` — `string`; 必填.

`subdomain` 是網域字首，例如 `myapp`；`domain` 是可用根網域，例如 `de5.net`。註冊使用 `action=create` 和請求欄位 `domain`；響應中的 `rootdomain` 及同名列表過濾引數不是註冊欄位。仍需符合可用性和帳號配額要求。

#### 請求示例

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

#### 響應示例

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 獲取網域詳情

`GET` · `endpoint=subdomains` · `action=get`

#### 引數

- `subdomain_id` — `integer`; 必填.

使用當前鑑權帳號擁有的網域 ID，響應包含網域物件、`dns_records` 與 `dns_count`。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 響應示例

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

### 1.4 刪除網域

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### 引數

- `subdomain_id` — `integer`; 必填.

刪除帳號名下的目標網域及關聯 DNS 記錄，響應透過 `dns_records_deleted` 報告刪除數量。提交前請確認目標 ID。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### 響應示例

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 續期網域

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### 引數

- `subdomain_id` — `integer`; 必填.

DNSHE 正常免費續期仍然免費，示例為 `charged_amount=0`。通用外掛可配置收費贖回；涉及贖回時，請先確認網域狀態和控制檯規則。根據響應的 `previous_expires_at`、`new_expires_at`、`never_expires`、`remaining_days`、`charged_amount` 判斷實際結果。

續期失敗包括：HTTP 403 `renewal disabled`、`redemption period requires administrator`、`renewal window expired`；HTTP 422 且 `error_code=renewal_not_yet_available`；HTTP 402 `insufficient balance for redemption renewal`；HTTP 404 表示網域不存在或不屬於當前帳號。請檢查續期視窗或聯絡支援，不要無間隔重試。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### 響應示例

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

## DNS 記錄管理

### 2.1 列出 DNS 記錄

`GET` · `endpoint=dns_records` · `action=list`

#### 引數

- `subdomain_id` — `integer`; 必填.

優先使用列表或建立介面返回的模組 `id`，新公開記錄使用 15 位外顯 ID。`record_id` 是 DNS 供應商的記錄標識。修改/刪除至少提供其中一個，同時提供時必須指向同一記錄，否則返回 `dns_record_identifier_mismatch`。舊內部 ID 繼續相容。參考文件說明純數字 `record_id` 至少相容至 2027-06-12，新呼叫請將模組 ID 放入 `id`。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 響應示例

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

### 2.2 建立 DNS 記錄

`POST` · `endpoint=dns_records` · `action=create`

#### 引數

- `subdomain_id` — `integer`; 必填.
- `type` — `string`; 必填.
- `name` — `string`; 可選; 預設值 / 範圍: `@`.
- `content` — `string`; 可選.
- `ttl` — `integer`; 可選; 預設值 / 範圍: `600`.
- `priority` — `integer`; 可選; 預設值 / 範圍: `MX: 10; SRV: 0`.
- `line` — `string`; 可選.
- `record_weight / weight` — `integer`; 可選.
- `record_port / port` — `integer`; 可選; 預設值 / 範圍: `1–65535`.
- `record_target / target` — `string`; 可選.
- `caa_flag` — `integer`; 可選; 預設值 / 範圍: `0; 0–255`.
- `caa_tag` — `string`; 可選; 預設值 / 範圍: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; 可選.

`type` 支援 A、AAAA、CNAME、MX、TXT、NS、SRV、CAA。`name` 是相對於已註冊網域的名稱，省略、空值或 `@` 表示網域本身，不接受完整網域；萬用字元 `*` 只能位於最左側標籤。`content` 必填，除非由 SRV/CAA 結構化引數組裝。`ttl` 預設 600 秒；`priority` 在 MX 中預設 10，在 SRV 中預設 0。

SRV 的 `record_weight`/`weight`、`record_port`/`port`、`record_target`/`target` 分別表示權重、埠（1–65535）和目標主機，目標 `.` 表示服務不可用。CAA 使用 `caa_flag`（0–255，預設 0）、`caa_tag`（1–15 位字母數字，預設 `issue`）和 `caa_value`。`line` 僅適用於 AliDNS，其他供應商拒絕非空值。

後臺可透過 `disable_ns_management` 禁用 NS 寫入。網域委派到外部 DNS 後，建立或修改非 NS 記錄會返回 `external_dns_delegated`；刪除舊記錄、校準和過期清理不受此限制。

#### 請求示例

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

#### 響應示例

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 修改 DNS 記錄

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### 引數

- `id` — `integer`; 可選.
- `record_id` — `string`; 可選.
- `type / name / content` — `string`; 可選.
- `ttl / priority` — `integer`; 可選.
- `line` — `string`; 可選.
- `record_weight / weight` — `integer`; 可選.
- `record_port / port` — `integer`; 可選.
- `record_target / target` — `string`; 可選.
- `caa_flag` — `integer`; 可選.
- `caa_tag / caa_value` — `string`; 可選.

提供 `id` 或 `record_id`，以及需要修改的欄位。名稱規則及 SRV/CAA 選項與建立相同。兩個標識同時提供時必須指向同一記錄，響應返回模組 ID 和供應商記錄 ID。

優先使用列表或建立介面返回的模組 `id`，新公開記錄使用 15 位外顯 ID。`record_id` 是 DNS 供應商的記錄標識。修改/刪除至少提供其中一個，同時提供時必須指向同一記錄，否則返回 `dns_record_identifier_mismatch`。舊內部 ID 繼續相容。參考文件說明純數字 `record_id` 至少相容至 2027-06-12，新呼叫請將模組 ID 放入 `id`。

後臺可透過 `disable_ns_management` 禁用 NS 寫入。網域委派到外部 DNS 後，建立或修改非 NS 記錄會返回 `external_dns_delegated`；刪除舊記錄、校準和過期清理不受此限制。

#### 請求示例

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

#### 響應示例

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 刪除 DNS 記錄

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### 引數

- `id` — `integer`; 可選.
- `record_id` — `string`; 可選.

優先使用列表或建立介面返回的模組 `id`，新公開記錄使用 15 位外顯 ID。`record_id` 是 DNS 供應商的記錄標識。修改/刪除至少提供其中一個，同時提供時必須指向同一記錄，否則返回 `dns_record_identifier_mismatch`。舊內部 ID 繼續相容。參考文件說明純數字 `record_id` 至少相容至 2027-06-12，新呼叫請將模組 ID 放入 `id`。

#### 請求示例

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

#### 響應示例

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## 動態 DNS（DDNS）

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

在網域管理 → DDNS 中，為指定 A/AAAA 記錄建立專用 Token。透過 `Authorization: Bearer <DDNS_TOKEN>` 或 `X-DDNS-Token` 傳遞，不接受 URL 或請求體傳遞 Token。該 Token 只能修改繫結記錄的 IP。支援 GET、POST、PUT，下例使用 POST。可選 `ip` 指定 IPv4/IPv6；省略時使用直連請求來源 IP。更新 AAAA 時，請確保來源或指定值為相應 IPv6 地址。

`status=good` 表示 IP 已更新；`status=nochg` 且 `changed=false` 同樣表示成功，且不會呼叫 DNS 供應商。DDNS 固定使用 `https://api005.dnshe.com`，不隨客戶中心網域變化。

#### 請求示例

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

#### 響應示例

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

群暉 DSM 等裝置應使用支援請求頭的計劃指令碼，不要把 Token 放入 DDNS URL 模板。建立並儲存 Token 後，在裝置任務計劃中配置指令碼並手動測試一次。每 5 分鐘執行一次可作為起點，但不得短於後臺配置的最短更新間隔；Token 應儲存在受保護的任務環境中。

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## API 金鑰管理

### 3.1 列出 API 金鑰

`GET` · `endpoint=keys` · `action=list`

列表返回金鑰 ID、名稱、狀態、請求次數和最近使用時間，不會恢復已有 Secret。首次金鑰必須在控制檯建立。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 響應示例

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

### 3.2 建立 API 金鑰

`POST` · `endpoint=keys` · `action=create`

#### 引數

- `key_name` — `string`; 必填.
- `ip_whitelist` — `string`; 可選.

`key_name` 是新金鑰名稱。啟用 IP 允許清單時，可選 `ip_whitelist` 接受單個 IP 或 CIDR，支援逗號、換行或分號分隔。請將文件示例 IP 替換為伺服器真實出口 IP。返回的 `api_secret` 只顯示一次，必須立即儲存。

#### 請求示例

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

#### 響應示例

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 刪除 API 金鑰

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### 引數

- `key_id` — `integer`; 必填.

透過 `key_id` 撤銷目標金鑰。建議使用另一個有效金鑰管理憑據，避免刪除金鑰時意外中斷當前自動化任務。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### 響應示例

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 重新生成 API Secret

`POST` · `endpoint=keys` · `action=regenerate`

#### 引數

- `key_id` — `integer`; 必填.

重新生成 `key_id` 對應的 Secret，舊 Secret 立即失效。請立即儲存新值並更新依賴服務。若已丟失全部有效憑據，請透過控制檯恢復，不能無鑑權呼叫重新生成介面。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### 響應示例

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## 網域轉贈

### 4.1 發起轉贈

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### 引數

- `subdomain_id` — `integer`; 必填.

`subdomain_id` 必須屬於當前鑑權帳號。響應返回轉贈碼和有效期，只應將轉贈碼交給預期接收人。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### 響應示例

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

### 4.2 接受轉贈

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### 引數

- `code` — `string`; 必填.

接收方使用自己的金鑰鑑權，並提交發起方提供的 `code`。接受後網域轉移，請核對響應中的網域和來源帳號資訊。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### 響應示例

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

### 4.3 取消轉贈

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### 引數

- `gift_id` — `integer`; 必填.

`gift_id` 必須是當前使用者發起且仍為 pending 的轉贈，取消後該待接受轉贈失效。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### 響應示例

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

### 4.4 查詢轉贈記錄

`GET` · `endpoint=gifts` · `action=list`

返回轉贈記錄及狀態。`initiate`、`accept`、`cancel` 是受限流的寫操作。寫請求超時後請先查詢狀態，不要假設操作未執行。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 響應示例

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

## 配額查詢

### 5.1 查詢配額

`GET` · `endpoint=quota`

`quota` 返回 `used`、`base`、`invite_bonus`、`total`、`available`。請讀取實際配額，不要假設自己的額度與示例一致。本介面不傳 `action`。

#### 請求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 響應示例

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

## WHOIS 查詢

`GET` · `endpoint=whois`

#### 引數

- `domain` — `string`; 必填.

必填 `domain` 為完整網域，可查詢系統內網域及外部 WHOIS。公共模式預設無需金鑰，每 IP 每分鐘 2 次，與普通 API 限流獨立配置。後臺可強制 API Key 鑑權，此時使用常規兩個請求頭。本介面不傳 `action`。

郵箱和郵政編碼的可見性由隱私配置決定；`registrant_postal_code` 獨立於舊欄位 `registrant_address`。`owner_userid` 僅用於系統內網域，預設只對已鑑權的所屬帳號返回，運營方可調整可見性；公共 WHOIS 預設不暴露內部使用者 ID。不要假設可選身份欄位一定存在。

公共狀態包括 `Registered`、`RenewalGracePeriod`、`RedemptionPeriod`、`ServerHold`、`PendingDelete`、`unregistered`。`nameservers` 及別名 `name_servers` 優先使用實際 NS，否則使用配置預設值。永久網域返回 `expires_at="2999-12-31 23:59"`，不包含 `never_expires`。未註冊網域返回 `registered=false`、`status=unregistered`。公共模式的 `rate_limit` 表示當前 IP 的剩餘額度。

#### 請求示例

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 響應示例

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

## 錯誤處理與速率限制

同時檢查 HTTP 狀態和 JSON `success`。業務判斷應使用穩定的 `error_code`，不要匹配可能變化的提示文案。`message` 是可讀描述，`details` 是可選上下文，相容欄位 `error` 與 message 含義相同。非 JSON 的上游響應也應作為失敗處理。常見錯誤碼及 HTTP 狀態如下，續期錯誤見對應章節。

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

普通 API 預設每分鐘 60 次，公共 WHOIS 預設每 IP 每分鐘 2 次，實際值可能不同。若響應提供 `details.limit`、`details.remaining`、`details.reset_at`，請據此處理。配額耗盡和限流都可能返回 HTTP 429，應區分 `quota_exceeded` 與 `rate_limit_exceeded`。

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

讀取請求被限流時，可等待 reset 時間或使用有上限、帶隨機抖動的指數退避。建立、刪除、續期、接受轉贈或金鑰輪換超時後，不要直接重複執行；先檢查資源當前狀態。示例用戶端不自動重試寫操作。

## 用戶端示例

這些是輕量參考用戶端，不是官方 SDK。它們編碼查詢引數、傳送 JSON、設定超時並檢查 HTTP/API 錯誤。請從倉庫根目錄執行示例。Node.js 需要內建 fetch 和 AbortSignal.timeout；Python 僅使用標準庫；PHP 需要 cURL 和 JSON 支援。憑據只應放在可信服務端，不能放入瀏覽器 JavaScript。

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

## 安全建議與常見問題

使用 HTTPS、受保護的環境變數、按用途分開的金鑰及最小可用許可權。生產環境可用時開啟 IP 允許清單，定期輪換 Secret、撤銷閒置金鑰並檢查請求日誌。API/DDNS Token 不應出現在程式碼倉庫、URL、截圖或公開日誌中。

Secret 丟失：使用其他有效憑據或控制檯重新生成，舊值失效。提高請求限制：聯絡支援。子帳號：參考實現僅允許主帳號建立和使用金鑰。批次操作：未記錄批次介面，請逐個呼叫。使用統計：在 API 管理或金鑰列表中檢視呼叫次數及最近使用時間。

## 技術支援

帳號、介面可用性或續期問題請聯絡 [support@dnshe.com](mailto:support@dnshe.com)。部署相關配置請參閱 [線上 API 手冊](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) 和 [管理網域](https://my.dnshe.com/index.php?m=domain_hub)。

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
