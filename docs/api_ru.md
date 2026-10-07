# Документация API бесплатных доменов DNSHE (v2.0)

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <strong>Русский</strong> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Вернуться к описанию](../README_RU.md)

## 📌 Основная информация

* **Базовый URL:**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **Аутентификация:** API Key + API Secret
* **Формат ответа:** JSON
* **Ограничение частоты:** 60 запросов в минуту (настраивается)

---

## 🔐 Аутентификация

### Получение учётных данных API

1. Войдите в личный кабинет DNSHE
2. Откройте **Управление моими доменами** (My Domain Management)
3. Выберите **Управление API** (API Management) в боковом меню
4. Создайте новый ключ API

---

### Способ аутентификации

#### ✅ Рекомендуется: HTTP-заголовки

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ Отключено: параметры URL

> По соображениям безопасности передача `api_key` и `api_secret` через URL или тело запроса больше не поддерживается.

---

## 📦 Конечные точки API

---

## 1️⃣ Управление поддоменами

### 1.1 Список поддоменов

* **Конечная точка:** `subdomains`
* **Действие:** `list`
* **Метод:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### Пример ответа

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

### 1.2 Регистрация поддомена

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

### 1.3 Получение сведений о поддомене

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 Удаление поддомена

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 Продление поддомена

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ Управление DNS-записями

### Список DNS-записей

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### Создание DNS-записи

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

## 3️⃣ Управление ключами API

### Список ключей API

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ Квоты

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ Поиск WHOIS (публичный API)

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ Формат ошибки

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 Ограничение частоты запросов

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

## 🔐 Рекомендации по безопасности

* Храните учётные данные API в переменных окружения
* Включите список разрешённых IP для ключей производственной среды
* Регулярно меняйте ключи API
* Всегда используйте HTTPS

---

## ❓ Частые вопросы

**Вопрос: потерян API Secret?**
Ответ: используйте `regenerate`, чтобы создать новый.

**Вопрос: поддерживаются ли пакетные операции?**
Ответ: в текущей версии не поддерживаются.

---

## 📝 История изменений

### v2.0 (2026-04-25)

* 🚀 Официальный выпуск v2.0
* 🔧 Оптимизирована структура команд API
* ✨ Добавлены новые возможности API
* ⚡ Улучшена производительность пагинации и запросов
* 🛡️ Улучшены обработка ошибок и безопасность

---

### v1.0 (2025-10-19)

* 🎉 Первый выпуск
* Управление поддоменами
* Управление DNS-записями
* Управление ключами API
* Поддержка квот
* Ограничение частоты запросов
