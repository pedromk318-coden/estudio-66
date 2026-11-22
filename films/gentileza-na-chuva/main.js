// Animação original 2D recortada — 1080x1920, 10 s, 24 fps.
const W=1080,H=1920,canvas=document.querySelector('#film'),ctx=canvas.getContext('2d');
const TAU=Math.PI*2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
const mix=(a,b,t)=>a+(b-a)*t;
const ease=(t,a,b)=>smooth((t-a)/(b-a));
const rr=(x,y,w,h,r,fill,stroke=null,lw=4)=>{
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
 if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}
};
function grad(x,y,w,h,stops){const g=ctx.createLinearGradient(x,y,x+w,y+h);for(const s of stops)g.addColorStop(s[0],s[1]);return g;}
function ellipse(x,y,rx,ry,fill,stroke=null,lw=4){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}}
function line(points,color,width=8){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function text(str,y,size,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.font=`900 ${size}px Arial,sans-serif`;ctx.lineWidth=16;ctx.strokeStyle='rgba(24,17,25,.82)';ctx.lineJoin='round';ctx.strokeText(str,540,y);ctx.fillStyle='#fff8e9';ctx.fillText(str,540,y);ctx.restore();}
function grain(){ctx.save();ctx.globalAlpha=.055;for(let i=0;i<1800;i++){const x=(i*7919%1080),y=(i*3571%1920);ctx.fillStyle=i%2?'#fff':'#1b1020';ctx.fillRect(x,y,2,2);}ctx.restore();}
function background(t){
 const wall=grad(0,0,0,1450,[[0,'#26303a'],[.45,'#4c3a3a'],[1,'#211d2b']]);ctx.fillStyle=wall;ctx.fillRect(0,0,W,1500);
 // tijolos desfocados
 ctx.save();ctx.globalAlpha=.18;for(let row=0;row<18;row++){let y=80+row*78;for(let col=-1;col<6;col++){let x=col*230+(row%2)*115;rr(x,y,215,58,10,'#9b7161');}}ctx.restore();
 // janela molhada
 rr(690,330,310,720,26,'#172c3b','#b38b65',18);
 const win=grad(700,340,300,700,[[0,'#355c75'],[.5,'#1b314b'],[1,'#172338']]);rr(710,350,270,680,12,win);
 line([[845,355],[845,1025]],'#d6b18a',14);line([[715,700],[975,700]],'#d6b18a',14);
 // luzes da rua
 for(let i=0;i<8;i++){let x=725+(i*83)%250,y=430+(i*137)%480;ctx.save();ctx.globalAlpha=.35;ctx.filter='blur(22px)';ellipse(x,y,24,36,i%2?'#f8b75e':'#8bc7db');ctx.restore();}
 // balcão e piso
 ctx.fillStyle=grad(0,1250,0,670,[[0,'#805c50'],[1,'#302733']]);ctx.fillRect(0,1250,W,670);
 rr(-40,1250,1160,95,18,'#68483f','#a77b5d',8);
 // prateleiras
 rr(45,410,260,450,18,'#372a31','#9c7359',12);
 for(let i=0;i<3;i++){rr(65,535+i*105,220,14,5,'#b8895e');for(let j=0;j<3;j++){let x=90+j*65;rr(x,455+i*105,42,76,10,['#bd7155','#d8a15e','#597e83'][(i+j)%3]);}}
 // luminária quente
 line([[390,0],[430,220]],'#302634',13);ctx.save();ctx.shadowColor='#ffd27c';ctx.shadowBlur=100;ellipse(435,270,46,55,'#fff0b0');ctx.restore();
 ctx.save();ctx.globalAlpha=.17;ctx.filter='blur(40px)';ellipse(435,300,210,250,'#ffc66d');ctx.restore();
 // chuva na janela
 ctx.save();ctx.globalAlpha=.34;for(let i=0;i<34;i++){let x=700+(i*67%290),y=(i*151+t*180)%700+350;line([[x,y],[x-12,y+45]],'#c4e3e9',3);}ctx.restore();
}
function cat(x,y,s,t){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 // sombra
 ellipse(0,108,105,22,'rgba(10,12,20,.25)');
 // cauda
 ctx.save();ctx.translate(-55,30);ctx.rotate(Math.sin(t*4)*.18);line([[0,0],[-55,-30],[-75,-85]],'#4b3d40',24);line([[0,0],[-55,-30],[-75,-85]],'#b58b6c',12);ctx.restore();
 // corpo
 ellipse(0,45,75,83,grad(-50,-30,100,170,[[0,'#d9b88e'],[1,'#8e6e5e']]),'#493b3b',8);
 // cabeça e orelhas
 ctx.save();ctx.translate(0,-48);ctx.rotate(Math.sin(t*2)*.025);
 ctx.beginPath();ctx.moveTo(-72,-5);ctx.lineTo(-62,-83);ctx.lineTo(-12,-48);ctx.lineTo(20,-48);ctx.lineTo(63,-85);ctx.lineTo(76,-5);ctx.quadraticCurveTo(75,65,0,70);ctx.quadraticCurveTo(-75,60,-72,-5);ctx.closePath();ctx.fillStyle='#c69a73';ctx.fill();ctx.lineWidth=8;ctx.strokeStyle='#493b3b';ctx.stroke();
 ellipse(-36,2,8,12,'#292632');ellipse(36,2,8,12,'#292632');ellipse(0,30,11,8,'#a65f5b');
 line([[-8,40],[0,47],[8,40]],'#493b3b',4);
 // gotinhas
 for(let i=0;i<7;i++){ellipse(-54+i*18,-35+(i%2)*18,3,6,'rgba(225,235,226,.7)');}
 ctx.restore();ctx.restore();
}
function person(t,close=false){
 const move=ease(t,3.1,5.3),reach=ease(t,5.0,7.2),smile=ease(t,7.1,8.4);
 ctx.save();
 // corpo com avental
 let bob=Math.sin(t*3)*4;
 ctx.translate(450,1050+bob);
 // sombra
 ellipse(0,610,230,35,'rgba(13,13,23,.32)');
 // pernas
 line([[-70,470],[-90,590]],'#27303e',34);line([[70,470],[95,590]],'#27303e',34);
 rr(-135,570,100,34,16,'#332b32');rr(50,570,100,34,16,'#332b32');
 // tronco
 ctx.beginPath();ctx.moveTo(-150,30);ctx.quadraticCurveTo(-180,10,-195,110);ctx.lineTo(-160,490);ctx.quadraticCurveTo(0,540,160,490);ctx.lineTo(195,110);ctx.quadraticCurveTo(180,10,150,30);ctx.quadraticCurveTo(0,-25,-150,30);ctx.closePath();
 ctx.fillStyle=grad(-180,0,350,500,[[0,'#6b8f9b'],[.5,'#426c7b'],[1,'#29495a']]);ctx.fill();ctx.lineWidth=12;ctx.strokeStyle='#263541';ctx.stroke();
 // avental
 ctx.beginPath();ctx.moveTo(-95,55);ctx.lineTo(-125,480);ctx.quadraticCurveTo(0,510,125,480);ctx.lineTo(95,55);ctx.closePath();ctx.fillStyle='#c48b5d';ctx.fill();ctx.lineWidth=7;ctx.strokeStyle='#63483f';ctx.stroke();
 line([[-90,95],[0,140],[90,95]],'#e4b17b',12);
 // braço esquerdo
 line([[-155,100],[-210,260],[-180,370]],'#d99a70',50);ellipse(-180,380,31,28,'#d99a70');
 // braço direito alcança
 const handX=mix(155,280,reach),handY=mix(135,335,reach);
 line([[155,100],[210,220],[handX,handY]],'#d99a70',52);ellipse(handX,handY,31,28,'#d99a70');
 // pescoço e cabeça
 rr(-50,-45,100,105,28,'#c9825c');
 ctx.save();ctx.translate(0,-145);ctx.rotate(Math.sin(t*2)*.018);
 ellipse(0,0,145,170,grad(-100,-130,210,300,[[0,'#f2bd88'],[1,'#c9825c']]),'#543c3b',10);
 // cabelo
 ctx.beginPath();ctx.moveTo(-143,-25);ctx.quadraticCurveTo(-150,-190,-20,-190);ctx.quadraticCurveTo(95,-210,145,-90);ctx.lineTo(120,-35);ctx.quadraticCurveTo(45,-100,-30,-70);ctx.quadraticCurveTo(-100,-55,-143,-25);ctx.closePath();ctx.fillStyle='#302b34';ctx.fill();ctx.lineWidth=8;ctx.strokeStyle='#49363a';ctx.stroke();
 // mechas
 for(let i=0;i<7;i++){line([[-115+i*34,-110-(i%2)*12],[-90+i*34,-148]],'#66515a',9);}
 // olhos/sobrancelhas
 line([[-75,-15],[-35,-20]],'#302c35',10);line([[35,-20],[75,-15]],'#302c35',10);
 ellipse(-53,12,10,17,'#302c35');ellipse(53,12,10,17,'#302c35');
 ellipse(-85,55,20,12,'rgba(226,120,105,.35)');ellipse(85,55,20,12,'rgba(226,120,105,.35)');
 if(smile>.3){ctx.beginPath();ctx.moveTo(-24,82);ctx.quadraticCurveTo(0,95+smile*12,28,80);ctx.strokeStyle='#75464a';ctx.lineWidth=8;ctx.stroke();}else line([[-22,84],[22,84]],'#75464a',7);
 ctx.restore();
 // gola e botões
 ellipse(0,30,28,20,'#e9c69a');for(let i=0;i<4;i++)ellipse(0,190+i*58,5,5,'#f0d0a5');
 ctx.restore();
}
function scene(t){
 ctx.clearRect(0,0,W,H);
 background(t);
 const reveal=ease(t,0,1.1);
 // gato do lado da porta
 cat(820,1280,1.0,t);
 // personagem
 person(t);
 // copo e pano no balcão
 rr(780,1135,105,120,16,'#d7b68a','#684c42',8);ellipse(832,1138,53,15,'#f3dfbd','#684c42',6);
 line([[800,1190],[860,1190]],'#a06b4f',5);
 // pequena tigela no chão aparece
 const bowl=ease(t,5.3,6.6);ctx.save();ctx.globalAlpha=bowl;ellipse(820,1475,85,27,'#b5c9c2','#425e62',7);ellipse(820,1467,66,18,'#e6e2c8');ctx.restore();
 // composição/câmera simulada: escurece bordas
 const vign=ctx.createRadialGradient(540,850,350,540,900,1250);vign.addColorStop(0,'rgba(0,0,0,0)');vign.addColorStop(1,'rgba(10,8,17,.48)');ctx.fillStyle=vign;ctx.fillRect(0,0,W,H);
 // subtítulo em três entradas
 if(t<3.2)text('UMA NOITE DE CHUVA',1450,58,ease(t,.5,1.1)*(1-ease(t,2.4,3.1)));
 else if(t<7.2)text('ELE NÃO TINHA PRA ONDE IR',1450,52,ease(t,3.2,3.8)*(1-ease(t,6.5,7.1)));
 else text('UM POUCO DE CALOR MUDA TUDO',1450,47,ease(t,7.1,7.7));
 // brilho quente de final
 const warm=ease(t,7.2,9.8);ctx.save();ctx.globalAlpha=warm*.18;ctx.fillStyle='#ffc879';ctx.fillRect(0,0,W,H);ctx.restore();
 grain();
}
window.DUR=10;
window.render=(t)=>scene(clamp(t,0,10));
window.TEXTS=(t)=>{const s=t<3.2?'UMA NOITE DE CHUVA':t<7.2?'ELE NÃO TINHA PRA ONDE IR':'UM POUCO DE CALOR MUDA TUDO';return [{id:'caption',text:s,x0:40,y0:1380,x1:1040,y1:1515}];};
window.READY=true;
