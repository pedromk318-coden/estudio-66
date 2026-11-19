import { W, H, inkC, fxC, ovC, setCam, clear, nibs, line, text, dim, balloon, hatch, knock, fxShadow, LW, rect, circ, cam } from './draw.js';
import { makePaper } from './paper.js';

const DUR = 6, SW = 1700, SH = 2900;
const comp = makePaper(document.getElementById('c'), W, H);
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ss = x => x * x * (3 - 2 * x);

// rocket drawn in sheet units; nose at (cx, ny)
const cx = 850, base = 1900, ny = 900;
const half = y => y >= base - 600 ? 150 : 150 * Math.sqrt(Math.max(0, (y - ny) / 400));
const BODY = (() => { const L = [], R = []; for (let y = ny; y <= base; y += 20) { L.push([cx - half(y), y]); R.unshift([cx + half(y), y]); } return [...L, ...R]; })();
const FINL = [[cx - 148, base - 230], [cx - 300, base + 10], [cx - 300, base + 80], [cx - 150, base]];
const FINR = FINL.map(([x, y]) => [2 * cx - x, y]);
const NOZ = [[cx - 80, base], [cx + 80, base], [cx + 110, base + 110], [cx - 110, base + 110]];
const off = (P, dy) => P.map(([x, y]) => [x, y + dy]);

function render(t) {
  const z = .6 + .08 * ss(seg(t, 0, 6));
  setCam({ x: SW / 2, y: SH / 2 - 40 * ss(seg(t, 0, 6)), z, r: 0 });
  clear();
  // sheet furniture: border, title block, notes column
  const u0 = ss(seg(t, 0, .7));
  line(rect(70, 70, SW - 70, SH - 70), { w: LW.out, u: u0, closed: true });
  line(rect(90, 90, SW - 90, SH - 90), { w: LW.hair, u: u0, closed: true });
  line(rect(1000, 2480, SW - 90, SH - 90), { w: LW.det, u: ss(seg(t, .3, .9)), closed: true });
  [2580, 2680].forEach(y => line([[1000, y], [SW - 90, y]], { w: LW.thin, u: ss(seg(t, .5, 1)) }));
  const tu = ss(seg(t, .6, 1.2));
  text('PROJ. FOGUETE N.º 07', 1030, 2550, { size: 46, u: tu }); text('ESCALA 1:20   FOLHA 1/1', 1030, 2650, { size: 34, u: tu }); text('ESTÚDIO 66', 1030, 2760, { size: 52, u: tu });
  // the one real thing: at the end the rocket leaves the paper (shadow proves it), drawing stays as a pale imprint
  const lift = ss(seg(t, 4.3, 6)), dy = -lift * 900;
  // centre line (long-short dash) and outline, drawn by the pen in order
  line([[cx, ny - 120], [cx, base + 200]], { w: LW.hair, u: ss(seg(t, .8, 1.4)), dash: [40, 10, 8, 10] });
  if (lift > 0) { fxShadow(off(BODY, dy + 60), .5 * lift, 30); line(BODY, { w: LW.hair, closed: true }); }
  knock(off(BODY, dy));
  line(off(BODY, dy), { w: LW.out, u: ss(seg(t, 1.0, 2.2)), closed: true });
  for (const F of [FINL, FINR]) { knock(off(F, dy)); line(off(F, dy), { w: LW.out, u: ss(seg(t, 2.0, 2.6)), closed: true }); hatch(off(F, dy), { sp: 14, u: ss(seg(t, 2.5, 3.0)) }); }
  line(off(NOZ, dy), { w: LW.det, u: ss(seg(t, 2.4, 2.8)), closed: true });
  line(off(circ(cx, 1500, 60), dy), { w: LW.det, u: ss(seg(t, 2.6, 3.0)) });
  line(off([[cx - 150, 1260], [cx + 150, 1260]], dy), { w: LW.det, u: ss(seg(t, 2.6, 3.0)) });
  // dimensions and numbered balloons
  dim([cx + 360, ny], [cx + 360, base + 110], 0, '4 500', { u: ss(seg(t, 3.0, 3.6)) });
  dim([cx - 300, base + 260], [cx + 300, base + 260], 0, '1 200', { u: ss(seg(t, 3.2, 3.8)) });
  balloon([cx - 40, 1500 + dy], [cx - 420, 1300], 1, { u: ss(seg(t, 3.6, 4.0)) });
  balloon([cx - 230, base + 30 + dy], [cx - 520, base - 300], 2, { u: ss(seg(t, 3.8, 4.2)) });
  nibs();
  comp(inkC, fxC, ovC, { sheet: [SW, SH], cam, seed: 3, desk: 1 });
}
window.render = render; window.DUR = DUR;
document.fonts.ready.then(() => { render(0); window.READY = true; });
