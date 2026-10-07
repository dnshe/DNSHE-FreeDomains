'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const files = fs.readdirSync(path.join(root,'docs')).filter(file=>/^api(?:_[a-z_]+)?\.md$/.test(file));
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const before = files.map(file=>read('docs/'+file));
const build = spawnSync(process.execPath,[path.join(__dirname,'build-api-docs.cjs')],{cwd:root,encoding:'utf8'});
assert.equal(build.status,0,build.stderr);
files.forEach((file,index)=>assert.equal(read('docs/'+file),before[index],file+': generated file is stale'));
const codeBlocks = text => [...text.matchAll(/^```(\w+)\n([\s\S]*?)^```/gm)].map(match=>({language:match[1],code:match[2]}));
const canonical = codeBlocks(read('docs/api.md'));
let jsonCount = 0;
for (const file of files) {
  const text = read('docs/'+file);
  assert.equal((text.match(/^```/gm)||[]).length,canonical.length*2,'Unclosed fence: '+file);
  assert.deepEqual(codeBlocks(text),canonical,'Examples differ: '+file);
  for (const block of codeBlocks(text)) {
    if (block.language==='json') {
      const parsed=JSON.parse(block.code);
      for (const field of ['subdomains','records','keys','gifts']) if(Array.isArray(parsed[field]) && parsed.count !== undefined) assert.equal(parsed.count,parsed[field].length);
      jsonCount++;
    }
    if (block.language==='bash') {
      for (const match of block.code.matchAll(/-d\s+'([\s\S]*?)'/g)) JSON.parse(match[1]);
      assert(!block.code.includes('action=register'),'Old register action: '+file);
      assert(!block.code.includes('https://您的域名'),'Placeholder host: '+file);
    }
  }
  const headings = [...text.matchAll(/^## (.+)$/gm)].map(match => match[1].toLowerCase().replace(/[^\p{L}\p{M}\p{N}_ -]/gu, '').replace(/ /g, '-'));
  for(const match of text.matchAll(/\]\(#([^\)]+)\)/g)) assert(headings.includes(match[1]),'Missing heading target '+match[1]);
  for(const match of text.matchAll(/(?:href="|\]\()((?:\.\/|\.\.\/)[^"\)]+)(?:"|\))/g)) assert(fs.existsSync(path.resolve(root,'docs',match[1])),'Missing reference '+match[1]);
  const nav=text.split('\n').find(line=>line.startsWith('<p align="center" dir="ltr">'));
  assert.equal((nav.match(/<a href=/g)||[]).length,9,'Incomplete language navigation');
}
for(const file of fs.readdirSync(root).filter(file=>/^README.*\.md$/.test(file))) {
  const text=read(file);
  const apiLine=text.split('\n').find(line=>line.includes('](./docs/api'));
  assert(apiLine && (apiLine.match(/\]\(\.\/docs\/api/g)||[]).length===1,'Mixed-language API links: '+file);
  for(const match of text.matchAll(/(?:src="|href="|\]\()(\.\/[^"\)]+)(?:"|\))/g)) assert(fs.existsSync(path.resolve(root,match[1])),'Missing README reference');
}
const arabic=read('docs/api_ar.md');
assert(arabic.startsWith('<div dir="rtl">'));
assert.equal((arabic.match(/<div dir="ltr" align="left">/g)||[]).length,canonical.length);
assert(arabic.includes('&lt;DDNS_TOKEN&gt;'),'Arabic placeholder must be escaped');
console.log(`PASS: ${files.length} API documents; ${canonical.length} identical code blocks each; ${jsonCount} valid JSON responses; navigation, links, Arabic layout and reproducible generation.`);
