import { Holo, prepModel, drawPad, drawScanPlane } from './holo.js';
import { theme, background, vignette, chrome, plate, FONT } from './hud.js';

const W = 1080, H = 1920, DUR = 6, TAU = Math.PI * 2;
const ctx = document.getElementById('c').getContext('2d');
const T = theme(190, 38), HO = new Holo(W, H);
const ss = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t), seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));

// ---- rocket as a real wireframe: lathe body + 4 fins + nozzle ----
function lathe(prof, n, y0 = 0) {
  const v = [], e = [], q = [];
  prof.forEach(([r, y]) => { for (let i = 0; i < n; i++) { const a = i / n * TAU; v.push(Math.cos(a) * r, y + y0, Math.sin(a) * r); } });
  for (let k = 0; k < prof.length; k++) for (let i = 0; i < n; i++) {
    const a = k * n + i; e.push(a, k * n + (i + 1) % n);
    if (k < prof.length - 1) { e.push(a, a + n); q.push(a, k * n + (i + 1) % n, (k + 1) * n + (i + 1) % n, a + n); }
  }
  return { v, e, q };
}
function fin(ang) {
  const pts = [[0.26, 0.05], [0.62, -0.12], [0.62, 0.12], [0.27, 0.62]], v = [], e = [], q = [0, 1, 2, 3];
  for (const [r, y] of pts) v.push(Math.cos(ang) * r, y, Math.sin(ang) * r);
  e.push(0, 1, 1, 2, 2, 3, 3, 0); return { v, e, q };
}
const body = lathe([[0.27, 0], [0.28, 0.35], [0.28, 0.9], [0.27, 1.3], [0.22, 1.65], [0.13, 1.95], [0.03, 2.18]], 20);
const noz = lathe([[0.12, 0], [0.2, -0.22]], 16);
const model = prepModel({ name: 'foguete', parts: [
  { id: 'body', anchor: [0, 1.2, 0.28], pieces: [{ id: 'body', explode: [0, 0, 0], ...body }] },
  { id: 'fins', anchor: [0.6, 0.1, 0], pieces: [0, 1, 2, 3].map(k => ({ id: 'fin' + k, explode: [Math.cos(k * TAU / 4 + .4) * .6, -.1, Math.sin(k * TAU / 4 + .4) * .6], ...fin(k * TAU / 4 + .4) })) },
  { id: 'nozzle', anchor: [0, -0.2, 0], pieces: [{ id: 'noz', explode: [0, -.45, 0], hot: true, ...noz }] },
] });

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  background(ctx, W, H, T, { cy: H * 0.55, py: t * 6 });
  const lift = ss(seg(t, 4.6, 6)) * 2.6;
  const cam = { target: [0, 1.0 + lift * .35, 0], yaw: .5 + t * .35, pitch: .22, dist: 8.4 - ss(seg(t, 0, 4.6)) * .8, fov: .62, cx: W / 2, cy: H * .52 };
  drawPad(ctx, cam, W, H, { hue: T.hue, rot: t * .5, alpha: 1 - ss(seg(t, 5, 6)) * .5 });
  const scanY = -0.3 + ss(seg(t, 0.1, 1.9)) * 2.6;
  const ex = ss(seg(t, 2.1, 2.9)) * (1 - ss(seg(t, 3.4, 4.1)));
  const solid = ss(seg(t, 4.0, 4.6)) * .7;
  const mv = { ...cam, target: [0, 1.0 + lift * .35 - lift, 0] };      // the rocket climbs inside the frame
  const info = HO.draw(ctx, model, mv, { hue: T.hue, spin: 0, scan: t < 1.95 ? { y: scanY } : null, explode: { fins: ex * .55, nozzle: ex * .6 }, solid, wave: t > 4 ? { y: (t - 4) * 1.6 - .2, w: .18 } : null, glow: 1.1 });
  if (t < 1.95) drawScanPlane(ctx, mv, W, H, scanY, { hue: T.hue, r: .55 });
  if (t > 4.6) { // exhaust: hot near-white plume and particles
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 40; i++) { const [nx, ny] = info.anchor?.nozzle || [W / 2, H * .7], k = (i * 0.137 + t * 2.3) % 1, y = ny + 20 + k * 520, x = nx + Math.sin(i * 7.1) * k * 120;
      ctx.fillStyle = `hsla(${T.accentHue},100%,70%,${(1 - k) * .6})`; ctx.beginPath(); ctx.arc(x, y, 3 + 10 * (1 - k), 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  chrome(ctx, W, H, T, { alpha: 1, px: t * 10 });
  const a = ss(seg(t, .2, .6));
  plate(ctx, T, 70, 120, 520, 110, a);
  ctx.fillStyle = T.hi(a); ctx.font = `600 44px ${FONT.ui}, sans-serif`; ctx.fillText('FOGUETE // ' + (t < 2 ? 'ESCANEANDO' : t < 4.2 ? 'MONTAGEM' : 'IGNIÇÃO'), 96, 178);
  ctx.fillStyle = T.line(a); ctx.font = `28px ${FONT.mono}, monospace`; ctx.fillText(`ALT ${(lift * 1000).toFixed(0).padStart(4, '0')} m   SCAN ${Math.round(ss(seg(t, .1, 1.9)) * 100)}%`, 96, 216);
  vignette(ctx, W, H, .6);
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
