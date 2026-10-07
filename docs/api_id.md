# Dokumentasi API Domain Gratis DNSHE (v2.0)

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <strong>Bahasa Indonesia</strong> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Kembali ke pengantar](../README_ID.md)

## 📌 Informasi Dasar

* **URL dasar:**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **Autentikasi:** API Key + API Secret
* **Format respons:** JSON
* **Batas permintaan:** 60 permintaan/menit (dapat dikonfigurasi)

---

## 🔐 Autentikasi

### Mendapatkan Kredensial API

1. Masuk ke area klien DNSHE
2. Buka **Pengelolaan Domain Saya** (My Domain Management)
3. Pilih **Pengelolaan API** (API Management) pada bilah samping
4. Buat kunci API baru

---

### Metode Autentikasi

#### ✅ Direkomendasikan: Header HTTP

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ Dinonaktifkan: Parameter URL

> Demi keamanan, pengiriman `api_key` dan `api_secret` melalui URL atau isi permintaan tidak lagi didukung.

---

## 📦 Endpoint API

---

## 1️⃣ Pengelolaan Subdomain

### 1.1 Daftar Subdomain

* **Endpoint:** `subdomains`
* **Tindakan:** `list`
* **Metode:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### Contoh Respons

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

### 1.2 Mendaftarkan Subdomain

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

### 1.3 Mendapatkan Detail Subdomain

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 Menghapus Subdomain

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 Memperpanjang Subdomain

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ Pengelolaan Rekaman DNS

### Daftar Rekaman DNS

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### Membuat Rekaman DNS

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

## 3️⃣ Pengelolaan Kunci API

### Daftar Kunci API

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ Kuota

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ Pencarian WHOIS (API Publik)

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ Format Kesalahan

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 Pembatasan Permintaan

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

## 🔐 Praktik Keamanan

* Simpan kredensial API dalam variabel lingkungan
* Aktifkan daftar IP yang diizinkan untuk kunci produksi
* Rotasi kunci API secara berkala
* Selalu gunakan HTTPS

---

## ❓ Pertanyaan Umum

**T: API Secret hilang?**
J: Gunakan `regenerate` untuk membuat yang baru.

**T: Apakah operasi massal didukung?**
J: Belum didukung pada versi saat ini.

---

## 📝 Riwayat Perubahan

### v2.0 (2026-04-25)

* 🚀 Rilis resmi v2.0
* 🔧 Optimalisasi struktur perintah API
* ✨ Penambahan kemampuan API
* ⚡ Peningkatan performa paginasi dan kueri
* 🛡️ Peningkatan penanganan kesalahan dan keamanan

---

### v1.0 (2025-10-19)

* 🎉 Rilis pertama
* Pengelolaan subdomain
* Pengelolaan rekaman DNS
* Pengelolaan kunci API
* Dukungan kuota
* Pembatasan permintaan
