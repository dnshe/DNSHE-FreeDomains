# DNSHE 免费域名 API 文档（v2.0）

<p align="center" dir="ltr"><a href="./api.md">English</a> · <strong>简体中文</strong> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[返回项目介绍](../README_ZH.md)

## 📌 基本信息

* **API地址：**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **认证方式：** API Key + API Secret
* **返回格式：** JSON
* **速率限制：** 默认 60 请求/分钟（可在后台配置）

---

## 🔐 认证

### 获取 API 密钥

1. 登录 DNSHE 客户区
2. 进入「我的域名管理」
3. 左侧导航 → 点击「API管理」
4. 创建 API 密钥

---

### 认证方式

#### ✅ 推荐方式：HTTP Header

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ 已禁用方式：URL 参数

> 出于安全原因，`api_key` 和 `api_secret` 已禁止通过 URL 或 Body 传递。

---

## 📦 API端点

---

## 1️⃣ 子域名管理

### 1.1 列出子域名

* **Endpoint:** `subdomains`
* **Action:** `list`
* **Method:** `GET`

#### 示例

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
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
      "rootdomain": "example.com",
      "full_domain": "test.example.com",
      "status": "active"
    }
  ]
}
```

---

### 1.2 注册子域名

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

### 1.3 获取详情

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 删除子域名

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 续期子域名

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ DNS记录管理

### 列出记录

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 创建记录

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

## 3️⃣ API密钥管理

### 列出密钥

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ 配额查询

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ WHOIS 查询（公开接口）

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ 错误结构

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

## 🔐 安全建议

* 使用环境变量存储 API 密钥
* 开启 IP 白名单
* 定期轮换密钥
* 始终使用 HTTPS

---

## ❓ 常见问题

**Q：API密钥丢失？**
A：使用 `regenerate` 重新生成

**Q：支持批量操作吗？**
A：当前版本暂不支持

---

## 📝 更新日志

### v2.0 (2026-04-25)

* 🚀 发布 v2.0 正式版本
* 🔧 优化 API 命令结构
* ✨ 新增部分功能接口
* ⚡ 提升分页与查询性能
* 🛡️ 优化错误结构与安全机制

---

### v1.0 (2025-10-19)

* 🎉 初始版本发布
* 支持子域名管理
* 支持 DNS 记录管理
* 支持 API 密钥管理
* 支持配额查询
* 支持速率限制
