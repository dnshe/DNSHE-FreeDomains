# DNSHE-Domain-API-Referenz

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <strong>Deutsch</strong> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Zurück zur Einführung](../README_DE.md)

Registrieren Sie Domains, verwalten Sie DNS, aktualisieren Sie dynamische IPs und automatisieren Sie Kontoabläufe. Die Beispiele verwenden den DNSHE-API-Host und Platzhalter. Ersetzen Sie Namen, IDs und Zugangsdaten durch eigene Ressourcen.

## Inhalt

- [Erste Schritte](#erste-schritte)
- [Authentifizierung und Anfragekonventionen](#authentifizierung-und-anfragekonventionen)
- [Domainverwaltung](#domainverwaltung)
- [Verwaltung von DNS-Einträgen](#verwaltung-von-dns-einträgen)
- [Dynamisches DNS (DDNS)](#dynamisches-dns-ddns)
- [API-Schlüsselverwaltung](#api-schlüsselverwaltung)
- [Domainübertragungen](#domainübertragungen)
- [Kontingente](#kontingente)
- [WHOIS](#whois)
- [Fehler und Anfragelimits](#fehler-und-anfragelimits)
- [Clientbeispiele](#clientbeispiele)
- [Sicherheit und häufige Fragen](#sicherheit-und-häufige-fragen)
- [Support](#support)

## Erste Schritte

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

Die Basis-URL enthält bereits `m=domain_hub`; ergänzen Sie Parameter mit `&`. Anfragen und Antworten verwenden JSON, außer GET-Abfrageparametern. Das allgemeine Limit beträgt standardmäßig 60 Anfragen/Minute und ist konfigurierbar. Funktionen hängen von Konto und Installation ab. Die Shellbeispiele verwenden Bash/sh; setzen Sie zuerst diese Umgebungsvariablen.

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## Authentifizierung und Anfragekonventionen

Erstellen Sie den ersten Schlüssel im Kundenbereich → [Domains verwalten](https://my.dnshe.com/index.php?m=domain_hub) → API-Verwaltung. Verwenden Sie `X-API-Key` und `X-API-Secret` als Header; Zugangsdaten in URL oder Anfragekörper sind deaktiviert. GET-Parameter gehören in die Abfrage, Schreibparameter in JSON mit `Content-Type: application/json`. `endpoint` bestimmt die Ressource, `action` die Operation. `quota` und `whois` benötigen kein `action`. DDNS verwendet ein separates Token.

## Domainverwaltung

### 1.1 Domains auflisten

`GET` · `endpoint=subdomains` · `action=list`

#### Parameter

- `page` — `integer`; optional; Standard / Bereich: `1`.
- `cursor_id` — `integer`; optional.
- `per_page` — `integer`; optional; Standard / Bereich: `200; 1–500`.
- `include_total` — `boolean`; optional; Standard / Bereich: `false`.
- `search` — `string`; optional.
- `rootdomain` — `string`; optional.
- `status` — `string`; optional; Standard / Bereich: `active | suspended | expired`.
- `created_from / created_to` — `string`; optional; Standard / Bereich: `YYYY-MM-DD`.
- `sort_by` — `string`; optional; Standard / Bereich: `id`.
- `sort_dir` — `string`; optional; Standard / Bereich: `desc; asc | desc`.
- `fields` — `string`; optional; Standard / Bereich: `all`.

`page` ist eine kompatible Seitennummer ab 1. Beginnen Sie bei großen Listen mit `cursor_id=0`; verwenden Sie anschließend `pagination.next_cursor_id`, solange `pagination.has_more=true`, und stoppen Sie bei false. Der Cursormodus sortiert nach ID ohne OFFSET. `per_page`: Standard 200, Maximum 500, Einstieg 50–100. `include_total=1` ergänzt eine möglicherweise teure Gesamtzählung. `search` sucht Präfix oder Stammdomain; `rootdomain`, `status`, `created_from`, `created_to` filtern. Datumsformat: YYYY-MM-DD. `sort_by`: `id`, `created_at`, `updated_at`, `expires_at`, `subdomain`; `sort_dir`: `asc` oder `desc`.

`fields` ist eine kommaseparierte Auswahl oder `all`: `id`, `subdomain`, `rootdomain`, `full_domain`, `status`, `created_at`, `updated_at`, `expires_at`, `never_expires`, `cloudflare_zone_id`, `provider_account_id`. Eine Auswahl enthält immer `id`. `count` bezeichnet die zurückgegebene Sammlung, nicht zwingend alle Treffer.

#### Anfragebeispiele

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

#### Antwortbeispiele

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

### 1.2 Domain registrieren

`POST` · `endpoint=subdomains` · `action=create`

#### Parameter

- `subdomain` — `string`; erforderlich.
- `domain` — `string`; erforderlich.

`subdomain` ist das Präfix, etwa `myapp`; `domain` die verfügbare Stammdomain, etwa `de5.net`. Registrieren Sie mit `action=create` und `domain`. Das Antwortfeld und der Listenfilter `rootdomain` sind keine Registrierungsfelder. Verfügbarkeit und Kontingente gelten weiterhin.

#### Anfragebeispiele

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

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 Domaindetails abrufen

`GET` · `endpoint=subdomains` · `action=get`

#### Parameter

- `subdomain_id` — `integer`; erforderlich.

Verwenden Sie eine Domain-ID des authentifizierten Kontos. Die Antwort enthält Domainobjekt, `dns_records` und `dns_count`.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Antwortbeispiele

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

### 1.4 Domain löschen

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### Parameter

- `subdomain_id` — `integer`; erforderlich.

Löscht die eigene Domain samt zugehörigen DNS-Einträgen. `dns_records_deleted` meldet die Anzahl. Prüfen Sie die Ziel-ID vor dem Senden.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 Domain verlängern

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### Parameter

- `subdomain_id` — `integer`; erforderlich.

Die normale kostenlose DNSHE-Verlängerung bleibt kostenlos; das Beispiel hat `charged_amount=0`. Das allgemeine Plugin erlaubt kostenpflichtige Wiederherstellung. Prüfen Sie in dieser Phase Zustand und Konsolenregeln. Lesen Sie `previous_expires_at`, `new_expires_at`, `never_expires`, `remaining_days`, `charged_amount` aus der tatsächlichen Antwort.

Verlängerungsfehler: HTTP 403 `renewal disabled`, `redemption period requires administrator`, `renewal window expired`; HTTP 422 `renewal_not_yet_available`; HTTP 402 `insufficient balance for redemption renewal`; HTTP 404 bei fehlender oder fremder Domain. Prüfen Sie das Zeitfenster oder kontaktieren Sie den Support; vermeiden Sie ununterbrochene Wiederholungen.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### Antwortbeispiele

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

## Verwaltung von DNS-Einträgen

### 2.1 DNS-Einträge auflisten

`GET` · `endpoint=dns_records` · `action=list`

#### Parameter

- `subdomain_id` — `integer`; erforderlich.

Bevorzugen Sie die Modul-`id` aus Liste/Erstellung; neue öffentliche IDs haben 15 Stellen. `record_id` bezeichnet den DNS-Anbietereintrag. Ändern/Löschen benötigt mindestens eine Kennung; beide müssen denselben Eintrag bezeichnen, sonst `dns_record_identifier_mismatch`. Alte interne IDs bleiben kompatibel. Numerische `record_id` sind laut Referenz mindestens bis 2027-06-12 kompatibel; neue Clients senden Modul-IDs in `id`.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Antwortbeispiele

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

### 2.2 DNS-Eintrag erstellen

`POST` · `endpoint=dns_records` · `action=create`

#### Parameter

- `subdomain_id` — `integer`; erforderlich.
- `type` — `string`; erforderlich.
- `name` — `string`; optional; Standard / Bereich: `@`.
- `content` — `string`; optional.
- `ttl` — `integer`; optional; Standard / Bereich: `600`.
- `priority` — `integer`; optional; Standard / Bereich: `MX: 10; SRV: 0`.
- `line` — `string`; optional.
- `record_weight / weight` — `integer`; optional.
- `record_port / port` — `integer`; optional; Standard / Bereich: `1–65535`.
- `record_target / target` — `string`; optional.
- `caa_flag` — `integer`; optional; Standard / Bereich: `0; 0–255`.
- `caa_tag` — `string`; optional; Standard / Bereich: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; optional.

`type` unterstützt A, AAAA, CNAME, MX, TXT, NS, SRV, CAA. `name` ist relativ zur registrierten Domain; fehlend, leer oder `@` bedeutet die Domain selbst. Vollständige Domainnamen werden abgelehnt; `*` ist nur im äußersten linken Label erlaubt. `content` ist erforderlich, außer bei Aufbau aus strukturierten SRV/CAA-Parametern. Standard: `ttl` 600 Sekunden, `priority` 10 für MX und 0 für SRV.

SRV verwendet `record_weight`/`weight`, `record_port`/`port` (1–65535), `record_target`/`target`; Ziel `.` bedeutet nicht verfügbar. CAA: `caa_flag` (0–255, Standard 0), `caa_tag` (1–15 alphanumerische Zeichen, Standard `issue`), `caa_value`. `line` gilt nur für AliDNS; andere Anbieter lehnen nicht leere Werte ab.

NS-Schreibzugriffe können durch `disable_ns_management` deaktiviert sein. Nach externer DNS-Delegation werden Erstellung/Änderung von Nicht-NS-Einträgen mit `external_dns_delegated` abgelehnt. Löschen alter Einträge, Abgleich und Ablaufbereinigung bleiben möglich.

#### Anfragebeispiele

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

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 DNS-Eintrag ändern

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### Parameter

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

Senden Sie `id` oder `record_id` sowie zu ändernde Felder. Namensregeln und SRV/CAA-Optionen entsprechen der Erstellung. Beide Kennungen müssen denselben Eintrag bezeichnen. Die Antwort liefert Modul- und Anbieter-ID.

Bevorzugen Sie die Modul-`id` aus Liste/Erstellung; neue öffentliche IDs haben 15 Stellen. `record_id` bezeichnet den DNS-Anbietereintrag. Ändern/Löschen benötigt mindestens eine Kennung; beide müssen denselben Eintrag bezeichnen, sonst `dns_record_identifier_mismatch`. Alte interne IDs bleiben kompatibel. Numerische `record_id` sind laut Referenz mindestens bis 2027-06-12 kompatibel; neue Clients senden Modul-IDs in `id`.

NS-Schreibzugriffe können durch `disable_ns_management` deaktiviert sein. Nach externer DNS-Delegation werden Erstellung/Änderung von Nicht-NS-Einträgen mit `external_dns_delegated` abgelehnt. Löschen alter Einträge, Abgleich und Ablaufbereinigung bleiben möglich.

#### Anfragebeispiele

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

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 DNS-Eintrag löschen

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### Parameter

- `id` — `integer`; optional.
- `record_id` — `string`; optional.

Bevorzugen Sie die Modul-`id` aus Liste/Erstellung; neue öffentliche IDs haben 15 Stellen. `record_id` bezeichnet den DNS-Anbietereintrag. Ändern/Löschen benötigt mindestens eine Kennung; beide müssen denselben Eintrag bezeichnen, sonst `dns_record_identifier_mismatch`. Alte interne IDs bleiben kompatibel. Numerische `record_id` sind laut Referenz mindestens bis 2027-06-12 kompatibel; neue Clients senden Modul-IDs in `id`.

#### Anfragebeispiele

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

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## Dynamisches DNS (DDNS)

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

Erstellen Sie unter Domainverwaltung → DDNS ein Token für einen bestimmten A/AAAA-Eintrag. Senden Sie `Authorization: Bearer <DDNS_TOKEN>` oder `X-DDNS-Token`, niemals URL oder Anfragekörper. Das Token ändert nur die gebundene IP. GET, POST und PUT werden unterstützt; Beispiele nutzen POST. Optionales `ip` setzt IPv4/IPv6; ohne Angabe gilt die direkt beobachtete Quell-IP. Für AAAA ist die passende IPv6 nötig.

`status=good` bedeutet geändert. Auch `status=nochg` mit `changed=false` ist erfolgreich und ruft den DNS-Anbieter nicht auf. DDNS verwendet unabhängig vom Kundenbereich `https://api005.dnshe.com`.

#### Anfragebeispiele

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

#### Antwortbeispiele

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

Für Synology DSM und andere Geräte verwenden Sie geplante Skripte mit Headern, keine URL-Vorlage mit Token. Speichern Sie das Token und testen Sie den Task manuell. Fünf Minuten sind ein Ausgangspunkt; das konfigurierte Mindestintervall darf nicht unterschritten werden. Speichern Sie Tokens in einer geschützten Taskumgebung.

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## API-Schlüsselverwaltung

### 3.1 API-Schlüssel auflisten

`GET` · `endpoint=keys` · `action=list`

Listet Schlüssel-IDs, Namen, Zustand, Anfragezähler und letzte Nutzung. Bestehende Secrets werden nicht wiederhergestellt. Der erste Schlüssel wird in der Konsole erstellt.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Antwortbeispiele

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

### 3.2 API-Schlüssel erstellen

`POST` · `endpoint=keys` · `action=create`

#### Parameter

- `key_name` — `string`; erforderlich.
- `ip_whitelist` — `string`; optional.

`key_name` benennt den Schlüssel. Bei aktivierter IP-Freigabeliste akzeptiert `ip_whitelist` IP/CIDR, getrennt durch Kommas, Zeilenumbrüche oder Semikolons. Ersetzen Sie die Beispiel-IP durch die tatsächliche ausgehende Server-IP. `api_secret` wird nur einmal angezeigt: sofort speichern.

#### Anfragebeispiele

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

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 API-Schlüssel löschen

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### Parameter

- `key_id` — `integer`; erforderlich.

Widerruft den Schlüssel `key_id`. Verwenden Sie einen separaten gültigen Verwaltungsschlüssel, damit das Löschen den aktuellen Ablauf nicht unerwartet beendet.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 API Secret erneuern

`POST` · `endpoint=keys` · `action=regenerate`

#### Parameter

- `key_id` — `integer`; erforderlich.

Erzeugt ein neues Secret für `key_id`; das alte wird ungültig. Speichern Sie das neue und aktualisieren Sie abhängige Dienste. Sind alle gültigen Zugangsdaten verloren, nutzen Sie die Konsole statt eines unauthentifizierten API-Aufrufs.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### Antwortbeispiele

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## Domainübertragungen

### 4.1 Übertragung starten

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### Parameter

- `subdomain_id` — `integer`; erforderlich.

`subdomain_id` muss dem authentifizierten Konto gehören. Die Antwort liefert Übertragungscode und Ablaufzeit. Teilen Sie den Code nur mit dem vorgesehenen Empfänger.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### Antwortbeispiele

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

### 4.2 Übertragung annehmen

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### Parameter

- `code` — `string`; erforderlich.

Der Empfänger authentifiziert sich selbst und sendet den `code` des Absenders. Die Annahme überträgt die Domain; prüfen Sie Domain und Quellkonto in der Antwort.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### Antwortbeispiele

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

### 4.3 Übertragung abbrechen

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### Parameter

- `gift_id` — `integer`; erforderlich.

`gift_id` muss eine vom aktuellen Nutzer initiierte Übertragung im Zustand pending bezeichnen. Abbrechen macht diese Übertragung ungültig.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### Antwortbeispiele

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

### 4.4 Übertragungen auflisten

`GET` · `endpoint=gifts` · `action=list`

Listet Übertragungen und Zustände. `initiate`, `accept`, `cancel` sind begrenzte Schreibzugriffe. Prüfen Sie nach einem Timeout zuerst den Zustand; die Operation kann bereits erfolgt sein.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Antwortbeispiele

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

## Kontingente

### 5.1 Kontingent abfragen

`GET` · `endpoint=quota`

`quota` enthält `used`, `base`, `invite_bonus`, `total`, `available`. Nutzen Sie die tatsächlichen Werte statt der Beispielkontingente. Kein `action` erforderlich.

#### Anfragebeispiele

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Antwortbeispiele

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

#### Parameter

- `domain` — `string`; erforderlich.

Erforderliches `domain` enthält den vollständigen Namen für interne Domains oder externes WHOIS. Öffentlich standardmäßig ohne Schlüssel, mit 2 Anfragen/Minute/IP, getrennt vom allgemeinen API-Limit. Der Betreiber kann die üblichen zwei Authentifizierungsheader verlangen. Kein `action` erforderlich.

E-Mail- und Postleitzahl-Sichtbarkeit hängen vom Datenschutz ab; `registrant_postal_code` ist getrennt vom alten `registrant_address`. `owner_userid` gilt nur intern und ist normalerweise dem authentifizierten Eigentümer sichtbar, sofern der Betreiber dies nicht ändert. Öffentlich werden interne Nutzer-IDs standardmäßig nicht offengelegt. Optionale Identitätsfelder können fehlen.

Zustände: `Registered`, `RenewalGracePeriod`, `RedemptionPeriod`, `ServerHold`, `PendingDelete`, `unregistered`. `nameservers` und Alias `name_servers` verwenden tatsächliche NS, sonst Standardwerte. Unbefristete Domains liefern `expires_at="2999-12-31 23:59"` ohne `never_expires`. Nicht registriert: `registered=false`, `status=unregistered`. Öffentlich zeigt `rate_limit` das verbleibende IP-Kontingent.

#### Anfragebeispiele

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Antwortbeispiele

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

## Fehler und Anfragelimits

Prüfen Sie HTTP-Status und JSON-`success`. Verarbeiten Sie stabile `error_code` statt veränderlicher Texte. `message` beschreibt den Fehler, `details` ergänzt optionalen Kontext, das alte `error` entspricht message. Auch Nicht-JSON-Antworten sind Fehler. Unten stehen häufige Codes und HTTP-Status; Verlängerungsfehler sind beim Endpunkt erklärt.

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

Standard: allgemeine API 60/Minute, öffentliches WHOIS 2/Minute/IP; Einstellungen können abweichen. Nutzen Sie `details.limit`, `details.remaining`, `details.reset_at`, falls vorhanden. HTTP 429 gilt für Kontingente und Rate: unterscheiden Sie `quota_exceeded` und `rate_limit_exceeded`.

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

Warten Sie bei begrenzten Lesezugriffen bis zum Reset oder nutzen Sie begrenztes exponentielles Backoff mit Zufallsanteil. Nach Timeout bei Erstellen, Löschen, Verlängern, Annehmen oder Secretwechsel zuerst den Zustand prüfen. Clients wiederholen Schreibzugriffe nicht automatisch.

## Clientbeispiele

Kleine Referenzclients, kein offizielles SDK: Querykodierung, JSON, Timeouts und HTTP/API-Prüfung sind enthalten. Führen Sie Beispiele im Repository-Stamm aus. Node.js benötigt eingebautes fetch und AbortSignal.timeout; Python nutzt die Standardbibliothek; PHP benötigt cURL und JSON. Zugangsdaten gehören auf vertrauenswürdige Server, nie in Browser-JavaScript.

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

## Sicherheit und häufige Fragen

Verwenden Sie HTTPS, geschützte Umgebungsvariablen, getrennte Schlüssel und minimale Rechte. Aktivieren Sie verfügbare IP-Freigabelisten, wechseln Sie Secrets, widerrufen Sie ungenutzte Schlüssel und prüfen Sie Logs. API/DDNS-Tokens gehören nicht in Repositorys, URLs, Screenshots oder öffentliche Logs.

Secret verloren: mit anderem gültigen Schlüssel oder Konsole erneuern; das alte wird ungültig. Höheres Limit: Support. Unterkonten: die Referenz erlaubt Schlüsselerstellung/-nutzung nur dem Hauptkonto. Keine dokumentierten Stapeloperationen; einzeln aufrufen. Statistiken stehen in API-Verwaltung und Schlüsselliste.

## Support

Fragen zu Konten, Verfügbarkeit und Verlängerung: [support@dnshe.com](mailto:support@dnshe.com). Einstellungen: [Onlinehandbuch](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) und [Domains verwalten](https://my.dnshe.com/index.php?m=domain_hub).

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
