# Справочник API доменов DNSHE

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <strong>Русский</strong> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Вернуться к описанию](../README_RU.md)

Регистрируйте домены, управляйте DNS, обновляйте динамические IP и автоматизируйте операции аккаунта. В примерах используются адрес DNSHE и условные данные. Замените имена, ID и ключи своими.

## Содержание

- [Начало работы](#начало-работы)
- [Аутентификация и запросы](#аутентификация-и-запросы)
- [Управление доменами](#управление-доменами)
- [Управление DNS-записями](#управление-dns-записями)
- [Динамический DNS (DDNS)](#динамический-dns-ddns)
- [Управление ключами API](#управление-ключами-api)
- [Передача доменов](#передача-доменов)
- [Квоты](#квоты)
- [WHOIS](#whois)
- [Ошибки и ограничения запросов](#ошибки-и-ограничения-запросов)
- [Примеры клиентов](#примеры-клиентов)
- [Безопасность и частые вопросы](#безопасность-и-частые-вопросы)
- [Поддержка](#поддержка)

## Начало работы

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

Базовый URL уже содержит `m=domain_hub`; добавляйте параметры через `&`. Запросы и ответы используют JSON, кроме параметров GET. Обычный лимит — 60 запросов в минуту, но оператор может изменить его. Возможности зависят от аккаунта и конфигурации. Примеры команд предназначены для Bash/sh; сначала задайте переменные окружения.

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## Аутентификация и запросы

Создайте первый ключ в личном кабинете → [Управление доменами](https://my.dnshe.com/index.php?m=domain_hub) → Управление API. Используйте заголовки `X-API-Key` и `X-API-Secret`; передача ключей через URL или тело отключена. Параметры GET передавайте в строке запроса, запись — JSON с `Content-Type: application/json`. `endpoint` выбирает ресурс, `action` — операцию. Для `quota` и `whois` параметр `action` не нужен. DDNS использует отдельный токен.

## Управление доменами

### 1.1 Список доменов

`GET` · `endpoint=subdomains` · `action=list`

#### Параметры

- `page` — `integer`; необязательный; по умолчанию / диапазон: `1`.
- `cursor_id` — `integer`; необязательный.
- `per_page` — `integer`; необязательный; по умолчанию / диапазон: `200; 1–500`.
- `include_total` — `boolean`; необязательный; по умолчанию / диапазон: `false`.
- `search` — `string`; необязательный.
- `rootdomain` — `string`; необязательный.
- `status` — `string`; необязательный; по умолчанию / диапазон: `active | suspended | expired`.
- `created_from / created_to` — `string`; необязательный; по умолчанию / диапазон: `YYYY-MM-DD`.
- `sort_by` — `string`; необязательный; по умолчанию / диапазон: `id`.
- `sort_dir` — `string`; необязательный; по умолчанию / диапазон: `desc; asc | desc`.
- `fields` — `string`; необязательный; по умолчанию / диапазон: `all`.

`page` — совместимый номер страницы от 1. Для больших списков начните с `cursor_id=0`, затем передавайте `pagination.next_cursor_id`, пока `pagination.has_more=true`; при false остановитесь. Курсор использует порядок ID без OFFSET. `per_page`: по умолчанию 200, максимум 500, рекомендуемое начало 50–100. `include_total=1` добавляет потенциально дорогой подсчёт. `search` ищет по префиксу или корневому домену; `rootdomain`, `status`, `created_from`, `created_to` фильтруют результаты. Даты: YYYY-MM-DD. `sort_by`: `id`, `created_at`, `updated_at`, `expires_at`, `subdomain`; `sort_dir`: `asc` или `desc`.

`fields` — список через запятую или `all`: `id`, `subdomain`, `rootdomain`, `full_domain`, `status`, `created_at`, `updated_at`, `expires_at`, `never_expires`, `cloudflare_zone_id`, `provider_account_id`. При выборке `id` добавляется автоматически. `count` обозначает размер возвращённой коллекции, а не обязательно общее число совпадений.

#### Примеры запросов

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

#### Примеры ответов

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

### 1.2 Регистрация домена

`POST` · `endpoint=subdomains` · `action=create`

#### Параметры

- `subdomain` — `string`; обязательный.
- `domain` — `string`; обязательный.

`subdomain` — префикс, например `myapp`; `domain` — доступный корневой домен, например `de5.net`. Для регистрации используйте `action=create` и поле `domain`. Поле ответа и фильтр `rootdomain` не являются полем регистрации. Действуют квоты и ограничения доступности.

#### Примеры запросов

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

#### Примеры ответов

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 Сведения о домене

`GET` · `endpoint=subdomains` · `action=get`

#### Параметры

- `subdomain_id` — `integer`; обязательный.

Укажите ID домена своего аккаунта. Ответ содержит объект домена, `dns_records` и `dns_count`.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Примеры ответов

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

### 1.4 Удаление домена

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### Параметры

- `subdomain_id` — `integer`; обязательный.

Удаляет принадлежащий аккаунту домен и связанные DNS-записи. Число удалённых записей — `dns_records_deleted`. Перед отправкой проверьте ID.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### Примеры ответов

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 Продление домена

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### Параметры

- `subdomain_id` — `integer`; обязательный.

Обычное бесплатное продление DNSHE остаётся бесплатным: в примере `charged_amount=0`. Универсальный плагин допускает платное восстановление, поэтому в период восстановления проверьте состояние и правила панели. Результат определяйте по `previous_expires_at`, `new_expires_at`, `never_expires`, `remaining_days`, `charged_amount`.

Ошибки продления: HTTP 403 `renewal disabled`, `redemption period requires administrator`, `renewal window expired`; HTTP 422 `renewal_not_yet_available`; HTTP 402 `insufficient balance for redemption renewal`; HTTP 404 для отсутствующего или чужого домена. Проверьте сроки или обратитесь в поддержку, не повторяйте запрос непрерывно.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### Примеры ответов

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

## Управление DNS-записями

### 2.1 Список DNS-записей

`GET` · `endpoint=dns_records` · `action=list`

#### Параметры

- `subdomain_id` — `integer`; обязательный.

Предпочитайте `id` модуля из списка или создания; новые публичные ID состоят из 15 цифр. `record_id` — ID записи у DNS-провайдера. Для изменения/удаления нужен хотя бы один; оба должны указывать на одну запись, иначе `dns_record_identifier_mismatch`. Старые внутренние ID совместимы. Совместимость числового `record_id` указана как минимум до 2027-06-12; новые клиенты передают ID модуля в `id`.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Примеры ответов

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

### 2.2 Создание DNS-записи

`POST` · `endpoint=dns_records` · `action=create`

#### Параметры

- `subdomain_id` — `integer`; обязательный.
- `type` — `string`; обязательный.
- `name` — `string`; необязательный; по умолчанию / диапазон: `@`.
- `content` — `string`; необязательный.
- `ttl` — `integer`; необязательный; по умолчанию / диапазон: `600`.
- `priority` — `integer`; необязательный; по умолчанию / диапазон: `MX: 10; SRV: 0`.
- `line` — `string`; необязательный.
- `record_weight / weight` — `integer`; необязательный.
- `record_port / port` — `integer`; необязательный; по умолчанию / диапазон: `1–65535`.
- `record_target / target` — `string`; необязательный.
- `caa_flag` — `integer`; необязательный; по умолчанию / диапазон: `0; 0–255`.
- `caa_tag` — `string`; необязательный; по умолчанию / диапазон: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; необязательный.

Типы `type`: A, AAAA, CNAME, MX, TXT, NS, SRV, CAA. `name` задаётся относительно зарегистрированного домена; пропуск, пустое значение или `@` означают сам домен. Полное имя не принимается; `*` допустим только в крайней левой метке. `content` обязателен, кроме формирования из структурированных SRV/CAA. `ttl` по умолчанию 600 секунд, `priority` — 10 для MX и 0 для SRV.

Для SRV используйте `record_weight`/`weight`, `record_port`/`port` (1–65535), `record_target`/`target`; цель `.` означает недоступную службу. Для CAA: `caa_flag` (0–255, по умолчанию 0), `caa_tag` (1–15 букв/цифр, по умолчанию `issue`), `caa_value`. `line` поддерживается только AliDNS; другие провайдеры отклоняют непустое значение.

Запись NS может быть отключена через `disable_ns_management`. После делегирования внешнему DNS создание/изменение не-NS записей отклоняется с `external_dns_delegated`. Удаление старых записей, сверка и очистка просроченных ресурсов не блокируются.

#### Примеры запросов

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

#### Примеры ответов

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 Изменение DNS-записи

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### Параметры

- `id` — `integer`; необязательный.
- `record_id` — `string`; необязательный.
- `type / name / content` — `string`; необязательный.
- `ttl / priority` — `integer`; необязательный.
- `line` — `string`; необязательный.
- `record_weight / weight` — `integer`; необязательный.
- `record_port / port` — `integer`; необязательный.
- `record_target / target` — `string`; необязательный.
- `caa_flag` — `integer`; необязательный.
- `caa_tag / caa_value` — `string`; необязательный.

Передайте `id` или `record_id` и изменяемые поля. Правила имён и SRV/CAA такие же, как при создании. Оба идентификатора должны совпадать по записи. Ответ возвращает ID модуля и провайдера.

Предпочитайте `id` модуля из списка или создания; новые публичные ID состоят из 15 цифр. `record_id` — ID записи у DNS-провайдера. Для изменения/удаления нужен хотя бы один; оба должны указывать на одну запись, иначе `dns_record_identifier_mismatch`. Старые внутренние ID совместимы. Совместимость числового `record_id` указана как минимум до 2027-06-12; новые клиенты передают ID модуля в `id`.

Запись NS может быть отключена через `disable_ns_management`. После делегирования внешнему DNS создание/изменение не-NS записей отклоняется с `external_dns_delegated`. Удаление старых записей, сверка и очистка просроченных ресурсов не блокируются.

#### Примеры запросов

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

#### Примеры ответов

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 Удаление DNS-записи

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### Параметры

- `id` — `integer`; необязательный.
- `record_id` — `string`; необязательный.

Предпочитайте `id` модуля из списка или создания; новые публичные ID состоят из 15 цифр. `record_id` — ID записи у DNS-провайдера. Для изменения/удаления нужен хотя бы один; оба должны указывать на одну запись, иначе `dns_record_identifier_mismatch`. Старые внутренние ID совместимы. Совместимость числового `record_id` указана как минимум до 2027-06-12; новые клиенты передают ID модуля в `id`.

#### Примеры запросов

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

#### Примеры ответов

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## Динамический DNS (DDNS)

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

Создайте токен для конкретной A/AAAA-записи в Управление доменами → DDNS. Передавайте `Authorization: Bearer <DDNS_TOKEN>` или `X-DDNS-Token`, не URL и не тело. Токен меняет только IP связанной записи. Поддерживаются GET, POST, PUT; ниже POST. Необязательный `ip` задаёт IPv4/IPv6; без него используется непосредственно наблюдаемый IP источника запроса. Для AAAA нужен соответствующий IPv6.

`status=good` означает изменение IP. `status=nochg` и `changed=false` также означают успех, без обращения к DNS-провайдеру. DDNS использует `https://api005.dnshe.com` независимо от адреса личного кабинета.

#### Примеры запросов

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

#### Примеры ответов

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

Для Synology DSM и других устройств используйте планировщик со скриптом, отправляющим заголовки, а не URL-шаблон с токеном. Сохраните токен и проверьте задачу вручную. Пять минут — исходный ориентир, но интервал не должен быть меньше настроенного минимума. Храните токен в защищённом окружении задачи.

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## Управление ключами API

### 3.1 Список ключей API

`GET` · `endpoint=keys` · `action=list`

Возвращает ID, имена, состояние, число запросов и время использования ключей. Существующий Secret получить нельзя. Первый ключ создаётся в панели.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Примеры ответов

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

### 3.2 Создание ключа API

`POST` · `endpoint=keys` · `action=create`

#### Параметры

- `key_name` — `string`; обязательный.
- `ip_whitelist` — `string`; необязательный.

`key_name` — имя ключа. При включённом списке разрешённых IP параметр `ip_whitelist` принимает IP/CIDR через запятую, перевод строки или точку с запятой. Замените пример реальным внешним IP сервера. `api_secret` показывается один раз: сохраните сразу.

#### Примеры запросов

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

#### Примеры ответов

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 Удаление ключа API

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### Параметры

- `key_id` — `integer`; обязательный.

Отзывает ключ `key_id`. Управляйте ключами с помощью отдельного действующего ключа, чтобы не прервать текущую автоматизацию неожиданно.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### Примеры ответов

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 Пересоздание API Secret

`POST` · `endpoint=keys` · `action=regenerate`

#### Параметры

- `key_id` — `integer`; обязательный.

Создаёт новый Secret для `key_id`, старый становится недействительным. Сохраните новый и обновите сервисы. Если утрачены все рабочие данные, восстановите доступ через панель: без аутентификации операция недоступна.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### Примеры ответов

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## Передача доменов

### 4.1 Начать передачу

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### Параметры

- `subdomain_id` — `integer`; обязательный.

`subdomain_id` должен принадлежать текущему аккаунту. Ответ содержит код передачи и срок действия. Передавайте код только нужному получателю.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### Примеры ответов

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

### 4.2 Принять домен

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### Параметры

- `code` — `string`; обязательный.

Получатель использует собственный ключ и передаёт `code` отправителя. Операция передаёт домен; проверьте имя и исходный аккаунт в ответе.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### Примеры ответов

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

### 4.3 Отменить передачу

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### Параметры

- `gift_id` — `integer`; обязательный.

`gift_id` должен соответствовать передаче в состоянии pending, начатой текущим пользователем. Отмена делает её недействительной.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### Примеры ответов

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

### 4.4 Список передач

`GET` · `endpoint=gifts` · `action=list`

Возвращает записи передачи и состояния. `initiate`, `accept`, `cancel` — ограниченные по частоте операции записи. После таймаута сначала проверьте состояние: запрос мог выполниться.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Примеры ответов

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

## Квоты

### 5.1 Проверка квоты

`GET` · `endpoint=quota`

Объект `quota` содержит `used`, `base`, `invite_bonus`, `total`, `available`. Используйте фактический ответ, а не квоту примера. `action` не требуется.

#### Примеры запросов

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Примеры ответов

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

#### Параметры

- `domain` — `string`; обязательный.

Обязательный `domain` — полное имя для внутреннего домена или внешнего WHOIS. Публичный режим обычно не требует ключа и ограничен 2 запросами/минуту/IP отдельно от общего API. Оператор может потребовать два стандартных заголовка аутентификации. `action` не требуется.

Видимость почты и индекса определяется приватностью; `registrant_postal_code` отличается от старого `registrant_address`. `owner_userid` относится только к внутренним доменам и обычно виден аутентифицированному владельцу, если оператор не изменил настройку. Публичный WHOIS по умолчанию не раскрывает внутренние ID. Не считайте необязательные персональные поля обязательными.

Статусы: `Registered`, `RenewalGracePeriod`, `RedemptionPeriod`, `ServerHold`, `PendingDelete`, `unregistered`. `nameservers` и синоним `name_servers` берутся из фактических NS, иначе из настроек. Бессрочный домен возвращает `expires_at="2999-12-31 23:59"` без `never_expires`. Незарегистрированный: `registered=false`, `status=unregistered`. В публичном режиме `rate_limit` показывает остаток для IP.

#### Примеры запросов

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Примеры ответов

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

## Ошибки и ограничения запросов

Проверяйте HTTP и JSON `success`. Обрабатывайте стабильный `error_code`, а не меняющийся текст. `message` — описание, `details` — необязательный контекст, старое `error` повторяет смысл message. Ответ вышестоящего сервиса не в JSON также является ошибкой. Ниже общие коды и HTTP-статусы; ошибки продления описаны отдельно.

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

Обычно API допускает 60 запросов/минуту, публичный WHOIS — 2/минуту/IP; настройки могут отличаться. Используйте `details.limit`, `details.remaining`, `details.reset_at`, если они есть. HTTP 429 используется и для квоты, и для частоты: различайте `quota_exceeded` и `rate_limit_exceeded`.

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

Для ограниченных чтений дождитесь сброса или применяйте ограниченную экспоненциальную задержку со случайным разбросом. После таймаута создания, удаления, продления, принятия домена или смены Secret сначала проверьте состояние. Клиенты не повторяют запись автоматически.

## Примеры клиентов

Это небольшие примеры клиентов, а не официальный SDK. Они кодируют параметры, отправляют JSON, задают таймауты и проверяют HTTP/API. Запускайте из корня репозитория. Node.js требует встроенных fetch и AbortSignal.timeout; Python использует стандартную библиотеку; PHP — cURL и JSON. Ключи хранятся на доверенном сервере, не в браузере.

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

## Безопасность и частые вопросы

Используйте HTTPS, защищённые переменные окружения, отдельные ключи и минимальные права. Включайте список разрешённых IP, меняйте Secret, отзывайте ненужные ключи, проверяйте журналы. Не публикуйте API/DDNS-токены в репозитории, URL, снимках экрана или журналах.

Утрата Secret: пересоздайте через другой действующий ключ или панель; старый недействителен. Повышение лимита: поддержка. Подаккаунты: справочная реализация разрешает ключи только основному аккаунту. Пакетные операции не документированы, вызывайте отдельно. Статистика доступна в Управлении API и списке ключей.

## Поддержка

По вопросам аккаунта, доступности API и продления: [support@dnshe.com](mailto:support@dnshe.com). Настройки: [онлайн-руководство](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) и [Управление доменами](https://my.dnshe.com/index.php?m=domain_hub).

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
