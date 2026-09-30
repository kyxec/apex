import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve(process.env.OUTPUT_DIR || 'dist');
const siteURL = (process.env.SITE_URL || 'http://localhost:4173/').replace(/\/+$/,'')+'/';
const base = new URL(siteURL);
let checked = 0;
const languages = ['ru','es','en'];
const decode = value => value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'");
for (const [language,path] of [['ru','index.html'],['es','es/index.html'],['en','en/index.html'],['ru','privacy/index.html'],['es','es/privacy/index.html'],['en','en/privacy/index.html'],['ru','404.html']]) {
  const html = await readFile(resolve(root,path),'utf8');
  assert.match(html,new RegExp(`<html lang="${language}"`),path+': language');
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,path+': one H1');
  assert.match(html,/<title>[^<]+<\/title>/,path+': title');
  assert.match(html,/<meta name="description" content="[^\"]+"/,path+': description');
  const ids = [...html.matchAll(/\bid="([^\"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,path+': unique IDs');
  const expectedPath = path.replace(/index\.html$/,'');
  assert.ok(html.includes(`rel="canonical" href="${siteURL}${expectedPath}"`),path+': canonical');
  if (path!=='404.html') {
    for (const code of [...languages,'x-default']) assert.ok(html.includes(`hreflang="${code}"`),path+': hreflang '+code);
  }
  for (const m of html.matchAll(/(?:href|src)="([^\"]+)"/g)) {
    const value = decode(m[1]);
    if (/^(tel:|mailto:|https:|http:)/.test(value)) continue;
    const url = new URL(value,new URL(expectedPath,siteURL));
    assert.ok(url.pathname.startsWith(base.pathname),path+': asset respects Pages path: '+value);
    let local = resolve(root,url.pathname.slice(base.pathname.length));
    if (!extname(local)) local=resolve(local,'index.html');
    await access(local);
    if (url.hash) {
      const target = await readFile(local,'utf8');
      assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),path+': target anchor '+value);
    }
    checked++;
  }
  for (const m of html.matchAll(/srcset="([^\"]+)"/g)) for (const src of m[1].split(',').map(item=>item.trim().split(' ')[0])) {
    await access(resolve(root,new URL(src,siteURL).pathname.slice(base.pathname.length))); checked++;
  }
  for (const m of html.matchAll(/<img\b([^>]+)>/g)) {
    assert.match(m[1],/alt="[^\"]*"/,path+': image alternative');
    assert.match(m[1],/width="\d+"/,path+': image width');
    assert.match(m[1],/height="\d+"/,path+': image height');
  }
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(json,path+': JSON-LD');
  const graph = JSON.parse(json[1])['@graph'];
  assert.ok(graph.some(node=>node['@type']==='Organization'),path+': organization');
  assert.equal(graph.find(node=>node['@type']==='Organization').telephone,'+34632116353');
  if (!path.includes('privacy') && path !== '404.html') {
    assert.equal([...html.matchAll(/class="step"/g)].length,10,path+': ten renovation stages');
    assert.match(html,/id="project-form"/,path+': form');
    assert.match(html,/class="button button-primary form-submit" type="submit" disabled/,path+': no-JS form must not submit personal data');
    assert.match(html,/34632116353/,path+': WhatsApp');
    assert.ok(!html.includes('aggregateRating'),path+': no fabricated reviews');
  }
  assert.ok(!/\bTODO\b|\bTBD\b|lorem ipsum|example\.com/.test(html),path+': no unfinished content');
}
const css = await readFile(resolve(root,'assets/styles.css'),'utf8');
for (const m of css.matchAll(/url\(([^)]+)\)/g)) {await access(resolve(root,'assets',m[1])); checked++;}
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/:focus-visible/);
const sitemap = await readFile(resolve(root,'sitemap.xml'),'utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length,6,'six canonical pages in sitemap');
assert.ok(!sitemap.includes('404.html'));
assert.ok(sitemap.includes(`${siteURL}es/`));
assert.ok(sitemap.includes(`${siteURL}en/`));
const robots = await readFile(resolve(root,'robots.txt'),'utf8');
assert.ok(robots.includes(`Sitemap: ${siteURL}sitemap.xml`));
assert.ok((await stat(resolve(root,'assets/living-1800.webp'))).size < 500000,'hero image below 500 KB');
console.log(`PASS: 7 HTML pages, 3 languages, all stages, schema, sitemap, no-JS safety and ${checked} local asset/link references.`);
