// Sobreposição 2D (vertical 1080x1920): caixa de diálogo com texto digitado, saldo contando, cartão final
import { VO, T, SHOTS, DUR } from './story.js';
const cv = document.getElementById('ov'), g = cv.getContext('2d');
const W = 1080, H = 1920, CX = 510;   // CX: centro da área segura (x 80..940)
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ss = x => { x = clamp(x); return x * x * (3 - 2 * x); };

export async function overlayReady() {
  await Promise.all(['500 40px Cinzel', '700 40px Cinzel', 'italic 500 40px "Cormorant Garamond"', '600 40px "Cormorant Garamond"', '500 40px "Cormorant Garamond"'].map(f => document.fonts.load(f)));
}
function money(v) {   // R$ 1.000.000.000,00 (sem depender de locale)
  const s = String(Math.floor(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return 'R$ ' + s + ',00';
}
function spaced(text, x, y, sp) {
  const ws = [...text].map(c => g.measureText(c).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  let cx = x - tot / 2; [...text].forEach((c, i) => { g.fillText(c, cx + ws[i] / 2, y); cx += ws[i] + sp; });
}
function glowText(fn, col, blur) { g.save(); g.shadowColor = col; g.shadowBlur = blur; fn(); g.restore(); fn(); }
function ornament(cx, y, w, a) {
  g.save(); g.globalAlpha = a; g.strokeStyle = '#c9a863'; g.fillStyle = '#e2c989'; g.lineWidth = 2;
  for (const s of [-1, 1]) { const gr = g.createLinearGradient(cx, 0, cx + s * w, 0); gr.addColorStop(0, 'rgba(226,201,137,1)'); gr.addColorStop(1, 'rgba(226,201,137,0)'); g.strokeStyle = gr; g.beginPath(); g.moveTo(cx + s * 18, y); g.lineTo(cx + s * w, y); g.stroke(); }
  g.beginPath(); g.moveTo(cx, y - 9); g.lineTo(cx + 9, y); g.lineTo(cx, y + 9); g.lineTo(cx - 9, y); g.closePath(); g.fill(); g.restore();
}
function plate(x, y, w, h, a = 1) {
  g.save(); g.globalAlpha = a;
  const bg = g.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, 'rgba(14,18,34,.88)'); bg.addColorStop(1, 'rgba(6,8,18,.92)');
  g.fillStyle = bg; g.fillRect(x, y, w, h);
  g.strokeStyle = 'rgba(214,190,130,.9)'; g.lineWidth = 2.5; g.strokeRect(x + .5, y + .5, w - 1, h - 1);
  g.strokeStyle = 'rgba(214,190,130,.35)'; g.lineWidth = 1.2; g.strokeRect(x + 8.5, y + 8.5, w - 17, h - 17);
  for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) { g.fillStyle = '#e2c989'; g.beginPath(); g.moveTo(cx, cy - 8); g.lineTo(cx + 8, cy); g.lineTo(cx, cy + 8); g.lineTo(cx - 8, cy); g.fill(); }
  g.restore();
}
function wrap(text, maxW) { const words = text.split(' '), lines = []; let cur = ''; for (const w of words) { const n = cur ? cur + ' ' + w : w; if (g.measureText(n).width > maxW && cur) { lines.push(cur); cur = w; } else cur = n; } if (cur) lines.push(cur); return lines; }

// —— Caixa de diálogo (texto digitado, 90% da duração) ——
function dialog(t, v) {
  const a = ss(seg(t, v.t - .15, v.t + .25)) * (1 - ss(seg(t, v.t + v.d + .35, v.t + v.d + .7)));
  if (a <= 0) return;
  const bw = 840, bh = 270, x = CX - bw / 2, y = 1470 - bh + (1 - a) * 16;
  plate(x, y, bw, bh, a);
  g.save(); g.globalAlpha = a;
  g.font = '600 38px "Cormorant Garamond"'; const nw = g.measureText(v.who).width + 60;
  g.fillStyle = 'rgba(10,12,24,.95)'; g.fillRect(x + 40, y - 28, nw, 54); g.strokeStyle = 'rgba(214,190,130,.9)'; g.lineWidth = 2; g.strokeRect(x + 40.5, y - 27.5, nw - 1, 53);
  g.fillStyle = '#e8d5a4'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText(v.who, x + 70, y - 1);
  g.font = '600 56px "Cormorant Garamond"'; g.fillStyle = '#f4efe4';
  const n = v.sub.length, shown = Math.floor(n * clamp((t - v.t + .05) / (v.d * .9)));
  const lines = wrap(v.sub, bw - 120); let k = shown;
  lines.forEach((L, i) => { const s = L.slice(0, Math.max(0, k)); k -= L.length + 1; g.fillText(s, x + 60, y + 96 + i * 70); });
  if (shown >= n && Math.floor(t * 2.5) % 2 === 0) { g.fillStyle = '#e2c989'; const tx = x + bw - 56, ty = y + bh - 40; g.beginPath(); g.moveTo(tx - 10, ty - 6); g.lineTo(tx + 10, ty - 6); g.lineTo(tx, ty + 7); g.fill(); }
  g.restore();
}

// —— Notificação do banco: o saldo conta de zero até o valor final, acelerando ——
function bank(t) {
  const a = ss(seg(t, T.countA - .3, T.countA + .1)) * (1 - ss(seg(t, T.countB + 2.0, T.countB + 2.5)));
  if (a <= 0) return;
  const x = 100, w = 820, y = 330 + (1 - a) * -30, h = 260;
  plate(x, y, w, h, a);
  g.save(); g.globalAlpha = a; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#d8c28e'; g.font = '500 34px Cinzel'; spaced('PIX RECEBIDO', CX, y + 62, 8);
  ornament(CX, y + 100, 240, a);
  const p = seg(t, T.countA, T.countB), v = 1e9 * (p < 1 ? Math.pow(p, 2.6) : 1);   // lento no começo, acelera
  const done = p >= 1, pop = done ? 1 + .06 * Math.max(0, 1 - (t - T.countB) * 4) : 1;
  g.translate(CX, y + 176); g.scale(pop, pop);
  g.font = '700 62px Cinzel'; const gr = g.createLinearGradient(0, -34, 0, 34); gr.addColorStop(0, '#fff3cf'); gr.addColorStop(.55, '#e2c27c'); gr.addColorStop(1, '#a8803e');
  g.fillStyle = gr; glowText(() => g.fillText(money(v), 0, 0), done ? 'rgba(255,210,120,.8)' : 'rgba(255,190,110,.35)', done ? 40 : 16);
  g.restore();
}
// —— Ouro no canto (HUD de RPG), mostra o saldo durante a caminhada ——
function hud(t) {
  const a = ss(seg(t, 13.4, 14.2)) * (1 - ss(seg(t, 33.0, 33.6)));
  if (a <= 0) return;
  plate(100, 290, 440, 74, a);
  g.save(); g.globalAlpha = a; g.fillStyle = '#e2c27c'; g.beginPath(); g.arc(142, 327, 15, 0, 7); g.fill(); g.fillStyle = '#a8803e'; g.fillRect(138, 317, 8, 20);
  g.textAlign = 'left'; g.textBaseline = 'middle'; g.font = '700 30px Cinzel'; g.fillStyle = '#f3ead6'; g.fillText(money(1e9), 172, 329); g.restore();
}
// —— Cartão final ——
function endCard(t) {
  const a = ss(seg(t, T.endCard, T.endCard + .8)); if (a <= 0) return;
  g.save(); g.fillStyle = `rgba(2,3,10,${.62 * a})`; g.fillRect(0, 0, W, H);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = a; g.font = '700 84px Cinzel';
  const gr = g.createLinearGradient(0, 640, 0, 1000); gr.addColorStop(0, '#fff3cf'); gr.addColorStop(.55, '#e2c27c'); gr.addColorStop(1, '#a8803e'); g.fillStyle = gr;
  ['E SE VOCÊ', 'ACORDASSE COM', 'UM BILHÃO', 'NA CONTA?'].forEach((L, i) => glowText(() => spaced(L, CX, 700 + i * 112, 6), 'rgba(255,200,120,.5)', 34));
  ornament(CX, 1190, 300 * (.3 + .7 * a), a);
  const b = ss(seg(t, T.endCard + .8, T.endCard + 1.6)); g.globalAlpha = b; g.font = 'italic 500 58px "Cormorant Garamond"'; g.fillStyle = '#f3ead6'; g.fillText('Conta nos comentários.', CX, 1270);
  g.restore();
}
// —— Preto entre as cenas ——
const FADES = SHOTS.slice(1).map(s => [s.a, .3, .5]);
function blackout(t) {
  let a = 0;
  for (const [c, o, i] of FADES) { if (t < c && t > c - o) a = Math.max(a, ss((t - (c - o)) / o)); if (t >= c && t < c + i) a = Math.max(a, 1 - ss((t - c) / i)); }
  a = Math.max(a, ss(seg(t, DUR - .6, DUR)));
  if (a > 0) { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, W, H); }
}
export function drawOverlay(t, shot) {
  g.clearRect(0, 0, W, H);
  bank(t); hud(t);
  for (const v of VO) dialog(t, v);
  endCard(t); blackout(t);
}
