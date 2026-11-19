import { clamp, seg, ss, eio } from '/core/lib.js';
import { W, H, FR, PAL, TX, mk, buildTextures, inkify, stampFn, bokashi, kasumi, carve, line, fillPath, poly, printTex, drawSeal, vtext } from './print.js';

const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const DUR = 6;
buildTextures();

// rocket outline (local coords, nose at 0,-300)
const BODY = [[0,-300],[70,-230],[105,-110],[112,40],[108,150],[-108,150],[-112,40],[-105,-110],[-70,-230]];
const FINL = [[-104,40],[-200,190],[-196,236],[-104,150]];
const FINR = FINL.map(([a,b]) => [-a,b]);
const tr = (p, ox, oy, s) => p.map(([a,b]) => [ox + a*s, oy + b*s]);

// static sky + sea blocks, cached once
const sky = mk(), sx = sky.getContext('2d');
bokashi(sx, 0, 40, W, 900, PAL.prus, 1, 0, { rough: 26, seed: 5 });
bokashi(sx, 0, 1150, W, 1400, PAL.beniP, 0, .55, { rough: 20, seed: 8 });
inkify(sky, { speck: .5, grain: .25, baren: .5 });

function sea(x, t) {
  const bands = [[1480, PAL.prusL], [1580, PAL.prus], [1700, PAL.prusD]];
  bands.forEach(([y0, col], i) => {
    const pts = [[0, H]]; for (let k = 0; k <= 12; k++) pts.push([k * 90, y0 + Math.sin(k * 1.1 + t * (1.2 + i * .4) + i) * 22]);
    pts.push([W, H]); fillPath(x, pts, col);
    for (let k = 0; k < 7; k++) { const cx = ((k * 170 + t * 40 * (i + 1)) % (W + 200)) - 100, cy = y0 + Math.sin(k + t) * 16;
      line(x, [[cx - 50, cy + 10], [cx - 20, cy - 18], [cx + 18, cy - 20], [cx + 40, cy - 4]], 3, PAL.white); }
  });
}

function rocket(x, cx, cy, t) {
  fillPath(x, tr(BODY, cx, cy, 1), PAL.paper);
  x.fillStyle = PAL.beni; x.beginPath(); poly(x, tr(FINL, cx, cy, 1)); poly(x, tr(FINR, cx, cy, 1)); x.fill();
  x.fillStyle = PAL.ai; x.beginPath(); x.arc(cx, cy - 40, 44, 0, 7); x.fill();
  fillPath(x, tr([[-104,-130],[104,-130],[106,-96],[-106,-96]], cx, cy, 1), PAL.beni);
  const fl = 230 + 40 * Math.sin(t * 31) + 25 * Math.sin(t * 17);
  fillPath(x, [[cx - 62, cy + 152], [cx - 34, cy + 152 + fl * .6], [cx, cy + 152 + fl], [cx + 34, cy + 152 + fl * .6], [cx + 62, cy + 152]], PAL.ochre);
  fillPath(x, [[cx - 30, cy + 152], [cx, cy + 152 + fl * .6], [cx + 30, cy + 152]], PAL.ochreL);
}
function rocketKey(x, cx, cy) {
  carve(x, tr(BODY, cx, cy, 1), 3.2, { closed: true, seed: 2, col: PAL.sumi });
  x.strokeStyle = PAL.sumi; x.lineWidth = 5; x.lineJoin = "round"; x.beginPath(); poly(x, tr(FINL, cx, cy, 1)); poly(x, tr(FINR, cx, cy, 1)); x.stroke();
  x.strokeStyle = PAL.sumi; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy - 40, 44, 0, 7); x.stroke();
}
// curled clouds of exhaust (the medium's way of drawing smoke)
function puffs(x, cx, cy, t) {
  for (let i = 0; i < 9; i++) {
    const age = clamp((t - 1.3 - i * .32) / 3); if (age <= 0) continue;
    const px = cx + (i % 2 ? 1 : -1) * (40 + age * 170) , py = 1460 - i * 18 + age * 30, r = 40 + age * 60;
    x.fillStyle = PAL.white; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
    x.strokeStyle = PAL.greyD; x.lineWidth = 2.6; x.beginPath(); x.arc(px, py, r, Math.PI * .9, Math.PI * 2.1); x.stroke();
    x.beginPath(); x.arc(px + r * .25, py - r * .1, r * .45, Math.PI, Math.PI * 1.9); x.stroke();
  }
}

function render(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(TX.paper, 0, 0);
  ctx.save(); ctx.beginPath(); ctx.rect(FR.x0, FR.y0, FR.x1 - FR.x0, FR.y1 - FR.y0); ctx.clip();
  const z = 1 + .04 * eio(t / DUR); ctx.setTransform(z, 0, 0, z, W / 2 * (1 - z), H / 2 * (1 - z));
  const rv = k => ss(seg(t, k * .25, k * .25 + .6));               // blocks print one after another
  stampFn(ctx, x => x.drawImage(sky, 0, 0), rv(0), [6, -4]);
  stampFn(ctx, x => { kasumi(x, 300 + t * 30, 780, 760, 70, PAL.paper, .92); kasumi(x, 760 - t * 22, 1060, 640, 60, PAL.paper, .9); }, rv(1));
  const lift = ss(seg(t, 1.3, 5.6)), cx = W / 2, cy = 1290 - lift * 820 + Math.sin(t * 40) * 3 * (1 - lift);
  puffs(ctx, cx, cy, t);
  stampFn(ctx, x => rocket(x, cx + 2.5, cy - 2, t), rv(2), [-5, 4]);   // colour block, slightly out of register
  stampFn(ctx, x => sea(x, t), rv(2), [4, 5]);
  stampFn(ctx, x => rocketKey(x, cx, cy), rv(3), [0, 0]);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.restore(); printTex(ctx, .1, .45);
  ctx.strokeStyle = PAL.sumi; ctx.lineWidth = 9; ctx.strokeRect(FR.x0, FR.y0, FR.x1 - FR.x0, FR.y1 - FR.y0);
  ctx.lineWidth = 2.5; ctx.strokeRect(FR.x0 + 18, FR.y0 + 18, FR.x1 - FR.x0 - 36, FR.y1 - FR.y0 - 36);
  const c = ss(seg(t, 4.6, 5.4));
  if (c > 0) {
    ctx.globalAlpha = c; ctx.fillStyle = '#f3e7c6'; ctx.fillRect(880, 110, 110, 440); ctx.strokeStyle = PAL.sumi; ctx.lineWidth = 3; ctx.strokeRect(880, 110, 110, 440);
    ctx.fillStyle = PAL.sumi; vtext(ctx, '飛翔の図', 935, 140, 82, 1.12, 'serif', 700);
    ctx.globalAlpha = 1; drawSeal(ctx, '印', 935, 620, 86, c);
  }
}
window.render = render; window.DUR = DUR;
document.fonts.ready.then(() => { render(0); window.READY = true; });
