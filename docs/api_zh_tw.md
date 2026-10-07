# DNSHE 免費網域 API 文件（v2.0）

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <strong>繁體中文</strong> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[返回專案介紹](../README_ZH_TW.md)

## 📌 基本資訊

* **API 位址：**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **驗證方式：** API Key + API Secret
* **回應格式：** JSON
* **速率限制：** 每分鐘 60 次請求（可設定）

---

## 🔐 驗證

### 取得 API 憑證

1. 登入 DNSHE 客戶中心
2. 進入 **我的網域管理**
3. 在側邊欄點選 **API 管理**
4. 建立新的 API 金鑰

---

### 驗證方式

#### ✅ 建議方式：HTTP 標頭

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ 已停用方式：URL 參數

> 基於安全考量，不再支援透過 URL 或請求主體傳遞 `api_key` 和 `api_secret`。

---

## 📦 API 端點

---

## 1️⃣ 子網域管理

### 1.1 列出子網域

* **端點:** `subdomains`
* **操作:** `list`
* **方法:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### 回應範例

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

### 1.2 註冊子網域

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

### 1.3 取得子網域詳細資訊

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 刪除子網域

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 續期子網域

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ DNS 記錄管理

### 列出 DNS 記錄

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 建立 DNS 記錄

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

## 3️⃣ API 金鑰管理

### 列出 API 金鑰

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ 配額查詢

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ WHOIS 查詢（公開 API）

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ 錯誤格式

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 速率限制

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

## 🔐 安全建議

* 使用環境變數儲存 API 憑證
* 為正式環境的金鑰啟用 IP 允許清單
* 定期輪替 API 金鑰
* 一律使用 HTTPS

---

## ❓ 常見問題

**問：遺失 API Secret 怎麼辦？**
答：使用 `regenerate` 重新產生。

**問：支援批次操作嗎？**
答：目前版本不支援。

---

## 📝 更新紀錄

### v2.0 (2026-04-25)

* 🚀 正式發布 v2.0
* 🔧 最佳化 API 指令結構
* ✨ 新增 API 功能
* ⚡ 改善分頁與查詢效能
* 🛡️ 強化錯誤處理與安全性

---

### v1.0 (2025-10-19)

* 🎉 首次發布
* 子網域管理
* DNS 記錄管理
* API 金鑰管理
* 配額查詢
* 速率限制
