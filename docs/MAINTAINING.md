# Maintaining the API reference

The ten API documents are generated from shared route data and translated prose:

- `api-reference.json`: Routes, methods, parameter metadata and shared request/response examples. This is documentation data, not an OpenAPI schema or server implementation.
- `i18n/*.json`: Localized headings and explanations. Each locale must contain every key from `i18n/en.json`.
- `../scripts/build-api-docs.cjs`: Builds each language document, navigation, links to native Markdown headings and Arabic RTL/LTR containers.
- `../examples/client.cjs`, `client.py`, `client.php`: Small server-side reference clients linked by the documentation.

After changing the reference data or translations, run from the repository root:

```sh
node scripts/build-api-docs.cjs
node scripts/check-api-docs.cjs
```

Keep request parameters, authentication headers and response JSON identical across languages. Update parameter descriptions when changing routes. Do not edit generated API Markdown directly.

The published client examples use placeholders and perform no requests when imported. Testing documentation should not create, renew, transfer or delete real domains or credentials. The complete official API guide is available at <https://my.dnshe.com/knowledgebase/13/DNSHE-Free-Domain-API-User-Guide-V2.0.html>. Documentation checks do not verify live server behavior.
