// Cena A: o quarto ao amanhecer. Diorama 3D em miniatura com o personagem em pixel art deitado na cama.
import * as THREE from 'three';
import { PX, ramp, woodPlanks, glow, h2 } from './px.js';
import { mats, mat, mesh, box } from './kit.js';
import { sky, particles, flick } from './fx.js';
import { makeHero } from './hero.js';
import { T } from './story.js';
import { clamp, seg, ss, lerp, track } from '/core/lib.js';

function fabric(cols, seed, stripe = true, w = 3) {
  const P = new PX(96, 96), R = ramp(cols, .3);
  P.fill((x, y) => { let v = .55 + (h2(x >> 1, y >> 1, seed) - .5) * .22; if (stripe && ((x >> w) % 2 === 0)) v += .18; return R(v, x, y); });
  return P.done();
}

export function buildRoom() {
  const scene = new THREE.Scene(), MM = mats();
  scene.fog = new THREE.FogExp2('#4a3a5a', .009);
  const SK = sky({ top: '#1c2454', mid: '#6a5a92', hor: '#f4a874', moonDir: new THREE.Vector3(-1, .2, -.4), moonCol: '#ffd9a8' }); scene.add(SK.mesh);

  // —— Luz: sol baixo entrando pela janela + ambiente frio ——
  const sun = new THREE.DirectionalLight('#ffb27a', 2.4); sun.position.set(-14, 7, -2); sun.target.position.set(0, 0, -.5);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 40 }); sun.shadow.bias = -.0008; sun.shadow.normalBias = .02;
  scene.add(sun, sun.target, new THREE.HemisphereLight('#8a78b0', '#2a2030', 1.0));

  // —— Base de mesa (o diorama), piso e paredes ——
  scene.add(mesh(new THREE.BoxGeometry(16, .5, 16).translate(0, -.45, 0), MM.plankDark));
  const floorM = mat(woodPlanks(96, 96, { pw: 6, len: 48, seed: 3 }));
  scene.add(mesh(new THREE.BoxGeometry(4.5, .2, 4.3).translate(-.35, -.1, -.5), floorM, { swap: true }));
  scene.add(mesh(new THREE.BoxGeometry(4.7, 3.1, .2).translate(-.35, 1.55, -2.75), MM.wall3, { cast: false }));
  scene.add(mesh(new THREE.BoxGeometry(.2, 3.1, 4.5).translate(-2.7, 1.55, -.5), MM.wall3, { cast: false }));
  // Janela na parede esquerda (brilho quente da manhã)
  const winGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.3), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffcf9a').multiplyScalar(2.4), fog: false }));
  winGlow.rotation.y = Math.PI / 2; winGlow.position.set(-2.59, 1.7, -.4); scene.add(winGlow);
  for (const [w, h, d, y, z] of [[.1, .1, 1.7, 1.0, -.4], [.1, .1, 1.7, 2.35, -.4], [.1, 1.4, .1, 1.0, -1.2], [.1, 1.4, .1, 1.0, .4], [.1, 1.4, .08, 1.0, -.4], [.08, .06, 1.5, 1.67, -.4]]) {
    const b = box(w, h, d, MM.beam, { cast: false }); b.position.set(-2.55, y, z); scene.add(b);
  }

  // —— Cama ——
  const sheet = mat(fabric(['#1e4a4a', '#2f6e6a', '#4a9a8e', '#7fd0b8'], 2, true)), pil = mat(fabric(['#9a94a8', '#c4bfd0', '#e8e4f0', '#ffffff'], 5, false));
  const bedF = box(2.2, .3, 1.55, MM.plankDark); bedF.position.set(-1.45, 0, -1.7); scene.add(bedF);
  const matt = mesh(new THREE.BoxGeometry(2.1, .2, 1.45).translate(-1.45, .4, -1.7), mat(fabric(['#cfc9d8', '#e2deea', '#f2f0f8', '#ffffff'], 8, false))); scene.add(matt);
  const head = box(.12, 1.0, 1.7, MM.plankDark); head.position.set(-2.55, 0, -1.7); scene.add(head);
  const pillow = box(.55, .14, .75, pil); pillow.position.set(-2.18, .5, -1.7); scene.add(pillow);
  const blanket = box(1.3, .22, 1.5, sheet); blanket.position.set(-.95, .5, -1.7); scene.add(blanket);

  // —— Criado-mudo + celular ——
  const stand = box(.6, .6, .6, MM.plank); stand.position.set(.1, 0, -2.15); scene.add(stand);
  const phoneG = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(.15, .02, .27), new THREE.MeshStandardMaterial({ color: '#10161e', roughness: .5 })); body.castShadow = true; phoneG.add(body);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.12, .24), new THREE.MeshBasicMaterial({ color: new THREE.Color('#8fd8ff').multiplyScalar(2.2), fog: false })); scr.rotation.x = -Math.PI / 2; scr.position.y = .012; phoneG.add(scr);
  const phoneGlow = glow('#8fd8ff', .8, 1.0); phoneGlow.position.y = .06; phoneG.add(phoneGlow);
  const phoneLight = new THREE.PointLight('#9fd8ff', 0, 5, 2); phoneLight.position.y = .5; phoneG.add(phoneLight);
  scene.add(phoneG);

  // —— Móveis e detalhes ——
  const ward = box(1.1, 2.1, .6, MM.plankDark); ward.position.set(1.1, 0, -2.4); scene.add(ward);
  const rug = mesh(new THREE.BoxGeometry(1.8, .03, 1.3).translate(.35, .015, .55), mat(fabric(['#5a2a2a', '#8a3c34', '#c4604a', '#e8a070'], 11, true, 2))); scene.add(rug);
  for (const [x, z, r] of [[-.15, -.7, .3], [.1, -.55, -.4]]) { const s = box(.14, .05, .26, mat(fabric(['#3a1f2a', '#6a3a4a', '#9a5a6a'], 4, false))); s.position.set(x, .03, z); s.rotation.y = r; scene.add(s); }

  // —— Personagem ——
  const hero = makeHero(); scene.add(hero.root);
  const fill = new THREE.PointLight('#ffd9b8', 1.5, 9, 2); scene.add(fill);
  const handLight = new THREE.PointLight('#9fd8ff', 0, 5, 2); scene.add(handLight);

  // —— Partículas: poeira na luz e faíscas douradas quando o saldo conta ——
  const dust = particles(70, (i, t, o) => { o.x = -2.4 + ((i * 7.3) % 4.2) + Math.sin(t * .3 + i) * .1; o.y = ((i * 3.1) % 2.6) + .2 + Math.sin(t * .5 + i * 2) * .05; o.z = -2.4 + ((i * 5.7) % 4); o.a = .35; o.s = .045; o.r = 1; o.g = .85; o.b = .6; }, { soft: 1 });
  scene.add(dust);
  const sp = { x: 0, y: 0, z: 0 };
  const sparks = particles(60, (i, t, o) => {
    const k = clamp((t - T.countA) / (T.countB - T.countA)), life = (t * .9 + i * .37) % 1, ang = i * 2.399, rad = .15 + life * .9;
    const on = t > T.countA && t < T.shockEnd + 1.5 ? 1 : 0;
    o.x = sp.x + Math.cos(ang) * rad * .6; o.y = sp.y + life * 1.9; o.z = sp.z + Math.sin(ang) * rad * .5;
    o.a = on * (1 - life) * Math.min(1, life * 8) * (.4 + .6 * Math.min(1, k * 1.5)); o.s = .06 + (i % 3) * .02; o.r = 1; o.g = .82; o.b = .3;
  }, { soft: 1 });
  scene.add(sparks);

  const camP = track([[0, [6.2, 7.6, 8.4]], [2.4, [4.8, 5.6, 6.6]], [3.4, [3.9, 4.3, 5.3]], [7.6, [3.5, 3.9, 4.8]], [13, [6.4, 7.8, 8.8]]]);
  const camL = track([[0, [-.6, .9, -.9]], [2.4, [-1.0, .8, -1.5]], [3.4, [-1.2, .9, -1.7]], [7.6, [-1.2, .9, -1.7]], [13, [-.4, .9, -1]]]);

  function update(t, shot, cam, post) {
    const lt = t - shot.a;
    cam.fov = 38; cam.updateProjectionMatrix(); cam.position.set(...camP(lt)); cam.lookAt(...camL(lt));
    sun.intensity = lerp(1.7, 2.9, ss(seg(lt, 0, 13)));
    // celular vibrando
    const buzz = T.buzz.some(([a, b]) => lt >= a && lt < b), onStand = lt < T.wake;
    phoneG.visible = onStand;
    phoneG.position.set(.1 + (buzz ? Math.sin(lt * 95) * .012 : 0), .6, -2.15 + (buzz ? Math.cos(lt * 83) * .01 : 0)); phoneG.rotation.y = buzz ? Math.sin(lt * 71) * .06 : 0;
    phoneLight.intensity = onStand ? (buzz ? 2.6 : .7) : 0; const gs = buzz ? 1.2 + .2 * Math.sin(lt * 40) : .75; phoneGlow.scale.set(gs, gs, 1);
    // personagem: dorme → acorda → olha o saldo → susto
    const sit = lt >= T.wake;
    hero.root.position.set(sit ? -1.7 : -1.95, .48, -1.62);
    let f;
    if (lt < T.wake - .3) f = Math.floor(lt / .9) % 2 ? 'sleep1' : 'sleep';
    else if (lt < T.wake + .4) f = 'sit';
    else if (lt < T.shock) f = Math.floor(lt * 2) % 2 ? 'sitPhone1' : 'sitPhone';
    else if (lt < T.shockEnd) f = 'sitShock';
    else f = Math.floor(lt * 2) % 2 ? 'sitPhone1' : 'sitPhone';
    hero.frame(f); hero.face(cam);
    const hp = hero.phonePos(true); sp.x = hp.x; sp.y = hp.y; sp.z = hp.z;
    handLight.position.copy(hp).add(new THREE.Vector3(.3, .1, .5)); handLight.intensity = sit ? 1.9 : 0;
    const toCam = cam.position.clone().sub(hero.root.position).setY(0).normalize();
    fill.position.copy(hero.root.position).addScaledVector(toCam, 2.0).setY(1.9);
    dust.userData.update(t); sparks.userData.update(lt);
    post.dof.focus = cam.position.distanceTo(hero.root.position.clone().setY(.95)); post.dof.aper = 350; post.dof.maxCoc = 22;
    post.bloom.strength = .6;
  }
  return { scene, update };
}
