# Documentation API des domaines gratuits DNSHE (v2.0)

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <strong>Français</strong> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Retour à la présentation](../README_FR.md)

## 📌 Présentation

* **URL de base :**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **Authentification :** API Key + API Secret
* **Format de réponse :** JSON
* **Limite de requêtes :** 60 requêtes/minute (configurable)

---

## 🔐 Authentification

### Obtenir les identifiants API

1. Connectez-vous à l'espace client DNSHE
2. Ouvrez **Gestion de mes domaines** (My Domain Management)
3. Sélectionnez **Gestion API** (API Management) dans la barre latérale
4. Créez une nouvelle clé API

---

### Méthode d'authentification

#### ✅ Recommandé : en-têtes HTTP

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ Désactivé : paramètres URL

> Pour des raisons de sécurité, la transmission de `api_key` et `api_secret` par l'URL ou le corps de la requête n'est plus prise en charge.

---

## 📦 Points d'accès API

---

## 1️⃣ Gestion des sous-domaines

### 1.1 Lister les sous-domaines

* **Point d'accès:** `subdomains`
* **Action:** `list`
* **Méthode:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### Exemple de réponse

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

### 1.2 Enregistrer un sous-domaine

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

### 1.3 Obtenir les détails d'un sous-domaine

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 Supprimer un sous-domaine

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 Renouveler un sous-domaine

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ Gestion des enregistrements DNS

### Lister les enregistrements DNS

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### Créer un enregistrement DNS

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

## 3️⃣ Gestion des clés API

### Lister les clés API

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ Quotas

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ Recherche WHOIS (API publique)

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ Format des erreurs

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 Limitation du débit de requêtes

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

## 🔐 Bonnes pratiques de sécurité

* Stockez les identifiants API dans des variables d'environnement
* Activez une liste d'adresses IP autorisées pour les clés de production
* Renouvelez régulièrement les clés API
* Utilisez toujours HTTPS

---

## ❓ Questions fréquentes

**Question : API Secret perdu ?**
Réponse : utilisez `regenerate` pour en créer un nouveau.

**Question : les opérations par lots sont-elles prises en charge ?**
Réponse : pas dans la version actuelle.

---

## 📝 Historique des modifications

### v2.0 (2026-04-25)

* 🚀 Publication officielle de v2.0
* 🔧 Optimisation de la structure des commandes API
* ✨ Ajout de nouvelles fonctionnalités API
* ⚡ Amélioration des performances de pagination et de requête
* 🛡️ Amélioration de la gestion des erreurs et de la sécurité

---

### v1.0 (2025-10-19)

* 🎉 Première publication
* Gestion des sous-domaines
* Gestion des enregistrements DNS
* Gestion des clés API
* Prise en charge des quotas
* Limitation du débit de requêtes
