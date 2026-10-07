<div dir="rtl">

# مرجع API للنطاقات في DNSHE

<p align="center" dir="ltr"><a href="./api.md">English</a> · <a href="./api_zh.md">简体中文</a> · <a href="./api_zh_tw.md">繁體中文</a> · <a href="./api_ja.md">日本語</a> · <a href="./api_ru.md">Русский</a> · <a href="./api_id.md">Bahasa Indonesia</a> · <a href="./api_de.md">Deutsch</a> · <a href="./api_fr.md">Français</a> · <a href="./api_ko.md">한국어</a> · <strong>العربية</strong></p>

[العودة إلى تعريف الخدمة](../README_AR.md)

سجّل النطاقات وأدر DNS وحدّث عناوين IP الديناميكية وأتمت عمليات الحساب. تستخدم الأمثلة مضيف API الخاص بـ DNSHE وبيانات اعتماد بديلة. استبدل الأسماء والمعرّفات والمفاتيح بمواردك.

## المحتويات

- [البدء](#البدء)
- [المصادقة وقواعد الطلبات](#المصادقة-وقواعد-الطلبات)
- [إدارة النطاقات](#إدارة-النطاقات)
- [إدارة سجلات DNS](#إدارة-سجلات-dns)
- [DNS الديناميكي (DDNS)](#dns-الديناميكي-ddns)
- [إدارة مفاتيح API](#إدارة-مفاتيح-api)
- [إهداء النطاقات](#إهداء-النطاقات)
- [الحصص](#الحصص)
- [استعلام WHOIS](#استعلام-whois)
- [الأخطاء وحدود الطلبات](#الأخطاء-وحدود-الطلبات)
- [أمثلة العملاء](#أمثلة-العملاء)
- [الأمان والأسئلة الشائعة](#الأمان-والأسئلة-الشائعة)
- [الدعم](#الدعم)

## البدء

<div dir="ltr" align="left">

```text
https://api005.dnshe.com/index.php?m=domain_hub
```

</div>

يتضمن العنوان الأساسي <code dir="ltr">m=domain_hub</code>؛ أضف المعلمات باستخدام <code dir="ltr">&amp;</code>. تستخدم الطلبات والاستجابات JSON باستثناء معلمات استعلام GET. الحد العام الافتراضي 60 طلبًا في الدقيقة ويمكن للمشغّل تعديله. تتوقف الميزات على الحساب وإعدادات النشر. أمثلة الأوامر مخصصة لـ Bash/sh؛ اضبط متغيرات البيئة أولًا.

<div dir="ltr" align="left">

```bash
export DNSHE_API_KEY='replace-with-your-api-key'
export DNSHE_API_SECRET='replace-with-your-api-secret'
export DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'
```

</div>

## المصادقة وقواعد الطلبات

أنشئ المفتاح الأول من منطقة العملاء ← [إدارة النطاقات](https://my.dnshe.com/index.php?m=domain_hub) ← إدارة API. استخدم الترويستين <code dir="ltr">X-API-Key</code> و<code dir="ltr">X-API-Secret</code>؛ إرسال بيانات الاعتماد في URL أو الجسم معطّل. تُرسل معلمات GET في الاستعلام، وعمليات الكتابة بصيغة JSON مع <code dir="ltr">Content-Type: application/json</code>. يحدد <code dir="ltr">endpoint</code> المورد و<code dir="ltr">action</code> العملية. لا يحتاج <code dir="ltr">quota</code> و<code dir="ltr">whois</code> إلى <code dir="ltr">action</code>. يستخدم DDNS رمزًا مستقلًا.

## إدارة النطاقات

### 1.1 عرض النطاقات

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=subdomains</code> · <code dir="ltr">action=list</code>

#### المعلمات

- <code dir="ltr">page</code> — <code dir="ltr">integer</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">1</code>.
- <code dir="ltr">cursor_id</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">per_page</code> — <code dir="ltr">integer</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">200; 1–500</code>.
- <code dir="ltr">include_total</code> — <code dir="ltr">boolean</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">false</code>.
- <code dir="ltr">search</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">rootdomain</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">status</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">active | suspended | expired</code>.
- <code dir="ltr">created_from / created_to</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">YYYY-MM-DD</code>.
- <code dir="ltr">sort_by</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">id</code>.
- <code dir="ltr">sort_dir</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">desc; asc | desc</code>.
- <code dir="ltr">fields</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">all</code>.

<code dir="ltr">page</code> رقم صفحة متوافق يبدأ من 1. للقوائم الكبيرة ابدأ بـ <code dir="ltr">cursor_id=0</code>، ثم استخدم <code dir="ltr">pagination.next_cursor_id</code> ما دام <code dir="ltr">pagination.has_more=true</code>، وتوقف عند false. يرتب وضع المؤشر حسب ID دون OFFSET. القيمة الافتراضية لـ <code dir="ltr">per_page</code> هي 200 والحد الأقصى 500، ويمكن البدء بـ 50–100. يضيف <code dir="ltr">include_total=1</code> إحصاءً قد يكون مكلفًا. يبحث <code dir="ltr">search</code> في البادئة أو النطاق الجذر؛ وتصفّي <code dir="ltr">rootdomain</code> و<code dir="ltr">status</code> و<code dir="ltr">created_from</code> و<code dir="ltr">created_to</code> النتائج. صيغة التاريخ YYYY-MM-DD. خيارات <code dir="ltr">sort_by</code>: <code dir="ltr">id</code> و<code dir="ltr">created_at</code> و<code dir="ltr">updated_at</code> و<code dir="ltr">expires_at</code> و<code dir="ltr">subdomain</code>؛ وخيارات <code dir="ltr">sort_dir</code>: <code dir="ltr">asc</code> أو <code dir="ltr">desc</code>.

<code dir="ltr">fields</code> قائمة مفصولة بفواصل أو <code dir="ltr">all</code>: <code dir="ltr">id</code> و<code dir="ltr">subdomain</code> و<code dir="ltr">rootdomain</code> و<code dir="ltr">full_domain</code> و<code dir="ltr">status</code> و<code dir="ltr">created_at</code> و<code dir="ltr">updated_at</code> و<code dir="ltr">expires_at</code> و<code dir="ltr">never_expires</code> و<code dir="ltr">cloudflare_zone_id</code> و<code dir="ltr">provider_account_id</code>. يُضاف <code dir="ltr">id</code> دائمًا للاختيار المخصص. يمثل <code dir="ltr">count</code> عدد العناصر المعادة، وليس بالضرورة إجمالي النتائج.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list&cursor_id=0&per_page=100&fields=id,subdomain,rootdomain,status" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=list&search=test&rootdomain=de5.net&status=active&sort_by=expires_at&sort_dir=asc&per_page=50" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

<div dir="ltr" align="left">

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

</div>

### 1.2 تسجيل نطاق

<code dir="ltr">POST</code> · <code dir="ltr">endpoint=subdomains</code> · <code dir="ltr">action=create</code>

#### المعلمات

- <code dir="ltr">subdomain</code> — <code dir="ltr">string</code>; مطلوب.
- <code dir="ltr">domain</code> — <code dir="ltr">string</code>; مطلوب.

<code dir="ltr">subdomain</code> بادئة مثل <code dir="ltr">myapp</code>، و<code dir="ltr">domain</code> نطاق جذر متاح مثل <code dir="ltr">de5.net</code>. يستخدم التسجيل <code dir="ltr">action=create</code> والحقل <code dir="ltr">domain</code>. حقل الاستجابة ومرشح القائمة <code dir="ltr">rootdomain</code> ليسا حقلَي تسجيل. تطبق قيود التوافر وحصة الحساب.

#### أمثلة الطلبات

<div dir="ltr" align="left">

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

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "Subdomain registered successfully",
  "subdomain_id": 3,
  "full_domain": "myapp.de5.net"
}
```

</div>

### 1.3 تفاصيل النطاق

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=subdomains</code> · <code dir="ltr">action=get</code>

#### المعلمات

- <code dir="ltr">subdomain_id</code> — <code dir="ltr">integer</code>; مطلوب.

استخدم معرّف نطاق يملكه الحساب المصادق عليه. تتضمن الاستجابة كائن النطاق و<code dir="ltr">dns_records</code> و<code dir="ltr">dns_count</code>.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=get&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

### 1.4 حذف نطاق

<code dir="ltr">POST / DELETE</code> · <code dir="ltr">endpoint=subdomains</code> · <code dir="ltr">action=delete</code>

#### المعلمات

- <code dir="ltr">subdomain_id</code> — <code dir="ltr">integer</code>; مطلوب.

يحذف النطاق المملوك وسجلات DNS المرتبطة. يعرض <code dir="ltr">dns_records_deleted</code> عدد السجلات المحذوفة. تحقق من المعرّف قبل الإرسال.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 1
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "Subdomain deleted successfully",
  "subdomain_id": 1,
  "full_domain": "test.de5.net",
  "dns_records_deleted": 4
}
```

</div>

### 1.5 تجديد نطاق

<code dir="ltr">POST / PUT</code> · <code dir="ltr">endpoint=subdomains</code> · <code dir="ltr">action=renew</code>

#### المعلمات

- <code dir="ltr">subdomain_id</code> — <code dir="ltr">integer</code>; مطلوب.

يبقى التجديد المجاني العادي في DNSHE مجانيًا، ويستخدم المثال <code dir="ltr">charged_amount=0</code>. قد تضبط الإضافة العامة استردادًا مدفوعًا؛ تحقق من الحالة وسياسة اللوحة خلال فترة الاسترداد. اقرأ <code dir="ltr">previous_expires_at</code> و<code dir="ltr">new_expires_at</code> و<code dir="ltr">never_expires</code> و<code dir="ltr">remaining_days</code> و<code dir="ltr">charged_amount</code> لتحديد النتيجة الفعلية.

أخطاء التجديد: HTTP 403 مع <code dir="ltr">renewal disabled</code> أو <code dir="ltr">redemption period requires administrator</code> أو <code dir="ltr">renewal window expired</code>؛ HTTP 422 مع <code dir="ltr">renewal_not_yet_available</code>؛ HTTP 402 مع <code dir="ltr">insufficient balance for redemption renewal</code>؛ HTTP 404 للنطاق غير الموجود أو غير المملوك. تحقق من نافذة التجديد أو تواصل مع الدعم، ولا تكرر الطلب دون انتظار.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=subdomains&action=renew" \
-H "X-API-Key: ${DNSHE_API_KEY}" \
-H "X-API-Secret: ${DNSHE_API_SECRET}" \
-H "Content-Type: application/json" \
-d '{
  "subdomain_id": 3
}'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

## إدارة سجلات DNS

### 2.1 عرض سجلات DNS

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=dns_records</code> · <code dir="ltr">action=list</code>

#### المعلمات

- <code dir="ltr">subdomain_id</code> — <code dir="ltr">integer</code>; مطلوب.

فضّل <code dir="ltr">id</code> الخاص بالوحدة من القائمة أو الإنشاء؛ تتكون المعرّفات العامة الجديدة من 15 رقمًا. <code dir="ltr">record_id</code> هو معرّف مزود DNS. يتطلب التعديل والحذف واحدًا على الأقل؛ وإذا أُرسلا معًا يجب أن يشيرا إلى السجل نفسه، وإلا يظهر <code dir="ltr">dns_record_identifier_mismatch</code>. تبقى المعرّفات الداخلية القديمة متوافقة. يوثق المرجع توافق <code dir="ltr">record_id</code> الرقمي حتى 2027-06-12 على الأقل؛ استخدم <code dir="ltr">id</code> لمعرّف الوحدة في العملاء الجدد.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=list&subdomain_id=1" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

### 2.2 إنشاء سجل DNS

<code dir="ltr">POST</code> · <code dir="ltr">endpoint=dns_records</code> · <code dir="ltr">action=create</code>

#### المعلمات

- <code dir="ltr">subdomain_id</code> — <code dir="ltr">integer</code>; مطلوب.
- <code dir="ltr">type</code> — <code dir="ltr">string</code>; مطلوب.
- <code dir="ltr">name</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">@</code>.
- <code dir="ltr">content</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">ttl</code> — <code dir="ltr">integer</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">600</code>.
- <code dir="ltr">priority</code> — <code dir="ltr">integer</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">MX: 10; SRV: 0</code>.
- <code dir="ltr">line</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">record_weight / weight</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">record_port / port</code> — <code dir="ltr">integer</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">1–65535</code>.
- <code dir="ltr">record_target / target</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">caa_flag</code> — <code dir="ltr">integer</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">0; 0–255</code>.
- <code dir="ltr">caa_tag</code> — <code dir="ltr">string</code>; اختياري; القيمة الافتراضية / النطاق: <code dir="ltr">issue; 1–15 [A-Za-z0-9]</code>.
- <code dir="ltr">caa_value</code> — <code dir="ltr">string</code>; اختياري.

يدعم <code dir="ltr">type</code> الأنواع A وAAAA وCNAME وMX وTXT وNS وSRV وCAA. يكون <code dir="ltr">name</code> نسبيًا للنطاق المسجل؛ حذفه أو تركه فارغًا أو <code dir="ltr">@</code> يعني النطاق نفسه. لا يُقبل الاسم الكامل؛ وتُسمح <code dir="ltr">*</code> في الجزء الأيسر فقط. <code dir="ltr">content</code> مطلوب إلا إذا جُمّع من معلمات SRV/CAA المنظمة. القيمة الافتراضية لـ <code dir="ltr">ttl</code> هي 600 ثانية، ولـ <code dir="ltr">priority</code> هي 10 في MX و0 في SRV.

يستخدم SRV المعلمات <code dir="ltr">record_weight</code>/<code dir="ltr">weight</code> للوزن و<code dir="ltr">record_port</code>/<code dir="ltr">port</code> للمنفذ (1–65535) و<code dir="ltr">record_target</code>/<code dir="ltr">target</code> للهدف؛ ويعني الهدف <code dir="ltr">.</code> أن الخدمة غير متاحة. يستخدم CAA: <code dir="ltr">caa_flag</code> (0–255، الافتراضي 0)، و<code dir="ltr">caa_tag</code> (1–15 حرفًا أو رقمًا، الافتراضي <code dir="ltr">issue</code>)، و<code dir="ltr">caa_value</code>. يخص <code dir="ltr">line</code> مزود AliDNS فقط؛ ويرفض الآخرون القيمة غير الفارغة.

قد تُعطّل كتابة NS عبر <code dir="ltr">disable_ns_management</code>. بعد التفويض إلى DNS خارجي، يُرفض إنشاء أو تعديل سجلات غير NS بالخطأ <code dir="ltr">external_dns_delegated</code>. لا يمنع ذلك حذف السجلات القديمة أو المطابقة أو تنظيف الموارد المنتهية.

#### أمثلة الطلبات

<div dir="ltr" align="left">

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

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "DNS record created successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

</div>

### 2.3 تعديل سجل DNS

<code dir="ltr">POST / PUT / PATCH</code> · <code dir="ltr">endpoint=dns_records</code> · <code dir="ltr">action=modify</code>

#### المعلمات

- <code dir="ltr">id</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">record_id</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">type / name / content</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">ttl / priority</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">line</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">record_weight / weight</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">record_port / port</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">record_target / target</code> — <code dir="ltr">string</code>; اختياري.
- <code dir="ltr">caa_flag</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">caa_tag / caa_value</code> — <code dir="ltr">string</code>; اختياري.

أرسل <code dir="ltr">id</code> أو <code dir="ltr">record_id</code> والحقول المراد تغييرها. قواعد الاسم وخيارات SRV/CAA مماثلة للإنشاء. يجب أن يشير المعرّفان إلى السجل نفسه. تعيد الاستجابة معرّف الوحدة والمزود.

فضّل <code dir="ltr">id</code> الخاص بالوحدة من القائمة أو الإنشاء؛ تتكون المعرّفات العامة الجديدة من 15 رقمًا. <code dir="ltr">record_id</code> هو معرّف مزود DNS. يتطلب التعديل والحذف واحدًا على الأقل؛ وإذا أُرسلا معًا يجب أن يشيرا إلى السجل نفسه، وإلا يظهر <code dir="ltr">dns_record_identifier_mismatch</code>. تبقى المعرّفات الداخلية القديمة متوافقة. يوثق المرجع توافق <code dir="ltr">record_id</code> الرقمي حتى 2027-06-12 على الأقل؛ استخدم <code dir="ltr">id</code> لمعرّف الوحدة في العملاء الجدد.

قد تُعطّل كتابة NS عبر <code dir="ltr">disable_ns_management</code>. بعد التفويض إلى DNS خارجي، يُرفض إنشاء أو تعديل سجلات غير NS بالخطأ <code dir="ltr">external_dns_delegated</code>. لا يمنع ذلك حذف السجلات القديمة أو المطابقة أو تنظيف الموارد المنتهية.

#### أمثلة الطلبات

<div dir="ltr" align="left">

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

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "DNS record updated successfully",
  "id": 738492016583241,
  "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
}
```

</div>

### 2.4 حذف سجل DNS

<code dir="ltr">POST / DELETE</code> · <code dir="ltr">endpoint=dns_records</code> · <code dir="ltr">action=delete</code>

#### المعلمات

- <code dir="ltr">id</code> — <code dir="ltr">integer</code>; اختياري.
- <code dir="ltr">record_id</code> — <code dir="ltr">string</code>; اختياري.

فضّل <code dir="ltr">id</code> الخاص بالوحدة من القائمة أو الإنشاء؛ تتكون المعرّفات العامة الجديدة من 15 رقمًا. <code dir="ltr">record_id</code> هو معرّف مزود DNS. يتطلب التعديل والحذف واحدًا على الأقل؛ وإذا أُرسلا معًا يجب أن يشيرا إلى السجل نفسه، وإلا يظهر <code dir="ltr">dns_record_identifier_mismatch</code>. تبقى المعرّفات الداخلية القديمة متوافقة. يوثق المرجع توافق <code dir="ltr">record_id</code> الرقمي حتى 2027-06-12 على الأقل؛ استخدم <code dir="ltr">id</code> لمعرّف الوحدة في العملاء الجدد.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1
  }'
```

</div>

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=dns_records&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "record_id": "5a0ce6c4d1d4c71bc5e60a2a2a0e4997"
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "DNS record deleted successfully"
}
```

</div>

## DNS الديناميكي (DDNS)

<code dir="ltr">GET / POST / PUT</code> · <code dir="ltr">endpoint=ddns</code> · <code dir="ltr">action=update</code>

أنشئ رمزًا لسجل A/AAAA محدد من إدارة النطاقات ← DDNS. أرسله عبر <code dir="ltr">Authorization: Bearer &lt;DDNS_TOKEN&gt;</code> أو <code dir="ltr">X-DDNS-Token</code>، وليس URL أو الجسم. لا يغيّر الرمز إلا IP السجل المرتبط. تُدعم GET وPOST وPUT، ويستخدم المثال POST. يحدد <code dir="ltr">ip</code> الاختياري IPv4/IPv6؛ وعند حذفه يُستخدم IP مصدر الاتصال المباشر. لتحديث AAAA استخدم IPv6 مناسبًا.

يعني <code dir="ltr">status=good</code> تغيير العنوان. ويُعد <code dir="ltr">status=nochg</code> مع <code dir="ltr">changed=false</code> نجاحًا أيضًا، دون استدعاء مزود DNS. يستخدم DDNS العنوان <code dir="ltr">https://api005.dnshe.com</code> مستقلًا عن منطقة العملاء.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update" \
  -H "Authorization: Bearer ${DNSHE_DDNS_TOKEN}"
```

</div>

<div dir="ltr" align="left">

```bash
curl -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update" \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"ip":"203.0.113.10"}'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "status": "nochg",
  "changed": false,
  "ip": "203.0.113.10"
}
```

</div>

### Synology DSM

في Synology DSM وغيره، استخدم مهمة مجدولة ترسل الترويسات بدل قالب URL يتضمن الرمز. احفظ الرمز واختبر المهمة يدويًا. يمكن البدء بفاصل خمس دقائق، بشرط ألا يكون أقصر من الحد الأدنى المضبوط. احفظ الرمز في بيئة مهمة محمية.

<div dir="ltr" align="left">

```sh
#!/bin/sh
: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"
curl --fail-with-body --silent --show-error --max-time 30 -X POST \
  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \
  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"
```

</div>

## إدارة مفاتيح API

### 3.1 عرض مفاتيح API

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=keys</code> · <code dir="ltr">action=list</code>

تعرض القائمة المعرّفات والأسماء والحالات وعدد الطلبات وآخر استخدام. لا يمكن استعادة Secret قديم منها. يُنشأ المفتاح الأول في اللوحة.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

### 3.2 إنشاء مفتاح API

<code dir="ltr">POST</code> · <code dir="ltr">endpoint=keys</code> · <code dir="ltr">action=create</code>

#### المعلمات

- <code dir="ltr">key_name</code> — <code dir="ltr">string</code>; مطلوب.
- <code dir="ltr">ip_whitelist</code> — <code dir="ltr">string</code>; اختياري.

<code dir="ltr">key_name</code> هو اسم المفتاح. عند تفعيل قائمة IP، يقبل <code dir="ltr">ip_whitelist</code> عناوين IP أو CIDR مفصولة بفواصل أو أسطر أو فواصل منقوطة. استبدل عنوان المثال بعنوان خروج الخادم الحقيقي. يظهر <code dir="ltr">api_secret</code> مرة واحدة فقط؛ احفظه فورًا.

#### أمثلة الطلبات

<div dir="ltr" align="left">

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

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "API key created successfully",
  "api_key": "cfsd_zzzzzzzzzz",
  "api_secret": "aaaaaaaaaaaaaaaa",
  "warning": "Please save the api_secret, it will not be shown again"
}
```

</div>

### 3.3 حذف مفتاح API

<code dir="ltr">POST / DELETE</code> · <code dir="ltr">endpoint=keys</code> · <code dir="ltr">action=delete</code>

#### المعلمات

- <code dir="ltr">key_id</code> — <code dir="ltr">integer</code>; مطلوب.

يلغي المفتاح <code dir="ltr">key_id</code>. استخدم مفتاحًا صالحًا آخر للإدارة حتى لا يؤدي الحذف إلى إيقاف الأتمتة الحالية بشكل غير متوقع.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=delete" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 2
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

</div>

### 3.4 إعادة إنشاء API Secret

<code dir="ltr">POST</code> · <code dir="ltr">endpoint=keys</code> · <code dir="ltr">action=regenerate</code>

#### المعلمات

- <code dir="ltr">key_id</code> — <code dir="ltr">integer</code>; مطلوب.

ينشئ Secret جديدًا لـ <code dir="ltr">key_id</code> ويلغي القديم. احفظ القيمة الجديدة وحدّث الخدمات المعتمدة عليها. إذا فُقدت كل بيانات الاعتماد الصالحة، استعد الوصول من اللوحة؛ لا تتاح العملية دون مصادقة.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=keys&action=regenerate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "key_id": 1
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

```json
{
  "success": true,
  "message": "API secret regenerated successfully",
  "api_key": "cfsd_xxxxxxxxxx",
  "api_secret": "new_secret_here",
  "warning": "Please save the new api_secret, it will not be shown again"
}
```

</div>

## إهداء النطاقات

### 4.1 بدء إهداء

<code dir="ltr">POST / PUT</code> · <code dir="ltr">endpoint=gifts</code> · <code dir="ltr">action=initiate</code>

#### المعلمات

- <code dir="ltr">subdomain_id</code> — <code dir="ltr">integer</code>; مطلوب.

يجب أن يملك الحساب المصادق عليه <code dir="ltr">subdomain_id</code>. تعيد الاستجابة رمز الإهداء ووقت الانتهاء. شارك الرمز مع المستلم المقصود فقط.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=initiate" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "subdomain_id": 123
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

### 4.2 قبول إهداء

<code dir="ltr">POST / PUT</code> · <code dir="ltr">endpoint=gifts</code> · <code dir="ltr">action=accept</code>

#### المعلمات

- <code dir="ltr">code</code> — <code dir="ltr">string</code>; مطلوب.

يصادق المستلم بمفتاحه الخاص ويرسل <code dir="ltr">code</code> من المرسل. ينقل القبول النطاق؛ تحقق من النطاق والحساب الأصلي في الاستجابة.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=accept" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AB12CD34EF56GH78IJ"
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

### 4.3 إلغاء إهداء

<code dir="ltr">POST / DELETE</code> · <code dir="ltr">endpoint=gifts</code> · <code dir="ltr">action=cancel</code>

#### المعلمات

- <code dir="ltr">gift_id</code> — <code dir="ltr">integer</code>; مطلوب.

يجب أن يشير <code dir="ltr">gift_id</code> إلى إهداء pending بدأه المستخدم الحالي. يلغي الإلغاء عملية النقل المعلقة.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X POST "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=cancel" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "gift_id": 88
  }'
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

### 4.4 عرض الإهداءات

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=gifts</code> · <code dir="ltr">action=list</code>

تعرض السجلات والحالات. <code dir="ltr">initiate</code> و<code dir="ltr">accept</code> و<code dir="ltr">cancel</code> عمليات كتابة محدودة المعدل. بعد انتهاء المهلة، تحقق من الحالة قبل التكرار؛ فقد تكون العملية نُفّذت.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=gifts&action=list" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

## الحصص

### 5.1 عرض الحصة

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=quota</code>

يتضمن <code dir="ltr">quota</code> الحقول <code dir="ltr">used</code> و<code dir="ltr">base</code> و<code dir="ltr">invite_bonus</code> و<code dir="ltr">total</code> و<code dir="ltr">available</code>. استخدم القيم الفعلية لا حصة حساب المثال. لا تحتاج إلى <code dir="ltr">action</code>.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl --fail-with-body --silent --show-error --max-time 30 -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=quota" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

## استعلام WHOIS

<code dir="ltr">GET</code> · <code dir="ltr">endpoint=whois</code>

#### المعلمات

- <code dir="ltr">domain</code> — <code dir="ltr">string</code>; مطلوب.

<code dir="ltr">domain</code> مطلوب ويحتوي الاسم الكامل لنطاق داخلي أو استعلام WHOIS خارجي. الوضع العام لا يحتاج مفتاحًا افتراضيًا، وحدّه طلبان في الدقيقة لكل IP، بشكل مستقل عن API العام. قد يطلب المشغّل ترويستَي المصادقة المعتادتين. لا تحتاج إلى <code dir="ltr">action</code>.

تتوقف رؤية البريد والرمز البريدي على الخصوصية؛ <code dir="ltr">registrant_postal_code</code> مستقل عن <code dir="ltr">registrant_address</code> القديم. يخص <code dir="ltr">owner_userid</code> النطاقات الداخلية ويظهر عادة للمالك المصادق عليه ما لم يغيّر المشغّل الإعداد. لا يكشف WHOIS العام المعرّفات الداخلية افتراضيًا. قد تغيب حقول الهوية الاختيارية.

تشمل الحالات <code dir="ltr">Registered</code> و<code dir="ltr">RenewalGracePeriod</code> و<code dir="ltr">RedemptionPeriod</code> و<code dir="ltr">ServerHold</code> و<code dir="ltr">PendingDelete</code> و<code dir="ltr">unregistered</code>. يستخدم <code dir="ltr">nameservers</code> والاسم البديل <code dir="ltr">name_servers</code> سجلات NS الفعلية أو الإعدادات الافتراضية. يعيد النطاق الدائم <code dir="ltr">expires_at="2999-12-31 23:59"</code> دون <code dir="ltr">never_expires</code>. غير المسجل يعيد <code dir="ltr">registered=false</code> و<code dir="ltr">status=unregistered</code>. يوضح <code dir="ltr">rate_limit</code> العام حصة IP المتبقية.

#### أمثلة الطلبات

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net"
```

</div>

<div dir="ltr" align="left">

```bash
curl -X GET "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=whois&domain=foo.de5.net" \
  -H "X-API-Key: ${DNSHE_API_KEY}" \
  -H "X-API-Secret: ${DNSHE_API_SECRET}"
```

</div>

#### أمثلة الاستجابات

<div dir="ltr" align="left">

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

</div>

<div dir="ltr" align="left">

```json
{
  "success": true,
  "domain": "foo.de5.net",
  "registered": false,
  "status": "unregistered",
  "message": "domain not registered"
}
```

</div>

## الأخطاء وحدود الطلبات

تحقق من HTTP وJSON <code dir="ltr">success</code>. اعتمد على <code dir="ltr">error_code</code> الثابت، لا نص الرسالة المتغير. <code dir="ltr">message</code> وصف و<code dir="ltr">details</code> سياق اختياري و<code dir="ltr">error</code> القديم يكرر معنى message. تُعد الاستجابة غير JSON من المزود الأعلى فشلًا أيضًا. ترد أدناه الرموز وحالات HTTP الشائعة؛ وأخطاء التجديد موضحة في قسمها.

- <code dir="ltr">bad_request</code> — HTTP <code dir="ltr">400</code>.
- <code dir="ltr">auth_invalid_credentials</code> — HTTP <code dir="ltr">401</code>.
- <code dir="ltr">auth_ip_not_allowed</code> — HTTP <code dir="ltr">403</code>.
- <code dir="ltr">api_access_disabled</code> — HTTP <code dir="ltr">403</code>.
- <code dir="ltr">not_found / subdomain_not_found / dns_record_not_found</code> — HTTP <code dir="ltr">404</code>.
- <code dir="ltr">quota_exceeded</code> — HTTP <code dir="ltr">429</code>.
- <code dir="ltr">rate_limit_exceeded</code> — HTTP <code dir="ltr">429</code>.
- <code dir="ltr">provider_operation_failed</code> — HTTP <code dir="ltr">502</code>.
- <code dir="ltr">internal_error</code> — HTTP <code dir="ltr">500</code>.
- <code dir="ltr">renewal_not_yet_available</code> — HTTP <code dir="ltr">422</code>.

<div dir="ltr" align="left">

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

</div>

الافتراضي 60 طلبًا في الدقيقة لـ API العام وطلبان في الدقيقة لكل IP لـ WHOIS العام، وقد تختلف الإعدادات. استخدم <code dir="ltr">details.limit</code> و<code dir="ltr">details.remaining</code> و<code dir="ltr">details.reset_at</code> عند وجودها. قد يعني HTTP 429 نفاد الحصة أو تجاوز المعدل؛ ميّز <code dir="ltr">quota_exceeded</code> عن <code dir="ltr">rate_limit_exceeded</code>.

<div dir="ltr" align="left">

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

</div>

للقراءات المحدودة، انتظر إعادة الضبط أو استخدم تراجعًا أُسّيًا محدودًا مع عشوائية. بعد مهلة الإنشاء أو الحذف أو التجديد أو قبول الإهداء أو تبديل Secret، تحقق من الحالة قبل الإعادة. لا يعيد العملاء عمليات الكتابة تلقائيًا.

## أمثلة العملاء

هذه أمثلة عملاء خفيفة وليست SDK رسميًا. تشمل ترميز الاستعلام وJSON والمهل وفحص HTTP/API. شغّلها من جذر المستودع. يتطلب Node.js دالتَي fetch وAbortSignal.timeout المدمجتين؛ يستخدم Python المكتبة القياسية فقط؛ ويتطلب PHP دعم cURL وJSON. احفظ بيانات الاعتماد على خادم موثوق، لا في JavaScript المتصفح.

### Node.js

[client.cjs](../examples/client.cjs)

<div dir="ltr" align="left">

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

</div>

### Python

[client.py](../examples/client.py)

<div dir="ltr" align="left">

```python
import os
from examples.client import DNSHEClient

client = DNSHEClient(
    'https://api005.dnshe.com/index.php?m=domain_hub',
    os.environ['DNSHE_API_KEY'], os.environ['DNSHE_API_SECRET']
)
print(client.request('subdomains', 'list', data={'cursor_id': 0, 'per_page': 100}))
```

</div>

### PHP

[client.php](../examples/client.php)

<div dir="ltr" align="left">

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

</div>

## الأمان والأسئلة الشائعة

استخدم HTTPS ومتغيرات بيئة محمية ومفاتيح منفصلة وأقل صلاحيات متاحة. فعّل قائمة IP عند توفرها، وغيّر الأسرار وألغِ المفاتيح المهملة وراقب السجلات. لا تنشر رموز API/DDNS في المستودعات أو URL أو الصور أو السجلات العامة.

فقدان Secret: أعد إنشاؤه ببيانات صالحة أخرى أو عبر اللوحة؛ يُلغى القديم. رفع الحد: تواصل مع الدعم. الحسابات الفرعية: يسمح المرجع للحساب الرئيسي فقط بإنشاء واستخدام المفاتيح. لا توجد عمليات مجمعة موثقة؛ استدعِ كل عملية منفردة. الإحصاءات متاحة في إدارة API أو قائمة المفاتيح.

## الدعم

لأسئلة الحساب والتوافر والتجديد: [support@dnshe.com](mailto:support@dnshe.com). الإعدادات في [الدليل عبر الإنترنت](https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html) و[إدارة النطاقات](https://my.dnshe.com/index.php?m=domain_hub).

</div>

<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->
