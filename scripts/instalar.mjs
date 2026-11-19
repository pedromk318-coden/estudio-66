// Estúdio 66 · instalação dos pacotes (uma vez só).  node scripts/instalar.mjs [voz]
// Instala: pacotes npm da biblioteca, o navegador do renderizador e o ambiente Python (sons e mixagem).
// "voz" acrescenta a voz offline em português (Kokoro, cerca de 350 MB).
import { execSync } from 'node:child_process';
import { existsSync, createWriteStream, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const SKILL = join(dirname(fileURLToPath(import.meta.url)), '..'), LIB = join(SKILL, 'biblioteca');
const WIN = process.platform === 'win32', VOZ = process.argv.includes('voz');
const sh = (c, o = {}) => { console.log('→ ' + c); execSync(c, { stdio: 'inherit', cwd: LIB, ...o }); };
const has = c => { try { execSync(c, { stdio: 'ignore' }); return true; } catch { return false; } };

// 1. npm + navegador
if (!existsSync(join(LIB, 'node_modules', 'three'))) sh('npm install --no-audit --no-fund --loglevel=error');
sh(`node "${join('node_modules', 'playwright-core', 'cli.js')}" install chromium-headless-shell`);

// 2. ambiente Python
const venvPy = join(LIB, '.venv', WIN ? 'Scripts/python.exe' : 'bin/python');
if (!existsSync(venvPy)) {
  const py = (WIN ? ['py -3.12', 'py -3.11', 'py -3', 'python'] : ['python3.12', 'python3.11', 'python3']).find(p => has(`${p} -c "import sys; assert (3,11) <= sys.version_info[:2] < (3,14)"`))
    || (WIN ? ['py -3', 'python'] : ['python3']).find(p => has(`${p} -c "import sys; assert sys.version_info >= (3,11)"`));
  if (!py) { console.error('✗ Python 3.11 ou maior não encontrado. Veja INSTALAR.md.'); process.exit(2); }
  sh(`${py} -m venv .venv`);
}
const pip = r => sh(`"${venvPy}" -m pip install --quiet --disable-pip-version-check -r ${r}`);
pip('requirements.txt');

// 3. voz em português (opcional)
if (VOZ) {
  pip('requirements-voice.txt');
  if (!existsSync(join(LIB, 'core', 'tts', 'kokoro-v1.0.onnx'))) {
    const a = JSON.parse(readFileSync(join(LIB, 'tools', 'assets.json'), 'utf8')), p = a.packs.voice;
    const url = `https://github.com/${a.repo}/releases/download/${a.tag}/${p.file}`, tmp = join(tmpdir(), 'estudio66-voz.tar');
    console.log(`→ baixando a voz (${(p.size / 1e6).toFixed(0)} MB)…`);
    const r = await fetch(url); if (!r.ok) { console.error('✗ download falhou: ' + r.status); process.exit(1); }
    const h = createHash('sha256'), f = createWriteStream(tmp);
    for await (const chunk of r.body) { h.update(chunk); f.write(chunk); }
    await new Promise(res => f.end(res));
    if (h.digest('hex') !== p.sha256) { rmSync(tmp); console.error('✗ arquivo da voz corrompido; rode de novo.'); process.exit(1); }
    sh(`tar -xf "${tmp}"`); rmSync(tmp);
  }
}
console.log('\n✓ Instalação concluída. Confira com: node scripts/verificar.mjs');
