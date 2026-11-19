// Personagem 2D ilustrado em alta resolução, integrado a cenários 3D HD-2D.
// O desenho usa curvas vetoriais Canvas (não pixel art); a placa 2D participa da profundidade 3D.
import * as THREE from 'three';
import { billboard, blob, texOf } from './px.js';

const FW = 68, FH = 100, SCALE = 4, SPX = 1 / 60;
const INK = '#29202a';
const names = ['sleep','sleep1','sit','sitPhone','sitPhone1','sitShock','stand','stand1','blink','w0','w1','w2','w3','phone','phone1','cheer','cheer1'];
const states = {
  sleep:{pose:'sleep'}, sleep1:{pose:'sleep',bob:1}, sit:{pose:'sit'}, sitPhone:{pose:'sit',phone:1},
  sitPhone1:{pose:'sit',phone:1,bob:1}, sitShock:{pose:'sit',phone:1,shock:1},
  stand:{pose:'stand'}, stand1:{pose:'stand',bob:1}, blink:{pose:'stand',blink:1},
  w0:{pose:'walk',step:0},w1:{pose:'walk',step:1},w2:{pose:'walk',step:2},w3:{pose:'walk',step:3},
  phone:{pose:'stand',phone:1},phone1:{pose:'stand',phone:1,bob:1},cheer:{pose:'stand',cheer:1},cheer1:{pose:'stand',cheer:1,bob:1}
};

function rounded(ctx,x,y,w,h,r,fill,stroke=INK,lw=1.25){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}}
function line(ctx,pts,color=INK,w=2){ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.strokeStyle=color;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function makeFrame(ctx,s){
  ctx.clearRect(0,0,FW,FH); ctx.save();
  const bob=s.bob||0, pose=s.pose;
  // Soft illustrated edge light, kept subtle so the character feels inside the scene.
  const skin='#e8ae8e', hair='#38251f', shirt='#4777b8', pants='#29466f', shoe='#633f4b';
  if(pose==='sleep'){
    // Pillow and blanket with rounded illustrated shapes.
    rounded(ctx,4,70,60,22,8,'#e9e4ef','#aaa3b8',1);
    ctx.beginPath();ctx.ellipse(28,62+bob,15,14,0,0,Math.PI*2);ctx.fillStyle=hair;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.ellipse(32,64+bob,10,10,0,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.stroke();
    line(ctx,[[27,65+bob],[30,65+bob]],'#4b302d',1.4); line(ctx,[[35,65+bob],[38,65+bob]],'#4b302d',1.4);
    rounded(ctx,31,69,34,25,8,'#4c9a91','#244b50',1.5);
    line(ctx,[[35,74],[59,72]],'#8ac7b8',1.3);
  } else {
    const sit=pose==='sit', walk=pose==='walk';
    // Legs and slippers; separate shapes create a readable 2D silhouette.
    if(!sit){
      const step=s.step||0, swing=[-4,3,4,-3][step];
      rounded(ctx,walk?20+swing:23,69,9,22,'#31517c',INK,1.4);
      rounded(ctx,walk?38-swing:37,69,9,22,'#263f68',INK,1.4);
      rounded(ctx,walk?17+swing:20,88,15,7,3,shoe,INK,1.2);
      rounded(ctx,walk?35-swing:34,88,15,7,3,'#754a56',INK,1.2);
    } else {
      rounded(ctx,17,73,38,16,'#31517c',INK,1.4);
      rounded(ctx,12,85,20,7,3,shoe,INK,1.2);
    }
    // Torso, with soft fabric highlight and folds.
    rounded(ctx,18,38+bob,33,37,9,shirt,INK,1.7);
    ctx.beginPath();ctx.moveTo(23,44+bob);ctx.quadraticCurveTo(34,49+bob,46,43+bob);ctx.strokeStyle='#83a9d8';ctx.lineWidth=2;ctx.stroke();
    line(ctx,[[28,53+bob],[30,67+bob]],'#315d98',1.2);
    // Arms / hands
    if(s.cheer){
      line(ctx,[[20,45],[13,35],[10,24]],shirt,7);line(ctx,[[20,45],[13,35],[10,24]],INK,1.5);
      line(ctx,[[49,45],[56,34],[57,22]],shirt,7);line(ctx,[[49,45],[56,34],[57,22]],INK,1.5);
      ctx.beginPath();ctx.arc(10,22,4,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.strokeStyle=INK;ctx.stroke();
      ctx.beginPath();ctx.arc(57,20,4,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.stroke();
    } else if(s.phone){
      line(ctx,[[47,45],[54,49],[57,40]],shirt,7);line(ctx,[[47,45],[54,49],[57,40]],INK,1.5);
      ctx.beginPath();ctx.arc(57,38,4,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.strokeStyle=INK;ctx.stroke();
      ctx.save();ctx.translate(59,31);ctx.rotate(-.12);rounded(ctx,-3,-7,7,14,1.5,'#172433','#10151d',1);rounded(ctx,-2,-5,5,10,1,'#8bdcff',null);ctx.restore();
    } else {
      line(ctx,[[20,45],[14,58],[16,68]],shirt,7);line(ctx,[[20,45],[14,58],[16,68]],INK,1.5);
      line(ctx,[[48,45],[54,57],[52,68]],shirt,7);line(ctx,[[48,45],[54,57],[52,68]],INK,1.5);
      ctx.beginPath();ctx.arc(16,69,3.5,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.strokeStyle=INK;ctx.stroke();
      ctx.beginPath();ctx.arc(52,69,3.5,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.stroke();
    }
    // Neck and head
    rounded(ctx,29,32+bob,11,12,4,skin,INK,1.1);
    ctx.beginPath();ctx.ellipse(34,22+bob,14,16,0,0,Math.PI*2);ctx.fillStyle=hair;ctx.fill();ctx.strokeStyle=INK;ctx.lineWidth=1.6;ctx.stroke();
    ctx.beginPath();ctx.ellipse(35,25+bob,11,12,0,0,Math.PI*2);ctx.fillStyle=skin;ctx.fill();ctx.stroke();
    // Fringe
    ctx.beginPath();ctx.moveTo(22,21+bob);ctx.quadraticCurveTo(25,4+bob,40,8+bob);ctx.quadraticCurveTo(50,13+bob,47,24+bob);ctx.quadraticCurveTo(40,17+bob,34,19+bob);ctx.quadraticCurveTo(28,27+bob,22,21+bob);ctx.fillStyle=hair;ctx.fill();ctx.strokeStyle=INK;ctx.stroke();
    if(s.blink){line(ctx,[[30,25+bob],[33,25+bob]],'#392a2a',1.5);line(ctx,[[39,25+bob],[42,25+bob]],'#392a2a',1.5);}
    else {ctx.fillStyle='#28212a';ctx.beginPath();ctx.ellipse(31,25+bob,1.35,2,0,0,Math.PI*2);ctx.ellipse(40,25+bob,1.35,2,0,0,Math.PI*2);ctx.fill();}
    ctx.beginPath();ctx.arc(36,32+bob, s.shock?2.5:1.5,0,Math.PI*2);ctx.fillStyle='#9c4d55';ctx.fill();
    ctx.fillStyle='rgba(232,132,125,.42)';ctx.beginPath();ctx.ellipse(27,30+bob,3,1.7,0,0,Math.PI*2);ctx.ellipse(44,30+bob,3,1.7,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

function createAtlas(){
  const canvas=document.createElement('canvas');canvas.width=FW*SCALE*names.length;canvas.height=FH*SCALE;
  const c=canvas.getContext('2d');c.scale(SCALE,SCALE);
  names.forEach((name,i)=>{c.save();c.translate(i*FW,0);makeFrame(c,states[name]);c.restore();});
  const tex=texOf(canvas,{mip:true});tex.magFilter=THREE.LinearFilter;tex.minFilter=THREE.LinearMipmapLinearFilter;tex.generateMipmaps=true;tex.anisotropy=8;tex.premultiplyAlpha=true;
  tex.repeat.set(1/names.length,1);
  return {tex,names,n:names.length};
}

export function makeHero(){
  const A=createAtlas();
  const mesh=billboard(A.tex,FW*SPX,FH*SPX,{shadow:true,receive:false});
  // O plano 2D recebe a iluminação do cenário e participa da profundidade/oclusão 3D.
  const root=new THREE.Group();root.add(mesh);root.userData.char='hero';
  const sh=blob(.62,.42,'#17121b');sh.position.y=.018;sh.position.z=.015;root.add(sh);
  const contact=new THREE.Mesh(new THREE.CircleGeometry(.22,32),new THREE.MeshBasicMaterial({color:'#17121b',transparent:true,opacity:.22,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=.025;root.add(contact);
  return {
    root,mesh,atlas:A,shadowBlob:sh,
    frame(name){const i=A.names.indexOf(name);if(i<0)throw new Error('frame '+name);A.tex.offset.x=i/A.n;},
    face(cam,flip=false){root.rotation.y=Math.atan2(cam.position.x-root.position.x,cam.position.z-root.position.z);mesh.scale.x=flip?-1:1;},
    phonePos(sit=false){const v=new THREE.Vector3(.40,(FH-(sit?40:39))*SPX,.10);v.applyAxisAngle(new THREE.Vector3(0,1,0),root.rotation.y);return v.add(root.position);}
  };
}
