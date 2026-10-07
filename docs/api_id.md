# Referensi API Domain DNSHE

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <strong>Bahasa Indonesia</strong> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <a href="./api_ar.md">العربية</a></p>

[Kembali ke pengantar](../README_ID.md)

Daftarkan domain, kelola DNS, perbarui IP dinamis, dan otomatisasikan operasi akun. Contoh memakai host API DNSHE dan kredensial pengganti. Ganti nama, ID, dan kunci dengan milik Anda.

## Daftar Isi

- [Mulai Menggunakan](#mulai-menggunakan)
- [Autentikasi dan Aturan Permintaan](#autentikasi-dan-aturan-permintaan)
- [Pengelolaan Domain](#pengelolaan-domain)
- [Pengelolaan Rekaman DNS](#pengelolaan-rekaman-dns)
- [DNS Dinamis (DDNS)](#dns-dinamis-ddns)
- [Pengelolaan Kunci API](#pengelolaan-kunci-api)
- [Pemberian Domain](#pemberian-domain)
- [Kuota](#kuota)
- [WHOIS](#whois)
- [Kesalahan dan Batas Permintaan](#kesalahan-dan-batas-permintaan)
- [Contoh Klien](#contoh-klien)
- [Keamanan dan Pertanyaan Umum](#keamanan-dan-pertanyaan-umum)
- [Dukungan](#dukungan)

## Mulai Menggunakan

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

URL dasar sudah berisi `m=domain_hub`; tambahkan parameter dengan `&`. Permintaan dan respons memakai JSON, kecuali parameter kueri GET. Batas umum bawaan adalah 60 permintaan/menit dan dapat diubah operator. Fitur bergantung pada akun dan konfigurasi. Contoh shell memakai Bash/sh; atur variabel lingkungan berikut terlebih dahulu.

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

## Autentikasi dan Aturan Permintaan

Buat kunci pertama melalui area klien → [Kelola domain](https://my.dnshe.com/index.php?m=domain_hub) → Pengelolaan API. Kirim header `X-API-Key` dan `X-API-Secret`; kredensial melalui URL atau isi permintaan dinonaktifkan. Parameter GET berada di kueri; operasi tulis memakai JSON dan `Content-Type: application/json`. `endpoint` memilih sumber daya, `action` memilih operasi. `quota` dan `whois` tidak memerlukan `action`. DDNS memakai token tersendiri.

## Pengelolaan Domain

### 1.1 Daftar domain

`GET` · `endpoint=subdomains` · `action=list`

#### Parameter

- `page` — `integer`; opsional; nilai bawaan / rentang: `1`.
- `cursor_id` — `integer`; opsional.
- `per_page` — `integer`; opsional; nilai bawaan / rentang: `200; 1–500`.
- `include_total` — `boolean`; opsional; nilai bawaan / rentang: `false`.
- `search` — `string`; opsional.
- `rootdomain` — `string`; opsional.
- `status` — `string`; opsional; nilai bawaan / rentang: `active | suspended | expired`.
- `created_from / created_to` — `string`; opsional; nilai bawaan / rentang: `YYYY-MM-DD`.
- `sort_by` — `string`; opsional; nilai bawaan / rentang: `id`.
- `sort_dir` — `string`; opsional; nilai bawaan / rentang: `desc; asc | desc`.
- `fields` — `string`; opsional; nilai bawaan / rentang: `all`.

`page` adalah nomor halaman kompatibilitas mulai dari 1. Untuk koleksi besar, mulai dengan `cursor_id=0`, lalu gunakan `pagination.next_cursor_id` selama `pagination.has_more=true`; berhenti ketika false. Mode kursor memakai urutan ID tanpa OFFSET. `per_page` bawaan 200, maksimum 500; mulai dari 50–100. `include_total=1` menambahkan penghitungan total yang bisa lambat. `search` mencari prefiks atau domain akar; `rootdomain`, `status`, `created_from`, `created_to` menyaring hasil. Format tanggal YYYY-MM-DD. `sort_by`: `id`, `created_at`, `updated_at`, `expires_at`, `subdomain`; `sort_dir`: `asc` atau `desc`.

`fields` berupa daftar dipisahkan koma atau `all`: `id`, `subdomain`, `rootdomain`, `full_domain`, `status`, `created_at`, `updated_at`, `expires_at`, `never_expires`, `cloudflare_zone_id`, `provider_account_id`. Pilihan khusus tetap menyertakan `id`. `count` adalah jumlah koleksi yang dikembalikan, bukan selalu total seluruh hasil.

#### Contoh Permintaan

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

#### Contoh Respons

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

### 1.2 Mendaftarkan domain

`POST` · `endpoint=subdomains` · `action=create`

#### Parameter

- `subdomain` — `string`; wajib.
- `domain` — `string`; wajib.

`subdomain` adalah prefiks seperti `myapp`; `domain` adalah akhiran akar yang tersedia seperti `de5.net`. Registrasi memakai `action=create` dan kolom `domain`. Kolom respons serta filter `rootdomain` bukan kolom registrasi. Ketersediaan dan kuota akun tetap berlaku.

#### Contoh Permintaan

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

#### Contoh Respons

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

### 1.3 Detail domain

`GET` · `endpoint=subdomains` · `action=get`

#### Parameter

- `subdomain_id` — `integer`; wajib.

Gunakan ID domain milik akun yang diautentikasi. Respons berisi objek domain, `dns_records`, dan `dns_count`.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Contoh Respons

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

### 1.4 Menghapus domain

`POST / DELETE` · `endpoint=subdomains` · `action=delete`

#### Parameter

- `subdomain_id` — `integer`; wajib.

Menghapus domain milik akun beserta rekaman DNS terkait. `dns_records_deleted` melaporkan jumlah yang dihapus. Periksa ID sebelum mengirim.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

#### Contoh Respons

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

### 1.5 Memperpanjang domain

`POST / PUT` · `endpoint=subdomains` · `action=renew`

#### Parameter

- `subdomain_id` — `integer`; wajib.

Perpanjangan gratis normal DNSHE tetap gratis; contoh memakai `charged_amount=0`. Plugin umum dapat mengatur pemulihan berbayar, jadi periksa status dan kebijakan konsol ketika dalam masa pemulihan. Baca `previous_expires_at`, `new_expires_at`, `never_expires`, `remaining_days`, `charged_amount` untuk hasil sebenarnya.

Kegagalan meliputi HTTP 403 `renewal disabled`, `redemption period requires administrator`, `renewal window expired`; HTTP 422 `renewal_not_yet_available`; HTTP 402 `insufficient balance for redemption renewal`; HTTP 404 untuk domain tidak ditemukan atau bukan milik akun. Periksa jendela perpanjangan atau hubungi dukungan, jangan mengulang terus-menerus.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

#### Contoh Respons

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

## Pengelolaan Rekaman DNS

### 2.1 Daftar rekaman DNS

`GET` · `endpoint=dns_records` · `action=list`

#### Parameter

- `subdomain_id` — `integer`; wajib.

Utamakan `id` modul dari daftar/pembuatan; rekaman publik baru memakai ID 15 digit. `record_id` adalah identitas di penyedia DNS. Ubah/hapus memerlukan setidaknya satu; jika keduanya dikirim harus menunjuk rekaman yang sama, atau muncul `dns_record_identifier_mismatch`. ID internal lama masih kompatibel. Kompatibilitas `record_id` numerik didokumentasikan setidaknya sampai 2027-06-12; klien baru memakai `id` untuk ID modul.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Contoh Respons

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

### 2.2 Membuat rekaman DNS

`POST` · `endpoint=dns_records` · `action=create`

#### Parameter

- `subdomain_id` — `integer`; wajib.
- `type` — `string`; wajib.
- `name` — `string`; opsional; nilai bawaan / rentang: `@`.
- `content` — `string`; opsional.
- `ttl` — `integer`; opsional; nilai bawaan / rentang: `600`.
- `priority` — `integer`; opsional; nilai bawaan / rentang: `MX: 10; SRV: 0`.
- `line` — `string`; opsional.
- `record_weight / weight` — `integer`; opsional.
- `record_port / port` — `integer`; opsional; nilai bawaan / rentang: `1–65535`.
- `record_target / target` — `string`; opsional.
- `caa_flag` — `integer`; opsional; nilai bawaan / rentang: `0; 0–255`.
- `caa_tag` — `string`; opsional; nilai bawaan / rentang: `issue; 1–15 [A-Za-z0-9]`.
- `caa_value` — `string`; opsional.

`type` mendukung A, AAAA, CNAME, MX, TXT, NS, SRV, CAA. `name` relatif terhadap domain terdaftar; tidak diisi, kosong, atau `@` berarti domain itu sendiri. Nama lengkap tidak diterima; `*` hanya pada label paling kiri. `content` wajib kecuali dibentuk dari parameter terstruktur SRV/CAA. `ttl` bawaan 600 detik; `priority` bawaan 10 untuk MX dan 0 untuk SRV.

SRV memakai `record_weight`/`weight`, `record_port`/`port` (1–65535), `record_target`/`target`; target `.` berarti layanan tidak tersedia. CAA memakai `caa_flag` (0–255, bawaan 0), `caa_tag` (1–15 huruf/angka, bawaan `issue`), `caa_value`. `line` hanya untuk AliDNS; penyedia lain menolak nilai tidak kosong.

Penulisan NS dapat dinonaktifkan melalui `disable_ns_management`. Setelah delegasi DNS eksternal, pembuatan/perubahan non-NS ditolak dengan `external_dns_delegated`. Penghapusan rekaman lama, rekonsiliasi, dan pembersihan kedaluwarsa tidak diblokir.

#### Contoh Permintaan

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

#### Contoh Respons

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.3 Mengubah rekaman DNS

`POST / PUT / PATCH` · `endpoint=dns_records` · `action=modify`

#### Parameter

- `id` — `integer`; opsional.
- `record_id` — `string`; opsional.
- `type / name / content` — `string`; opsional.
- `ttl / priority` — `integer`; opsional.
- `line` — `string`; opsional.
- `record_weight / weight` — `integer`; opsional.
- `record_port / port` — `integer`; opsional.
- `record_target / target` — `string`; opsional.
- `caa_flag` — `integer`; opsional.
- `caa_tag / caa_value` — `string`; opsional.

Kirim `id` atau `record_id` dan kolom yang berubah. Aturan nama dan opsi SRV/CAA sama dengan pembuatan. Kedua identitas harus menunjuk rekaman yang sama. Respons mengembalikan ID modul dan penyedia.

Utamakan `id` modul dari daftar/pembuatan; rekaman publik baru memakai ID 15 digit. `record_id` adalah identitas di penyedia DNS. Ubah/hapus memerlukan setidaknya satu; jika keduanya dikirim harus menunjuk rekaman yang sama, atau muncul `dns_record_identifier_mismatch`. ID internal lama masih kompatibel. Kompatibilitas `record_id` numerik didokumentasikan setidaknya sampai 2027-06-12; klien baru memakai `id` untuk ID modul.

Penulisan NS dapat dinonaktifkan melalui `disable_ns_management`. Setelah delegasi DNS eksternal, pembuatan/perubahan non-NS ditolak dengan `external_dns_delegated`. Penghapusan rekaman lama, rekonsiliasi, dan pembersihan kedaluwarsa tidak diblokir.

#### Contoh Permintaan

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

#### Contoh Respons

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

### 2.4 Menghapus rekaman DNS

`POST / DELETE` · `endpoint=dns_records` · `action=delete`

#### Parameter

- `id` — `integer`; opsional.
- `record_id` — `string`; opsional.

Utamakan `id` modul dari daftar/pembuatan; rekaman publik baru memakai ID 15 digit. `record_id` adalah identitas di penyedia DNS. Ubah/hapus memerlukan setidaknya satu; jika keduanya dikirim harus menunjuk rekaman yang sama, atau muncul `dns_record_identifier_mismatch`. ID internal lama masih kompatibel. Kompatibilitas `record_id` numerik didokumentasikan setidaknya sampai 2027-06-12; klien baru memakai `id` untuk ID modul.

#### Contoh Permintaan

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

#### Contoh Respons

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

## DNS Dinamis (DDNS)

`GET / POST / PUT` · `endpoint=ddns` · `action=update`

Buat token khusus rekaman A/AAAA di Pengelolaan Domain → DDNS. Kirim `Authorization: Bearer <DDNS_TOKEN>` atau `X-DDNS-Token`, bukan URL atau isi permintaan. Token hanya dapat mengubah IP rekaman terikat. Mendukung GET, POST, PUT; contoh memakai POST. `ip` opsional menentukan IPv4/IPv6; tanpa nilai, sistem memakai IP sumber koneksi langsung. Untuk AAAA, gunakan sumber/nilai IPv6 yang sesuai.

`status=good` berarti IP berubah; `status=nochg` dan `changed=false` juga sukses, tanpa memanggil penyedia DNS. Host DDNS tetap `https://api005.dnshe.com`, terpisah dari host area klien.

#### Contoh Permintaan

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

#### Contoh Respons

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

### Synology DSM

Pada Synology DSM atau perangkat lain, gunakan skrip terjadwal yang dapat mengirim header, bukan templat URL berisi token. Simpan token, buat tugas, dan uji manual. Jadwal lima menit dapat menjadi awal, tetapi jangan lebih sering daripada interval minimum konfigurasi. Simpan token dalam lingkungan tugas yang terlindungi.

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

## Pengelolaan Kunci API

### 3.1 Daftar kunci API

`GET` · `endpoint=keys` · `action=list`

Menampilkan ID, nama, status, jumlah permintaan, dan waktu penggunaan kunci. Secret lama tidak dapat dipulihkan dari daftar. Kunci pertama dibuat melalui konsol.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Contoh Respons

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

### 3.2 Membuat kunci API

`POST` · `endpoint=keys` · `action=create`

#### Parameter

- `key_name` — `string`; wajib.
- `ip_whitelist` — `string`; opsional.

`key_name` memberi nama kunci. Jika daftar IP diaktifkan, `ip_whitelist` menerima IP/CIDR dipisahkan koma, baris baru, atau titik koma. Ganti IP contoh dengan IP keluar server sebenarnya. `api_secret` hanya ditampilkan sekali; simpan segera.

#### Contoh Permintaan

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

#### Contoh Respons

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

### 3.3 Menghapus kunci API

`POST / DELETE` · `endpoint=keys` · `action=delete`

#### Parameter

- `key_id` — `integer`; wajib.

Mencabut kunci `key_id`. Kelola kredensial menggunakan kunci aktif lain agar penghapusan tidak menghentikan otomatisasi yang sedang berjalan secara tidak sengaja.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

#### Contoh Respons

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 3.4 Regenerasi API Secret

`POST` · `endpoint=keys` · `action=regenerate`

#### Parameter

- `key_id` — `integer`; wajib.

Membuat Secret baru untuk `key_id` dan menonaktifkan Secret lama. Simpan nilai baru dan perbarui layanan terkait. Jika semua kredensial aktif hilang, pulihkan melalui konsol; regenerasi API memerlukan autentikasi.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

#### Contoh Respons

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

## Pemberian Domain

### 4.1 Memulai pemberian

`POST / PUT` · `endpoint=gifts` · `action=initiate`

#### Parameter

- `subdomain_id` — `integer`; wajib.

`subdomain_id` harus milik akun pemanggil. Respons berisi kode pemberian dan waktu kedaluwarsa. Bagikan kode hanya kepada penerima yang dituju.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

#### Contoh Respons

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

### 4.2 Menerima domain

`POST / PUT` · `endpoint=gifts` · `action=accept`

#### Parameter

- `code` — `string`; wajib.

Penerima memakai kuncinya sendiri dan mengirim `code` dari pengirim. Penerimaan memindahkan domain; periksa domain dan akun asal pada respons.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

#### Contoh Respons

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

### 4.3 Membatalkan pemberian

`POST / DELETE` · `endpoint=gifts` · `action=cancel`

#### Parameter

- `gift_id` — `integer`; wajib.

`gift_id` harus merujuk pemberian berstatus pending yang dimulai pengguna saat ini. Pembatalan menonaktifkan pemberian tersebut.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

#### Contoh Respons

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

### 4.4 Daftar pemberian

`GET` · `endpoint=gifts` · `action=list`

Menampilkan catatan dan status pemberian. `initiate`, `accept`, `cancel` adalah penulisan yang dibatasi. Setelah timeout, periksa status dahulu; permintaan mungkin sudah berhasil.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Contoh Respons

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

## Kuota

### 5.1 Memeriksa kuota

`GET` · `endpoint=quota`

Objek `quota` berisi `used`, `base`, `invite_bonus`, `total`, `available`. Pakai nilai sebenarnya, jangan mengasumsikan kuota sama dengan contoh. Tidak perlu `action`.

#### Contoh Permintaan

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Contoh Respons

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

- `domain` — `string`; wajib.

`domain` wajib berisi nama lengkap untuk domain internal atau WHOIS eksternal. Mode publik tidak memerlukan kunci secara bawaan dan dibatasi 2 permintaan/menit/IP, terpisah dari API umum. Operator dapat mewajibkan dua header autentikasi biasa. Tidak perlu `action`.

Visibilitas email dan kode pos mengikuti privasi. `registrant_postal_code` berbeda dari `registrant_address` lama. `owner_userid` hanya untuk domain internal dan biasanya terlihat bagi pemilik terautentikasi, kecuali operator mengubahnya. WHOIS publik tidak mengekspos ID internal secara bawaan. Kolom identitas opsional belum tentu ada.

Status meliputi `Registered`, `RenewalGracePeriod`, `RedemptionPeriod`, `ServerHold`, `PendingDelete`, `unregistered`. `nameservers` dan alias `name_servers` memakai NS sebenarnya, atau nilai konfigurasi jika tidak ada. Domain permanen mengembalikan `expires_at="2999-12-31 23:59"` tanpa `never_expires`. Nama belum terdaftar: `registered=false`, `status=unregistered`. `rate_limit` publik adalah sisa kuota IP.

#### Contoh Permintaan

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

#### Contoh Respons

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

## Kesalahan dan Batas Permintaan

Periksa status HTTP dan JSON `success`. Gunakan `error_code` yang stabil, bukan teks pesan. `message` adalah penjelasan, `details` konteks opsional, dan `error` lama setara dengan message. Respons non-JSON dari hulu juga kegagalan. Daftar berikut berisi kode dan HTTP; kesalahan perpanjangan dijelaskan di rutenya.

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

Bawaan API umum 60/menit, WHOIS publik 2/menit/IP; konfigurasi dapat berbeda. Baca `details.limit`, `details.remaining`, `details.reset_at` jika tersedia. HTTP 429 dapat berarti kuota atau frekuensi; bedakan `quota_exceeded` dan `rate_limit_exceeded`.

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

Untuk pembacaan yang dibatasi, tunggu reset atau gunakan exponential backoff terbatas dengan jitter. Setelah timeout pembuatan, penghapusan, perpanjangan, penerimaan domain atau rotasi Secret, periksa status sebelum mengulang. Klien tidak mengulang penulisan otomatis.

## Contoh Klien

Ini contoh klien ringan, bukan SDK resmi. Mendukung pengodean kueri, JSON, timeout, dan pemeriksaan HTTP/API. Jalankan dari akar repositori. Node.js memerlukan fetch bawaan dan AbortSignal.timeout; Python hanya pustaka standar; PHP memerlukan cURL dan JSON. Kredensial hanya di server tepercaya, bukan JavaScript peramban.

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

## Keamanan dan Pertanyaan Umum

Gunakan HTTPS, variabel lingkungan terlindungi, kunci terpisah, dan izin minimum. Aktifkan daftar IP produksi bila tersedia, rotasi Secret, cabut kunci tidak terpakai, dan pantau log. Jangan publikasikan token API/DDNS dalam repositori, URL, tangkapan layar, atau log.

Secret hilang: regenerasi dengan kredensial aktif lain atau konsol; nilai lama tidak berlaku. Batas lebih tinggi: hubungi dukungan. Subakun: implementasi referensi hanya mengizinkan akun utama membuat/menggunakan kunci. Operasi massal tidak didokumentasikan, panggil satu per satu. Statistik tersedia di Pengelolaan API atau daftar kunci.

## Dukungan

Pertanyaan akun, ketersediaan API, atau perpanjangan: [support@dnshe.com](mailto:support@dnshe.com). Konfigurasi: [panduan daring](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) dan [Kelola domain](https://my.dnshe.com/index.php?m=domain_hub).

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
