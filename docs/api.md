# DNSHE Domain API Reference

<p align="center" dir="ltr"><strong>English</strong> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Back to introduction](../README.md)

Register domains, manage DNS, update dynamic IPs and automate account workflows. Examples use the DNSHE API host and placeholder credentials; replace example names and IDs with resources you own.

## Contents

- [Getting started](#getting-started)
- [Authentication and request conventions](#authentication-and-request-conventions)
- [Domain management](#domain-management)
- [DNS record management](#dns-record-management)
- [Dynamic DNS (DDNS)](#dynamic-dns-ddns)
- [API key management](#api-key-management)
- [Domain gifts](#domain-gifts)
- [Quota](#quota)
- [WHOIS](#whois)
- [Errors and rate limits](#errors-and-rate-limits)
- [Client examples](#client-examples)
- [Security and FAQ](#security-and-faq)
- [Support](#support)

## Getting started

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

The base URL already contains `m=domain_hub`; append route parameters with `&`. Requests and responses use JSON, except GET query parameters. General authenticated access defaults to 60 requests/minute and can be configured by the operator. Function availability depends on your account and deployment settings. The shell examples use Bash/sh; configure these environment variables first.

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## Authentication and request conventions

Create your first API key in the client area → [Manage domains](https://my.dnshe.com/index.php?m=domain_hub) → API Management. Send `X-API-Key` and `X-API-Secret` headers on authenticated requests. Credentials in URL queries or request bodies are disabled. Send GET parameters in the query string; send write parameters as JSON with `Content-Type: application/json`. `endpoint` selects the resource; `action` selects the operation. `quota` and `whois` do not need `action`. DDNS uses a separate token, described below.

## Domain management

### 1.1 List domains

`GET` · `endpoint=subdomains` · `action=list`

#### Parameters

- `page` — `integer`; optional; default / range: `1`.
- `cursor_id` — `integer`; optional.
- `per_page` — `integer`; optional; default / range: `200; 1–500`.
- `include_total` — `boolean`; optional; default / range: `false`.
- `search` — `string`; optional.
- `rootdomain` — `string`; optional.
- `status` — `string`; optional; default / range: `active | suspended | expired`.
- `created_from / created_to` — `string`; optional; default / range: `YYYY-MM-DD`.
- `sort_by` — `string`; optional; default / range: `id`.
- `sort_dir` — `string`; optional; default / range: `desc; asc | desc`.
- `fields` — `string`; optional; default / range: `all`.

`page` is a 1-based compatibility page number. For large collections, start with `cursor_id=0`, then send `pagination.next_cursor_id` while `pagination.has_more=true`; stop when false. Cursor mode uses ID ordering without OFFSET. `per_page` defaults to 200 and is capped at 500; 50–100 is a useful starting point. `include_total=1` requests a potentially expensive total count. `search` matches the prefix or root domain; `rootdomain`, `status`, `created_from` and `created_to` filter results. Dates use YYYY-MM-DD. `sort_by` accepts `id`, `created_at`, `updated_at`, `expires_at` or `subdomain`; `sort_dir` accepts `asc` or `desc`.

`fields` is a comma-separated selection or `all`: `id`, `subdomain`, `rootdomain`, `full_domain`, `status`, `created_at`, `updated_at`, `expires_at`, `never_expires`, `cloudflare_zone_id`, `provider_account_id`. A custom selection always includes `id`. `count` describes the returned collection, not necessarily all matching domains; use pagination rather than assuming a global total.

#### Request examples

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

#### Response examples

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

### 1.2 Register a domain

`POST` · `endpoint=subdomains` · `action=create`

#### Parameters

- `subdomain` — `string`; required.
- `domain` — `string`; required.

`subdomain` is the prefix (for example `myapp`); `domain` is an available root suffix (for example `de5.net`). Registration uses `action=create` and the request field `domain`. The response field `rootdomain` and list filter of that name are not registration fields. Availability and account quotas still apply.

#### Request examples

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

#### Response examples

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 Get domain details

`GET` · `endpoint=subdomains` · `action=get`

#### Parameters

- `subdomain_id` — `integer`; required.

Use a domain ID owned by the authenticated account. The response includes the domain object, its `dns_records` and `dns_count`.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Response examples

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

### 1.4 Delete a domain

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### Parameters

- `subdomain_id` — `integer`; required.

Deletes the owned domain and its associated DNS records. The response reports `dns_records_deleted`. Confirm the target ID before sending this write operation.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### Response examples

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 Renew a domain

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### Parameters

- `subdomain_id` — `integer`; required.

Normal DNSHE free renewal remains free; the example has `charged_amount=0`. The generic plugin can configure paid redemption handling, so inspect the domain state and current console policy before a redemption renewal. Read `previous_expires_at`, `new_expires_at`, `never_expires`, `remaining_days` and `charged_amount` from the response rather than assuming the result.

Renewal failures in the reference include: HTTP 403 `renewal disabled`, `redemption period requires administrator` or `renewal window expired`; HTTP 422 with `error_code=renewal_not_yet_available`; HTTP 402 `insufficient balance for redemption renewal`; HTTP 404 for a missing or unowned domain. Check the renewal window or contact support; do not retry these conditions in a tight loop.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### Response examples

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

## DNS record management

### 2.1 List DNS records

`GET` · `endpoint=dns_records` · `action=list`

#### Parameters

- `subdomain_id` — `integer`; required.

Prefer the module's `id` returned by list/create, which is a 15-digit public ID for newly exposed records. `record_id` is the DNS provider's record identifier. Modify/delete require at least one; if both are supplied they must identify the same record, otherwise `dns_record_identifier_mismatch` is returned. Legacy internal IDs remain compatible. Numeric `record_id` compatibility is documented through at least 2027-06-12; new clients should put module IDs in `id`.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Response examples

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

### 2.2 Create a DNS record

`POST` · `endpoint=dns_records` · `action=create`

#### Parameters

- `subdomain_id` — `integer`; required.
- `type` — `string`; required.
- `name` — `string`; optional; default / range: `@`.
- `content` — `string`; optional.
- `ttl` — `integer`; optional; default / range: `600`.
- `priority` — `integer`; optional; default / range: `MX: 10; SRV: 0`.
- `line` — `string`; optional.
- `record_weight / weight` — `integer`; optional.
- `record_port / port` — `integer`; optional; default / range: `1–65535`.
- `record_target / target` — `string`; optional.
- `caa_flag` — `integer`; optional; default / range: `0; 0–255`.
- `caa_tag` — `string`; optional; default / range: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; optional.

`type` supports A, AAAA, CNAME, MX, TXT, NS, SRV and CAA. `name` is relative to the registered domain: omitted, empty or `@` means the domain itself; a full domain name is not accepted. A wildcard `*` may appear only as the leftmost label. `content` is required unless structured SRV/CAA inputs construct it. `ttl` defaults to 600 seconds. `priority` defaults to 10 for MX and 0 for SRV.

For SRV, `record_weight`/`weight`, `record_port`/`port` and `record_target`/`target` supply weight, port (1–65535) and target; target `.` means the service is unavailable. For CAA, use `caa_flag` (0–255, default 0), `caa_tag` (1–15 alphanumeric characters, default `issue`) and `caa_value`. `line` is an AliDNS-only routing option; other providers reject a non-empty value.

NS writes may be disabled by `disable_ns_management`. Once a domain is delegated to external nameservers, creating/modifying non-NS records is rejected with `external_dns_delegated`. Deleting old records, reconciliation and expiration cleanup are not blocked by this restriction.

#### Request examples

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

#### Response examples

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 Modify a DNS record

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### Parameters

- `id` — `integer`; optional.
- `record_id` — `string`; optional.
- `type / name / content` — `string`; optional.
- `ttl / priority` — `integer`; optional.
- `line` — `string`; optional.
- `record_weight / weight` — `integer`; optional.
- `record_port / port` — `integer`; optional.
- `record_target / target` — `string`; optional.
- `caa_flag` — `integer`; optional.
- `caa_tag / caa_value` — `string`; optional.

Send `id` or `record_id` plus the fields to change. The same naming rules and SRV/CAA options as creation apply. If both identifiers are provided, they must refer to the same record. The response returns both the module ID and provider record ID.

Prefer the module's `id` returned by list/create, which is a 15-digit public ID for newly exposed records. `record_id` is the DNS provider's record identifier. Modify/delete require at least one; if both are supplied they must identify the same record, otherwise `dns_record_identifier_mismatch` is returned. Legacy internal IDs remain compatible. Numeric `record_id` compatibility is documented through at least 2027-06-12; new clients should put module IDs in `id`.

NS writes may be disabled by `disable_ns_management`. Once a domain is delegated to external nameservers, creating/modifying non-NS records is rejected with `external_dns_delegated`. Deleting old records, reconciliation and expiration cleanup are not blocked by this restriction.

#### Request examples

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

#### Response examples

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 Delete a DNS record

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### Parameters

- `id` — `integer`; optional.
- `record_id` — `string`; optional.

Prefer the module's `id` returned by list/create, which is a 15-digit public ID for newly exposed records. `record_id` is the DNS provider's record identifier. Modify/delete require at least one; if both are supplied they must identify the same record, otherwise `dns_record_identifier_mismatch` is returned. Legacy internal IDs remain compatible. Numeric `record_id` compatibility is documented through at least 2027-06-12; new clients should put module IDs in `id`.

#### Request examples

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

#### Response examples

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## Dynamic DNS (DDNS)

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

Create a dedicated token for a specific A/AAAA record in Domain Management → DDNS. Send `Authorization: Bearer <DDNS_TOKEN>` or `X-DDNS-Token`; never send the token in the URL or body. The token can only update its bound record's IP. The route supports GET, POST and PUT; POST is used below. Optional `ip` supplies an IPv4/IPv6 address; when omitted, the directly observed request source IP is used. For IPv6, the request source or explicit value must match the bound AAAA record.

`status=good` means the address changed; `status=nochg` with `changed=false` is also success and does not call the DNS provider. DDNS uses `https://api005.dnshe.com`, independently of the client-area hostname.

#### Request examples

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

#### Response examples

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

For Synology DSM or other devices, use a scheduled script that can send headers, not a DDNS URL template containing the token. Create and save the token, configure the device task scheduler, and test once manually. A five-minute schedule is a starting point only; never run more frequently than the configured minimum update interval. Store the token in the task's protected environment.

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## API key management

### 3.1 List API keys

`GET` · `endpoint=keys` · `action=list`

Lists key IDs, names, status, request counts and last-use timestamps. The list does not recover an existing API secret. Initial credential creation is done in the console.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Response examples

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

### 3.2 Create an API key

`POST` · `endpoint=keys` · `action=create`

#### Parameters

- `key_name` — `string`; required.
- `ip_whitelist` — `string`; optional.

`key_name` names the new key. Optional `ip_whitelist` accepts IPs or CIDR ranges separated by commas, newlines or semicolons when IP allowlisting is enabled. Replace the documentation IP with your server's actual egress IP. Save the returned `api_secret` immediately: it is shown only once.

#### Request examples

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

#### Response examples

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 Delete an API key

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### Parameters

- `key_id` — `integer`; required.

`key_id` selects the key to revoke. Use a separate working key to manage other credentials, so deleting a key does not interrupt the same automation workflow unexpectedly.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### Response examples

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 Regenerate an API secret

`POST` · `endpoint=keys` · `action=regenerate`

#### Parameters

- `key_id` — `integer`; required.

Regenerates the secret for `key_id`. The previous secret becomes invalid; save the new secret immediately and update dependent services. If you have lost all working credentials, recover access through the console rather than attempting unauthenticated API regeneration.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### Response examples

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## Domain gifts

### 4.1 Initiate a gift

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### Parameters

- `subdomain_id` — `integer`; required.

`subdomain_id` must belong to the authenticated account. The response provides a gift code and expiration time. Share the code only with the intended recipient.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### Response examples

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

### 4.2 Accept a gift

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### Parameters

- `code` — `string`; required.

The recipient authenticates with their own key and submits the sender's `code`. Acceptance transfers the domain; check the returned domain and source account information.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### Response examples

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

### 4.3 Cancel a gift

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### Parameters

- `gift_id` — `integer`; required.

`gift_id` must refer to a pending gift initiated by the authenticated user. Cancellation invalidates that pending transfer.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### Response examples

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

### 4.4 List gifts

`GET` · `endpoint=gifts` · `action=list`

Lists gift records and their state. `initiate`, `accept` and `cancel` are rate-limited writes. After an ambiguous timeout, inspect current gift state before retrying; do not assume a timed-out write failed.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Response examples

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

## Quota

### 5.1 Read quota

`GET` · `endpoint=quota`

Returns `used`, `base`, `invite_bonus`, `total` and `available` in `quota`. Read the actual returned quota rather than assuming the example account's allowance. This endpoint has no `action` parameter.

#### Request examples

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Response examples

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

## WHOIS

`GET` · `endpoint=whois`

#### Parameters

- `domain` — `string`; required.

Queries internal domains and external WHOIS information using required `domain` (the full name). Public mode needs no API credentials and defaults to 2 requests/minute per IP, separately configurable from general API limits. The operator may require API-key authentication; in that mode use the usual two headers. This endpoint has no `action` parameter.

Registrant email and postal-code visibility depend on privacy settings; `registrant_postal_code` is distinct from the legacy `registrant_address`. `owner_userid` applies only to internal domains and is normally returned only to the authenticated owner, unless the operator changes visibility. Public WHOIS does not reveal internal user IDs by default. Do not assume optional identity fields are present.

Public states include `Registered`, `RenewalGracePeriod`, `RedemptionPeriod`, `ServerHold`, `PendingDelete` and `unregistered`. `nameservers` and its alias `name_servers` use actual NS records, falling back to configured defaults. Permanent domains return `expires_at=2999-12-31 23:59` without `never_expires`. Unregistered names return `registered=false` and `status=unregistered`. In public mode, `rate_limit` reports the current IP's remaining allowance.

#### Request examples

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Response examples

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

## Errors and rate limits

Check both the HTTP status and JSON `success`. Handle the stable `error_code`, not a translated or changing message. `message` is human-readable; `details` optionally supplies context; legacy `error` mirrors the message. A non-JSON upstream error is also a failure. Common error codes and HTTP statuses follow; renewal-specific messages are described with the renewal route.

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

General access defaults to 60 requests/minute; public WHOIS defaults to 2/minute/IP. Actual limits may differ. Use `details.limit`, `details.remaining` and `details.reset_at` when returned. Quota exhaustion and rate limiting can both use HTTP 429, so distinguish `quota_exceeded` from `rate_limit_exceeded`.

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

For rate-limited reads, wait until the reported reset time or use bounded exponential backoff with jitter. Do not automatically replay create, delete, renew, gift acceptance or secret rotation after a timeout: inspect the current resource state first. These examples do not implement automatic write retries.

## Client examples

These small reference clients are examples, not an official SDK. They encode queries, send JSON, enforce timeouts and check HTTP/API errors. Run usage examples from the repository root. Node.js needs built-in fetch and AbortSignal.timeout; Python uses only the standard library; PHP requires cURL and JSON support. Keep credentials on a trusted server, never in browser JavaScript.

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

## Security and FAQ

Use HTTPS, protected environment variables, separate keys per workload and the narrowest available permissions. Enable IP allowlisting for production when available. Rotate secrets, revoke unused keys and monitor request logs. Do not put API/DDNS tokens in source control, URLs, screenshots or public logs.

Lost secret: regenerate using another valid credential or the console; the old secret becomes invalid. Higher request limit: contact support. Subaccounts: the reference permits key creation/use only by the main account. Batch operations: call individually; no batch endpoint is documented. Usage statistics: see request counts and last-use times in API Management or the key-list response.

## Support

For account, endpoint availability or renewal questions, contact [support@dnshe.com](mailto:support@dnshe.com). See the [online API manual](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) and [Manage domains](https://my.dnshe.com/index.php?m=domain_hub) for deployment-specific settings.

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
