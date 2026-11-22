// Stop-motion artesanal de massinha: 10 s, vertical 1080x1920, 8 poses/s.
const canvas=document.querySelector('#film');
const ctx=canvas.getContext('2d',{alpha:false});
const W=1080,H=1920;
window.DUR=10;
window.READY=true;
const TAU=Math.PI*2;
function oval(x,y,rx,ry,fill,stroke='#8b6250',lw=8){
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=fill;ctx.fill();
  if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}
}
function path(points,fill,stroke='#8b6250',lw=8){
  ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath();ctx.fillStyle=fill;ctx.fill();
  if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}
}
function line(x1,y1,x2,y2,color,width=12){
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();
}
function grain(seed,count){
  let n=seed>>>0;const rnd=()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296};
  for(let i=0;i<count;i++){
    const x=rnd()*W,y=rnd()*H,r=1+rnd()*3;
    ctx.globalAlpha=.035+rnd()*.045;ctx.fillStyle=rnd()>.5?'#fff7e8':'#654b3c';
    ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  }
  ctx.globalAlpha=1;
}
function background(){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#e9cdb0');g.addColorStop(.62,'#d9b391');g.addColorStop(1,'#b87f62');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // fundo de estúdio de miniaturas e mesa
  ctx.fillStyle='#f1d9bd';ctx.fillRect(0,0,W,1120);
  ctx.fillStyle='#c58d6c';ctx.fillRect(0,1120,W,800);
  line(0,1120,W,1120,'#ad775e',7);
  oval(530,1580,430,75,'rgba(78,48,37,.18)',null);
  // pequenas marcas da mesa
  for(let i=0;i<13;i++)line(70+i*79,1190+(i%3)*190,115+i*79,1190+(i%3)*190,'rgba(111,67,48,.12)',4);
}
function pot(){
  path([[385,1400],[695,1400],[650,1710],[430,1710]],'#b95f4d','#874b40',12);
  oval(540,1402,157,34,'#d88968','#874b40',10);
  oval(540,1410,132,22,'#594537',null);
  // impressões digitais na argila do vaso
  for(let i=0;i<12;i++)oval(430+(i%4)*58,1470+Math.floor(i/4)*65,8,13,'rgba(255,208,166,.35)',null);
}
function stem(growth){
  const top=1400-growth*420;
  line(540,1400,540,top,'#557b4d',22);
  if(growth>.2){
    ctx.save();ctx.translate(540,top+130);ctx.rotate(-.55);
    oval(-55,0,75,32,'#7da45c','#486d43',7);ctx.restore();
  }
  if(growth>.42){
    ctx.save();ctx.translate(540,top+235);ctx.rotate(.55);
    oval(55,0,75,32,'#8eae62','#486d43',7);ctx.restore();
  }
  if(growth>.68){
    oval(540,top-15,54,60,'#f2bd55','#b57a3c',7);
    for(let i=0;i<7;i++){const a=i*TAU/7;oval(540+Math.cos(a)*68,top-15+Math.sin(a)*68,31,43,'#e98976','#a95750',6);}
    oval(540,top-15,28,30,'#8d673e','#6b4c35',5);
  }
}
function gardener(frame){
  const bob=Math.sin(frame*1.7)*8;
  // pernas e sapatos de massinha
  line(420,1190,400,1390,'#435b62',42);line(555,1195,570,1390,'#435b62',42);
  oval(390,1400,65,30,'#493c38','#332d2a',7);oval(575,1400,65,30,'#493c38','#332d2a',7);
  // corpo
  oval(485,1045+bob,128,175,'#6f9b83','#456e60',11);
  oval(485,1060,92,115,'#88b59a',null);
  // cabeça grande de boneco
  oval(490,800+bob,150,158,'#e9a978','#a96e54',12);
  oval(440,790+bob,16,21,'#342d2a',null);oval(535,790+bob,16,21,'#342d2a',null);
  oval(488,850+bob,36,17,'#b96d5e',null);
  // touca
  path([[350,755+bob],[380,665+bob],[485,620+bob],[590,665+bob],[630,755+bob]],'#d96f57','#a34f45',10);
  oval(485,660+bob,35,22,'#f0bd70','#a34f45',6);
  // braço que segura o regador
  line(585,990+bob,700,1080,'#e9a978',38);
  oval(710,1088,28,28,'#e9a978','#a96e54',6);
  // outro braço apoiado
  line(390,990+bob,335,1120,'#e9a978',38);
}
function wateringCan(frame){
  const tilt=Math.min(1,Math.max(0,(frame-12)/20));
  ctx.save();ctx.translate(760,1080);ctx.rotate(-.12-tilt*.3);
  oval(0,0,100,72,'#7e9da0','#4e6d72',10);
  ctx.beginPath();ctx.arc(-12,-8,80,Math.PI*1.08,Math.PI*1.92);ctx.strokeStyle='#4e6d72';ctx.lineWidth=17;ctx.stroke();
  path([[65,-12],[165,-58],[180,-43],[85,20]],'#7e9da0','#4e6d72',9);
  oval(183,-48,18,15,'#c1d0c5','#4e6d72',6);
  ctx.restore();
  if(frame>18&&frame<53){
    const k=(frame-18)%8;
    for(let i=0;i<4;i++){
      const x=935-i*23+(k%4)*3,y=1040+i*55+(k%5)*12;
      oval(x,y,7,12,'#8ec7d0','#5d9da4',2);
    }
  }
}
function renderFrame(t){
  const f=Math.floor(t*8); // 8 quadros únicos por segundo: movimento stop-motion
  background();
  // pequenos objetos de cenário
  oval(150,1490,85,26,'#b6a17b','#8e795b',6);
  oval(150,1455,56,48,'#e4c58e','#9c805b',7);
  pot();
  const growth=Math.min(1,Math.max(0,(f-8)/43));
  stem(growth);
  gardener(f);
  wateringCan(f);
  // textura e sombras de fotografia de miniatura
  const vignette=ctx.createRadialGradient(540,850,400,540,850,1250);
  vignette.addColorStop(0,'rgba(35,25,20,0)');vignette.addColorStop(1,'rgba(35,25,20,.23)');
  ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
  grain(9000+f,420);
}
window.render=(t)=>renderFrame(Math.max(0,Math.min(9.999,t)));
renderFrame(0);
