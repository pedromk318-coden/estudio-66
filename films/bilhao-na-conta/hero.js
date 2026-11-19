// Personagem: pessoa de pijama (pixel art, 3/4 voltada para a direita). Mesmo formato de atlas do chars.js.
import * as THREE from 'three';
import { ramp, hex, billboard, blob } from './px.js';
import { atlas, FW, FH, SPX } from './chars.js';

const R = {
  skin: ramp(['#b87a62', '#dea282', '#f3c9a6', '#ffe2c8'], .22),
  hair: ramp(['#1e120e', '#3a2216', '#5a3822', '#7a5030'], .22),
  pj: ramp(['#1f3a6e', '#2f5aa0', '#5b88cf', '#a9c7f2'], .22),
  pant: ramp(['#16284e', '#233f73', '#35599a', '#4f78bc'], .22),
  slip: ramp(['#3a1f2a', '#6a3a4a', '#9a5a6a'], .22),
  blk: ramp(['#1e4a4a', '#2f6e6a', '#4a9a8e', '#7fd0b8'], .22),
  pillow: ramp(['#9a94a8', '#c4bfd0', '#e8e4f0', '#ffffff'], .22),
  phone: ramp(['#0b1a2a', '#2a7ad0', '#7fd0ff', '#ffffff'], .22),
};
const INK = hex('#1a1016');

function head(P, hx, hy, o = {}) {
  P.ellipse(hx - 1, hy - .5, 6.8, 7, (x, y, dx, dy) => R.hair(.55 - dy * .2 + dx * .05, x, y));
  const fx = hx + 2, fy = hy + 1;
  P.ellipse(fx, fy, 4.7, 5, (x, y, dx, dy) => R.skin(.62 - dx * .1 - dy * .25, x, y));
  for (let x = Math.floor(fx - 5); x <= fx + 4; x++) { const d = 2 + ((x * 7) % 3 === 0 ? 1 : 0); for (let y = Math.floor(fy - 5.5); y < fy - 5.5 + d + 1; y++) P.set(x, y, R.hair(.5 + (x - fx) * .04, x, y)); }
  const ey = Math.round(fy), ex1 = Math.round(fx + 2), ex2 = Math.round(fx - 1);
  if (o.closed) { for (const x of [ex1, ex1 - 1, ex2, ex2 - 1]) P.set(x, ey, INK); }
  else if (o.blink) { P.set(ex1, ey, R.skin(.2, 0, 0)); P.set(ex2, ey, R.skin(.2, 0, 0)); }
  else { for (const x of [ex1, ex2]) { P.set(x, ey, INK); P.set(x, ey - 1, INK); } }
  if (o.open) P.rect(Math.round(fx + 1), ey + 3, 2, 2, hex('#6a2030')); else P.set(Math.round(fx + 1), ey + 3, R.skin(.25, 0, 0));
  P.set(Math.round(fx + 4), ey + 1, R.skin(.4, 0, 0));
  P.set(Math.round(fx + 3), ey + 2, hex('#e8907a')); P.set(Math.round(fx - 2), ey + 2, hex('#e8907a'));
}
function shirt(P, top, bot) {
  P.poly([[10, top], [22, top], [24, bot], [9, bot]], (x, y) => { const s = (x - 9) / 15; let v = .62 - s * .4; if (((y - top) >> 1) % 2 === 0) v += .14; return R.pj(v, x, y); });
}
function sleeve(P, pts) { pts.forEach(([x, y]) => { P.set(x, y, R.pj(.7, x, y)); P.set(x, y + 1, R.pj(.4, x, y)); }); }
function phone(P, E, x, y) {
  P.rect(x, y, 3, 6, R.phone(.08, 0, 0));
  for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) { const c = R.phone(.55 + (i + j) * .08, x + i, y + j); P.set(x + i, y + j, c); E.set(x + i, y + j, c); }
}
function arms(P, E, top, arm) {
  if (arm === 'phone') { sleeve(P, [[21, top + 2], [22, top + 3], [24, top + 3], [25, top + 2], [26, top]]); P.rect(26, top - 2, 2, 2, R.skin(.6, 0, 0)); phone(P, E, 27, top - 6); }
  else if (arm === 'cheer') { sleeve(P, [[21, top + 1], [22, top - 2], [23, top - 5], [23, top - 8]]); P.rect(22, top - 11, 3, 3, R.skin(.6, 0, 0)); sleeve(P, [[11, top + 1], [10, top - 2], [9, top - 5]]); P.rect(7, top - 9, 3, 3, R.skin(.5, 0, 0)); }
  else { sleeve(P, [[21, top + 2], [22, top + 4], [22, top + 6], [22, top + 8], [22, top + 10]]); P.rect(21, top + 12, 3, 2, R.skin(.55, 0, 0)); }
}

function drawHero(P, E, p) {
  const by = p.bob || 0, pose = p.pose || 'stand', arm = p.arm || 'low';
  if (pose === 'sleep') {   // cabeça no travesseiro, cobertor até o ombro
    for (let y = 40; y < 46; y++) for (let x = 1; x < 17; x++) P.set(x, y, R.pillow(.75 - (y - 40) * .08, x, y));
    head(P, 9, 38 + by, { closed: 1 });
    P.poly([[14, 40 - by], [34, 38 - by], [34, 49], [14, 49]], (x, y) => { let v = .6 - (x - 14) * .01; if (((x + y) >> 2) % 2 === 0) v += .15; return R.blk(v, x, y); });
    return;
  }
  if (pose === 'sit') {     // sentado na cama, cobertor no colo
    const top = 21 + by; head(P, 16, 14 + by, p);
    shirt(P, top, 44); arms(P, E, top, arm);
    P.poly([[2, 40], [34, 38], [34, 49], [2, 49]], (x, y) => { let v = .62; if (((x + y) >> 2) % 2 === 0) v += .15; if (y < 42) v += .12; return R.blk(v, x, y); });
    return;
  }
  const top = 19 + by, st = p.step ?? -1;
  const legs = st < 0 ? [[13, 0], [18, 0]] : [[[11, 0], [20, -1]], [[14, -1], [17, 0]], [[20, -1], [11, 0]], [[17, 0], [14, -1]]][st];
  legs.forEach(([lx, ly], i) => { for (let y = 38; y < 46 + ly; y++) for (let x = lx; x < lx + 4; x++) P.set(x, y, R.pant((i ? .55 : .85) - (x === lx ? .25 : 0), x, y)); P.rect(lx - 1, 46 + ly, 6, 2, R.slip(i ? .4 : .8, 0, 0)); });
  P.poly([[10, 36], [23, 36], [24, 41], [9, 41]], (x, y) => R.pant(.7 - (x - 9) * .02, x, y));
  head(P, 16, 11 + by, p); shirt(P, top, 38); arms(P, E, top, arm);
}

const T = {
  stand: { pose: 'stand' }, stand1: { pose: 'stand', bob: 1 }, blink: { pose: 'stand', blink: 1 },
  w0: { pose: 'stand', step: 0 }, w1: { pose: 'stand', step: 1, bob: -1 }, w2: { pose: 'stand', step: 2 }, w3: { pose: 'stand', step: 3, bob: -1 },
  phone: { pose: 'stand', arm: 'phone' }, phone1: { pose: 'stand', arm: 'phone', bob: 1 },
  cheer: { pose: 'stand', arm: 'cheer', open: 1 }, cheer1: { pose: 'stand', arm: 'cheer', open: 1, bob: -1 },
  sleep: { pose: 'sleep' }, sleep1: { pose: 'sleep', bob: 1 },
  sit: { pose: 'sit' }, sitPhone: { pose: 'sit', arm: 'phone' }, sitPhone1: { pose: 'sit', arm: 'phone', bob: 1 }, sitShock: { pose: 'sit', arm: 'phone', open: 1 },
};

export function makeHero() {
  const A = atlas(T, drawHero);
  const mesh = billboard(A.tex, FW * SPX, FH * SPX, { em: A.em, emCol: '#ffffff', emI: 2.2 });
  const root = new THREE.Group(); root.add(mesh); root.userData.char = 'hero';
  const sh = blob(.42, .55); sh.position.y = .015; root.add(sh);
  return {
    root, mesh, atlas: A, shadowBlob: sh,
    frame(name) { const i = A.names.indexOf(name); if (i < 0) throw new Error('frame ' + name); A.tex.offset.x = A.em.offset.x = i / A.n; },
    face(cam, flip = false) { root.rotation.y = Math.atan2(cam.position.x - root.position.x, cam.position.z - root.position.z); mesh.scale.x = flip ? -1 : 1; },
    // posição do celular na mão (aprox.), em metros no mundo
    phonePos(sit = false) { const v = new THREE.Vector3((28.5 - FW / 2) * SPX, (FH - (sit ? 20 : 17)) * SPX, .1); v.applyAxisAngle(new THREE.Vector3(0, 1, 0), root.rotation.y); return v.add(root.position); },
  };
}
