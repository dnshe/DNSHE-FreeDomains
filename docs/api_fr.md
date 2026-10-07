# Référence API des domaines DNSHE

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <strong>Français</strong> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Retour à la présentation](../README_FR.md)

Enregistrez des domaines, gérez le DNS, actualisez les IP dynamiques et automatisez les opérations du compte. Les exemples utilisent le serveur API DNSHE et des identifiants fictifs. Remplacez noms, ID et clés par vos ressources.

## Sommaire

- [Premiers pas](#premiers-pas)
- [Authentification et conventions](#authentification-et-conventions)
- [Gestion des domaines](#gestion-des-domaines)
- [Gestion des enregistrements DNS](#gestion-des-enregistrements-dns)
- [DNS dynamique (DDNS)](#dns-dynamique-ddns)
- [Gestion des clés API](#gestion-des-clés-api)
- [Dons de domaines](#dons-de-domaines)
- [Quotas](#quotas)
- [WHOIS](#whois)
- [Erreurs et limites de requêtes](#erreurs-et-limites-de-requêtes)
- [Exemples de clients](#exemples-de-clients)
- [Sécurité et questions fréquentes](#sécurité-et-questions-fréquentes)
- [Assistance](#assistance)

## Premiers pas

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

L'URL de base contient déjà `m=domain_hub` ; ajoutez les paramètres avec `&`. Requêtes et réponses utilisent JSON, sauf les paramètres de requête GET. La limite générale est de 60 requêtes/minute par défaut, configurable. Les fonctions dépendent du compte et du déploiement. Les commandes utilisent Bash/sh ; définissez d'abord ces variables d'environnement.

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## Authentification et conventions

Créez la première clé dans l'espace client → [Gérer les domaines](https://my.dnshe.com/index.php?m=domain_hub) → Gestion API. Utilisez les en-têtes `X-API-Key` et `X-API-Secret` ; les identifiants dans l'URL ou le corps sont désactivés. Les paramètres GET vont dans l'URL, les écritures dans un corps JSON avec `Content-Type: application/json`. `endpoint` sélectionne la ressource, `action` l'opération. `quota` et `whois` n'ont pas besoin d'`action`. DDNS utilise un jeton distinct.

## Gestion des domaines

### 1.1 Lister les domaines

`GET` · `endpoint=subdomains` · `action=list`

#### Paramètres

- `page` — `integer`; facultatif; valeur par défaut / plage: `1`.
- `cursor_id` — `integer`; facultatif.
- `per_page` — `integer`; facultatif; valeur par défaut / plage: `200; 1–500`.
- `include_total` — `boolean`; facultatif; valeur par défaut / plage: `false`.
- `search` — `string`; facultatif.
- `rootdomain` — `string`; facultatif.
- `status` — `string`; facultatif; valeur par défaut / plage: `active | suspended | expired`.
- `created_from / created_to` — `string`; facultatif; valeur par défaut / plage: `YYYY-MM-DD`.
- `sort_by` — `string`; facultatif; valeur par défaut / plage: `id`.
- `sort_dir` — `string`; facultatif; valeur par défaut / plage: `desc; asc | desc`.
- `fields` — `string`; facultatif; valeur par défaut / plage: `all`.

`page` est un numéro compatible commençant à 1. Pour les grandes collections, commencez avec `cursor_id=0`, puis utilisez `pagination.next_cursor_id` tant que `pagination.has_more=true` ; arrêtez à false. Le curseur trie par ID sans OFFSET. `per_page` : défaut 200, maximum 500, point de départ 50–100. `include_total=1` ajoute un comptage potentiellement coûteux. `search` cherche le préfixe ou domaine racine ; `rootdomain`, `status`, `created_from`, `created_to` filtrent. Dates : YYYY-MM-DD. `sort_by` : `id`, `created_at`, `updated_at`, `expires_at`, `subdomain` ; `sort_dir` : `asc` ou `desc`.

`fields` est une sélection séparée par des virgules ou `all` : `id`, `subdomain`, `rootdomain`, `full_domain`, `status`, `created_at`, `updated_at`, `expires_at`, `never_expires`, `cloudflare_zone_id`, `provider_account_id`. Toute sélection inclut `id`. `count` décrit la collection retournée, pas forcément tous les résultats.

#### Exemples de requêtes

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

#### Exemples de réponses

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

### 1.2 Enregistrer un domaine

`POST` · `endpoint=subdomains` · `action=create`

#### Paramètres

- `subdomain` — `string`; obligatoire.
- `domain` — `string`; obligatoire.

`subdomain` est le préfixe, par exemple `myapp` ; `domain` la racine disponible, par exemple `de5.net`. L'enregistrement utilise `action=create` et `domain`. Le champ de réponse et filtre `rootdomain` ne servent pas à enregistrer. Disponibilité et quotas s'appliquent.

#### Exemples de requêtes

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

#### Exemples de réponses

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 Détails du domaine

`GET` · `endpoint=subdomains` · `action=get`

#### Paramètres

- `subdomain_id` — `integer`; obligatoire.

Utilisez l'ID d'un domaine appartenant au compte authentifié. La réponse contient le domaine, `dns_records` et `dns_count`.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Exemples de réponses

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

### 1.4 Supprimer un domaine

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### Paramètres

- `subdomain_id` — `integer`; obligatoire.

Supprime le domaine possédé et ses enregistrements DNS. `dns_records_deleted` indique le nombre supprimé. Vérifiez l'ID avant l'envoi.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### Exemples de réponses

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 Renouveler un domaine

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### Paramètres

- `subdomain_id` — `integer`; obligatoire.

Le renouvellement gratuit normal DNSHE reste gratuit : `charged_amount=0` dans l'exemple. Le plugin générique peut configurer une récupération payante ; vérifiez l'état et les règles de la console pendant cette période. Lisez `previous_expires_at`, `new_expires_at`, `never_expires`, `remaining_days`, `charged_amount` dans la réponse.

Échecs possibles : HTTP 403 `renewal disabled`, `redemption period requires administrator`, `renewal window expired` ; HTTP 422 `renewal_not_yet_available` ; HTTP 402 `insufficient balance for redemption renewal` ; HTTP 404 pour un domaine absent ou appartenant à un autre compte. Vérifiez la fenêtre ou contactez l'assistance, sans boucle de relance immédiate.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### Exemples de réponses

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

## Gestion des enregistrements DNS

### 2.1 Lister les enregistrements DNS

`GET` · `endpoint=dns_records` · `action=list`

#### Paramètres

- `subdomain_id` — `integer`; obligatoire.

Préférez l'`id` du module retourné par la liste/création ; les nouveaux ID publics ont 15 chiffres. `record_id` est l'identifiant du fournisseur DNS. Modification/suppression : au moins un ; les deux doivent désigner le même enregistrement, sinon `dns_record_identifier_mismatch`. Les anciens ID internes restent compatibles. La compatibilité de `record_id` numérique est documentée au moins jusqu'au 2027-06-12 ; utilisez désormais `id` pour le module.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Exemples de réponses

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

### 2.2 Créer un enregistrement DNS

`POST` · `endpoint=dns_records` · `action=create`

#### Paramètres

- `subdomain_id` — `integer`; obligatoire.
- `type` — `string`; obligatoire.
- `name` — `string`; facultatif; valeur par défaut / plage: `@`.
- `content` — `string`; facultatif.
- `ttl` — `integer`; facultatif; valeur par défaut / plage: `600`.
- `priority` — `integer`; facultatif; valeur par défaut / plage: `MX: 10; SRV: 0`.
- `line` — `string`; facultatif.
- `record_weight / weight` — `integer`; facultatif.
- `record_port / port` — `integer`; facultatif; valeur par défaut / plage: `1–65535`.
- `record_target / target` — `string`; facultatif.
- `caa_flag` — `integer`; facultatif; valeur par défaut / plage: `0; 0–255`.
- `caa_tag` — `string`; facultatif; valeur par défaut / plage: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; facultatif.

`type` accepte A, AAAA, CNAME, MX, TXT, NS, SRV, CAA. `name` est relatif au domaine enregistré ; absent, vide ou `@` désigne le domaine lui-même. Un nom complet est refusé ; `*` est autorisé uniquement dans l'étiquette la plus à gauche. `content` est obligatoire sauf construction par SRV/CAA structuré. Défauts : `ttl` 600 secondes ; `priority` 10 pour MX, 0 pour SRV.

SRV : `record_weight`/`weight`, `record_port`/`port` (1–65535), `record_target`/`target` ; cible `.` signifie service indisponible. CAA : `caa_flag` (0–255, défaut 0), `caa_tag` (1–15 caractères alphanumériques, défaut `issue`), `caa_value`. `line` est propre à AliDNS ; les autres fournisseurs refusent une valeur non vide.

Les écritures NS peuvent être désactivées par `disable_ns_management`. Après délégation externe, créer/modifier un enregistrement non-NS renvoie `external_dns_delegated`. Suppression d'anciens enregistrements, réconciliation et nettoyage d'expiration restent possibles.

#### Exemples de requêtes

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

#### Exemples de réponses

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 Modifier un enregistrement DNS

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### Paramètres

- `id` — `integer`; facultatif.
- `record_id` — `string`; facultatif.
- `type / name / content` — `string`; facultatif.
- `ttl / priority` — `integer`; facultatif.
- `line` — `string`; facultatif.
- `record_weight / weight` — `integer`; facultatif.
- `record_port / port` — `integer`; facultatif.
- `record_target / target` — `string`; facultatif.
- `caa_flag` — `integer`; facultatif.
- `caa_tag / caa_value` — `string`; facultatif.

Envoyez `id` ou `record_id` et les champs à modifier. Les règles de nom et SRV/CAA sont identiques à la création. Les identifiants doivent désigner le même enregistrement. La réponse retourne les ID du module et du fournisseur.

Préférez l'`id` du module retourné par la liste/création ; les nouveaux ID publics ont 15 chiffres. `record_id` est l'identifiant du fournisseur DNS. Modification/suppression : au moins un ; les deux doivent désigner le même enregistrement, sinon `dns_record_identifier_mismatch`. Les anciens ID internes restent compatibles. La compatibilité de `record_id` numérique est documentée au moins jusqu'au 2027-06-12 ; utilisez désormais `id` pour le module.

Les écritures NS peuvent être désactivées par `disable_ns_management`. Après délégation externe, créer/modifier un enregistrement non-NS renvoie `external_dns_delegated`. Suppression d'anciens enregistrements, réconciliation et nettoyage d'expiration restent possibles.

#### Exemples de requêtes

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

#### Exemples de réponses

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 Supprimer un enregistrement DNS

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### Paramètres

- `id` — `integer`; facultatif.
- `record_id` — `string`; facultatif.

Préférez l'`id` du module retourné par la liste/création ; les nouveaux ID publics ont 15 chiffres. `record_id` est l'identifiant du fournisseur DNS. Modification/suppression : au moins un ; les deux doivent désigner le même enregistrement, sinon `dns_record_identifier_mismatch`. Les anciens ID internes restent compatibles. La compatibilité de `record_id` numérique est documentée au moins jusqu'au 2027-06-12 ; utilisez désormais `id` pour le module.

#### Exemples de requêtes

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

#### Exemples de réponses

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## DNS dynamique (DDNS)

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

Créez un jeton pour un enregistrement A/AAAA dans Gestion des domaines → DDNS. Envoyez `Authorization: Bearer <DDNS_TOKEN>` ou `X-DDNS-Token`, jamais dans l'URL ou le corps. Le jeton ne modifie que l'IP liée. GET, POST, PUT sont acceptés ; l'exemple utilise POST. `ip` facultatif définit IPv4/IPv6 ; sinon l'IP source directe est utilisée. Pour AAAA, utilisez une IPv6 correspondante.

`status=good` indique un changement. `status=nochg` avec `changed=false` est aussi un succès, sans appel au fournisseur DNS. DDNS utilise `https://api005.dnshe.com`, indépendamment de l'espace client.

#### Exemples de requêtes

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

#### Exemples de réponses

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

Sur Synology DSM et autres appareils, utilisez une tâche scriptée capable d'envoyer des en-têtes, pas un modèle URL contenant le jeton. Sauvegardez le jeton et testez manuellement. Cinq minutes sont un point de départ ; respectez toujours l'intervalle minimal configuré. Gardez le jeton dans un environnement de tâche protégé.

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## Gestion des clés API

### 3.1 Lister les clés API

`GET` · `endpoint=keys` · `action=list`

Liste ID, noms, états, nombres de requêtes et dates d'utilisation. Le Secret existant n'est pas récupérable. La première clé se crée dans la console.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Exemples de réponses

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

### 3.2 Créer une clé API

`POST` · `endpoint=keys` · `action=create`

#### Paramètres

- `key_name` — `string`; obligatoire.
- `ip_whitelist` — `string`; facultatif.

`key_name` nomme la clé. Si le filtrage IP est activé, `ip_whitelist` accepte IP/CIDR séparés par virgules, nouvelles lignes ou points-virgules. Remplacez l'IP d'exemple par l'IP de sortie réelle du serveur. `api_secret` n'est affiché qu'une fois : sauvegardez-le immédiatement.

#### Exemples de requêtes

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

#### Exemples de réponses

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 Supprimer une clé API

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### Paramètres

- `key_id` — `integer`; obligatoire.

Révoque la clé `key_id`. Utilisez une autre clé valide pour gérer les identifiants afin d'éviter d'interrompre l'automatisation en cours.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### Exemples de réponses

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 Régénérer un API Secret

`POST` · `endpoint=keys` · `action=regenerate`

#### Paramètres

- `key_id` — `integer`; obligatoire.

Régénère le Secret de `key_id` et invalide l'ancien. Sauvegardez la nouvelle valeur et mettez à jour les services. Si tous les identifiants valides sont perdus, récupérez l'accès dans la console : l'API exige une authentification.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### Exemples de réponses

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## Dons de domaines

### 4.1 Initier un don

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### Paramètres

- `subdomain_id` — `integer`; obligatoire.

`subdomain_id` doit appartenir au compte authentifié. La réponse fournit un code de don et une expiration. Partagez le code uniquement avec le destinataire prévu.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### Exemples de réponses

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

### 4.2 Accepter un don

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### Paramètres

- `code` — `string`; obligatoire.

Le destinataire utilise sa propre clé et soumet le `code` de l'expéditeur. L'acceptation transfère le domaine ; vérifiez le domaine et le compte source retournés.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### Exemples de réponses

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

### 4.3 Annuler un don

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### Paramètres

- `gift_id` — `integer`; obligatoire.

`gift_id` doit désigner un don pending initié par l'utilisateur actuel. L'annulation invalide ce transfert en attente.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### Exemples de réponses

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

### 4.4 Lister les dons

`GET` · `endpoint=gifts` · `action=list`

Liste les dons et leur état. `initiate`, `accept`, `cancel` sont des écritures limitées. Après un timeout, vérifiez l'état avant de relancer : l'opération peut avoir abouti.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Exemples de réponses

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

## Quotas

### 5.1 Consulter le quota

`GET` · `endpoint=quota`

`quota` contient `used`, `base`, `invite_bonus`, `total`, `available`. Utilisez la réponse réelle, pas le quota du compte d'exemple. Aucun `action` nécessaire.

#### Exemples de requêtes

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Exemples de réponses

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

#### Paramètres

- `domain` — `string`; obligatoire.

`domain` obligatoire est le nom complet pour les domaines internes ou le WHOIS externe. Le mode public est sans clé par défaut, limité à 2 requêtes/minute/IP, indépendamment de l'API générale. L'opérateur peut exiger les deux en-têtes habituels. Aucun `action` nécessaire.

La visibilité de l'e-mail et du code postal dépend de la confidentialité ; `registrant_postal_code` est distinct de l'ancien `registrant_address`. `owner_userid` concerne les domaines internes et n'est normalement visible que par le propriétaire authentifié, sauf configuration différente. Le WHOIS public ne révèle pas les ID internes par défaut. Les champs d'identité facultatifs peuvent manquer.

États : `Registered`, `RenewalGracePeriod`, `RedemptionPeriod`, `ServerHold`, `PendingDelete`, `unregistered`. `nameservers` et l'alias `name_servers` utilisent les NS réels, sinon les valeurs par défaut. Les domaines permanents retournent `expires_at="2999-12-31 23:59"` sans `never_expires`. Non enregistré : `registered=false`, `status=unregistered`. En mode public, `rate_limit` décrit le quota IP restant.

#### Exemples de requêtes

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Exemples de réponses

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

## Erreurs et limites de requêtes

Vérifiez HTTP et JSON `success`. Traitez le `error_code` stable, pas le texte variable. `message` décrit l'erreur, `details` est facultatif, l'ancien `error` reprend le message. Une réponse amont non JSON est aussi un échec. Les codes et statuts courants suivent ; les erreurs de renouvellement sont décrites à leur route.

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

Par défaut : API générale 60/minute, WHOIS public 2/minute/IP ; la configuration peut varier. Utilisez `details.limit`, `details.remaining`, `details.reset_at` si présents. HTTP 429 concerne quotas et fréquence : distinguez `quota_exceeded` et `rate_limit_exceeded`.

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

Pour les lectures limitées, attendez la réinitialisation ou utilisez un recul exponentiel borné et aléatoire. Après timeout d'une création, suppression, prolongation, acceptation ou rotation de Secret, vérifiez l'état avant répétition. Les clients ne relancent pas automatiquement les écritures.

## Exemples de clients

Petits clients de référence, pas un SDK officiel : encodage des requêtes, JSON, délais et contrôle HTTP/API. Exécutez depuis la racine du dépôt. Node.js nécessite fetch et AbortSignal.timeout intégrés ; Python utilise la bibliothèque standard ; PHP nécessite cURL et JSON. Conservez les identifiants sur un serveur de confiance, jamais dans le JavaScript du navigateur.

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

## Sécurité et questions fréquentes

Utilisez HTTPS, des variables protégées, des clés séparées et les droits minimaux. Activez le filtrage IP si disponible, changez les Secrets, révoquez les clés inutilisées et surveillez les journaux. Ne publiez pas les jetons API/DDNS dans dépôts, URL, captures ou journaux.

Secret perdu : régénérez avec un autre identifiant valide ou la console ; l'ancien est invalidé. Limite supérieure : assistance. Sous-comptes : la référence réserve les clés au compte principal. Aucune opération par lots documentée ; appelez individuellement. Statistiques dans Gestion API ou la liste des clés.

## Assistance

Questions de compte, disponibilité ou renouvellement : [support@dnshe.com](mailto:support@dnshe.com). Configuration : [manuel en ligne](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) et [Gérer les domaines](https://my.dnshe.com/index.php?m=domain_hub).

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
