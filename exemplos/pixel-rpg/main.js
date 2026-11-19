import { W, H, C, T, FB, LUT, sprFromRows, makeOut, bayer, hash } from './px.js';
import { win } from './ui.js';
import { text, textW } from './font.js';

const DUR = 6, cv = document.getElementById('c'), fb = new FB(), out = makeOut(cv);
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ss = x => x * x * (3 - 2 * x);

// rocket sprite, 3-tone shading from the upper left + 1-px ink outline
const ROCKET = sprFromRows([
  '.....kk.....', '....kwwk....', '...kwwwsk...', '...kwwwsk...', '..krrrrrrk..', '..kwwwwwsk..', '..kwbbbbsk..',
  '..kwbccbsk..', '..kwbbbbsk..', '..kwwwwwsk..', '..kwwwwwsk..', '..krrrrrrk..', '.krkwwwwskrk.', 'krrkwwwwskrrk',
  'krrkkkkkkkrrk', 'kk..kggk..kk', '....kggk....'],
  { k: C.ink, w: C.white, s: C.silver, r: C.red, b: C.navy, c: C.cyan, g: C.steel });
const FL = [['.oyyo.', 'oyyyyo', '.oyyo.', '..oo..', '..o...'], ['.oyyo.', '.oyyo.', 'oyyyyo', '.oyo..', '..oo..', '...o..']]
  .map(r => sprFromRows(r, { o: C.orange, y: C.yellow }));
const SMOKE = sprFromRows(['.sss.', 'sswss', 'swwws', 'sswss', '.sss.'], { s: C.silver, w: C.white });

function scene(t) {
  fb.clear(C.night);
  fb.gradV(0, 0, W, 230, [C.ink, C.night, C.navy, C.blue, C.teal]);            // ordered-dither sky
  for (let i = 0; i < 45; i++) { const x = hash(i, 1) * W | 0, y = hash(i, 2) * 200 | 0; if ((Math.floor(t * 6) + i) % 7) fb.px(x, y, i % 5 ? C.white : C.yellow); }
  const cam = 0;                                 // camera follows the rocket up, integer pixels
  const gy = 262 + cam;
  for (let x = 0; x < W; x++) { const h = 8 + Math.round(6 * Math.sin(x * .07) + 3 * Math.sin(x * .19)); fb.vline(x, gy - h + Math.round(cam * .3) - 10, gy, C.dslate); } // far hills, slower parallax
  fb.rect(0, gy, W, H - gy, C.green); fb.dither(0, gy, W, 6, () => .5, C.green, C.lime); fb.rect(0, gy + 6, W, H, C.dgreen);
  fb.rect(54, gy - 70, 6, 70, C.slate); for (let y = gy - 70; y < gy; y += 8) fb.line(54, y, 60, y + 8, C.steel);       // launch tower
  const climb = Math.pow(seg(t, 2.6, 5.6), 1.8) * 330, shake = t > 1.8 && t < 2.6 ? (Math.floor(t * 16) % 2) : 0;
  const rx = 78 + shake, ry = Math.round(gy - 34 - climb);
  if (t > 2.0) for (let i = 0; i < 10; i++) { const k = (t * 1.6 + i * .1) % 1; if (t < 2.6 && k > .5) continue; fb.blit(SMOKE, Math.round(rx + 10 + (i % 2 ? 1 : -1) * k * 44), Math.round(gy - 4 + k * 6)); }
  if (t > 1.8) fb.blit(X2(FL[Math.floor(t * 8) % 2]), rx + 6, ry + 34);
  fb.blit(X2(ROCKET), rx, ry);
  // dialog window at the top, typed letter by letter
  win(fb, 6, 8, 168, 44);
  const L1 = 'FOGUETE usou', L2 = 'DECOLAR!', n = Math.floor(seg(t, .3, 1.6) * (L1.length + L2.length));
  text(fb, L1.slice(0, n), 14, 16, C.white, C.ink); text(fb, L2.slice(0, Math.max(0, n - L1.length)), 14, 30, C.yellow, C.ink);
  if (t > 4.6) { const s = 'LEVEL UP!', w = textW(s); win(fb, (W - w) / 2 - 8, 150, w + 16, 22); if (Math.floor(t * 6) % 2 || t > 5.4) text(fb, s, (W - w) / 2, 157, C.amber, C.ink); }
}

function render(t) {
  scene(t);
  // colour-depth climb: 4-colour handheld → 8-bit → 16-bit as the engine ignites
  const lut = t < .9 ? LUT.gb4 : t < 1.8 ? LUT.nes : LUT.full;
  if (t > .75 && t < .9 || t > 1.65 && t < 1.8) { const nxt = t < 1 ? LUT.nes : LUT.full, f = t < 1 ? seg(t, .75, .9) : seg(t, 1.65, 1.8); out.present(fb, lut, nxt, (x, y) => bayer(x, y) < f); }
  else out.present(fb, lut);
  out.show();
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
function X2(s) { if (s.x2) return s.x2; const d = new Uint8Array(s.w * s.h * 4); for (let y = 0; y < s.h * 2; y++) for (let x = 0; x < s.w * 2; x++) d[y * s.w * 2 + x] = s.d[(y >> 1) * s.w + (x >> 1)]; return s.x2 = { w: s.w * 2, h: s.h * 2, d }; }
