import { readFile, writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import ru from '../content/ru.mjs';
import es from '../content/es.mjs';
import en from '../content/en.mjs';
import { renderPage, escape } from '../src/template.mjs';

const siteURL = (process.env.SITE_URL || 'http://localhost:4173/').replace(/\/+$/, '') + '/';
const parsed = new URL(siteURL);
if (!['https:','http:'].includes(parsed.protocol) || parsed.search || parsed.hash) throw new Error('SITE_URL must be an absolute HTTP(S) URL without query or hash.');
const basePath = parsed.pathname;
const output = resolve(process.env.OUTPUT_DIR || 'dist');
if (!output.startsWith(resolve('.') + '\\') && !output.startsWith(resolve('.') + '/')) throw new Error('OUTPUT_DIR must stay inside the workspace.');
const languages = [ru, es, en];
// The absolute output path has been verified above to stay inside the workspace.
await rm(output, {recursive:true,force:true});
await mkdir(output, {recursive:true});
await cp('public', output, {recursive:true});
const packed = JSON.parse(await readFile('assets/packed.json','utf8'));
for (const [path, data] of Object.entries(packed)) {
  const destination = resolve(output,path);
  if (!destination.startsWith(output+sep) || !/^(assets|fonts)\/[a-zA-Z0-9._-]+\.(webp|jpg|png|woff2)$/.test(path)) throw new Error('Invalid packed asset path: '+path);
  try { await access(resolve('public',path)); }
  catch { await mkdir(dirname(destination),{recursive:true}); await writeFile(destination,Buffer.from(data,'base64')); }
}
const css = await readFile('src/fonts.css','utf8') + '\n' + await readFile('src/styles.css','utf8');
await writeFile(resolve(output,'assets/styles.css'), css);
await cp('src/main.js',resolve(output,'assets/main.js'));
for (const language of languages) {
  const dir = resolve(output, language.lang === 'ru' ? '.' : language.lang);
  await mkdir(resolve(dir,'privacy'), {recursive:true});
  await writeFile(resolve(dir,'index.html'), renderPage(language,{siteURL,basePath,languages}));
  await writeFile(resolve(dir,'privacy/index.html'), renderPage(language,{siteURL,basePath,languages,page:'privacy'}));
}
await writeFile(resolve(output,'404.html'),renderPage(ru,{siteURL,basePath,languages,page:'404'}));
const alternate = (lang, suffix='') => `${siteURL}${lang==='ru'?'':lang+'/'}${suffix}`;
const sitemap = ['','privacy/'].flatMap(suffix => languages.map(t => `<url><loc>${escape(alternate(t.lang,suffix))}</loc>${languages.map(l=>`<xhtml:link rel="alternate" hreflang="${l.lang}" href="${escape(alternate(l.lang,suffix))}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${escape(alternate('ru',suffix))}"/></url>`)).join('\n');
await writeFile(resolve(output,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemap}\n</urlset>`);
await writeFile(resolve(output,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteURL}sitemap.xml\n`);
await writeFile(resolve(output,'.nojekyll'),'');
console.log(`Built 3 languages, 3 data notices and 404 page. Site URL: ${siteURL}`);
