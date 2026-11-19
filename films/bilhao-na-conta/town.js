// Cena B/C: a vila acordando (janelas acendendo uma a uma) e o ponto de salvar no final.
import * as THREE from 'three';
import { cobbles, glow, mulberry } from './px.js';
import { mats, mat, mesh, box, house, crate, barrel, ridge } from './kit.js';
import { sky, particles, flick } from './fx.js';
import { makeHero } from './hero.js';
import { T } from './story.js';
import { clamp, seg, ss, lerp, track } from '/core/lib.js';

const HX0 = -10.2, HX1 = 6.4;   // caminhada: de onde sai até onde para

export function buildTown() {
  const scene = new THREE.Scene(), MM = mats();
  scene.fog = new THREE.FogExp2('#7a5a78', .011);
  const SK = sky({ top: '#222a66', mid: '#8a6aa0', hor: '#ffb27a', moonDir: new THREE.Vector3(-.7, .12, -1), moonCol: '#ffd0a0' }); scene.add(SK.mesh);
  const cA = { top: new THREE.Color('#222a66'), mid: new THREE.Color('#8a6aa0'), hor: new THREE.Color('#ffb27a') };
  const cB = { top: new THREE.Color('#34388a'), mid: new THREE.Color('#c27ab0'), hor: new THREE.Color('#ffd08a') };

  const sun = new THREE.DirectionalLight('#ffb27a', 2.0); sun.position.set(-26, 10, -12); sun.target.position.set(0, 0, -3);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 90 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .02;
  scene.add(sun, sun.target, new THREE.HemisphereLight('#8a78b0', '#2a2030', 1.0));

  // Chão de paralelepípedos
  scene.add(mesh(new THREE.BoxGeometry(60, .4, 40).translate(0, -.2, -8), mat(cobbles(96, 96, { seed: 4 }))));
  [[-30, -90, 200, 26, '#4a3a6a', 3], [40, -100, 220, 20, '#3a2c58', 7]].forEach(([x, z, w, h, c, s]) => { const r = ridge(w, h, c, s, { ppm: 1.4 }); r.position.set(x, -.5, z); scene.add(r); });

  // Casas: fileira da frente e fileira de trás
  const defs = [
    { x: -9, z: -6.5, w: 4.2, d: 4, h: 4, wall: 'wall', roof: 'roof', door: .6, windows: [[-1.2, 2]], upper: [[-1, 3.3], [1, 3.3]] },
    { x: -4.6, z: -6.5, w: 4, d: 4, h: 4.6, wall: 'wall3', roof: 'roof3', door: -1, windows: [[1, 2]], upper: [[-1, 3.7], [1, 3.7]] },
    { x: -.2, z: -6.5, w: 4.2, d: 4, h: 3.8, wall: 'wall2', roof: 'roof2', door: .5, windows: [[-1.3, 2]], upper: [[1.2, 3.1]] },
    { x: 4.2, z: -6.5, w: 4, d: 4, h: 4.8, wall: 'wall', roof: 'roof3', door: -.8, windows: [[1, 2]], upper: [[-1, 3.9], [1, 3.9]] },
    { x: 8.6, z: -6.5, w: 4.2, d: 4, h: 4.2, wall: 'wall3', roof: 'roof2', door: .7, windows: [[-1.2, 2]], upper: [[1, 3.4]] },
    { x: -7, z: -12.5, w: 4.4, d: 4, h: 6, wall: 'wall2', roof: 'roof', windows: [[-1, 3], [1, 3]], upper: [[0, 5]] },
    { x: -2, z: -12.5, w: 4.4, d: 4, h: 5.4, wall: 'wall3', roof: 'roof2', windows: [[0, 2.8]], upper: [[-1, 4.4], [1, 4.4]] },
    { x: 3, z: -12.5, w: 4.4, d: 4, h: 6.4, wall: 'wall', roof: 'roof3', windows: [[-1, 3.2], [1, 3.2]], upper: [[0, 5.3]] },
    { x: 8, z: -12.5, w: 4.4, d: 4, h: 5.2, wall: 'wall2', roof: 'roof3', windows: [[0, 2.6]], upper: [[0, 4.2]] },
  ];
  const houses = defs.map((o, i) => {
    const g = house(o); scene.add(g);
    g.userData.windows.forEach(q => { q.material = q.material.clone(); });
    const tOn = i < 5 ? T.lights[i] : T.lights[i % 6] + .5;
    let L = null; if (i < 5) { L = new THREE.PointLight('#ff9d4a', 0, 9, 2); L.position.set(o.x, 2.6, o.z + o.d / 2 + 1.2); scene.add(L); }
    return { g, tOn, L };
  });

  // Postes de luz
  const lamps = [-7, -2, 3, 8].map((x, i) => {
    const g = new THREE.Group(), hgt = 3;
    g.add(box(.14, hgt, .14, MM.plankDark));
    const arm = box(.6, .08, .08, MM.plankDark); arm.position.set(.25, hgt - .15, 0); g.add(arm);
    const lm = new THREE.MeshStandardMaterial({ color: '#2a2016', emissive: '#ffb45a', emissiveIntensity: .2 });
    const lamp = new THREE.Mesh(new THREE.BoxGeometry(.26, .34, .26), lm); lamp.position.set(.5, hgt - .42, 0); g.add(lamp);
    const L = new THREE.PointLight('#ffae55', 0, 12, 2); L.position.set(.5, hgt - .5, .3); g.add(L);
    const gl = glow('#ffb25e', 1.6, 1.2); gl.position.copy(lamp.position); g.add(gl);
    g.position.set(x, 0, -3.2); scene.add(g); return { g, lm, L, gl, tOn: T.lamps[i] };
  });

  // Adereços
  const R = mulberry(12);
  [[-6.2, -4.3], [-5.5, -4.4], [1.9, -4.3], [6.3, -4.4]].forEach(([x, z], i) => { const c = crate(.7 + R() * .2); c.position.set(x, 0, z); c.rotation.y = R() * .6; scene.add(c); });
  [[-2.4, -4.4], [6.7, -4.5], [-10.8, -4.6]].forEach(([x, z]) => { const b = barrel(); b.position.set(x, 0, z); scene.add(b); });
  const bench = new THREE.Group();
  const seat = box(1.7, .1, .5, MM.plank); seat.position.y = .42; bench.add(seat);
  const back = box(1.7, .5, .08, MM.plank); back.position.set(0, .52, -.22); bench.add(back);
  for (const sx of [-.7, .7]) { const leg = box(.1, .42, .4, MM.plankDark); leg.position.x = sx; bench.add(leg); }
  bench.position.set(8.8, 0, -3.6); scene.add(bench);

  // Cristal de salvar (final)
  const crystalG = new THREE.Group(); crystalG.position.set(7.4, 0, -2.0);
  const base = box(.7, .18, .7, MM.beam); crystalG.add(base);
  const crys = new THREE.Mesh(new THREE.OctahedronGeometry(1), new THREE.MeshStandardMaterial({ color: '#6fe7ff', emissive: '#2fc8ff', emissiveIntensity: 2.6, flatShading: true }));
  crys.scale.set(.26, .42, .26); crystalG.add(crys);
  const cgl = glow('#7fe0ff', 2.0, 1.1); cgl.position.y = .9; crystalG.add(cgl);
  const cL = new THREE.PointLight('#7fe0ff', 0, 7, 2); cL.position.set(0, 1.0, .6); crystalG.add(cL);
  scene.add(crystalG);

  // Personagem e partículas
  const hero = makeHero(); scene.add(hero.root);
  const fill = new THREE.PointLight('#ffd0b0', 1.7, 8, 2); scene.add(fill);
  const hp = { x: 0 };
  const coins = particles(56, (i, t, o) => {
    const life = (t * .35 + i * .173) % 1, on = clamp(Math.min(seg(t, T.walkA + .4, T.walkA + 1.6), 1 - seg(t, 23.0, 24.4)));
    o.x = hp.x + ((i * 7.31) % 5) - 2.5; o.y = 4.4 - life * 4.4; o.z = -2.4 + ((i * 3.77) % 2.4) - 1.2;
    o.a = on * Math.min(1, life * 6) * (1 - life * .3); o.s = .07 + (i % 3) * .02; o.r = 1; o.g = .82; o.b = .3;
  }, { soft: 1 });
  scene.add(coins);
  const sparkles = particles(30, (i, t, o) => { const life = (t * .5 + i * .31) % 1, a = i * 2.4; o.x = 7.4 + Math.cos(a) * (.3 + life * .5); o.y = .5 + life * 1.8; o.z = -2.0 + Math.sin(a) * (.3 + life * .5); o.a = ss(seg(t, T.saveIn, T.saveIn + 1)) * (1 - life); o.s = .05; o.r = .5; o.g = .9; o.b = 1; }, { soft: 1 });
  scene.add(sparkles);

  const camP = track([[13, [HX1 + 2.6, 4.6, 6.4]], [30, [HX1 - 1, 8.5, 12]], [60, [-5.5, 19, 25]]]);
  const camL = track([[13, [HX1 + .1, 1.2, -2.2]], [30, [HX1 - 3, 1, -3]], [60, [-1.8, 0, -5.5]]]);

  function update(t, shot, cam, post) {
    const lt = t - shot.a, mood = seg(t, 13, 60);
    for (const k of ['top', 'mid', 'hor']) SK.u[k].value.lerpColors(cA[k], cB[k], mood);
    sun.intensity = lerp(1.9, 2.8, mood);
    // Personagem
    const wk = seg(t, T.walkA, T.walkB), walking = t >= T.walkA && t < T.walkB;
    const hx = shot.id === 'fim' ? HX1 : lerp(HX0, HX1, wk);
    hp.x = hx; hero.root.position.set(hx, 0, -2.2);
    let f;
    if (shot.id === 'rua') f = walking ? ['w0', 'w1', 'w2', 'w3'][Math.floor(t * 9) % 4] : (t < T.walkA ? 'stand' : (Math.floor(t * 2) % 2 ? 'stand1' : 'stand'));
    else f = t >= 55.3 ? (Math.floor(t * 3) % 2 ? 'cheer1' : 'cheer') : (Math.floor(t * 1.6) % 2 ? 'stand1' : 'stand');
    hero.frame(f);
    // Câmera
    if (shot.id === 'rua') {
      cam.fov = 40; cam.position.set(hx + 1.6, 7.4, 9.0); cam.lookAt(hx + .3, .9, -2.8);
    } else {
      cam.fov = lerp(38, 48, seg(t, 50, 60)); cam.position.set(...camP(t)); cam.lookAt(...camL(t));
    }
    cam.updateProjectionMatrix(); hero.face(cam);
    // Luzes que acendem uma a uma
    houses.forEach(h => {
      const lv = ss(seg(t, h.tOn, h.tOn + .45));
      h.g.userData.windows.forEach(q => { q.material.emissiveIntensity = lerp(.15, 2.4, lv) * (lv > .99 ? flick(t, h.tOn) : 1); });
      if (h.L) h.L.intensity = 8 * lv * flick(t, h.tOn * 3);
    });
    lamps.forEach(l => { const lv = ss(seg(t, l.tOn, l.tOn + .4)); l.lm.emissiveIntensity = lerp(.2, 4, lv); l.L.intensity = 12 * lv * flick(t, l.tOn); l.gl.scale.set(1.6 * lv + .01, 1.6 * lv + .01, 1); });
    // Cristal
    const cv = ss(seg(t, T.saveIn, T.saveIn + .8)); crystalG.visible = cv > 0;
    crys.rotation.y = t * 1.3; crys.position.y = .9 + Math.sin(t * 2.2) * .08; crys.scale.set(.26 * cv, .42 * cv, .26 * cv);
    cL.intensity = 6 * cv * flick(t, 1.7); cgl.scale.set(2 * cv + .01, 2 * cv + .01, 1); base.visible = cv > 0;
    const toCam = cam.position.clone().sub(hero.root.position).setY(0).normalize();
    fill.position.copy(hero.root.position).addScaledVector(toCam, 1.8).setY(1.8);
    coins.userData.update(t); sparkles.userData.update(t);
    post.dof.focus = cam.position.distanceTo(hero.root.position.clone().setY(.9)); post.dof.aper = 350; post.dof.maxCoc = 22;
    post.bloom.strength = .6;
  }
  return { scene, update };
}
