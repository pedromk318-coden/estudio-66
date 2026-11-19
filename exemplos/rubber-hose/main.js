import * as T from './toon.js';
import { P, pieEye, mouth, glove, shoe, hose } from './chars.js';

const W = 1080, H = 1920, DUR = 6, TAU = Math.PI * 2;
const cv = document.getElementById('c'); T.init(cv); const g = T.g;
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ss = x => x * x * (3 - 2 * x);
const rnd = s => { const x = Math.sin(s * 127.1) * 43758.5; return x - Math.floor(x); };

// background painted once: flat wash, soft blotches, clouds with thin outline, ground strip; it never boils
const bg = document.createElement('canvas'); bg.width = W; bg.height = H * 1.5;
{ const b = bg.getContext('2d'); b.fillStyle = P.pale; b.fillRect(0, 0, W, bg.height);
  for (let i = 0; i < 60; i++) { b.fillStyle = `rgba(${rnd(i) < .5 ? '255,255,255' : '120,118,110'},.05)`; b.beginPath(); b.arc(rnd(i + 1) * W, rnd(i + 2) * bg.height, 80 + rnd(i + 3) * 200, 0, TAU); b.fill(); }
  b.lineWidth = 3; b.strokeStyle = P.dmid;
  for (let i = 0; i < 9; i++) { const x = rnd(i + 9) * W, y = 150 + i * 280; b.beginPath(); for (let k = 0; k < 4; k++) { b.moveTo(x + k * 55 - 32, y + (k % 2) * -24); b.arc(x + k * 55 - 80, y + (k % 2) * -24, 48, 0, TAU); } b.lineWidth = 7; b.stroke(); b.fillStyle = P.white; b.fill(); }
  b.fillStyle = P.mid; b.fillRect(0, bg.height - 330, W, 330); b.fillStyle = P.dmid; for (let x = 0; x < W; x += 90) b.fillRect(x, bg.height - 330, 45, 330);
  b.fillStyle = P.ink; b.fillRect(0, bg.height - 334, W, 8); }

function rocket(t) {
  const crouch = ss(seg(t, 1.2, 1.9)) * (1 - ss(seg(t, 2.0, 2.15)));
  const jump = seg(t, 2.0, 6), fly = Math.pow(jump, 1.5) * 2300;
  const sq = 1 - crouch * .25 + (t > 2.0 ? .22 * Math.exp(-(t - 2.0) * 3) * Math.cos((t - 2) * 18) + .1 * (1 - Math.exp(-(t - 2) * 2)) : 0) ;
  const sx = 1 / Math.sqrt(sq), sy = sq;
  const y = 1500 - fly;
  // flame + motion lines first (behind)
  if (t > 2.0) { T.push(); T.translate(540, y + 30); T.scale(1.3); const fl = 160 + 40 * T.wob(t, 6);
    T.shape([[-50, 0], [-20, fl * .6], [0, fl], [20, fl * .6], [50, 0]], { fill: P.white }); T.shape([[-22, 0], [0, fl * .55], [22, 0]], { fill: P.light });
    for (const dx of [-120, 0, 120]) T.stroke([[dx, fl + 40], [dx, fl + 220]], T.S.lw * .7); T.pop(); }
  T.push(); T.translate(540, y); T.scale(1.3); T.scale(sx, sy);
  // feet: big round shoes, only while on the ground
  if (t < 2.1) { shoe(-70, 26, -1, 1.1); shoe(70, 26, 1, 1.1); hose([-50, -10], [-70, 10], 0, 22); hose([50, -10], [70, 10], 0, 22); }
  // rubber-hose arms: one waves, both fling up on launch
  const wave = t < 1.2 ? Math.sin(t * 12) * .5 : 0, up = ss(seg(t, 1.9, 2.3));
  const aL = [-150 - 60 * (1 - up), -260 - 140 * up], aR = [150 + 70 * (1 - up) + 40 * wave, -330 - 120 * up - 80 * (1 - up) * (t < 1.2 ? 1 : 0)];
  hose([-95, -200], aL, 30, 24); hose([95, -200], aR, -30, 24);
  glove(...aL, -2.4 + up * .6, 'open', 1, { flip: true }); glove(...aR, -.7 - up * .6 + wave * .4, 'open', 1);
  // body: fat bullet that squashes and stretches like a balloon; fins as boots of the body
  T.shape(T.spline([[0, -560], [80, -470], [108, -300], [104, -60], [70, 0], [-70, 0], [-104, -60], [-108, -300], [-80, -470]], true), {
    fill: P.white, shade: () => T.shape(T.rect(40, -600, 120, 640), { fill: P.light, stroke: false, boil: 0 }) });
  for (const s of [-1, 1]) T.shape([[s * 100, -150], [s * 190, -20], [s * 180, 20], [s * 96, -30]], { fill: P.ink });
  T.shape(T.rect(-106, -380, 212, 30), { fill: P.dark });
  // face carries the act: wide pie eyes, a grin, then an 'O' when it crouches
  const look = t < 1.2 ? .3 : 0, lid = t > 2.15 && t < 2.6 ? .45 : 0;
  pieEye(-38, -250, 30, 44, { lx: look, ly: -.1, lid }); pieEye(38, -250, 30, 44, { lx: look, ly: -.1, lid });
  mouth(0, -150, 70, crouch > .3 ? 'o' : 'smile', { open: .7 });
  T.pop();
  return y;
}

function damage(t) {   // composite pass: flicker, vertical scratches, dust, hair, strong vignette
  const f = Math.floor(t * 24), r = k => rnd(f * 13.7 + k);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = `rgba(255,250,235,${(r(1) - .5) * .08 + .02})`; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 2; i++) if (r(2 + i) < .7) { g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(r(4 + i) * W, 0, 2, H); }
  for (let i = 0; i < 7; i++) { g.fillStyle = 'rgba(14,13,12,.75)'; g.beginPath(); g.arc(r(10 + i) * W, r(20 + i) * H, 2 + r(30 + i) * 5, 0, TAU); g.fill(); }
  if (r(40) < .15) { g.strokeStyle = 'rgba(14,13,12,.6)'; g.lineWidth = 2; g.beginPath(); const x = r(41) * W, y = r(42) * H; g.moveTo(x, y); g.bezierCurveTo(x + 60, y + 20, x - 40, y + 80, x + 30, y + 140); g.stroke(); }
  const v = g.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 1150); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.7)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
}

function render(t) {
  T.frame(t);
  const wv = (rnd(Math.floor(t * 24)) - .5) * 2.4;          // gate weave
  const pan = Math.pow(seg(t, 2.2, 6), 1.3) * (H * .5);     // the camera follows a little, then lets it go
  g.setTransform(1, 0, 0, 1, wv, 0); g.drawImage(bg, 0, -(H * .5) + pan);
  T.translate(wv, pan * .2); rocket(t);
  damage(t);
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
