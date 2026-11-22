import {makeParticleField,drawParticles,drawRain,glow,drawVignetteGrain,renderShutter,camera,smooth,lerp,drawSoftFocus,drawLightShafts,drawBokeh,drawMotionStreaks,drawLensFlare} from '/core/render/cinematic2d.js';
const W=1080,H=1920,canvas=document.querySelector('#film'),ctx=canvas.getContext('2d',{alpha:false});
const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const dust=makeParticleField(190,77,1.2),embers=makeParticleField(48,92,1.0),haze=makeParticleField(42,41,1.8),bokeh=makeParticleField(28,119,1.7);
const rr=(c,x,y,w,h,r,fill,stroke=null,lw=3)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=lw;c.strokeStyle=stroke;c.stroke();}};
const ell=(c,x,y,rx,ry,fill,stroke=null,lw=3)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=lw;c.strokeStyle=stroke;c.stroke();}};
const line=(c,pts,color,width=5)=>{c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)c.lineTo(...pts[i]);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();};
const path=(c,fn,fill,stroke=null,lw=4)=>{c.beginPath();fn(c);c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=lw;c.strokeStyle=stroke;c.lineJoin='round';c.lineCap='round';c.stroke();}};
const grad=(c,x,y,w,h,stops)=>{const g=c.createLinearGradient(x,y,x+w,y+h);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;};
const ease=(t,a,b)=>smooth((t-a)/(b-a));
const noise=(seed)=>{let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;}};
const paper=document.createElement('canvas');paper.width=512;paper.height=512;
{const p=paper.getContext('2d'),r=noise(171);p.fillStyle='#33252a';p.fillRect(0,0,512,512);for(let i=0;i<10500;i++){p.globalAlpha=.025+r()*.07;p.fillStyle=r()>.5?'#f5c99b':'#080b15';p.fillRect(r()*512,r()*512,1+r()*2,1+r()*2);}p.globalAlpha=1;}

function background(c,t){
  c.fillStyle=grad(c,0,0,0,H,[[0,'#171d2b'],[.36,'#4a3033'],[.72,'#251d2a'],[1,'#10131e']]);c.fillRect(0,0,W,H);
  // Tijolos com variação, juntas e luz quente irregular.
  for(let row=0;row<23;row++)for(let col=-1;col<7;col++){
    const x=col*190+(row%2)*95,y=30+row*82;
    const shade=(row*7+col*13)%4;
    rr(c,x,y,178,68,8,['#50383b','#624346','#49343a','#76504a'][shade],'rgba(18,15,24,.45)',5);
    line(c,[[x+12,y+9],[x+155,y+9]],'rgba(255,207,160,.06)',3);
  }
  // Cortina lateral e palco.
  const curtain=grad(c,0,0,340,0,[[0,'#160f20'],[.5,'#6b2836'],[1,'#2a1728']]);
  c.fillStyle=curtain;c.fillRect(0,0,300,H);
  for(let i=0;i<12;i++){const x=i*28+8;c.beginPath();c.moveTo(x,0);c.bezierCurveTo(x-24,420,x+24,1180,x-5,H);c.lineTo(x+18,H);c.bezierCurveTo(x+42,1180,x-3,420,x+20,0);c.fillStyle=i%2?'rgba(12,8,20,.28)':'rgba(255,130,112,.10)';c.fill();}
  // Quadros, cartazes e molduras no fundo.
  rr(c,690,310,270,330,14,'#2c202b','#d1a16c',12);rr(c,710,330,230,170,6,'#74323c','#f1c98a',7);
  ell(c,825,414,47,47,'#e9a04c');rr(c,735,530,175,11,5,'#b98b65');rr(c,735,558,144,9,5,'#84665b');
  rr(c,760,740,205,275,12,'#202b3c','#c59b6e',12);
  for(let i=0;i<5;i++){rr(c,780,775+i*42,165,22,5,['#9a5e48','#d19a58','#4b7182','#a87578','#d0b77c'][i]);}
  // Piso de madeira com perspectiva.
  c.fillStyle=grad(c,0,1160,0,760,[[0,'#79513f'],[.35,'#543b36'],[1,'#171722']]);c.fillRect(0,1160,W,760);
  for(let i=0;i<20;i++){const y=1190+i*42;line(c,[[0,y],[W,y+((i%3)-1)*12]],'rgba(240,185,127,.16)',3);}
  for(let i=0;i<12;i++){const x=i*100-80;line(c,[[540,1160],[x,1920]],'rgba(18,13,21,.25)',4);}
  // Spots, practical bulbs and volumetric shafts.
  glow(c,470,245,250,'#ffbd70',.34);glow(c,925,540,165,'#ff9f50',.23);
  line(c,[[420,0],[460,170]],'#1a1620',10);ell(c,463,204,29,39,'#ffe9b5');glow(c,463,218,260,'#ffd17c',.2);
  c.save();c.globalAlpha=.10;c.fillStyle=grad(c,0,190,520,970,[[0,'rgba(255,217,145,.7)'],[1,'rgba(255,217,145,0)']]);path(c,p=>{p.moveTo(420,205);p.lineTo(30,1220);p.lineTo(720,1220);p.closePath();},c.fillStyle);c.restore();
  // Bokeh de luzes distantes.
  for(let i=0;i<18;i++){const x=330+(i*137)%700,y=260+(i*211)%850;glow(c,x,y,18+(i%4)*12,i%3?'#ffb86a':'#86b7d0',.16);}
  c.save();c.globalAlpha=.075;for(let yy=0;yy<H;yy+=512)for(let xx=0;xx<W;xx+=512)c.drawImage(paper,xx,yy);c.restore();
}
function microphone(c,t){
  const sway=Math.sin(t*2.1)*5;
  line(c,[[650+sway,810],[650+sway,1510]],'#3b4355',19);line(c,[[762+sway,840],[778+sway,840]],'#b4a7a0',5);
  c.save();c.translate(650+sway,790);c.rotate(-.12+Math.sin(t*1.5)*.025);
  rr(c,-25,-75,50,104,22,grad(c,-25,-75,50,104,[[0,'#aeb9c6'],[.4,'#47566a'],[1,'#1d2738']]),'#17202e',6);
  for(let i=0;i<5;i++)line(c,[[-15,-59+i*12],[15,-59+i*12]],'rgba(225,232,239,.38)',3);
  c.restore();
}
function singer(c,t,pose=0){
  c.save();
  const breath=Math.sin(t*2.4)*9, sway=Math.sin(t*1.7)*15;
  const walk=pose===1?1-ease(t,3.2,6.7):0;
  const walkX=-250*walk,stepBob=pose===1?Math.abs(Math.sin(t*8))*10:Math.sin(t*3.2)*3;
  c.translate(520+sway+walkX,stepBob);c.rotate(Math.sin(t*2.0)*.018);
  // Sombra de contato no palco.
  ell(c,0,1650,235,43,'rgba(5,8,16,.48)');
  // Pernas e botas.
  path(c,p=>{p.moveTo(-95,1320);p.lineTo(-35,1320);p.lineTo(-52,1580);p.lineTo(-95,1580);p.closePath();},grad(c,-95,1320,70,260,[[0,'#29334a'],[.5,'#171f31'],[1,'#0e1423']]),'#101624',8);
  path(c,p=>{p.moveTo(25,1320);p.lineTo(92,1320);p.lineTo(120,1580);p.lineTo(72,1580);p.closePath();},grad(c,25,1320,100,260,[[0,'#303b54'],[.5,'#1a2336'],[1,'#0e1423']]),'#101624',8);
  ell(c,-73,1590,66,34,'#111827','#070d18',7);ell(c,100,1590,67,34,'#111827','#070d18',7);
  // Casaco com modelagem, pregas e highlights.
  path(c,p=>{p.moveTo(-170,850);p.quadraticCurveTo(-130,790,-65,800);p.lineTo(65,800);p.quadraticCurveTo(140,790,180,870);p.lineTo(220,1330);p.quadraticCurveTo(0,1390,-215,1330);p.closePath();},grad(c,-210,800,430,550,[[0,'#9ab4d2'],[.23,'#57799f'],[.55,'#365578'],[.82,'#253e5b'],[1,'#172b43']]),'#1a2b43',12);
  path(c,p=>{p.moveTo(-40,810);p.lineTo(15,810);p.lineTo(65,980);p.lineTo(5,1090);p.lineTo(-65,965);p.closePath();},'#171f31','#26354a',5);
  line(c,[[-160,920],[-115,1110],[-135,1300]],'rgba(219,230,239,.34)',10);
  line(c,[[150,920],[105,1100],[145,1290]],'rgba(12,24,42,.42)',12);
  for(let i=0;i<6;i++){ell(c,6,1040+i*42,5,5,'#d8c4a0');line(c,[[-20,1060+i*42],[30,1060+i*42]],'rgba(210,222,231,.2)',3);}
  // Braços em pose de palco, com articulações suaves.
  const arm=Math.sin(t*3.2)*.32;
  c.save();c.translate(-135,875);c.rotate(-.48+arm);
  path(c,p=>{p.moveTo(-35,0);p.quadraticCurveTo(-80,75,-60,185);p.lineTo(-20,215);p.quadraticCurveTo(8,125,12,35);p.closePath();},grad(c,-70,0,90,220,[[0,'#b77a61'],[.5,'#8f554c'],[1,'#653b3d']]),'#402b35',7);
  ell(c,-5,205,27,31,'#c98b70');c.restore();
  c.save();c.translate(125,875);c.rotate(.55-arm*.75);
  path(c,p=>{p.moveTo(-24,0);p.quadraticCurveTo(15,50,30,145);p.lineTo(8,190);p.lineTo(-32,178);p.lineTo(-48,55);p.closePath();},grad(c,-48,0,80,190,[[0,'#9c6254'],[.5,'#77464a'],[1,'#4e3540']]),'#392a38',7);
  ell(c,-5,180,27,30,'#bd8068');c.restore();
  // Pescoço e rosto com volumes.
  rr(c,-49,740,98,112,28,grad(c,-49,740,100,112,[[0,'#c78a6d'],[.6,'#9a5c50'],[1,'#663b3e']]));
  c.save();c.translate(0,650+breath*.25);c.rotate(Math.sin(t*1.3)*.055);
  path(c,p=>{p.moveTo(-125,-15);p.quadraticCurveTo(-128,-135,-80,-175);p.quadraticCurveTo(-15,-220,70,-178);p.quadraticCurveTo(130,-130,122,-10);p.quadraticCurveTo(110,110,0,125);p.quadraticCurveTo(-110,112,-125,-15);p.closePath();},grad(c,-125,-180,250,310,[[0,'#e1a27d'],[.3,'#c98067'],[.72,'#a75f55'],[1,'#78444a']]),'#4b3039',10);
  // Sombra lateral e bochechas.
  ell(c,-87,12,32,45,'rgba(91,47,51,.2)');ell(c,73,12,32,45,'rgba(255,191,144,.18)');
  ell(c,-65,34,20,13,'rgba(241,139,125,.3)');ell(c,64,34,20,13,'rgba(241,139,125,.3)');
  // Olhos, sobrancelhas e nariz.
  const blink=(Math.sin(t*1.9+1.2)>.985)?0.12:1;
  c.save();c.scale(1,blink);
  ell(c,-43,-28,12,17,'#302532');ell(c,43,-28,12,17,'#302532');ell(c,-47,-34,3.5,5,'#fff0d4');ell(c,39,-34,3.5,5,'#fff0d4');
  c.restore();
  line(c,[[-65,-62],[-28,-68]],'#4b3039',9);line(c,[[27,-68],[64,-62]],'#4b3039',9);
  path(c,p=>{p.moveTo(0,-20);p.quadraticCurveTo(18,4,3,12);},'transparent','rgba(101,54,51,.65)',6);
  // Boca sincronizada com a performance.
  const singing=pose===2, mouth=.5+.5*Math.sin(t*11);
  if(singing){ell(c,0,65,12+mouth*7,20+mouth*10,'#512c39');ell(c,0,76,8,4,'#e99a8c');}
  else{path(c,p=>{p.moveTo(-17,65);p.quadraticCurveTo(0,72,17,65);},'transparent','#713b42',7);}
  // Cachos individuais: silhueta irregular e highlights.
  for(let i=0;i<34;i++){
    const a=Math.PI+(i/33)*Math.PI,rx=107,ry=106;
    const x=Math.cos(a)*rx,y=Math.sin(a)*ry-18;
    ell(c,x,y,17+(i%3)*2,19+(i%4),['#201d2b','#2b2635','#403443'][i%3],'#161724',3);
    line(c,[[x-7,y-5],[x-1,y-12],[x+7,y-10]],'rgba(211,156,125,.32)',3);
  }
  // Brinco dourado e presilha.
  ell(c,-120,40,20,26,'transparent','#d9a64d',7);ell(c,120,40,20,26,'transparent','#d9a64d',7);
  path(c,p=>{p.moveTo(-48,-164);p.quadraticCurveTo(0,-205,48,-164);},'transparent','#d86d62',11);
  c.restore();
  c.restore();
}
function scene(c,t){
  const shot=t<3.2?0:t<6.7?1:2;
  const local=shot===0?t:shot===1?t-3.2:t-6.7;
  c.fillStyle='#090c16';c.fillRect(0,0,W,H);
  const draw=()=>{drawSoftFocus(c,()=>background(c,t),2.2);microphone(c,t);singer(c,t,shot);};
  if(shot===0)camera(c,t,{x:0,y:35,zoom:1.13+ease(t,0,3.2)*.075,shake:2.1},draw);
  else if(shot===1)camera(c,t,{x:-145+Math.sin(local*1.8)*24,y:-18,zoom:1.08+Math.sin(local*1.4)*.025,shake:3.2},draw);
  else camera(c,t,{x:25+Math.sin(local*1.3)*18,y:-8,zoom:1.18+ease(local,0,3.3)*.09,shake:2.5},draw);
  // Layeres atmosféricas e chuva visível na janela.
  drawParticles(c,haze,t,{color:'#ffca91',alpha:.16,glow:24,drift:.35});
  drawParticles(c,dust,t,{color:'#ffe2b8',alpha:.48,glow:10,drift:.7});
  drawParticles(c,embers,t,{color:'#ff9b62',alpha:.62,glow:20,drift:1.3});
  drawBokeh(c,bokeh,t,{alpha:.34,blur:22,colors:['#ffd18a','#ff9e83','#91c8ee']});
  drawRain(c,t,{count:68,intensity:.48,color:'rgba(181,218,236,.48)',seed:23});
  drawLightShafts(c,t,{alpha:.13,count:3,originX:465,originY:190});
  // Halo de palco e leve flare que respira.
  glow(c,455,225,300,'#ffd38a',.13+.045*Math.sin(t*3));
  drawLensFlare(c,463,218,t,{strength:.22,color:'#ffd28a'});
  if(shot===1){drawMotionStreaks(c,t,{alpha:.16,intensity:.75,seed:53});}
  if(shot===1){c.save();c.globalAlpha=.24;line(c,[[0,1110],[W,1110]],'rgba(255,201,139,.4)',5);c.restore();}
  drawVignetteGrain(c,t,{grain:.028,vignette:.48});
}
window.DUR=10;
window.render=t=>renderShutter(ctx,t,(target,st)=>scene(target,st),{samples:(t>3.15&&t<6.85)?3:2,shutter:(t>3.15&&t<6.85)?.62:.46});
window.READY=true;
