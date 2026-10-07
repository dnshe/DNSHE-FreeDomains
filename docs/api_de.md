# API-Dokumentation für kostenlose DNSHE-Domains (v2.0)

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <strong>Deutsch</strong> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Zurück zur Einführung](../README_DE.md)

## 📌 Übersicht

* **Basis-URL:**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **Authentifizierung:** API Key + API Secret
* **Antwortformat:** JSON
* **Anfragelimit:** 60 Anfragen/Minute (konfigurierbar)

---

## 🔐 Authentifizierung

### API-Zugangsdaten erhalten

1. Melden Sie sich im DNSHE-Kundenbereich an
2. Öffnen Sie **Meine Domainverwaltung** (My Domain Management)
3. Wählen Sie **API-Verwaltung** (API Management) in der Seitenleiste
4. Erstellen Sie einen neuen API-Schlüssel

---

### Authentifizierungsverfahren

#### ✅ Empfohlen: HTTP-Header

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ Deaktiviert: URL-Parameter

> Aus Sicherheitsgründen wird die Übermittlung von `api_key` und `api_secret` über die URL oder den Anfragekörper nicht mehr unterstützt.

---

## 📦 API-Endpunkte

---

## 1️⃣ Subdomainverwaltung

### 1.1 Subdomains auflisten

* **Endpunkt:** `subdomains`
* **Aktion:** `list`
* **Methode:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### Beispielantwort

```json
{
  "success": true,
  "count": 2,
  "subdomains": [
    {
      "id": 1,
      "subdomain": "test",
      "rootdomain": "example.com",
      "full_domain": "test.example.com",
      "status": "active"
    }
  ]
}
```

---

### 1.2 Subdomain registrieren

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=register" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain": "myapp",
    "rootdomain": "example.com"
  }'
```

---

### 1.3 Subdomaindetails abrufen

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 Subdomain löschen

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 Subdomain verlängern

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ Verwaltung von DNS-Einträgen

### DNS-Einträge auflisten

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### DNS-Eintrag erstellen

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=create" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1,
    "type": "A",
    "content": "192.168.1.100"
  }'
```

---

## 3️⃣ API-Schlüsselverwaltung

### API-Schlüssel auflisten

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ Kontingente

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ WHOIS-Abfrage (öffentliche API)

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ Fehlerformat

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 Begrenzung der Anfragerate

```json
{
  "error_code": "rate_limit_exceeded",
  "details": {
    "limit": 60,
    "remaining": 0
  }
}
```

---

## 🔐 Sicherheitsempfehlungen

* Speichern Sie API-Zugangsdaten in Umgebungsvariablen
* Aktivieren Sie eine IP-Freigabeliste für Produktionsschlüssel
* Wechseln Sie API-Schlüssel regelmäßig
* Verwenden Sie immer HTTPS

---

## ❓ Häufige Fragen

**Frage: API Secret verloren?**
Antwort: Verwenden Sie `regenerate`, um ein neues zu erzeugen.

**Frage: Werden Stapeloperationen unterstützt?**
Antwort: In der aktuellen Version nicht.

---

## 📝 Änderungsverlauf

### v2.0 (2026-04-25)

* 🚀 Offizielle Veröffentlichung von v2.0
* 🔧 API-Befehlsstruktur optimiert
* ✨ Neue API-Funktionen hinzugefügt
* ⚡ Leistung bei Paginierung und Abfragen verbessert
* 🛡️ Fehlerbehandlung und Sicherheit verbessert

---

### v1.0 (2025-10-19)

* 🎉 Erstveröffentlichung
* Subdomainverwaltung
* Verwaltung von DNS-Einträgen
* API-Schlüsselverwaltung
* Unterstützung von Kontingenten
* Begrenzung der Anfragerate
