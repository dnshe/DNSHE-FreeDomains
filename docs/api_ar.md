<div dir="rtl">

# وثائق API للنطاقات المجانية من DNSHE (v2.0)

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <strong>العربية</strong></p>

[العودة إلى تعريف الخدمة](../README_AR.md)

## 📌 معلومات أساسية

* **عنوان URL الأساسي:**
  <code dir="ltr">https://api005.dnshe.com/index.php?m=domain_hub</code>
* **المصادقة:** API Key + API Secret
* **صيغة الاستجابة:** JSON
* **حد الطلبات:** 60 طلبًا في الدقيقة (قابل للضبط)

---

## 🔐 المصادقة

### الحصول على بيانات اعتماد API

1. سجّل الدخول إلى منطقة عملاء DNSHE
2. انتقل إلى **إدارة نطاقاتي** (My Domain Management)
3. اختر **إدارة API** (API Management) من الشريط الجانبي
4. أنشئ مفتاح API جديدًا

---

### طريقة المصادقة

#### ✅ الطريقة الموصى بها: ترويسات HTTP

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

</div>

#### ❌ الطريقة المعطّلة: معلمات URL

> لأسباب أمنية، لم يعد إرسال <code dir="ltr">api_key</code> و<code dir="ltr">api_secret</code> عبر URL أو جسم الطلب مدعومًا.

---

## 📦 نقاط نهاية API

---

## 1️⃣ إدارة النطاقات الفرعية

### 1.1 عرض النطاقات الفرعية

* **نقطة النهاية:** <code dir="ltr">subdomains</code>
* **الإجراء:** <code dir="ltr">list</code>
* **الطريقة:** <code dir="ltr">GET</code>

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

</div>

#### مثال على الاستجابة

<div dir="ltr" align="left">

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

</div>

---

### 1.2 تسجيل نطاق فرعي

<div dir="ltr" align="left">

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

</div>

---

### 1.3 الحصول على تفاصيل نطاق فرعي

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

</div>

---

### 1.4 حذف نطاق فرعي

<div dir="ltr" align="left">

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 1}'
```

</div>

---

### 1.5 تجديد نطاق فرعي

<div dir="ltr" align="left">

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy" \
  -H "Content-Type: application/json" \
  -d '{"subdomain_id": 3}'
```

</div>

---

## 2️⃣ إدارة سجلات DNS

### عرض سجلات DNS

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

</div>

---

### إنشاء سجل DNS

<div dir="ltr" align="left">

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

</div>

---

## 3️⃣ إدارة مفاتيح API

### عرض مفاتيح API

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

</div>

---

## 4️⃣ الحصص

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: cfsd_xxxxxxxxxx" \
  -H "X-API-Secret: yyyyyyyyyyyy"
```

</div>

---

## 5️⃣ استعلام WHOIS (واجهة API عامة)

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.example.com"
```

</div>

---

## ❗ صيغة الأخطاء

<div dir="ltr" align="left">

```json
{
  "success": false,
  "error_code": "auth_invalid_credentials",
  "message": "Invalid API key"
}
```

</div>

---

## 🚦 تحديد معدل الطلبات

<div dir="ltr" align="left">

```json
{
  "error_code": "rate_limit_exceeded",
  "details": {
    "limit": 60,
    "remaining": 0
  }
}
```

</div>

---

## 🔐 أفضل ممارسات الأمان

* خزّن بيانات اعتماد API في متغيرات البيئة
* فعّل قائمة عناوين IP المسموح بها لمفاتيح بيئة الإنتاج
* غيّر مفاتيح API بانتظام
* استخدم HTTPS دائمًا

---

## ❓ الأسئلة الشائعة

**سؤال: فقدت API Secret؟**
جواب: استخدم <code dir="ltr">regenerate</code> لإنشاء قيمة جديدة.

**سؤال: هل تُدعم العمليات المجمّعة؟**
جواب: لا يدعمها الإصدار الحالي.

---

## 📝 سجل التغييرات

### v2.0 (2026-04-25)

* 🚀 الإصدار الرسمي من v2.0
* 🔧 تحسين بنية أوامر API
* ✨ إضافة إمكانات جديدة إلى API
* ⚡ تحسين أداء تقسيم النتائج إلى صفحات والاستعلامات
* 🛡️ تحسين معالجة الأخطاء والأمان

---

### v1.0 (2025-10-19)

* 🎉 الإصدار الأول
* إدارة النطاقات الفرعية
* إدارة سجلات DNS
* إدارة مفاتيح API
* دعم الحصص
* تحديد معدل الطلبات

</div>
