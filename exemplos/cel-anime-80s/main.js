import { W, H, TAU, canvas, cel, airbrush, vgrad, rng, rgba } from './cel.js';
import { flare, trail } from './fx.js';
import { makePost } from './post.js';

const DUR = 6;
const [sc, g] = canvas(W, H), [gc, e] = canvas(W, H);
const post = makePost(document.getElementById('gl'));
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ss = x => x * x * (3 - 2 * x);

// ---- background painting + its emissive plate, painted once (slides only) ----
const [bg, b] = canvas(W, H * 1.6), [be, bE] = canvas(W, H * 1.6), BH = H * 1.6;
vgrad(b, 0, 0, W, BH, [[0, '#0b0726'], [.45, '#2a1450'], [.72, '#a43a6e'], [.86, '#f08a5a'], [1, '#2b1240']]);
airbrush(b, 300, BH * .55, 420, 90, '#c25a8e', .35); airbrush(b, 820, BH * .62, 360, 70, '#ffb38a', .25);
const R = rng(9);
for (let i = 0; i < 120; i++) { b.fillStyle = rgba('#ffffff', .3 + R() * .6); b.fillRect(R() * W, R() * BH * .5, 2, 2); }
for (let L = 0; L < 2; L++) for (let i = 0; i < 14; i++) {
  const bw = 70 + R() * 120, bh = (L ? 500 : 300) + R() * (L ? 700 : 400), x = i * 82 - 40 + R() * 30, y = BH - bh;
  b.fillStyle = L ? '#140a2a' : '#2a1846'; b.fillRect(x, y, bw, bh);
  for (let k = 0; k < bh / 22; k++) for (let j = 0; j < bw / 18; j++) if (R() < .32) {
    const col = R() < .6 ? '#ffd27a' : R() < .5 ? '#7af0ff' : '#ff6fb0';
    b.fillStyle = col; b.fillRect(x + 6 + j * 18, y + 10 + k * 22, 9, 12); bE.fillStyle = col; bE.fillRect(x + 6 + j * 18, y + 10 + k * 22, 9, 12);
  }
}

// ---- the rocket as a cel: flat fill, hard shadow and highlight crescents, coloured outline, neon rim ----
const tr = (pts, x, y, s) => pts.map(([a, c]) => [x + a * s, y + c * s]);
const BODY = [[0, -300], [72, -220], [108, -90], [112, 60], [104, 150], [-104, 150], [-112, 60], [-108, -90], [-72, -220]];
const FIN = [[-100, 30], [-200, 180], [-200, 236], [-102, 150]];
function rocket(x, y, t) {
  const L = '#3a1f5c';
  for (const s of [1, -1]) cel(g, tr(FIN.map(([a, c]) => [a * s, c]), x, y, 1), { f: '#e23a5c', s: '#9c1f45', so: [10 * s, -6], l: '#6a1030', lw: 4 });
  cel(g, tr(BODY, x, y, 1), { f: '#ece6f4', s: '#9a8cc4', so: [-26, -4], h: '#ffffff', ho: [14, 6], rim: { c: '#7af0ff', d: [-8, 0] }, l: L, lw: 4.5 });
  cel(g, tr([[-108, -120], [108, -120], [110, -88], [-110, -88]], x, y, 1), { f: '#e23a5c', s: '#9c1f45', so: [-14, 0], l: L, lw: 3 });
  g.fillStyle = '#5ff2ff'; g.beginPath(); g.arc(x, y - 30, 44, 0, TAU); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x - 14, y - 44, 12, 0, TAU); g.fill();
  g.strokeStyle = L; g.lineWidth = 4.5; g.beginPath(); g.arc(x, y - 30, 44, 0, TAU); g.stroke();
  // black stamp on the emissive plate so the glow never bleeds through the cel
  e.save(); e.globalCompositeOperation = 'destination-out'; e.fill(new Path2D(`M${tr(BODY, x, y, 1).map(p => p.join(',')).join('L')}Z`)); e.restore();
}

function render(t) {
  const td = Math.floor(t * 12) / 12;                       // cels step at 12 fps; the background slides smoothly
  const lift = Math.pow(seg(t, 1.4, 5.8), 1.6);
  const pan = ss(seg(t, 1.6, 6)) * (BH - H);
  g.setTransform(1, 0, 0, 1, 0, 0); e.setTransform(1, 0, 0, 1, 0, 0); e.clearRect(0, 0, W, H);
  g.drawImage(bg, 0, -(BH - H) + pan); e.drawImage(be, 0, -(BH - H) + pan);
  const x = W / 2 + Math.sin(td * 9) * 4 * (1 - lift), y = 1480 - lift * 1500;
  const fl = 220 + 60 * Math.sin(td * 40);
  // flame and trail live on the emissive plate (light through the frame)
  trail(g, e, [[x, y + 160], [x + 6, y + 160 + fl * .5], [x - 4, y + 160 + fl]], '#ffcf6b', 26);
  e.fillStyle = '#ffd27a'; e.beginPath(); e.moveTo(x - 60, y + 152); e.lineTo(x, y + 152 + fl); e.lineTo(x + 60, y + 152); e.fill();
  g.fillStyle = '#ffe9b0'; g.beginPath(); g.moveTo(x - 40, y + 152); g.lineTo(x, y + 152 + fl * .7); g.lineTo(x + 40, y + 152); g.fill();
  if (t > 1.3) flare(e, x, y + 300, .45 + .1 * Math.sin(td * 30), "#ffb347", {});
  rocket(x, y, td);
  post.render(sc, gc, Math.round(t * 24));
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
