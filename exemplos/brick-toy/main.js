import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { makePost } from '/core/three/post.js';
import { COL, BRICK, PLATE, brick, plate, mesh, roundGeo, coneGeo, slopeGeo } from './bricks.js';

const W = 1080, H = 1920, DUR = 6;
const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), ss = x => x * x * (3 - 2 * x);
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, W / H, .5, 2000);
const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .45;
scene.background = new THREE.Color('#cfc8bc');
RectAreaLightUniformsLib.init();

// ---- real surface: a wooden desk, a wall, out-of-focus household props at true scale (1 m = 125 studs) ----
const wood = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#9b6a42'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 160; i++) { g.strokeStyle = `rgba(${60 + (i * 37) % 40},${30 + (i * 17) % 20},10,${.12 + (i % 5) * .03})`; g.lineWidth = 2 + (i % 4); g.beginPath(); const y = i * 6.4; g.moveTo(0, y); g.bezierCurveTo(300, y + 14 * Math.sin(i), 700, y - 12 * Math.cos(i * .7), 1024, y + 6); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const desk = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ map: wood, roughness: .55 }));
desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);
const wall = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), new THREE.MeshStandardMaterial({ color: '#e7e1d6', roughness: .9 })); wall.position.set(0, 150, -90); scene.add(wall);
const mug = new THREE.Mesh(new THREE.CylinderGeometry(10, 9, 24, 48), new THREE.MeshStandardMaterial({ color: '#2f6b8f', roughness: .3 })); mug.position.set(-26, 12, -45); mug.castShadow = true; scene.add(mug);
const pot = new THREE.Mesh(new THREE.SphereGeometry(16, 32, 16), new THREE.MeshStandardMaterial({ color: '#4f7a4a', roughness: .8 })); pot.position.set(34, 16, -60); scene.add(pot);

// ---- launch pad and the rocket, all bricks ----
const pad = new THREE.Group(); scene.add(pad);
const base = plate(8, 8, COL.dgray); pad.add(base);
for (const [x, z] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) { const p = brick(1, 1, COL.yellow); p.position.set(x, PLATE, z); pad.add(p); }
const rocket = new THREE.Group(); scene.add(rocket);
const add = (m, x, y, z) => { m.position.set(x, y, z); rocket.add(m); return m; };
let y = 0;
add(mesh(roundGeo(1, BRICK), COL.dgray), 0, y, 0); y += BRICK;                 // engine bell
for (const c of [COL.white, COL.white, COL.red, COL.white, COL.white, COL.blue]) { add(mesh(roundGeo(1, BRICK), c), 0, y, 0); y += BRICK; }
add(mesh(coneGeo(1, BRICK * 2), COL.red), 0, y, 0);
for (let k = 0; k < 4; k++) { const f = mesh(slopeGeo(2, BRICK * 2.4, .4), COL.red); const a = k * Math.PI / 2 + Math.PI / 4; f.rotation.y = a; f.position.set(Math.cos(a) * .9, BRICK * .6, -Math.sin(a) * .9); rocket.add(f); }
const win = add(mesh(roundGeo(.5, PLATE), COL.azure, { trans: true }), 0, BRICK * 4.4, 1.0); win.rotation.x = Math.PI / 2;

// effects are bricks too: flame from translucent round plates, smoke from white round bricks rebuilt per drawing
const flame = new THREE.Group(); rocket.add(flame);
const smoke = new THREE.Group(); scene.add(smoke);
function rebuildFx(d, on, lift) {
  flame.clear(); smoke.clear(); if (!on) return;
  const r = k => { const x = Math.sin(d * 91.7 + k * 12.9) * 43758.5; return x - Math.floor(x); };
  for (let i = 0; i < 4; i++) { const m = mesh(roundGeo(.5 + (3 - i) * .12, PLATE), i < 2 ? COL.yellow : COL.orange, { trans: true }); m.position.set((r(i) - .5) * .3, -PLATE * (i + 1) * 1.6, 0); flame.add(m); }
  const n = 10 + Math.min(16, Math.floor(lift * 30));
  for (let i = 0; i < n; i++) { const a = r(i + 9) * Math.PI * 2, R = 3 + r(i + 20) * (4 + lift * 6); const m = mesh(roundGeo(.5 + r(i + 30) * .5, BRICK), COL.white); m.position.set(Math.cos(a) * R, PLATE + r(i + 40) * 1.5, Math.sin(a) * R); m.rotation.y = r(i) * 3; smoke.add(m); }
}

// ---- toy-photography light: warm-white key with crisp shadow, softboxes, low environment ----
const key = new THREE.DirectionalLight('#fff4e6', 2.4); key.position.set(30, 60, 40); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 200 }); key.shadow.bias = -.0004; scene.add(key);
const soft = new THREE.RectAreaLight('#ffffff', 3, 30, 20); soft.position.set(-10, 25, 40); soft.lookAt(0, 6, 0); scene.add(soft);
const rim = new THREE.RectAreaLight('#cfe0ff', 4, 20, 30); rim.position.set(10, 20, -30); rim.lookAt(0, 6, 0); scene.add(rim);

const post = makePost(renderer, scene, camera, W, H, { ssaa: 2, ao: true, aoRadius: 3, aoThickness: 3, aoAmt: .9 });
post.bloom.strength = .12; post.bloom.threshold = 1.3;

function render(t) {
  const d = Math.floor(t * 12);                 // stop-motion: every drawing held for two frames
  const td = d / 12;
  const shake = td > 1.0 && td < 2.2 ? (d % 2 ? .12 : -.12) : 0;
  const lift = Math.pow(seg(td, 2.2, 6), 1.8) * 60;
  rocket.position.set(shake, PLATE + lift, 0);
  rebuildFx(d, td > 1.0, seg(td, 2.2, 4));
  const camY = 6 + lift * .82;                  // macro lens, close and low, following up
  camera.position.set(4, camY + 3, 34 - Math.min(10, lift * .1)); camera.lookAt(0, camY, 0);
  post.dof.focus = camera.position.distanceTo(new THREE.Vector3(0, PLATE + lift + 5, 0)); post.dof.aper = 1.2; post.dof.maxCoc = 16;
  post.composer.render();
}
window.render = render; window.DUR = DUR;
render(0); window.READY = true;
