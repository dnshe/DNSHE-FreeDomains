# DNSHE 域名 API 使用文档

<p align="center" dir="ltr"><a href="./api.md">English</a> · <strong>简体中文</strong> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[返回项目介绍](../README_ZH.md)

通过 API 注册域名、管理 DNS、更新动态 IP，并自动化账户操作。示例统一使用 DNSHE API 地址和占位凭据；请将示例域名、ID 和密钥替换为你自己的资源。

## 目录

- [快速开始](#快速开始)
- [认证与请求约定](#认证与请求约定)
- [域名管理](#域名管理)
- [DNS 记录管理](#dns-记录管理)
- [动态 DNS（DDNS）](#动态-dnsddns)
- [API 密钥管理](#api-密钥管理)
- [域名转赠](#域名转赠)
- [配额查询](#配额查询)
- [WHOIS 查询](#whois-查询)
- [错误处理与速率限制](#错误处理与速率限制)
- [客户端示例](#客户端示例)
- [安全建议与常见问题](#安全建议与常见问题)
- [技术支持](#技术支持)

## 快速开始

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

基础地址已包含 `m=domain_hub`，追加路由参数时使用 `&`。除 GET 查询参数外，请求与响应使用 JSON。普通鉴权请求默认每分钟 60 次，运营方可调整；功能可用性取决于账户和部署配置。命令示例使用 Bash/sh，请先配置下列环境变量。

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## 认证与请求约定

首次密钥请在客户中心 → [管理域名](https://my.dnshe.com/index.php?m=domain_hub) → API 管理中创建。鉴权请求必须携带 `X-API-Key` 和 `X-API-Secret` 请求头，URL 或请求体传递凭据的方式已禁用。GET 参数放在查询字符串中，写操作使用 JSON 并设置 `Content-Type: application/json`。`endpoint` 选择资源，`action` 选择操作；`quota` 和 `whois` 无需 `action`。DDNS 使用单独的 Token。

## 域名管理

### 1.1 列出域名

`GET` · `endpoint=subdomains` · `action=list`

#### 参数

- `page` — `integer`; 可选; 默认值 / 范围: `1`.
- `cursor_id` — `integer`; 可选.
- `per_page` — `integer`; 可选; 默认值 / 范围: `200; 1–500`.
- `include_total` — `boolean`; 可选; 默认值 / 范围: `false`.
- `search` — `string`; 可选.
- `rootdomain` — `string`; 可选.
- `status` — `string`; 可选; 默认值 / 范围: `active | suspended | expired`.
- `created_from / created_to` — `string`; 可选; 默认值 / 范围: `YYYY-MM-DD`.
- `sort_by` — `string`; 可选; 默认值 / 范围: `id`.
- `sort_dir` — `string`; 可选; 默认值 / 范围: `desc; asc | desc`.
- `fields` — `string`; 可选; 默认值 / 范围: `all`.

`page` 是从 1 开始的兼容页码。大数据量推荐首次传 `cursor_id=0`；当 `pagination.has_more=true` 时，将 `pagination.next_cursor_id` 用作下次游标，变为 false 时停止。游标模式固定按 ID 排序，不使用 OFFSET。`per_page` 默认 200、最大 500，建议先用 50–100。`include_total=1` 会额外统计总数，大数据量时可能较慢。`search` 匹配前缀或根域名；`rootdomain`、`status`、`created_from`、`created_to` 用于过滤，日期格式为 YYYY-MM-DD。`sort_by` 支持 `id`、`created_at`、`updated_at`、`expires_at`、`subdomain`；`sort_dir` 为 `asc` 或 `desc`。

`fields` 为逗号分隔的字段列表或 `all`，支持 `id`、`subdomain`、`rootdomain`、`full_domain`、`status`、`created_at`、`updated_at`、`expires_at`、`never_expires`、`cloudflare_zone_id`、`provider_account_id`。自定义选择仍会补充 `id`。`count` 表示本次返回集合的数量，不应当作所有匹配域名的总数。

#### 请求示例

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

#### 响应示例

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

### 1.2 注册域名

`POST` · `endpoint=subdomains` · `action=create`

#### 参数

- `subdomain` — `string`; 必填.
- `domain` — `string`; 必填.

`subdomain` 是域名前缀，例如 `myapp`；`domain` 是可用根域名，例如 `de5.net`。注册使用 `action=create` 和请求字段 `domain`；响应中的 `rootdomain` 及同名列表过滤参数不是注册字段。仍需符合可用性和账户配额要求。

#### 请求示例

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

#### 响应示例

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 获取域名详情

`GET` · `endpoint=subdomains` · `action=get`

#### 参数

- `subdomain_id` — `integer`; 必填.

使用当前鉴权账户拥有的域名 ID，响应包含域名对象、`dns_records` 与 `dns_count`。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 响应示例

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

### 1.4 删除域名

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### 参数

- `subdomain_id` — `integer`; 必填.

删除账户名下的目标域名及关联 DNS 记录，响应通过 `dns_records_deleted` 报告删除数量。提交前请确认目标 ID。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### 响应示例

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 续期域名

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### 参数

- `subdomain_id` — `integer`; 必填.

DNSHE 正常免费续期仍然免费，示例为 `charged_amount=0`。通用插件可配置收费赎回；涉及赎回时，请先确认域名状态和控制台规则。根据响应的 `previous_expires_at`、`new_expires_at`、`never_expires`、`remaining_days`、`charged_amount` 判断实际结果。

续期失败包括：HTTP 403 `renewal disabled`、`redemption period requires administrator`、`renewal window expired`；HTTP 422 且 `error_code=renewal_not_yet_available`；HTTP 402 `insufficient balance for redemption renewal`；HTTP 404 表示域名不存在或不属于当前账户。请检查续期窗口或联系支持，不要无间隔重试。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### 响应示例

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

## DNS 记录管理

### 2.1 列出 DNS 记录

`GET` · `endpoint=dns_records` · `action=list`

#### 参数

- `subdomain_id` — `integer`; 必填.

优先使用列表或创建接口返回的模块 `id`，新公开记录使用 15 位外显 ID。`record_id` 是 DNS 供应商的记录标识。修改/删除至少提供其中一个，同时提供时必须指向同一记录，否则返回 `dns_record_identifier_mismatch`。旧内部 ID 继续兼容。参考文档说明纯数字 `record_id` 至少兼容至 2027-06-12，新调用请将模块 ID 放入 `id`。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 响应示例

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

### 2.2 创建 DNS 记录

`POST` · `endpoint=dns_records` · `action=create`

#### 参数

- `subdomain_id` — `integer`; 必填.
- `type` — `string`; 必填.
- `name` — `string`; 可选; 默认值 / 范围: `@`.
- `content` — `string`; 可选.
- `ttl` — `integer`; 可选; 默认值 / 范围: `600`.
- `priority` — `integer`; 可选; 默认值 / 范围: `MX: 10; SRV: 0`.
- `line` — `string`; 可选.
- `record_weight / weight` — `integer`; 可选.
- `record_port / port` — `integer`; 可选; 默认值 / 范围: `1–65535`.
- `record_target / target` — `string`; 可选.
- `caa_flag` — `integer`; 可选; 默认值 / 范围: `0; 0–255`.
- `caa_tag` — `string`; 可选; 默认值 / 范围: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; 可选.

`type` 支持 A、AAAA、CNAME、MX、TXT、NS、SRV、CAA。`name` 是相对于已注册域名的名称，省略、空值或 `@` 表示域名本身，不接受完整域名；通配符 `*` 只能位于最左侧标签。`content` 必填，除非由 SRV/CAA 结构化参数组装。`ttl` 默认 600 秒；`priority` 在 MX 中默认 10，在 SRV 中默认 0。

SRV 的 `record_weight`/`weight`、`record_port`/`port`、`record_target`/`target` 分别表示权重、端口（1–65535）和目标主机，目标 `.` 表示服务不可用。CAA 使用 `caa_flag`（0–255，默认 0）、`caa_tag`（1–15 位字母数字，默认 `issue`）和 `caa_value`。`line` 仅适用于 AliDNS，其他供应商拒绝非空值。

后台可通过 `disable_ns_management` 禁用 NS 写入。域名委派到外部 DNS 后，创建或修改非 NS 记录会返回 `external_dns_delegated`；删除旧记录、校准和过期清理不受此限制。

#### 请求示例

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

#### 响应示例

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 修改 DNS 记录

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### 参数

- `id` — `integer`; 可选.
- `record_id` — `string`; 可选.
- `type / name / content` — `string`; 可选.
- `ttl / priority` — `integer`; 可选.
- `line` — `string`; 可选.
- `record_weight / weight` — `integer`; 可选.
- `record_port / port` — `integer`; 可选.
- `record_target / target` — `string`; 可选.
- `caa_flag` — `integer`; 可选.
- `caa_tag / caa_value` — `string`; 可选.

提供 `id` 或 `record_id`，以及需要修改的字段。名称规则及 SRV/CAA 选项与创建相同。两个标识同时提供时必须指向同一记录，响应返回模块 ID 和供应商记录 ID。

优先使用列表或创建接口返回的模块 `id`，新公开记录使用 15 位外显 ID。`record_id` 是 DNS 供应商的记录标识。修改/删除至少提供其中一个，同时提供时必须指向同一记录，否则返回 `dns_record_identifier_mismatch`。旧内部 ID 继续兼容。参考文档说明纯数字 `record_id` 至少兼容至 2027-06-12，新调用请将模块 ID 放入 `id`。

后台可通过 `disable_ns_management` 禁用 NS 写入。域名委派到外部 DNS 后，创建或修改非 NS 记录会返回 `external_dns_delegated`；删除旧记录、校准和过期清理不受此限制。

#### 请求示例

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

#### 响应示例

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 删除 DNS 记录

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### 参数

- `id` — `integer`; 可选.
- `record_id` — `string`; 可选.

优先使用列表或创建接口返回的模块 `id`，新公开记录使用 15 位外显 ID。`record_id` 是 DNS 供应商的记录标识。修改/删除至少提供其中一个，同时提供时必须指向同一记录，否则返回 `dns_record_identifier_mismatch`。旧内部 ID 继续兼容。参考文档说明纯数字 `record_id` 至少兼容至 2027-06-12，新调用请将模块 ID 放入 `id`。

#### 请求示例

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

#### 响应示例

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## 动态 DNS（DDNS）

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

在域名管理 → DDNS 中，为指定 A/AAAA 记录创建专用 Token。通过 `Authorization: Bearer <DDNS_TOKEN>` 或 `X-DDNS-Token` 传递，不接受 URL 或请求体传递 Token。该 Token 只能修改绑定记录的 IP。支持 GET、POST、PUT，下例使用 POST。可选 `ip` 指定 IPv4/IPv6；省略时使用直连请求来源 IP。更新 AAAA 时，请确保来源或指定值为相应 IPv6 地址。

`status=good` 表示 IP 已更新；`status=nochg` 且 `changed=false` 同样表示成功，且不会调用 DNS 供应商。DDNS 固定使用 `https://api005.dnshe.com`，不随客户中心域名变化。

#### 请求示例

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

#### 响应示例

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

群晖 DSM 等设备应使用支持请求头的计划脚本，不要把 Token 放入 DDNS URL 模板。创建并保存 Token 后，在设备任务计划中配置脚本并手动测试一次。每 5 分钟执行一次可作为起点，但不得短于后台配置的最短更新间隔；Token 应保存在受保护的任务环境中。

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## API 密钥管理

### 3.1 列出 API 密钥

`GET` · `endpoint=keys` · `action=list`

列表返回密钥 ID、名称、状态、请求次数和最近使用时间，不会恢复已有 Secret。首次密钥必须在控制台创建。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 响应示例

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

### 3.2 创建 API 密钥

`POST` · `endpoint=keys` · `action=create`

#### 参数

- `key_name` — `string`; 必填.
- `ip_whitelist` — `string`; 可选.

`key_name` 是新密钥名称。启用 IP 白名单时，可选 `ip_whitelist` 接受单个 IP 或 CIDR，支持逗号、换行或分号分隔。请将文档示例 IP 替换为服务器真实出口 IP。返回的 `api_secret` 只显示一次，必须立即保存。

#### 请求示例

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

#### 响应示例

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 删除 API 密钥

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### 参数

- `key_id` — `integer`; 必填.

通过 `key_id` 撤销目标密钥。建议使用另一个有效密钥管理凭据，避免删除密钥时意外中断当前自动化任务。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### 响应示例

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 重新生成 API Secret

`POST` · `endpoint=keys` · `action=regenerate`

#### 参数

- `key_id` — `integer`; 必填.

重新生成 `key_id` 对应的 Secret，旧 Secret 立即失效。请立即保存新值并更新依赖服务。若已丢失全部有效凭据，请通过控制台恢复，不能无鉴权调用重新生成接口。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### 响应示例

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## 域名转赠

### 4.1 发起转赠

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### 参数

- `subdomain_id` — `integer`; 必填.

`subdomain_id` 必须属于当前鉴权账户。响应返回转赠码和有效期，只应将转赠码交给预期接收人。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### 响应示例

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

### 4.2 接受转赠

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### 参数

- `code` — `string`; 必填.

接收方使用自己的密钥鉴权，并提交发起方提供的 `code`。接受后域名转移，请核对响应中的域名和来源账户信息。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### 响应示例

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

### 4.3 取消转赠

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### 参数

- `gift_id` — `integer`; 必填.

`gift_id` 必须是当前用户发起且仍为 pending 的转赠，取消后该待接受转赠失效。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### 响应示例

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

### 4.4 查询转赠记录

`GET` · `endpoint=gifts` · `action=list`

返回转赠记录及状态。`initiate`、`accept`、`cancel` 是受限流的写操作。写请求超时后请先查询状态，不要假设操作未执行。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 响应示例

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

## 配额查询

### 5.1 查询配额

`GET` · `endpoint=quota`

`quota` 返回 `used`、`base`、`invite_bonus`、`total`、`available`。请读取实际配额，不要假设自己的额度与示例一致。本接口不传 `action`。

#### 请求示例

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 响应示例

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

## WHOIS 查询

`GET` · `endpoint=whois`

#### 参数

- `domain` — `string`; 必填.

必填 `domain` 为完整域名，可查询系统内域名及外部 WHOIS。公共模式默认无需密钥，每 IP 每分钟 2 次，与普通 API 限流独立配置。后台可强制 API Key 鉴权，此时使用常规两个请求头。本接口不传 `action`。

邮箱和邮政编码的可见性由隐私配置决定；`registrant_postal_code` 独立于旧字段 `registrant_address`。`owner_userid` 仅用于系统内域名，默认只对已鉴权的所属账户返回，运营方可调整可见性；公共 WHOIS 默认不暴露内部用户 ID。不要假设可选身份字段一定存在。

公共状态包括 `Registered`、`RenewalGracePeriod`、`RedemptionPeriod`、`ServerHold`、`PendingDelete`、`unregistered`。`nameservers` 及别名 `name_servers` 优先使用实际 NS，否则使用配置默认值。永久域名返回 `expires_at="2999-12-31 23:59"`，不包含 `never_expires`。未注册域名返回 `registered=false`、`status=unregistered`。公共模式的 `rate_limit` 表示当前 IP 的剩余额度。

#### 请求示例

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 响应示例

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

## 错误处理与速率限制

同时检查 HTTP 状态和 JSON `success`。业务判断应使用稳定的 `error_code`，不要匹配可能变化的提示文案。`message` 是可读描述，`details` 是可选上下文，兼容字段 `error` 与 message 含义相同。非 JSON 的上游响应也应作为失败处理。常见错误码及 HTTP 状态如下，续期错误见对应章节。

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

普通 API 默认每分钟 60 次，公共 WHOIS 默认每 IP 每分钟 2 次，实际值可能不同。若响应提供 `details.limit`、`details.remaining`、`details.reset_at`，请据此处理。配额耗尽和限流都可能返回 HTTP 429，应区分 `quota_exceeded` 与 `rate_limit_exceeded`。

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

读取请求被限流时，可等待 reset 时间或使用有上限、带随机抖动的指数退避。创建、删除、续期、接受转赠或密钥轮换超时后，不要直接重复执行；先检查资源当前状态。示例客户端不自动重试写操作。

## 客户端示例

这些是轻量参考客户端，不是官方 SDK。它们编码查询参数、发送 JSON、设置超时并检查 HTTP/API 错误。请从仓库根目录运行示例。Node.js 需要内置 fetch 和 AbortSignal.timeout；Python 仅使用标准库；PHP 需要 cURL 和 JSON 支持。凭据只应放在可信服务端，不能放入浏览器 JavaScript。

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

## 安全建议与常见问题

使用 HTTPS、受保护的环境变量、按用途分开的密钥及最小可用权限。生产环境可用时开启 IP 白名单，定期轮换 Secret、撤销闲置密钥并检查请求日志。API/DDNS Token 不应出现在代码仓库、URL、截图或公开日志中。

Secret 丢失：使用其他有效凭据或控制台重新生成，旧值失效。提高请求限制：联系支持。子账户：参考实现仅允许主账户创建和使用密钥。批量操作：未记录批量接口，请逐个调用。使用统计：在 API 管理或密钥列表中查看调用次数及最近使用时间。

## 技术支持

账户、接口可用性或续期问题请联系 [support@dnshe.com](mailto:support@dnshe.com)。部署相关配置请参阅 [在线 API 手册](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) 和 [管理域名](https://my.dnshe.com/index.php?m=domain_hub)。

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
