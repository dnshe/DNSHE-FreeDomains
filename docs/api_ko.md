# DNSHE 무료 도메인 API 문서 (v2.0)

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <strong>한국어</strong> · <a href="./api_ar.md">العربية</a></p>

[서비스 소개로 돌아가기](../README_KO.md)

## 📌 기본 정보

* **기본 URL:**
  `https://api005.dnshe.com/index.php?m=domain_hub`
* **인증 방식:** API Key + API Secret
* **응답 형식:** JSON
* **요청 제한:** 분당 60회 (설정 가능)

---

## 🔐 인증

### API 인증 정보 발급

1. DNSHE 고객 영역에 로그인합니다
2. **내 도메인 관리**(My Domain Management)로 이동합니다
3. 사이드바에서 **API 관리**(API Management)를 선택합니다
4. 새 API 키를 생성합니다

---

### 인증 방식

#### ✅ 권장: HTTP 헤더

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### ❌ 사용 중지: URL 매개변수

> 보안상의 이유로 URL이나 요청 본문을 통한 `api_key` 및 `api_secret` 전달은 더 이상 지원되지 않습니다.

---

## 📦 API 엔드포인트

---

## 1️⃣ 하위 도메인 관리

### 1.1 하위 도메인 목록 조회

* **엔드포인트:** `subdomains`
* **작업:** `list`
* **메서드:** `GET`

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

#### 응답 예시

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

### 1.2 하위 도메인 등록

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

### 1.3 하위 도메인 상세 조회

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### 1.4 하위 도메인 삭제

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

---

### 1.5 하위 도메인 갱신

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

---

## 2️⃣ DNS 레코드 관리

### DNS 레코드 목록 조회

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

### DNS 레코드 생성

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

## 3️⃣ API 키 관리

### API 키 목록 조회

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 4️⃣ 할당량 조회

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

---

## 5️⃣ WHOIS 조회 (공개 API)

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

---

## ❗ 오류 형식

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

---

## 🚦 요청 속도 제한

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

## 🔐 보안 권장 사항

* API 인증 정보는 환경 변수에 저장하세요
* 운영 환경의 키에는 IP 허용 목록을 활성화하세요
* API 키를 정기적으로 교체하세요
* 항상 HTTPS를 사용하세요

---

## ❓ 자주 묻는 질문

**질문: API Secret을 분실했나요?**
답변: `regenerate`를 사용하여 새로 생성하세요.

**질문: 일괄 작업을 지원하나요?**
답변: 현재 버전에서는 지원하지 않습니다.

---

## 📝 변경 이력

### v2.0 (2026-04-25)

* 🚀 v2.0 정식 출시
* 🔧 API 명령 구조 최적화
* ✨ 새로운 API 기능 추가
* ⚡ 페이지 나누기 및 조회 성능 개선
* 🛡️ 오류 처리 및 보안 강화

---

### v1.0 (2025-10-19)

* 🎉 최초 출시
* 하위 도메인 관리
* DNS 레코드 관리
* API 키 관리
* 할당량 지원
* 요청 속도 제한
