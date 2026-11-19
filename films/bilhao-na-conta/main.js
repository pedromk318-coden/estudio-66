// E se você acordasse com um bilhão na conta — estilo HD-2D, vertical 1080x1920
import * as THREE from 'three';
import { makePost } from './post_ts.js';
import { DUR, SHOTS, shotAt } from './story.js';
import { buildRoom } from './room.js';
import { buildTown } from './town.js';
import { drawOverlay, overlayReady } from './ui.js';

const W = 1080, H = 1920, Q = new URLSearchParams(location.search);
const SS = +(Q.get('ss') ?? 1);
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('stage').appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(36, W / H, .3, 2000);
const ONLY = Q.get('only');
const sets = {};
if (!ONLY || ONLY === 'quarto') sets.quarto = buildRoom();
if (!ONLY || ONLY === 'rua') sets.rua = buildTown();
const SET_OF = { quarto: 'quarto', rua: 'rua', fim: 'rua' };
const post = makePost(renderer, Object.values(sets)[0].scene, camera, W, H, { ssaa: SS });
post.bloom.strength = .6; post.bloom.radius = .75; post.bloom.threshold = .85;
const V = post.vig.uniforms; V.amt.value = .6; V.warm.value = .12; V.contrast.value = .2; V.sat.value = 1.05;
renderer.domElement.style.width = W + 'px'; renderer.domElement.style.height = H + 'px';
await overlayReady();

// Tilt-shift: a faixa nítida segue o personagem (altura na tela)
const _v = new THREE.Vector3();
function tiltCenter(S, shot, t) {
  if (shot.id === 'fim' && t > 30) return .42;
  let w = null; S.scene.traverse(o => { if (o.userData.char === 'hero' && o.visible) w = o; });
  if (!w) return .45;
  camera.updateMatrixWorld(); S.scene.updateMatrixWorld(); w.getWorldPosition(_v); _v.y += .7; _v.project(camera);
  return Math.min(.8, Math.max(.2, _v.y * .5 + .5));
}
window.DUR = DUR;
window.render = t => {
  const shot = shotAt(t), sid = SET_OF[shot.id];
  if (sid && sets[sid]) {
    const S = sets[sid]; post.dof.scene = S.scene; if (post.dof.ao) post.dof.ao.scene = S.scene;
    post.vig.uniforms.fade.value = 1; post.bloom.strength = .6; post.bloom.threshold = .85; renderer.toneMappingExposure = 1.15;
    V.warm.value = .12; V.sat.value = 1.05; V.amt.value = .6;
    S.update(t, shot, camera, post, renderer);
    if (!Q.has('notilt')) { post.dof.tiltAmt = 17; post.dof.tiltC = tiltCenter(S, shot, t); post.dof.tiltW = .1; post.dof.tiltF = .3; post.dof.maxCoc = Math.max(post.dof.maxCoc, 24); V.sat.value *= 1.16; V.contrast.value = .28; }
    if (Q.has('nodof')) post.dof.maxCoc = 0;
    post.composer.render();
  } else { renderer.setRenderTarget(null); renderer.setClearColor('#000'); renderer.clear(); }
  drawOverlay(t, shot);
};
window.READY = true;
