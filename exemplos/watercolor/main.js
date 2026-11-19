// Watercolor rocket: everything is brush strokes from engine.js (mk / drawS), painted in order
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const DUR = 6;

// paper: warm base, soft noise, short curved fibres, light vignette
const paper = document.createElement('canvas'); paper.width = W; paper.height = H;
withSeed(5, () => { const p = paper.getContext('2d'); p.fillStyle = '#f3ead8'; p.fillRect(0, 0, W, H);
  for (let i = 0; i < 160; i++) { const gx = rnd(0, W), gy = rnd(0, H), g = p.createRadialGradient(gx, gy, 0, gx, gy, rnd(120, 400)); g.addColorStop(0, rnd() < .5 ? 'rgba(255,250,238,.08)' : 'rgba(190,160,120,.04)'); g.addColorStop(1, 'rgba(0,0,0,0)'); p.fillStyle = g; p.fillRect(0, 0, W, H); }
  for (let i = 0; i < 3500; i++) { const x = rnd(0, W), y = rnd(0, H); p.strokeStyle = `rgba(140,110,70,${rnd(.03, .09)})`; p.lineWidth = .8; p.beginPath(); p.moveTo(x, y); p.quadraticCurveTo(x + rnd(-8, 8), y + rnd(-8, 8), x + rnd(-18, 18), y + rnd(-18, 18)); p.stroke(); }
  const v = p.createRadialGradient(W / 2, H / 2, 500, W / 2, H / 2, 1200); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(90,60,30,.18)'); p.fillStyle = v; p.fillRect(0, 0, W, H); });

// ---- strokes, built once under fixed seeds; each has [t0, t1] ----
const S = [], add = (s, t0, t1, layer = 'bg') => { s.t0 = t0; s.t1 = t1; s.layer = layer; S.push(s); };
withSeed(11, () => {
  // sky washes: broad horizontal brush strokes, structure before detail
  for (let i = 0; i < 7; i++) { const y = 260 + i * 120 + rnd(-20, 20); add(mk(qcurve(-60, y, W + 60, y + rnd(-40, 40), rnd(-30, 30), 18), rnd(130, 190), i < 4 ? '#8fb6d4' : '#b9d2df', { prof: 'brush', a: .5 }), i * .06, .5 + i * .06); }
  for (let i = 0; i < 4; i++) { const y = 1600 + i * 70; add(mk(qcurve(-60, y, W + 60, y + rnd(-30, 30), rnd(-20, 20), 16), 120, i < 2 ? '#9cbf7e' : '#6f9a5a', { prof: 'brush', a: .55 }), .4 + i * .08, .9 + i * .08); }
  // rocket body: vertical strokes inside the silhouette, then the shadow side, then the edge stroke
  const cx = 540, by = 1450, wAt = y => y > by - 420 ? 105 : 105 * Math.sqrt(Math.max(0, (y - (by - 600)) / 180));
  for (let i = 0; i < 6; i++) { const x = cx - 80 + i * 32; add(mk(qcurve(x, by, cx + (x - cx) * .25, by - 590, 0, 14), 46, '#ece6dc', { prof: 'even', a: .7 }), .9 + i * .05, 1.4 + i * .05, 'r'); }
  add(mk(qcurve(cx + 70, by - 10, cx + 30, by - 560, -30, 14), 50, '#a9b3c2', { prof: 'tip', a: .55 }), 1.4, 1.8, 'r');
  add(mk(qcurve(cx - 104, by, cx - 6, by - 600, -80, 18), 9, '#4a3b34', { prof: 'even', a: .75 }), 1.6, 2.0, 'r');
  add(mk(qcurve(cx + 104, by, cx + 6, by - 600, 80, 18), 9, '#4a3b34', { prof: 'even', a: .75 }), 1.6, 2.0, 'r');
  add(mk(qcurve(cx - 100, by - 330, cx + 100, by - 330, -8, 10), 40, '#c9473f', { prof: 'brush', a: .8 }), 1.9, 2.15, 'r');
  for (let a = 0; a < 6.3; a += 1.05) add(mk(qcurve(cx + Math.cos(a) * 28, by - 220 + Math.sin(a) * 28, cx + Math.cos(a + 1.3) * 28, by - 220 + Math.sin(a + 1.3) * 28, 8, 6), 30, '#2f6fa8', { prof: 'even', a: .75 }), 2.1 + a * .03, 2.3 + a * .03, 'r');
  for (const s of [-1, 1]) { add(mk(qcurve(cx + s * 100, by - 150, cx + s * 205, by + 40, s * -20, 12), 70, '#d4544b', { prof: 'leaf', a: .8 }), 2.3, 2.6, 'r'); add(mk(qcurve(cx + s * 100, by - 140, cx + s * 205, by + 40, s * -20, 12), 6, '#7a2a24', { prof: 'even', a: .7 }), 2.55, 2.75, 'r'); }
  for (let i = 0; i < 3; i++) add(mk(qcurve(cx - 30 + i * 30, by + 10, cx - 10 + i * 10, by + 210 - Math.abs(i - 1) * 60, 0, 10), 52 - Math.abs(i - 1) * 14, i === 1 ? '#f6c453' : '#ef8a3c', { prof: 'leaf', a: .75 }), 2.7 + i * .06, 3.0 + i * .06, 'r');
  // exhaust clouds left behind on the paper
  for (let i = 0; i < 9; i++) { const sx = cx + rnd(-200, 200), sy = 1560 + rnd(-60, 60); add(mk(qcurve(sx - 90, sy, sx + 90, sy + rnd(-20, 20), rnd(-40, 40), 10), rnd(60, 100), '#d9dde0', { prof: 'brush', a: .55 }), 3.1 + i * .08, 3.5 + i * .08); }
  // annotation in the painter's hand: leader line
  add(mk(qcurve(330, 1290, 470, 1500, 40, 12), 3, '#4a3b34', { prof: 'even', a: .7 }), 4.9, 5.3, 'note');
});

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(paper, 0, 0);
  const lift = Math.pow(seg(t, 3.0, 6), 1.7) * 1150;
  for (const s of S) {
    const p = seg(t, s.t0, s.t1); if (p <= 0) continue;
    if (s.layer === 'r') { ctx.save(); ctx.translate(0, -lift); drawS(ctx, s, p); ctx.restore(); }
    else drawS(ctx, s, p);
  }
  const a = ss(seg(t, 5.0, 5.5));
  if (a > 0) { ctx.globalAlpha = a; ctx.fillStyle = '#4a3b34'; ctx.font = 'italic 54px Georgia, serif'; ctx.fillText('foguete, s.m.', 90, 1200); ctx.font = 'italic 34px Georgia, serif'; ctx.fillText('de fogo + -ete', 90, 1250); ctx.globalAlpha = 1; }
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
