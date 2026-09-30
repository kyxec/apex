import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
const port = Number(process.env.PORT || 4173);
const siteURL = process.env.SITE_URL || `http://localhost:${port}/`;
const basePath = new URL(siteURL).pathname;
const root = resolve(process.env.OUTPUT_DIR || 'dist');
async function build() {
  await new Promise((ok,fail)=>{
    const child = spawn(process.execPath,['scripts/build.mjs'],{stdio:'inherit',env:{...process.env,SITE_URL:siteURL}});
    child.on('exit',code=>code === 0 ? ok() : fail(new Error('Build failed')));
  });
}
await build();
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (!pathname.startsWith(basePath)) {res.writeHead(404);res.end('Not found');return;}
    let file = resolve(root,pathname.slice(basePath.length));
    if (file!==root && !file.startsWith(root+sep)) {res.writeHead(403);res.end('Forbidden');return;}
    try {if ((await stat(file)).isDirectory()) file=resolve(file,'index.html');}
    catch {file=resolve(root,'404.html');res.statusCode=404;}
    const body = await readFile(file);
    res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control','no-store');res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Preview: http://localhost:${port}${basePath}`));
let timeout;
for (const directory of ['src','content','public']) watch(directory,{recursive:true},()=>{clearTimeout(timeout);timeout=setTimeout(()=>build().catch(console.error),200);});
