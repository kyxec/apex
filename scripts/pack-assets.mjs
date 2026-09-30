import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const files = {};
for (const folder of ['assets','fonts']) {
  for (const name of await readdir(join('public',folder))) {
    if (!/\.(webp|jpg|png|woff2)$/i.test(name)) continue;
    files[`${folder}/${name}`] = (await readFile(join('public',folder,name))).toString('base64');
  }
}
await mkdir('assets',{recursive:true});
await writeFile('assets/packed.json',JSON.stringify(files));
console.log(`Packed ${Object.keys(files).length} binary assets. They are restored during the build.`);
