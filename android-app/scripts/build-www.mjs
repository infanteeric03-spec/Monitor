// Prepara la carpeta www/ de la app Android con la versión actual de la web (index.html, manual e iconos)
// y escribe apk-version.json con la versión de la APK (la usa la app para buscar actualizaciones).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const app = path.resolve(here, '..'), root = path.resolve(app, '..'), www = path.join(app, 'www');
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

const copy = (rel) => {
  const src = path.join(root, rel), dst = path.join(www, rel);
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dst, { recursive: true });
};
['index.html', 'manifest.json', 'favicon-32.png', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'manual'].forEach(copy);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const m = html.match(/<script type="application\/json" id="appChangelog">([\s\S]*?)<\/script>/);
const changes = m ? JSON.parse(m[1]) : [];
const info = {
  code: +(process.env.APK_CODE || 1),
  name: process.env.APK_NAME || 'dev',
  web: changes[0] ? changes[0].v : '',
  built: new Date().toISOString(),
  repo: 'infanteeric03-spec/simula-urg'
};
fs.writeFileSync(path.join(www, 'apk-version.json'), JSON.stringify(info, null, 2));
console.log('www listo:', info);
