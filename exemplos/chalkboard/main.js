import { Stroke, bake, drawStroke, arc, head, curve, poly, line } from './chalk.js';

const W = 1080, H = 1920, DUR = 6;
const ctx = document.getElementById('c').getContext('2d');
const ss = t => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);
const rnd = s => { let a = s >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

// ---- the board, baked once: even deep green slate, fine grain, slow mottling, wooden frame and tray ----
const board = document.createElement('canvas'); board.width = W; board.height = H;
{ const b = board.getContext('2d'), r = rnd(7);
  b.fillStyle = '#1f3a30'; b.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) { const g = b.createRadialGradient(r() * W, r() * H, 0, r() * W, r() * H, 300 + r() * 400); g.addColorStop(0, `rgba(${r() < .5 ? '40,70,58' : '22,44,36'},.25)`); g.addColorStop(1, 'rgba(0,0,0,0)'); b.fillStyle = g; b.fillRect(0, 0, W, H); }
  const id = b.getImageData(0, 0, W, H), d = id.data; for (let k = 0; k < d.length; k += 4) { const v = (r() - .5) * 10; d[k] += v; d[k + 1] += v; d[k + 2] += v; } b.putImageData(id, 0, 0);
  const wood = (x, y, w, h) => { const g = b.createLinearGradient(x, y, x + (w > h ? 0 : w), y + (w > h ? h : 0)); g.addColorStop(0, '#8a5c33'); g.addColorStop(.5, '#6d4524'); g.addColorStop(1, '#4e3119'); b.fillStyle = g; b.fillRect(x, y, w, h); };
  wood(0, 0, W, 46); wood(0, 0, 46, H); wood(W - 46, 0, 46, H); wood(0, H - 150, W, 150);
  b.fillStyle = 'rgba(0,0,0,.35)'; b.fillRect(46, H - 150, W - 92, 10);
  [[220, '#efece2'], [330, '#f2c14e'], [420, '#7fb7f0']].forEach(([x, c]) => { b.fillStyle = c; b.fillRect(x, H - 128, 78, 18); });
  const v = b.createRadialGradient(W / 2, H * .45, 300, W / 2, H * .45, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); b.fillStyle = v; b.fillRect(0, 0, W, H);
}

// ---- the lesson, in stroke order: rocket → window → fins → flame → trajectory → small rocket at the top ----
const S = [], at = (st, t0, t1) => { st.t0 = t0; st.t1 = t1; bake(st, 2); S.push(st); return st; };
const cx = 380, base = 1520;
const R = (a, b) => [cx + a, base + b];
at(curve([R(-95, 0), R(-102, -260), R(-80, -420), R(0, -560)], { w: 7 }), 0.15, 0.75);
at(curve([R(0, -560), R(80, -420), R(102, -260), R(95, 0)], { w: 7 }), 0.75, 1.3);
at(line(...R(-95, 0), ...R(95, 0), { w: 6 }), 1.3, 1.55);
at(arc(cx, base - 330, 46, -Math.PI / 2, Math.PI * 1.5, { w: 6, color: 'yellow' }), 1.55, 1.95);
at(poly([R(-92, -170), R(-190, -10), R(-190, 40), R(-95, -20)], { w: 6 }), 1.95, 2.3);
at(poly([R(92, -170), R(190, -10), R(190, 40), R(95, -20)], { w: 6 }), 2.3, 2.65);
at(curve([R(-55, 10), R(-30, 120), R(0, 190), R(30, 120), R(55, 10)], { w: 7, color: 'orange' }), 2.65, 3.05);
at(zigzagish(), 3.05, 3.3);
function zigzagish() { return curve([R(-25, 20), R(0, 110), R(25, 20)], { w: 5, color: 'yellow' }); }
// dashed trajectory (each dash is its own short stroke, written one after another)
const path = t => [cx + 150 + Math.pow(t, 1.4) * 290, base - 700 - t * 330];
for (let i = 0; i < 9; i++) { const a = i / 9, b = a + .065, t0 = 3.3 + i * .12; at(line(...path(a), ...path(b), { w: 5 }), t0, t0 + .1); }
{ const p = path(.98), q = path(.9); at(head(...p, Math.atan2(p[1] - q[1], p[0] - q[0]), 34, { w: 5 }), 4.4, 4.55); }
// small rocket at the top + stars
const sx = 860, sy = 330;
at(curve([[sx - 34, sy + 70], [sx - 36, sy - 10], [sx, sy - 80], [sx + 36, sy - 10], [sx + 34, sy + 70]], { w: 5 }), 4.6, 5.05);
at(line(sx - 34, sy + 70, sx + 34, sy + 70, { w: 5 }), 5.05, 5.15);
at(curve([[sx - 18, sy + 78], [sx, sy + 140], [sx + 18, sy + 78]], { w: 5, color: 'orange' }), 5.15, 5.35);
[[640, 260], [960, 560], [560, 520], [760, 150]].forEach(([x, y], i) => {
  at(line(x - 16, y, x + 16, y, { w: 4, color: 'yellow' }), 5.35 + i * .1, 5.42 + i * .1);
  at(line(x, y - 16, x, y + 16, { w: 4, color: 'yellow' }), 5.42 + i * .1, 5.5 + i * .1);
});

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(board, 0, 0);
  for (const st of S) drawStroke(ctx, st, t);
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
