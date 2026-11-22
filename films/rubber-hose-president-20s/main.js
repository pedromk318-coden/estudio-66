import * as T from '/styles/rubber-hose/demo/toon.js';
import { P, pieEye, mouth, brow, glove, shoe, hose } from '/styles/rubber-hose/demo/chars.js';

const W=1080,H=1920,cv=document.getElementById('c'),g=cv.getContext('2d');
T.init(cv); T.S.lw=6; T.S.lwScale=1;
window.DUR=20; window.EV=[];
const TAU=Math.PI*2, clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const easeOut=x=>1-Math.pow(1-clamp(x),3);
const scenes=[
 {a:0,b:2.3,name:'title',line:'E SE VOCÊ FOSSE',sub:'PRESIDENTE?',room:'hall'},
 {a:2.3,b:4.6,name:'office',line:'30 DIAS. UMA CANETA.',sub:'E MIL DECISÕES.',room:'office'},
 {a:4.6,b:6.9,name:'school',line:'EDUCAÇÃO',sub:'O FUTURO COMEÇA AQUI.',room:'school'},
 {a:6.9,b:9.2,name:'health',line:'SAÚDE',sub:'NINGUÉM PODE ESPERAR.',room:'hospital'},
 {a:9.2,b:11.5,name:'work',line:'EMPREGO',sub:'TRABALHO PARA TODOS.',room:'factory'},
 {a:11.5,b:13.8,name:'crisis',line:'MAS O PAÍS NÃO PARA…',sub:'E OS PROBLEMAS TAMBÉM NÃO.',room:'street'},
 {a:13.8,b:16.1,name:'public',line:'O POVO ESTÁ OLHANDO.',sub:'PROMESSA TEM QUE VIRAR AÇÃO.',room:'square'},
 {a:16.1,b:20,name:'end',line:'DIA 30',sub:'PRESTAR CONTAS!',room:'palace'}
];
function rounded(x,y,w,h,r,fill,stroke=null,lw=3){
 g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();if(stroke){g.lineWidth=lw;g.strokeStyle=stroke;g.stroke();}
}
function bgBase(top,bottom){
 const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,top);gr.addColorStop(1,bottom);g.fillStyle=gr;g.fillRect(0,0,W,H);
 const light=g.createRadialGradient(540,480,40,540,720,1120);light.addColorStop(0,'rgba(255,255,255,.2)');light.addColorStop(1,'rgba(0,0,0,.32)');g.fillStyle=light;g.fillRect(0,0,W,H);
}
function architecture(room,t){
 // distant painted environment; deliberately softened to separate the crisp hero
 g.save();g.filter='blur(5px)';
 if(room==='hall'||room==='palace'){
  bgBase('#77756f','#393936');
  for(let x=45;x<1080;x+=245){rounded(x,170,155,1050,70,'#aaa79f','#55534f',8);rounded(x+18,190,119,1010,55,'#85827b',null);}
  g.fillStyle='#343330';g.fillRect(0,1240,W,680);
  for(let x=0;x<W;x+=180){g.fillStyle='rgba(245,242,232,.12)';g.fillRect(x,1240,4,680);}
  rounded(250,230,580,620,12,'#4b4945','#c5c1b7',14);rounded(285,265,510,550,8,'#77746d','#373632',5);
  g.fillStyle='#d4d0c6';g.beginPath();g.ellipse(540,540,165,210,0,0,TAU);g.fill();
  g.fillStyle='#66635e';g.beginPath();g.ellipse(540,540,135,178,0,0,TAU);g.fill();
 }else if(room==='office'){
  bgBase('#8d8a83','#45433f');
  for(let x=40;x<W;x+=260){g.fillStyle='#5c5953';g.fillRect(x,180,18,950);g.fillStyle='#b6b2a8';g.fillRect(x+25,180,7,950);}
  rounded(110,230,860,500,18,'#a9a59b','#4a4843',10);rounded(145,265,790,430,10,'#5d5a54',null);
  for(let i=0;i<7;i++){g.strokeStyle='rgba(235,232,220,.4)';g.lineWidth=5;g.beginPath();g.moveTo(190,320+i*48);g.lineTo(890,320+i*48);g.stroke();}
  g.fillStyle='#383733';g.fillRect(0,1320,W,600);
  rounded(140,1160,800,210,25,'#a6a298','#393834',8);
 }else if(room==='school'){
  bgBase('#777b7b','#3d4140');
  rounded(90,220,900,620,16,'#4a4d4b','#d0cdc3',12);
  g.strokeStyle='rgba(245,243,233,.55)';g.lineWidth=7;
  for(let i=0;i<4;i++){g.beginPath();g.moveTo(180,360+i*105);g.quadraticCurveTo(520,320+i*105,900,370+i*105);g.stroke();}
  for(let x=65;x<1080;x+=250){rounded(x,1020,205,260,18,'#aaa69d','#474540',8);rounded(x+18,1040,170,95,8,'#6e6a63',null);}
  g.fillStyle='#383835';g.fillRect(0,1390,W,530);
 }else if(room==='hospital'){
  bgBase('#9c9a93','#55534e');
  for(let x=50;x<1080;x+=330){rounded(x,220,270,430,18,'#c9c6bd','#6c6962',9);rounded(x+24,245,220,380,12,'#77746d',null);}
  rounded(145,900,790,390,36,'#b9b5ab','#4b4944',10);
  g.fillStyle='#3d3b37';g.fillRect(0,1380,W,540);
 }else if(room==='factory'){
  bgBase('#77746d','#393936');
  for(let x=0;x<W;x+=170){g.fillStyle='#4a4843';g.fillRect(x,190,26,1030);g.fillStyle='#a6a298';g.fillRect(x+32,190,7,1030);}
  for(let y=500;y<1120;y+=180){g.fillStyle='#c0bcb2';g.fillRect(0,y,W,12);}
  g.fillStyle='#5b5852';g.fillRect(0,1290,W,630);
  for(let x=30;x<W;x+=170){g.beginPath();g.arc(x,1320,36,0,TAU);g.fillStyle='#272623';g.fill();}
 }else if(room==='street'){
  bgBase('#686762','#302f2c');
  for(let i=0;i<8;i++){let x=i*155-40,h=500+(i%3)*160;rounded(x,650-h,125,h,4,i%2?'#a5a198':'#77746c','#383733',5);for(let yy=720-h;yy<600;yy+=90)for(let xx=x+22;xx<x+105;xx+=42){g.fillStyle='#d5d1c7';g.fillRect(xx,yy,18,28);}}
  g.fillStyle='#292825';g.fillRect(0,1350,W,570);
  g.strokeStyle='#d4d0c7';g.lineWidth=8;g.setLineDash([65,55]);g.beginPath();g.moveTo(0,1640);g.lineTo(W,1640);g.stroke();g.setLineDash([]);
 }else{
  bgBase('#77746e','#3d3b37');
  for(let x=80;x<1080;x+=230){rounded(x,260,160,1050,70,'#a7a39a','#45433f',8);}
  g.fillStyle='#2f2e2b';g.fillRect(0,1320,W,600);
 }
 // foreground depth silhouettes, still softly out of focus
 g.globalAlpha=.6;g.fillStyle='#242321';g.beginPath();g.ellipse(540,1930,760,280,0,0,TAU);g.fill();
 g.restore();
 // cinematic soft floor bounce and vignette
 const vg=g.createRadialGradient(540,800,300,540,960,1250);vg.addColorStop(0,'rgba(255,255,255,0)');vg.addColorStop(1,'rgba(0,0,0,.42)');g.fillStyle=vg;g.fillRect(0,0,W,H);
}
function prop(scene,t){
 g.save();
 if(scene==='office'){
  // desk, quill and paperwork
  rounded(100,1420,880,180,28,'#bdb9af','#34332f',10);
  g.fillStyle='#4a4843';g.fillRect(150,1590,36,260);g.fillRect(890,1590,36,260);
  for(let i=0;i<3;i++){g.save();g.translate(360+i*170,1390-i*16);g.rotate(-.08+i*.07);rounded(-65,-25,130,80,5,'#e3dfd5','#4a4843',4);g.restore();}
  g.strokeStyle='#211f1d';g.lineWidth=18;g.beginPath();g.moveTo(780,1380);g.lineTo(820,1220);g.stroke();g.fillStyle='#e2ded4';g.beginPath();g.arc(820,1218,14,0,TAU);g.fill();
 }else if(scene==='school'){
  for(let i=0;i<5;i++){g.save();g.translate(230+i*145,1290+Math.sin(t*9+i)*9);g.rotate(-.08);rounded(-58,-34,116,68,8,['#d7d3c9','#8b8881','#b7b3aa'][i%3],'#3c3a36',4);g.restore();}
  rounded(700,1030,250,250,18,'#aaa69d','#383733',8);g.fillStyle='#3d3b37';g.fillRect(730,1070,190,15);g.fillRect(730,1120,150,12);
 }else if(scene==='health'){
  rounded(190,1270,700,100,28,'#bcb8ae','#383733',8);
  rounded(450,1090,180,170,24,'#f0ede4','#383733',8);
  g.fillStyle='#45433f';g.fillRect(520,1110,40,130);g.fillRect(475,1155,130,40);
  g.strokeStyle='#e9e6dd';g.lineWidth=14;g.beginPath();g.moveTo(200,980);g.lineTo(870,980);g.stroke();
 }else if(scene==='work'){
  g.fillStyle='#4b4944';g.fillRect(0,1400,W,100);
  for(let i=0;i<5;i++){g.beginPath();g.arc(120+i*220,1510,58,0,TAU);g.fillStyle='#252421';g.fill();g.strokeStyle='#bdb9b0';g.lineWidth=9;g.stroke();}
  for(let i=0;i<4;i++){rounded(80+i*250,1270,155,105,12,'#aaa69f','#353430',6);}
 }else if(scene==='crisis'){
  for(let i=0;i<18;i++){let x=(i*97+t*170)%1200-60,y=250+(i*173)%1100;g.save();g.translate(x,y);g.rotate(Math.sin(t*5+i)*.8);rounded(-22,-35,44,70,4,'#d7d3ca','#34322f',3);g.restore();}
  g.strokeStyle='#ddd9d0';g.lineWidth=10;g.beginPath();g.moveTo(60,1290);g.quadraticCurveTo(260,1170,420,1300);g.quadraticCurveTo(620,1420,800,1280);g.stroke();
 }else if(scene==='public'){
  for(let i=0;i<5;i++){let x=100+i*210;g.fillStyle='#252421';g.beginPath();g.arc(x,1250,42,0,TAU);g.fill();rounded(x-52,1290,104,180,32,'#aaa69e','#272623',5);rounded(x-75,1080,150,110,8,'#e3dfd5','#2a2926',5);g.fillStyle='#34322f';g.font='bold 23px Georgia';g.textAlign='center';g.fillText(i%2?'CADÊ?':'AÇÃO!',x,1140);}
 }else if(scene==='end'){
  rounded(130,1320,820,280,28,'#aaa69e','#292825',9);
  for(let i=0;i<4;i++){rounded(190+i*180,1380,140,110,8,'#e6e2d8','#3b3935',4);}
  g.fillStyle='#373531';g.font='bold 46px Georgia';g.textAlign='center';g.fillText('30 DIAS',540,1460);
 }
 g.restore();
}
function drawCharacter(t,pose={}){
 const stride=pose.stride||0, bob=Math.sin(t*TAU*2.7)*7, armWave=pose.wave||0, lean=pose.lean||0;
 const x=pose.x??540,y=pose.y??1500,s=pose.scale??1.0;
 // soft contact shadow, character remains crisp
 g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='rgba(0,0,0,.34)';g.filter='blur(22px)';g.beginPath();g.ellipse(0,8,190,38,0,0,TAU);g.fill();g.restore();
 T.frame(t,{amp:1.15});
 T.push();T.translate(x,y+bob);T.scale(s);T.rotate(lean);
 // articulated legs with knee bends
 const step=Math.sin(t*TAU*2.8)*stride;
 const legL={hip:[-43,-112],knee:[-52-step*.35,-54+Math.max(0,step)*.12],foot:[-72-step,-5]};
 const legR={hip:[43,-112],knee:[53+step*.35,-54+Math.max(0,-step)*.12],foot:[75+step,-5]};
 for(const L of [legL,legR]){
  hose(L.hip,L.knee,(L.foot[0]>0?1:-1)*7,19);
  T.shape(T.ell(L.knee[0],L.knee[1],12,12),{fill:P.ink,lw:3});
  hose(L.knee,L.foot,0,18);
 }
 shoe(legL.foot[0]-8,legL.foot[1],-1,1.55,Math.sin(t*16)*.12);
 shoe(legR.foot[0]-8,legR.foot[1],1,1.55,-Math.sin(t*16)*.12);
 // back arms with visible elbow joints
 const leftShoulder=[-76,-300],rightShoulder=[76,-300];
 const handL=pose.handL||[-185,-190],handR=pose.handR||[190,-190];
 const elbowL=[-125+Math.sin(t*5)*9,-245+armWave*15],elbowR=[125+Math.sin(t*5+1)*9,-245-armWave*15];
 for(const [sh,el,hand,side] of [[leftShoulder,elbowL,handL,-1],[rightShoulder,elbowR,handR,1]]){
  hose(sh,el,side*10,18);T.shape(T.ell(el[0],el[1],12,12),{fill:P.ink,lw:3});
  hose(el,hand,side*-8,17);
  glove(hand[0],hand[1],Math.atan2(hand[1]-el[1],hand[0]-el[0]),pose.glove||'open',1.05,{flip:side<0});
 }
 // jacket torso: hand-drawn organic silhouette
 T.shape(T.spline([[-78,-328],[-105,-300],[-111,-230],[-93,-135],[-60,-102],[0,-92],[60,-102],[93,-135],[111,-230],[105,-300],[78,-328],[0,-345]],true,8),{fill:P.white,lw:7,shade:()=>{
  T.shape(T.rect(52,-330,68,245),{fill:P.light,stroke:false,boil:0});
  T.shape(T.spline([[-8,-335],[0,-300],[12,-230],[0,-130],[-15,-220]],true,5),{fill:P.dark,lw:2});
 }});
 // lapels and buttons
 T.stroke(T.spline([[-70,-318],[-32,-260],[0,-292],[34,-260],[70,-318]],false,7),5);
 T.shape(T.spline([[-8,-285],[8,-285],[16,-180],[0,-155],[-16,-180]],true,5),{fill:P.dark,lw:3});
 for(let yy of [-235,-190,-145])T.shape(T.ell(43,yy,5,5),{fill:P.ink,lw:1});
 // neck
 T.shape(T.spline([[-25,-360],[-23,-395],[23,-395],[25,-360],[0,-340]],true,7),{fill:P.light,lw:5});
 // head silhouette with cheeks and chin
 T.shape(T.spline([[-84,-520],[-72,-570],[-35,-600],[28,-600],[72,-568],[86,-518],[78,-455],[54,-414],[18,-395],[-24,-398],[-58,-423],[-80,-468]],true,8),{fill:P.white,lw:7,shade:()=>T.shape(T.spline([[42,-580],[76,-540],[76,-470],[45,-420],[22,-420],[42,-490]],true,6),{fill:P.light,stroke:false,boil:0})});
 // hair cap + side locks, original silhouette
 T.shape(T.spline([[-86,-510],[-100,-545],[-85,-582],[-56,-598],[-42,-628],[-12,-611],[8,-632],[39,-609],[69,-598],[91,-566],[79,-532],[55,-545],[29,-558],[5,-550],[-22,-559],[-51,-540]],true,7),{fill:P.ink,lw:6});
 T.shape(T.spline([[-78,-512],[-88,-482],[-76,-462],[-66,-488]],true,5),{fill:P.dark,lw:3});
 // eyebrows, pie eyes and changing expression
 const ex=31,ey=-523;
 pieEye(-ex,ey,18,26,{type:pose.eyes||'open',lx:pose.gaze||.15,ly:pose.lookY||0,lid:pose.lid||0});
 pieEye(ex,ey,18,26,{type:pose.eyes||'open',lx:pose.gaze||.15,ly:pose.lookY||0,lid:pose.lid||0});
 brow(-ex,ey-36,28,pose.brow||'up',-1);brow(ex,ey-36,28,pose.brow||'up',1);
 T.shape(T.ell(0,-486,7,5),{fill:P.ink,lw:2});
 mouth(0,-455,pose.mouthW||54,pose.mouth||'grin',{open:pose.open??.7});
 // cheek lines and little ear
 T.stroke(T.arc(-67,-464,10,13,Math.PI*.1,Math.PI*.9,8),3);
 // bow tie and collar details
 T.shape(T.spline([[-24,-355],[-52,-374],[-54,-342],[-20,-338]],true,5),{fill:P.dark,lw:3});
 T.shape(T.spline([[24,-355],[52,-374],[54,-342],[20,-338]],true,5),{fill:P.dark,lw:3});
 T.pop();
}
function titleCard(a,b,t,start){
 const p=clamp((t-start)/.22);
 if(p<=0)return;
 g.save();g.globalAlpha=Math.min(1,p);
 const y=210;
 rounded(48,y,984,220,28,'rgba(18,17,15,.88)','#eeeae0',5);
 g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
 g.font='900 62px Shrikhand, Georgia';g.lineWidth=10;g.strokeStyle='#171614';g.strokeText(a,540,y+82);g.fillStyle='#f8f5ec';g.fillText(a,540,y+82);
 g.font='bold 31px Limelight, Georgia';g.fillStyle='#d7d3ca';g.fillText(b,540,y+160);
 g.restore();
}
function particles(t,scene){
 for(let i=0;i<34;i++){let x=(i*173+t*(scene==='crisis'?150:scene==='title'?42:18)+2400)%1200-60;let y=(i*251+Math.sin(t*3+i)*50+1920)%1920;let r=2+(i%4)*1.2;g.fillStyle=i%2?'rgba(245,242,232,.55)':'rgba(30,29,27,.4)';g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
}
function film(t,cut){
 // grain, scratches, gate weave, vignette
 g.save();
 const fl=1+(Math.sin(t*47)*.012)+(Math.sin(t*7.2)*.018);
 g.fillStyle='rgba(255,250,235,'+Math.max(0,(fl-1)*.4)+')';g.fillRect(0,0,W,H);
 for(let i=0;i<100;i++){let x=(i*137.7+t*19)%W,y=(i*251.3+t*7)%H;g.fillStyle=i%3?'rgba(15,14,12,.16)':'rgba(255,255,245,.22)';g.fillRect(x,y,1.5,1.5);}
 if(Math.sin(t*1.7)>.82){g.strokeStyle='rgba(250,248,240,.35)';g.lineWidth=2;g.beginPath();g.moveTo((t*177)%W,0);g.lineTo((t*177)%W+4,H);g.stroke();}
 const v=g.createRadialGradient(540,950,500,540,950,1320);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.5)');g.fillStyle=v;g.fillRect(0,0,W,H);
 if(cut){g.fillStyle='rgba(255,255,245,.12)';g.fillRect(0,0,W,H);}
 g.restore();
}
function render(t){
 t=Math.max(0,Math.min(19.9999,t));
 const sc=scenes.find(s=>t>=s.a&&t<s.b)||scenes[7];
 const local=t-sc.a,phase=local/(sc.b-sc.a),idx=scenes.indexOf(sc);
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);
 architecture(sc.room,t);
 prop(sc.name,t);
 // small hand-painted practical light beams
 g.save();g.globalCompositeOperation='screen';
 const beam=g.createLinearGradient(150,0,760,1600);beam.addColorStop(0,'rgba(255,255,245,.16)');beam.addColorStop(1,'rgba(255,255,245,0)');
 g.fillStyle=beam;g.beginPath();g.moveTo(120,0);g.lineTo(420,0);g.lineTo(880,1500);g.lineTo(520,1500);g.closePath();g.fill();g.restore();
 // character staging and acting per shot
 let pose={x:540,y:1530,scale:1.08,stride:.7,mouth:'grin',eyes:'open',brow:'up',handL:[-205,-210],handR:[205,-205],wave:0};
 if(sc.name==='title'){pose.y=1580-easeOut(phase)*90;pose.scale=1.02+Math.sin(local*9)*.035;pose.handL=[-210,-300];pose.handR=[210,-300];pose.mouth='grin';pose.stride=.8;}
 if(sc.name==='office'){pose.x=540+Math.sin(local*4)*26;pose.lean=-.08;pose.handR=[230,-360];pose.handL=[-190,-170];pose.mouth='open';pose.eyes='wide';}
 if(sc.name==='school'){pose.x=600;pose.handL=[-250,-290];pose.handR=[210,-170];pose.mouth='grin';pose.lean=-.12;}
 if(sc.name==='health'){pose.x=510;pose.handL=[-225,-300];pose.handR=[240,-100];pose.mouth='o';pose.eyes='wide';pose.brow='up';}
 if(sc.name==='work'){pose.x=560;pose.handL=[-210,-160];pose.handR=[245,-300];pose.lean=.1;pose.mouth='grin';}
 if(sc.name==='crisis'){pose.x=540+Math.sin(local*8)*95;pose.y=1530+Math.sin(local*15)*25;pose.handL=[-260,-330+Math.sin(local*12)*80];pose.handR=[250,-340+Math.cos(local*11)*90];pose.eyes='wide';pose.mouth='wavy';pose.stride=1.25;pose.lean=Math.sin(local*8)*.15;}
 if(sc.name==='public'){pose.x=540;pose.handL=[-230,-300];pose.handR=[235,-300];pose.mouth='open';pose.eyes='wide';pose.brow='up';}
 if(sc.name==='end'){pose.y=1540;pose.stride=0;pose.handL=[-220,-260];pose.handR=[220,-260];pose.mouth=phase>.58?'grin':'smile';pose.eyes='open';pose.brow='up';}
 drawCharacter(t,pose);
 if(sc.name==='public') { /* crowd silhouettes already live in the foreground layer */ }
 // big animated action word / scene caption
 titleCard(sc.line,sc.sub,t,sc.a);
 particles(t,sc.name);
 // quick whip blur on scene changes, not a slow dissolve
 const edge=Math.min(local,sc.b-local);
 if(edge<.16){g.save();g.globalAlpha=(.16-edge)/.16*.22;g.fillStyle='#f5f1e7';g.fillRect(0,0,W,H);g.restore();}
 film(t,edge<.035);
 // final iris closes as a hand-drawn period gag
 if(sc.name==='end'&&phase>.83){
  const q=clamp((phase-.83)/.17),r=1400*(1-smooth(q));
  g.save();g.fillStyle='#050505';g.beginPath();g.rect(0,0,W,H);g.arc(540,960,Math.max(0,r),0,TAU,true);g.fill('evenodd');g.restore();
 }
}
window.render=render;window.READY=true;
