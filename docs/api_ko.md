# DNSHE 도메인 API 참조 문서

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <strong>한국어</strong> · <a href="./api_ar.md">العربية</a></p>

[서비스 소개로 돌아가기](../README_KO.md)

도메인 등록, DNS 관리, 동적 IP 갱신 및 계정 작업을 자동화합니다. 예시는 DNSHE API 주소와 임시 인증 정보를 사용합니다. 이름, ID, 키는 자신의 리소스로 바꿔 주세요.

## 목차

- [시작하기](#시작하기)
- [인증 및 요청 규칙](#인증-및-요청-규칙)
- [도메인 관리](#도메인-관리)
- [DNS 레코드 관리](#dns-레코드-관리)
- [동적 DNS (DDNS)](#동적-dns-ddns)
- [API 키 관리](#api-키-관리)
- [도메인 양도](#도메인-양도)
- [할당량](#할당량)
- [WHOIS 조회](#whois-조회)
- [오류 및 요청 제한](#오류-및-요청-제한)
- [클라이언트 예제](#클라이언트-예제)
- [보안 및 자주 묻는 질문](#보안-및-자주-묻는-질문)
- [지원](#지원)

## 시작하기

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

기본 URL에 이미 `m=domain_hub`가 있으므로 추가 매개변수는 `&`로 연결합니다. GET 쿼리 매개변수 외에는 JSON을 사용합니다. 일반 인증 요청은 기본 분당 60회이며 운영자가 조정할 수 있습니다. 기능은 계정과 배포 설정에 따라 달라집니다. 셸 예시는 Bash/sh용이며 먼저 아래 환경 변수를 설정하세요.

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## 인증 및 요청 규칙

고객 영역 → [도메인 관리](https://my.dnshe.com/index.php?m=domain_hub) → API 관리에서 첫 키를 생성합니다. `X-API-Key`와 `X-API-Secret` 헤더로 인증하며 URL이나 본문으로 인증 정보를 보내는 방식은 비활성화되어 있습니다. GET은 쿼리 문자열, 쓰기 요청은 `Content-Type: application/json`과 JSON 본문을 사용합니다. `endpoint`는 리소스, `action`은 작업입니다. `quota`, `whois`에는 `action`이 필요 없습니다. DDNS는 별도 토큰을 사용합니다.

## 도메인 관리

### 1.1 도메인 목록

`GET` · `endpoint=subdomains` · `action=list`

#### 매개변수

- `page` — `integer`; 선택; 기본값 / 범위: `1`.
- `cursor_id` — `integer`; 선택.
- `per_page` — `integer`; 선택; 기본값 / 범위: `200; 1–500`.
- `include_total` — `boolean`; 선택; 기본값 / 범위: `false`.
- `search` — `string`; 선택.
- `rootdomain` — `string`; 선택.
- `status` — `string`; 선택; 기본값 / 범위: `active | suspended | expired`.
- `created_from / created_to` — `string`; 선택; 기본값 / 범위: `YYYY-MM-DD`.
- `sort_by` — `string`; 선택; 기본값 / 범위: `id`.
- `sort_dir` — `string`; 선택; 기본값 / 범위: `desc; asc | desc`.
- `fields` — `string`; 선택; 기본값 / 범위: `all`.

`page`는 1부터 시작하는 호환 페이지 번호입니다. 대규모 목록은 `cursor_id=0`으로 시작하고 `pagination.has_more=true`인 동안 `pagination.next_cursor_id`를 다음 커서로 사용하며 false에서 종료합니다. 커서 모드는 OFFSET 없이 ID 순서를 사용합니다. `per_page`는 기본 200, 최대 500이며 50–100부터 권장합니다. `include_total=1`은 비용이 큰 전체 개수 조회를 추가합니다. `search`는 접두사 또는 루트 도메인을 검색하며 `rootdomain`, `status`, `created_from`, `created_to`는 필터입니다. 날짜는 YYYY-MM-DD입니다. `sort_by`: `id`, `created_at`, `updated_at`, `expires_at`, `subdomain`; `sort_dir`: `asc` 또는 `desc`.

`fields`는 쉼표로 구분하거나 `all`을 사용합니다: `id`, `subdomain`, `rootdomain`, `full_domain`, `status`, `created_at`, `updated_at`, `expires_at`, `never_expires`, `cloudflare_zone_id`, `provider_account_id`. 선택 시에도 `id`는 포함됩니다. `count`는 반환된 목록의 개수이며 전체 일치 결과 수를 의미하지 않을 수 있습니다.

#### 요청 예시

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

#### 응답 예시

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

### 1.2 도메인 등록

`POST` · `endpoint=subdomains` · `action=create`

#### 매개변수

- `subdomain` — `string`; 필수.
- `domain` — `string`; 필수.

`subdomain`은 `myapp` 같은 접두사이고 `domain`은 `de5.net` 같은 사용 가능한 루트 도메인입니다. 등록은 `action=create` 및 `domain` 필드를 사용합니다. 응답과 목록 필터의 `rootdomain`은 등록 필드가 아닙니다. 사용 가능 여부와 계정 한도가 적용됩니다.

#### 요청 예시

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

#### 응답 예시

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 도메인 상세

`GET` · `endpoint=subdomains` · `action=get`

#### 매개변수

- `subdomain_id` — `integer`; 필수.

인증 계정이 소유한 도메인 ID를 지정합니다. 도메인 객체, `dns_records`, `dns_count`가 반환됩니다.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 응답 예시

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

### 1.4 도메인 삭제

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### 매개변수

- `subdomain_id` — `integer`; 필수.

소유 도메인과 연결된 DNS 레코드를 삭제합니다. `dns_records_deleted`가 삭제 개수를 나타냅니다. 요청 전 대상 ID를 확인하세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### 응답 예시

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 도메인 갱신

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### 매개변수

- `subdomain_id` — `integer`; 필수.

DNSHE의 일반 무료 갱신은 무료이며 예시는 `charged_amount=0`입니다. 범용 플러그인은 유료 복구를 설정할 수 있으므로 복구 기간에는 상태와 콘솔 정책을 확인하세요. `previous_expires_at`, `new_expires_at`, `never_expires`, `remaining_days`, `charged_amount`로 실제 결과를 판단합니다.

갱신 오류: HTTP 403 `renewal disabled`, `redemption period requires administrator`, `renewal window expired`; HTTP 422 `renewal_not_yet_available`; HTTP 402 `insufficient balance for redemption renewal`; 없거나 다른 계정 소유인 도메인은 HTTP 404입니다. 갱신 기간을 확인하거나 지원에 문의하고 반복 호출하지 마세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### 응답 예시

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

## DNS 레코드 관리

### 2.1 DNS 레코드 목록

`GET` · `endpoint=dns_records` · `action=list`

#### 매개변수

- `subdomain_id` — `integer`; 필수.

목록/생성에서 반환된 모듈 `id`를 우선 사용하세요. 새 공개 레코드 ID는 15자리입니다. `record_id`는 DNS 제공업체 식별자입니다. 수정/삭제에는 최소 하나가 필요하며 둘 다 지정하면 같은 레코드여야 합니다. 불일치는 `dns_record_identifier_mismatch`입니다. 기존 내부 ID는 호환되며 숫자 `record_id`는 최소 2027-06-12까지 호환된다고 명시되어 있습니다. 새 구현은 모듈 ID를 `id`에 넣으세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 응답 예시

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

### 2.2 DNS 레코드 생성

`POST` · `endpoint=dns_records` · `action=create`

#### 매개변수

- `subdomain_id` — `integer`; 필수.
- `type` — `string`; 필수.
- `name` — `string`; 선택; 기본값 / 범위: `@`.
- `content` — `string`; 선택.
- `ttl` — `integer`; 선택; 기본값 / 범위: `600`.
- `priority` — `integer`; 선택; 기본값 / 범위: `MX: 10; SRV: 0`.
- `line` — `string`; 선택.
- `record_weight / weight` — `integer`; 선택.
- `record_port / port` — `integer`; 선택; 기본값 / 범위: `1–65535`.
- `record_target / target` — `string`; 선택.
- `caa_flag` — `integer`; 선택; 기본값 / 범위: `0; 0–255`.
- `caa_tag` — `string`; 선택; 기본값 / 범위: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; 선택.

`type`은 A, AAAA, CNAME, MX, TXT, NS, SRV, CAA를 지원합니다. `name`은 등록 도메인의 상대 이름이며 생략, 빈 값, `@`는 도메인 자체입니다. 전체 도메인 이름은 허용되지 않으며 `*`는 가장 왼쪽 레이블에만 가능합니다. `content`는 SRV/CAA 구조화 입력으로 생성하는 경우 외에는 필수입니다. `ttl` 기본 600초, `priority`는 MX 기본 10, SRV 기본 0입니다.

SRV는 `record_weight`/`weight`, `record_port`/`port` (1–65535), `record_target`/`target`을 사용합니다. 대상 `.`는 서비스 이용 불가입니다. CAA는 `caa_flag` (0–255, 기본 0), `caa_tag` (영숫자 1–15자, 기본 `issue`), `caa_value`를 사용합니다. `line`은 AliDNS 전용이며 다른 제공업체는 비어 있지 않은 값을 거부합니다.

`disable_ns_management`로 NS 쓰기가 비활성화될 수 있습니다. 외부 DNS 위임 후 비 NS 레코드 생성/수정은 `external_dns_delegated`로 거부됩니다. 기존 레코드 삭제, 정합성 처리, 만료 정리는 제한되지 않습니다.

#### 요청 예시

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

#### 응답 예시

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 DNS 레코드 수정

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### 매개변수

- `id` — `integer`; 선택.
- `record_id` — `string`; 선택.
- `type / name / content` — `string`; 선택.
- `ttl / priority` — `integer`; 선택.
- `line` — `string`; 선택.
- `record_weight / weight` — `integer`; 선택.
- `record_port / port` — `integer`; 선택.
- `record_target / target` — `string`; 선택.
- `caa_flag` — `integer`; 선택.
- `caa_tag / caa_value` — `string`; 선택.

`id` 또는 `record_id`와 변경할 필드를 보냅니다. 이름과 SRV/CAA 규칙은 생성과 같습니다. 두 식별자는 같은 레코드를 가리켜야 하며 응답에는 모듈 및 제공업체 ID가 반환됩니다.

목록/생성에서 반환된 모듈 `id`를 우선 사용하세요. 새 공개 레코드 ID는 15자리입니다. `record_id`는 DNS 제공업체 식별자입니다. 수정/삭제에는 최소 하나가 필요하며 둘 다 지정하면 같은 레코드여야 합니다. 불일치는 `dns_record_identifier_mismatch`입니다. 기존 내부 ID는 호환되며 숫자 `record_id`는 최소 2027-06-12까지 호환된다고 명시되어 있습니다. 새 구현은 모듈 ID를 `id`에 넣으세요.

`disable_ns_management`로 NS 쓰기가 비활성화될 수 있습니다. 외부 DNS 위임 후 비 NS 레코드 생성/수정은 `external_dns_delegated`로 거부됩니다. 기존 레코드 삭제, 정합성 처리, 만료 정리는 제한되지 않습니다.

#### 요청 예시

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

#### 응답 예시

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 DNS 레코드 삭제

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### 매개변수

- `id` — `integer`; 선택.
- `record_id` — `string`; 선택.

목록/생성에서 반환된 모듈 `id`를 우선 사용하세요. 새 공개 레코드 ID는 15자리입니다. `record_id`는 DNS 제공업체 식별자입니다. 수정/삭제에는 최소 하나가 필요하며 둘 다 지정하면 같은 레코드여야 합니다. 불일치는 `dns_record_identifier_mismatch`입니다. 기존 내부 ID는 호환되며 숫자 `record_id`는 최소 2027-06-12까지 호환된다고 명시되어 있습니다. 새 구현은 모듈 ID를 `id`에 넣으세요.

#### 요청 예시

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

#### 응답 예시

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## 동적 DNS (DDNS)

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

도메인 관리 → DDNS에서 특정 A/AAAA 레코드용 토큰을 생성합니다. `Authorization: Bearer <DDNS_TOKEN>` 또는 `X-DDNS-Token`으로 보내며 URL이나 본문에 넣지 않습니다. 토큰은 연결된 레코드의 IP만 변경합니다. GET, POST, PUT을 지원하며 예시는 POST입니다. 선택 `ip`는 IPv4/IPv6를 지정하며 생략하면 직접 연결의 출발지 IP를 사용합니다. AAAA에는 해당 IPv6가 필요합니다.

`status=good`은 IP 변경 성공입니다. `status=nochg`, `changed=false`도 성공이며 DNS 제공업체를 호출하지 않습니다. DDNS 주소는 고객 영역과 독립된 `https://api005.dnshe.com`입니다.

#### 요청 예시

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

#### 응답 예시

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

Synology DSM 등은 토큰이 포함된 DDNS URL 템플릿 대신 헤더를 전송하는 예약 스크립트를 사용하세요. 토큰을 저장하고 작업을 수동 테스트합니다. 5분 간격을 기준으로 삼을 수 있지만 설정된 최소 갱신 간격보다 짧아서는 안 됩니다. 토큰은 보호된 작업 환경에 보관합니다.

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## API 키 관리

### 3.1 API 키 목록

`GET` · `endpoint=keys` · `action=list`

키 ID, 이름, 상태, 요청 횟수, 최근 사용 시각을 반환합니다. 기존 Secret은 복구하지 않습니다. 첫 키는 콘솔에서 생성합니다.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 응답 예시

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

### 3.2 API 키 생성

`POST` · `endpoint=keys` · `action=create`

#### 매개변수

- `key_name` — `string`; 필수.
- `ip_whitelist` — `string`; 선택.

`key_name`은 키 이름입니다. IP 허용 목록이 활성화되면 `ip_whitelist`에 IP/CIDR을 쉼표, 줄바꿈, 세미콜론으로 구분해 넣습니다. 예시 IP는 서버의 실제 출구 IP로 바꾸세요. `api_secret`은 한 번만 표시되므로 즉시 저장하세요.

#### 요청 예시

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

#### 응답 예시

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 API 키 삭제

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### 매개변수

- `key_id` — `integer`; 필수.

`key_id`의 키를 폐기합니다. 현재 자동화가 예기치 않게 중단되지 않도록 별도의 유효 키로 인증 정보를 관리하세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### 응답 예시

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 API Secret 재생성

`POST` · `endpoint=keys` · `action=regenerate`

#### 매개변수

- `key_id` — `integer`; 필수.

`key_id`의 Secret을 다시 생성하고 이전 값을 무효화합니다. 새 값을 저장하고 의존 서비스를 갱신하세요. 유효한 인증 정보를 모두 잃었다면 인증 없는 API 호출 대신 콘솔에서 복구하세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### 응답 예시

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## 도메인 양도

### 4.1 양도 시작

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### 매개변수

- `subdomain_id` — `integer`; 필수.

`subdomain_id`는 인증 계정 소유여야 합니다. 응답에 양도 코드와 만료 시각이 포함됩니다. 코드는 의도한 수신자에게만 공유하세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### 응답 예시

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

### 4.2 양도 수락

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### 매개변수

- `code` — `string`; 필수.

수신자 자신의 키로 인증하고 발신자의 `code`를 제출합니다. 수락하면 도메인이 이전되므로 응답의 도메인과 원래 계정을 확인하세요.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### 응답 예시

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

### 4.3 양도 취소

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### 매개변수

- `gift_id` — `integer`; 필수.

`gift_id`는 현재 사용자가 시작한 pending 양도여야 합니다. 취소하면 해당 대기 중 양도가 무효화됩니다.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### 응답 예시

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

### 4.4 양도 기록 조회

`GET` · `endpoint=gifts` · `action=list`

양도 기록과 상태를 조회합니다. `initiate`, `accept`, `cancel`은 요청 제한이 있는 쓰기입니다. 시간 초과 후에는 상태를 먼저 확인하세요. 작업이 이미 실행됐을 수 있습니다.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 응답 예시

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

## 할당량

### 5.1 할당량 조회

`GET` · `endpoint=quota`

`quota`는 `used`, `base`, `invite_bonus`, `total`, `available`을 반환합니다. 예시 계정의 수치를 가정하지 말고 실제 값을 사용하세요. `action`은 필요 없습니다.

#### 요청 예시

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 응답 예시

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

## WHOIS 조회

`GET` · `endpoint=whois`

#### 매개변수

- `domain` — `string`; 필수.

필수 `domain`은 내부 도메인이나 외부 WHOIS를 조회할 전체 이름입니다. 공개 모드는 기본 키 없이 IP당 분당 2회이며 일반 API와 별도 설정됩니다. 운영자가 인증을 요구하면 일반 두 헤더를 사용합니다. `action`은 필요 없습니다.

이메일과 우편번호 공개는 개인정보 설정에 따릅니다. `registrant_postal_code`는 기존 `registrant_address`와 별도입니다. `owner_userid`는 내부 도메인 전용이며 기본적으로 인증된 소유자에게만 표시되지만 운영자가 변경할 수 있습니다. 공개 WHOIS는 기본 내부 ID를 노출하지 않습니다. 선택 신원 필드가 항상 있다고 가정하지 마세요.

상태: `Registered`, `RenewalGracePeriod`, `RedemptionPeriod`, `ServerHold`, `PendingDelete`, `unregistered`. `nameservers`와 별칭 `name_servers`는 실제 NS를 우선 사용하고 없으면 기본 설정을 사용합니다. 영구 도메인은 `expires_at="2999-12-31 23:59"`를 반환하고 `never_expires`는 없습니다. 미등록은 `registered=false`, `status=unregistered`입니다. 공개 `rate_limit`은 현재 IP의 잔여량입니다.

#### 요청 예시

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### 응답 예시

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

## 오류 및 요청 제한

HTTP 상태와 JSON `success`를 모두 확인하세요. 가변 메시지 대신 안정적인 `error_code`를 처리합니다. `message`는 설명, `details`는 선택 문맥, 기존 `error`는 message와 같습니다. JSON이 아닌 상위 서비스 응답도 실패입니다. 일반 코드와 상태는 아래에 있으며 갱신 오류는 해당 경로에서 설명합니다.

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

기본 일반 API 60회/분, 공개 WHOIS 2회/분/IP이며 실제 설정은 다를 수 있습니다. 있으면 `details.limit`, `details.remaining`, `details.reset_at`을 사용하세요. HTTP 429는 할당량과 빈도 모두에 쓰이므로 `quota_exceeded`, `rate_limit_exceeded`를 구분하세요.

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

읽기가 제한되면 초기화까지 기다리거나 상한과 무작위 지연을 둔 지수 백오프를 사용하세요. 생성, 삭제, 갱신, 양도 수락, Secret 교체가 시간 초과되면 재전송 전에 상태를 확인하세요. 클라이언트는 쓰기를 자동 재시도하지 않습니다.

## 클라이언트 예제

공식 SDK가 아닌 경량 참고 클라이언트입니다. 쿼리 인코딩, JSON, 시간 제한, HTTP/API 검사를 포함합니다. 저장소 루트에서 실행하세요. Node.js는 내장 fetch와 AbortSignal.timeout, Python은 표준 라이브러리, PHP는 cURL과 JSON을 사용합니다. 인증 정보는 신뢰할 수 있는 서버에만 두고 브라우저 JavaScript에 넣지 마세요.

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

## 보안 및 자주 묻는 질문

HTTPS, 보호된 환경 변수, 용도별 키와 최소 권한을 사용하세요. 가능하면 운영 IP 허용 목록을 활성화하고 Secret 교체, 미사용 키 폐기, 로그 점검을 수행하세요. API/DDNS 토큰을 저장소, URL, 스크린샷, 공개 로그에 넣지 마세요.

Secret 분실: 다른 유효 인증 정보나 콘솔로 재생성하며 기존 값은 무효입니다. 한도 증가: 지원 문의. 하위 계정: 참고 구현에서는 주 계정만 키 생성/사용이 가능합니다. 일괄 API는 문서화되어 있지 않아 개별 호출합니다. 통계는 API 관리와 키 목록에서 확인합니다.

## 지원

계정, API 제공 여부, 갱신 문의: [support@dnshe.com](mailto:support@dnshe.com). 설정은 [온라인 설명서](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html)와 [도메인 관리](https://my.dnshe.com/index.php?m=domain_hub)를 확인하세요.

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
