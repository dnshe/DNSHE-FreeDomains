# DNSHE 無料ドメイン API ドキュメント（v2.0）

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <strong>日本語</strong> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[サービス紹介に戻る](../README_JA.md)

## 📌 基本情報

* **ベース URL：**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **認証方式：** API Key + API Secret
* **レスポンス形式：** JSON
* **レート制限：** 1 分あたり 60 リクエスト（設定可能）

---

## 🔐 認証

### API 認証情報の取得

1. DNSHE のクライアントエリアにログインします
2. **ドメイン管理**（My Domain Management）を開きます
3. サイドバーの **API 管理**（API Management）を選択します
4. 新しい API キーを作成します

---

### 認証方式

#### ✅ 推奨：HTTP ヘッダー

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ 廃止：URL パラメーター

> セキュリティ上の理由により、URL またはリクエストボディでの `api_key` と `api_secret` の送信はサポートされていません。

---

## 📦 API エンドポイント

---

## 1️⃣ サブドメイン管理

### 1.1 サブドメイン一覧の取得

* **エンドポイント:** `subdomains`
* **操作:** `list`
* **メソッド:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### レスポンス例

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

### 1.2 サブドメインの登録

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

### 1.3 サブドメイン詳細の取得

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 サブドメインの削除

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 サブドメインの更新

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ DNS レコード管理

### DNS レコード一覧の取得

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### DNS レコードの作成

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

## 3️⃣ API キー管理

### API キー一覧の取得

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ 利用枠の確認

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ WHOIS 検索（公開 API）

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ エラー形式

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 レート制限

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

## 🔐 セキュリティの推奨事項

* API 認証情報は環境変数に保存してください
* 本番用キーには IP 許可リストを有効にしてください
* API キーは定期的にローテーションしてください
* 常に HTTPS を使用してください

---

## ❓ よくある質問

**質問：API Secret を紛失した場合は？**
回答：`regenerate` を使用して再生成します。

**質問：一括操作に対応していますか？**
回答：現在のバージョンでは対応していません。

---

## 📝 変更履歴

### v2.0 (2026-04-25)

* 🚀 v2.0 正式リリース
* 🔧 API コマンド構造を最適化
* ✨ API 機能を追加
* ⚡ ページネーションと検索の性能を改善
* 🛡️ エラー処理とセキュリティを強化

---

### v1.0 (2025-10-19)

* 🎉 初回リリース
* サブドメイン管理
* DNS レコード管理
* API キー管理
* 利用枠の確認
* レート制限
