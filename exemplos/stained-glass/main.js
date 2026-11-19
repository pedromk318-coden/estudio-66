import { COL, Pass, poly, circle, voronoi, seedsIn, softPoly } from './glass.js';

const W = 1080, H = 1920, DUR = 6, TAU = Math.PI * 2;
const ctx = document.getElementById('c').getContext('2d');
const mkc = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const G = mkc(), S = mkc(), L = mkc(), g = G.getContext('2d'), s = S.getContext('2d'), l = L.getContext('2d');
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ss = x => x * x * (3 - 2 * x);
const rng = seed => () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// window opening: a tall pointed arch
const X0 = 150, X1 = 930, Y0 = 260, Y1 = 1500;
const arch = new Path2D(); arch.moveTo(X0, Y1); arch.lineTo(X0, Y0 + 390); arch.quadraticCurveTo(X0, Y0, (X0 + X1) / 2, Y0 - 60); arch.quadraticCurveTo(X1, Y0, X1, Y0 + 390); arch.lineTo(X1, Y1); arch.closePath();
const cells = voronoi(seedsIn([X0, Y0 - 80, X1, Y1], 70, rng(4)), [X0, Y0 - 80, X1, Y1]);

// stone wall, baked once
const wall = mkc(); { const w = wall.getContext('2d'), r = rng(9); w.fillStyle = '#4c4740'; w.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 110) for (let x = (y / 110 % 2) * -90; x < W; x += 180) { const v = 60 + r() * 22 | 0; w.fillStyle = `rgb(${v + 8},${v + 4},${v})`; w.fillRect(x + 4, y + 4, 172, 102); }
  w.fillStyle = '#2b2824'; w.save(); w.translate(0, 0); w.lineWidth = 60; w.strokeStyle = '#3a3631'; w.stroke(arch); w.restore();
  w.fillStyle = '#5a554d'; w.fillRect(0, 1560, W, H - 1560); for (let x = 0; x < W; x += 180) { w.fillStyle = 'rgba(0,0,0,.25)'; w.fillRect(x, 1560, 3, H); } }

function glass(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); s.setTransform(1, 0, 0, 1, 0, 0); s.clearRect(0, 0, W, H);
  g.save(); s.save(); g.clip(arch); s.clip(arch);
  const P = new Pass(g, s, 'full'); P.id = 0;
  const sky = [COL.cobalt, COL.deepblue, COL.blue2, COL.sky];
  // the rocket moves rigidly, in steps (4 positions per second), as a leaded figure would
  const step = Math.floor(seg(t, 1.6, 5.8) * 16) / 16, ry = 1180 - ss(step) * 760, cx = 540;
  const body = [[cx, ry - 330], [cx + 80, ry - 230], [cx + 105, ry - 80], [cx + 105, ry + 120], [cx - 105, ry + 120], [cx - 105, ry - 80], [cx - 80, ry - 230]];
  const bp = poly(body);
  cells.forEach((c, i) => { const p = softPoly(c.pts, .12); g.save(); s.save(); P.save(); P.piece(p, sky[i % 4], { id: i, lead: 7 }); P.restore(); g.restore(); s.restore(); });
  // stars and a crescent moon in gold
  [[300, 520], [780, 640], [260, 980], [820, 1120], [430, 420]].forEach(([x, y], i) => P.piece(circle(x, y, 18), COL.gold2, { id: 200 + i, lead: 5 }));
  P.piece(circle(720, 430, 70), COL.gold, { id: 210, lead: 7 });
  // rocket pieces (nose, body bands, fins, porthole, flame) cut over the sky
  P.piece(poly([body[0], body[1], body[6]]), COL.ruby, { id: 300, lead: 8 });
  P.piece(poly([body[6], body[1], body[2], body[5]]), COL.white, { id: 301, lead: 8 });
  P.piece(poly([body[5], body[2], body[3], body[4]]), COL.steel, { id: 302, lead: 8 });
  for (const k of [-1, 1]) P.piece(poly([[cx + k * 100, ry - 20], [cx + k * 210, ry + 140], [cx + k * 210, ry + 200], [cx + k * 100, ry + 120]]), COL.ruby2, { id: 310 + k, lead: 8 });
  P.piece(circle(cx, ry - 40, 42), COL.teal, { id: 320, lead: 8 });
  const fl = Math.floor(t * 6) % 2 ? 40 : 0;
  P.piece(poly([[cx - 70, ry + 122], [cx + 70, ry + 122], [cx, ry + 330 + fl]]), COL.amber, { id: 330, lead: 8 });
  P.piece(poly([[cx - 34, ry + 122], [cx + 34, ry + 122], [cx, ry + 240 + fl]]), COL.gold2, { id: 331, lead: 6 });
  g.restore(); s.restore();
  // saddle bars of iron across the window
  s.fillStyle = '#16171a'; [620, 980, 1340].forEach(y => s.fillRect(X0 - 20, y, X1 - X0 + 40, 12));
}

function render(t) {
  glass(t);
  const sun = .12 + .88 * ss(seg(t, 0, 2.2));            // glass is dark and milky until the sun comes up behind it
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(wall, 0, 0);
  // backlight: warm sun disc low behind the window, rising
  l.setTransform(1, 0, 0, 1, 0, 0); l.clearRect(0, 0, W, H); const sy = 1500 - 700 * ss(seg(t, 0, 6));
  const gr = l.createRadialGradient(540, sy, 50, 540, sy, 1100); gr.addColorStop(0, `rgba(255,248,230,${sun})`); gr.addColorStop(1, `rgba(120,120,130,${sun * .55})`);
  l.fillStyle = "#000"; l.fillRect(0, 0, W, H); l.fillStyle = gr; l.fillRect(0, 0, W, H); l.globalCompositeOperation = 'multiply'; l.drawImage(G, 0, 0); l.globalCompositeOperation = 'destination-in'; l.drawImage(G, 0, 0); l.globalCompositeOperation = 'source-over';
  ctx.drawImage(L, 0, 0);
  // irradiation: bright glass eats into the lead
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)'; ctx.globalAlpha = .55 * sun; ctx.drawImage(L, 0, 0); ctx.restore();
  ctx.drawImage(S, 0, 0);
  // coloured copy thrown onto the stone floor + light shaft with dust
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .35 * sun; ctx.filter = 'blur(26px)';
  ctx.setTransform(1, 0, 0, -.25, 0, 1560 + 1500 * .25 + 40); ctx.drawImage(L, 0, 0); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const sh = ctx.createLinearGradient(0, 400, 0, H); sh.addColorStop(0, `rgba(255,230,190,${.035 * sun})`); sh.addColorStop(1, 'rgba(255,230,190,0)');
  ctx.fillStyle = sh; ctx.beginPath(); ctx.moveTo(X0, 400); ctx.lineTo(X1, 400); ctx.lineTo(W + 200, H); ctx.lineTo(-200, H); ctx.fill(); ctx.restore();
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
