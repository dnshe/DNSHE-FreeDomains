'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8').replace(/^\uFEFF/, ''));
const spec = load('docs/api-reference.json');
const languages = [
  ['en','English','README.md','api.md'], ['zh','简体中文','README_ZH.md','api_zh.md'],
  ['zh_tw','繁體中文','README_ZH_TW.md','api_zh_tw.md'], ['ja','日本語','README_JA.md','api_ja.md'],
  ['ru','Русский','README_RU.md','api_ru.md'], ['id','Bahasa Indonesia','README_ID.md','api_id.md'],
  ['de','Deutsch','README_DE.md','api_de.md'], ['fr','Français','README_FR.md','api_fr.md'],
  ['ko','한국어','README_KO.md','api_ko.md'], ['ar','العربية','README_AR.md','api_ar.md'],
];
const english = load('docs/i18n/en.json');
const anchors = ['overview','authentication','subdomains','dns','ddns','keys','gifts','quota','whois','errors','examples','security','support'];
const headingSlug = text => text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '').replace(/ /g, '-');
const setup = "export DNSHE_API_KEY='replace-with-your-api-key'\nexport DNSHE_API_SECRET='replace-with-your-api-secret'\nexport DNSHE_DDNS_TOKEN='replace-with-your-ddns-token'";
const schedule = '#!/bin/sh\n: "${DNSHE_DDNS_TOKEN:?Set DNSHE_DDNS_TOKEN}"\ncurl --fail-with-body --silent --show-error --max-time 30 -X POST \\\n  -H "X-DDNS-Token: ${DNSHE_DDNS_TOKEN}" \\\n  "https://api005.dnshe.com/index.php?m=domain_hub&endpoint=ddns&action=update"';
const uses = {
  javascript: "const { DNSHEClient } = require('./examples/client.cjs');\nconst client = new DNSHEClient(\n  'https://api005.dnshe.com/index.php?m=domain_hub',\n  process.env.DNSHE_API_KEY, process.env.DNSHE_API_SECRET\n);\nclient.request('subdomains', 'list', 'GET', { cursor_id: 0, per_page: 100 })\n  .then(console.log)\n  .catch(error => { console.error(error.code || 'request_failed', error.message); process.exitCode = 1; });",
  python: "import os\nfrom examples.client import DNSHEClient\n\nclient = DNSHEClient(\n    'https://api005.dnshe.com/index.php?m=domain_hub',\n    os.environ['DNSHE_API_KEY'], os.environ['DNSHE_API_SECRET']\n)\nprint(client.request('subdomains', 'list', data={'cursor_id': 0, 'per_page': 100}))",
  php: "<?php\nrequire __DIR__ . '/examples/client.php';\n$client = new DNSHEClient(\n    'https://api005.dnshe.com/index.php?m=domain_hub',\n    getenv('DNSHE_API_KEY') ?: '', getenv('DNSHE_API_SECRET') ?: ''\n);\ntry {\n    print_r($client->request('subdomains', 'list', 'GET', ['cursor_id' => 0, 'per_page' => 100]));\n} catch (Throwable $error) {\n    fwrite(STDERR, $error->getMessage() . PHP_EOL);\n    exit(1);\n}",
};
const errorResponse = {success:false,error_code:'auth_invalid_credentials',message:'Invalid API key',details:{request_id:'example-request-id'},error:'Invalid API key'};
const rateResponse = {success:false,error_code:'rate_limit_exceeded',message:'Rate limit exceeded',details:{limit:60,remaining:0,reset_at:'2026-10-07 12:31:00'},error:'Rate limit exceeded'};
function render(language) {
  const [id,,readme,file] = language;
  const t = load('docs/i18n/' + id + '.json');
  for (const key of Object.keys(english)) if (typeof t[key] !== 'string' || !t[key].trim()) throw Error(id + ': missing ' + key);
  const output = [];
  const add = (...parts) => output.push(...parts);
  const code = (language, text) => {
    if (id === 'ar') add('<div dir="ltr" align="left">','');
    add('```' + language, text, '```','');
    if (id === 'ar') add('</div>','');
  };
  const heading = key => add('## ' + t[key],'');
  const examples = items => {
    for (const kind of ['request','response']) {
      const selected = items.filter(item => (item.language === 'json') === (kind === 'response'));
      if (selected.length) add('#### ' + t[kind],'');
      selected.forEach(item => code(item.language, item.code));
    }
  };
  const params = items => {
    if (!items.length) return;
    add('#### ' + t.parameters,'');
    for (const p of items) add('- `' + p.name + '` — `' + p.type + '`; ' + (p.required ? t.required : t.optional) + (p.default === null ? '' : '; ' + t.default + ': `' + p.default + '`') + '.');
    add('');
  };
  const operation = op => {
    add('### ' + op.number + ' ' + t[op.title],'','`' + op.methods.join(' / ') + '` · `endpoint=' + op.endpoint + '`' + (op.action === null ? '' : ' · `action=' + op.action + '`'),'');
    params(op.parameters);
    add(t[op.note],'');
    if (op.number === '1.1') add(t.fieldsText,'');
    if (op.number === '1.5') add(t.renewalErrors,'');
    if (op.number === '2.2') add(t.dnsAdvanced,'',t.delegatedText,'');
    if (op.number === '2.3') add(t.idsText,'',t.delegatedText,'');
    examples(op.examples);
  };
  if (id === 'ar') add('<div dir="rtl">','');
  add('# ' + t.title,'');
  add('<p align="center" dir="ltr">' + languages.map(([other,name,,api]) => other === id ? '<strong>' + name + '</strong>' : '<a href="./' + api + '">' + name + '</a>').join(' · ') + '</p>','');
  add('[' + t.back + '](../' + readme + ')','',t.intro,'','## ' + t.contents,'');
  anchors.forEach(key => add('- [' + t[key] + '](#' + headingSlug(t[key]) + ')'));
  add('');
  heading('overview'); code('text',spec.baseUrl); add(t.overviewText,''); code('bash',setup);
  heading('authentication'); add(t.authText,'');
  for (const [key,prefix] of [['subdomains','1.'],['dns','2.']]) { heading(key); spec.operations.filter(op=>op.number.startsWith(prefix)).forEach(operation); }
  heading('ddns'); add('`GET / POST / PUT` · `endpoint=ddns` · `action=update`','',t.ddnsText,'',t.ddnsResult,''); examples(spec.ddns); add('### Synology DSM','',t.ddnsSchedule,''); code('sh',schedule);
  for (const [key,prefix] of [['keys','3.'],['gifts','4.'],['quota','5.']]) { heading(key); spec.operations.filter(op=>op.number.startsWith(prefix)).forEach(operation); }
  heading('whois'); add('`GET` · `endpoint=whois`',''); params([{name:'domain',type:'string',required:true,default:null}]); add(t.whoisText,'',t.whoisPrivacy,'',t.whoisStatus,''); examples(spec.whois);
  heading('errors'); add(t.errorsText,''); spec.errors.forEach(([name,status])=>add('- `' + name + '` — HTTP `' + status + '`.')); add(''); code('json',JSON.stringify(errorResponse,null,2)); add(t.ratesText,''); code('json',JSON.stringify(rateResponse,null,2)); add(t.retryText,'');
  heading('examples'); add(t.sdkText,'');
  for (const [name,lang,file] of [['Node.js','javascript','client.cjs'],['Python','python','client.py'],['PHP','php','client.php']]) { add('### ' + name,'','[' + file + '](../examples/' + file + ')',''); code(lang,uses[lang]); }
  heading('security'); add(t.securityText,'',t.faqText,'');
  heading('support'); add(t.supportText,'');
  if (id === 'ar') add('</div>','');
  add('<!-- Generated by scripts/build-api-docs.cjs. Edit docs/api-reference.json and docs/i18n/*.json. -->','');
  let document = output.join('\n');
  if (id === 'ar') document = document.split(/(```[^\n]*\n[\s\S]*?```)/g).map((part,index)=>index%2 ? part : part.replace(/`([^`\n]+)`/g,(_,value)=>'<code dir="ltr">' + value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') + '</code>')).join('');
  return [file,document];
}
const documents = languages.map(render);
for (const [file,document] of documents) fs.writeFileSync(path.join(root,'docs',file),document,'utf8');
console.log('Built ' + documents.length + ' API documents.');
