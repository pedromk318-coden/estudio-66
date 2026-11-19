// Estúdio 66 · verificação: mostra o que falta no computador (não instala nada)
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = join(dirname(fileURLToPath(import.meta.url)), '..'), LIB = join(SKILL, 'biblioteca');
const WIN = process.platform === 'win32';
const run = c => { try { return execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { return null; } };
const ok = [], falta = [], pacote = [];

const node = process.versions.node.split('.').map(Number);
(node[0] >= 20 ? ok : falta).push(`Node ${process.versions.node}${node[0] >= 20 ? '' : ' (precisa da versão 20 ou maior)'}`);
const ff = run('ffmpeg -version'); ff ? ok.push('ffmpeg ' + ff.split(' ')[2]) : falta.push('ffmpeg');
const py = [WIN ? 'py -3' : 'python3', 'python'].map(p => [p, run(`${p} --version`)]).find(([, v]) => v && /3\.(1[1-9]|[2-9]\d)/.test(v));
py ? ok.push(py[1]) : falta.push('Python 3.11 ou maior');
run('sh -c "echo ok"') ? ok.push('shell sh') : falta.push(WIN ? 'Git for Windows (traz o sh usado na mixagem)' : 'sh');

existsSync(join(LIB, 'node_modules', 'playwright-core')) && existsSync(join(LIB, 'node_modules', 'three')) ? ok.push('pacotes npm') : pacote.push('pacotes npm');
const pw = run(`node "${join(LIB, 'node_modules', 'playwright-core', 'cli.js')}" install --dry-run chromium-headless-shell`);
pw && /Install location:\s*(.+)/.test(pw) && existsSync(pw.match(/Install location:\s*(.+)/)[1].trim()) ? ok.push('navegador do renderizador') : pacote.push('navegador do renderizador');
const venvPy = join(LIB, '.venv', WIN ? 'Scripts/python.exe' : 'bin/python');
existsSync(venvPy) && run(`"${venvPy}" -c "import numpy, scipy"`) !== null ? ok.push('ambiente Python (sons e mixagem)') : pacote.push('ambiente Python (sons e mixagem)');
existsSync(venvPy) && run(`"${venvPy}" -c "import kokoro_onnx"`) !== null ? ok.push('voz em português (Kokoro)') : console.log('· voz em português ainda não instalada (opcional): node scripts/instalar.mjs voz');

console.log('\nEstúdio 66 · verificação\n');
for (const x of ok) console.log('  ✓ ' + x);
for (const x of falta) console.log('  ✗ ' + x + '  → instale (veja INSTALAR.md)');
for (const x of pacote) console.log('  ○ ' + x + '  → node scripts/instalar.mjs');
console.log(falta.length ? '\nFalta programa do sistema: veja INSTALAR.md.' : pacote.length ? '\nRode: node scripts/instalar.mjs' : '\nTudo pronto. Peça um reel!');
process.exit(falta.length ? 2 : pacote.length ? 1 : 0);
