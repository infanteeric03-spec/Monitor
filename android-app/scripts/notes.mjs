// Notas de la versión: las novedades del registro de cambios posteriores a la versión web de la última APK publicada.
// Uso: node scripts/notes.mjs <versión web anterior> > notas.md
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const m = html.match(/<script type="application\/json" id="appChangelog">([\s\S]*?)<\/script>/);
const all = m ? JSON.parse(m[1]) : [];
const prev = process.argv[2] || '';
let list = [];
for (const x of all) { if (x.v === prev) break; list.push(x); }
if (!prev) list = all.slice(0, 5);
const sha = process.env.GITHUB_SHA || '';
let md = '## Novedades\n\n';
md += list.length ? list.map(x => '**' + x.d + '**\n' + x.items.map(t => '- ' + t).join('\n')).join('\n\n') : '- Mejoras internas.';
md += '\n\nInstala el archivo `.apk` de abajo en Android (puede que tengas que permitir instalar apps de esta fuente).\n';
// datos para la app (no se ven en GitHub): novedades en JSON, versión web y commit
md += '\n<!--WEBV:' + (all[0] ? all[0].v : '') + '-->\n<!--SHA:' + sha + '-->\n<!--CHANGES:' + Buffer.from(JSON.stringify(list), 'utf8').toString('base64') + '-->\n';
process.stdout.write(md);
