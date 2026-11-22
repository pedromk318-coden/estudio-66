// Curta 2D ilustrado — acabamento cinematográfico, 1080x1920, 10 s, 24 fps.
// Desenho em camadas + texturas cacheadas: detalhes ricos sem recalcular ruído em cada frame.
const W=1080,H=1920,canvas=document.querySelector('#film'),ctx=canvas.getContext('2d',{alpha:false});
const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t);return t*t*(3-2*t)},mix=(a,b,t)=>a+(b-a)*t;
const ease=(t,a,b)=>smooth((t-a)/(b-a));
const rr=(x,y,w,h,r,fill,stroke=null,lw=4)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}};
const ellipse=(x,y,rx,ry,fill,stroke=null,lw=4)=>{ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke();}};
const path=(d,fill,stroke=null,lw=4)=>{ctx.beginPath();d(ctx);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=stroke;ctx.stroke();}};
const line=(pts,color,width=6)=>{ctx.beginPath();ctx.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)ctx.lineTo(...pts[i]);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();};
const grad=(x,y,w,h,stops)=>{const g=ctx.createLinearGradient(x,y,x+w,y+h);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;};
function rng(seed){let n=seed>>>0;return()=>{n=(n*1664525+1013904223)>>>0;return n/4294967296;};}
// Textura de papel/filme criada uma vez; reaproveitada em todos os frames.
const paper=document.createElement('canvas');paper.width=512;paper.height=512;
{const p=paper.getContext('2d'),r=rng(7123);p.fillStyle='#b8a18b';p.fillRect(0,0,512,512);for(let i=0;i<9500;i++){p.globalAlpha=.025+r()*.055;p.fillStyle=r()>.5?'#fff0d8':'#342b32';p.fillRect(r()*512,r()*512,1+r()*2,1+r()*2);}p.globalAlpha=1;}
const paperPattern=ctx.createPattern(paper,'repeat');
const dust=Array.from({length:46},(_,i)=>({x:(i*197%1080),y:(i*311%1920),r:1+(i%3),phase:i*.71,speed:12+(i%7)*5}));
function glow(x,y,rx,ry,color,alpha=.5,blur=30){ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor=color;ctx.shadowBlur=blur;const g=ctx.createRadialGradient(x,y,0,x,y,Math.max(rx,ry));g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');ellipse(x,y,rx,ry,g);ctx.restore();}
function text(str,y,size,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.textAlign='center';ctx.font=`900 ${size}px Arial,sans-serif`;ctx.lineWidth=15;ctx.strokeStyle='rgba(25,17,24,.88)';ctx.lineJoin='round';ctx.shadowColor='#17121b';ctx.shadowBlur=18;ctx.strokeText(str,540,y);ctx.fillStyle='#fff4df';ctx.fillText(str,540,y);ctx.restore();}
function background(t){
 // Paredes em planos: tijolo desfocado, madeira, janela e balcão.
 ctx.fillStyle=grad(0,0,0,1510,[[0,'#1c2635'],[.48,'#49363a'],[1,'#211b29']]);ctx.fillRect(0,0,W,1510);
 for(let row=0;row<20;row++){const y=40+row*76;for(let col=-1;col<7;col++){const x=col*190+(row%2)*95;rr(x,y,178,62,9,row%3===0?'#65494a':'#765453','rgba(24,20,30,.32)',5);}}
 // placas de luz nas paredes e quadros de fundo
 rr(52,330,260,430,15,'#392a32','#b78a62',12);rr(75,355,214,180,8,'#6c3337','#d5b17c',8);
 glow(180,435,85,75,'#e6a54c',.36,42);rr(90,565,180,12,5,'#c49b70');rr(90,602,150,10,5,'#8e6c60');rr(90,634,170,10,5,'#8e6c60');
 // janela com céu noturno em profundidade
 rr(690,275,330,790,26,'#172333','#c39a70',19);
 rr(711,296,288,748,12,grad(710,300,280,700,[[0,'#52718b'],[.45,'#273f5b'],[1,'#182338']]));
 for(let i=0;i<16;i++){const x=725+(i*73)%260,y=365+(i*137)%620;glow(x,y,18+i%3*8,28+i%4*8,i%3?'#f2b66e':'#8bc4d2',.38,28);}
 line([[855,305],[855,1035]],'#d8b68f',15);line([[718,680],[992,680]],'#d8b68f',13);
 // chuva na parte externa do vidro
 ctx.save();ctx.globalAlpha=.4;for(let i=0;i<56;i++){const x=714+(i*59%280),y=(i*127+t*(150+i%4*18))%720+310;line([[x,y],[x-10,y+38]],'#c7e1e8',2.5);}ctx.restore();
 // prateleira com garrafas de silhueta irregular
 rr(45,820,280,320,16,'#33262e','#a57a5c',11);
 for(let i=0;i<3;i++){rr(60,910+i*88,250,12,5,'#c09469');for(let j=0;j<4;j++){const x=78+j*58;ctx.save();ctx.translate(x,845+i*88);ctx.rotate((j%2?1:-1)*.035);rr(0,0,36,62,9,['#b86b58','#d7a45f','#577c83','#8b6374'][(i+j)%4],'#493840',4);rr(8, -10,20,15,4,'#d9b98a');ctx.restore();}}
 // balcão e piso de madeira
 ctx.fillStyle=grad(0,1200,0,720,[[0,'#8e6858'],[.3,'#65483f'],[1,'#2d2730']]);ctx.fillRect(0,1200,W,720);
 for(let i=0;i<18;i++){ctx.globalAlpha=.13;line([[0,1260+i*39],[1080,1260+i*39]],i%2?'#e2b78d':'#211c26',3);}ctx.globalAlpha=1;
 rr(-30,1195,1140,100,18,'#68483f','#b18461',9);line([[0,1215],[1080,1215]],'rgba(255,216,169,.22)',4);
 // luminária com cone de luz
 line([[400,0],[430,210]],'#292331',12);glow(435,260,220,250,'#ffc96f',.19,75);glow(435,270,37,46,'#fff0b8',.92,54);ellipse(435,270,27,34,'#fff0bd','#e8c17b',5);
 // névoa de luz perto do balcão
 glow(530,1080,310,180,'#eaa45e',.12,70);
}
function cat(x,y,s,t){
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const tail=Math.sin(t*3.5)*.18;
 ellipse(0,135,112,24,'rgba(10,10,18,.32)');
 // cauda com volume e ponta peluda
 ctx.save();ctx.translate(-70,85);ctx.rotate(tail);path(p=>{p.moveTo(0,0);p.bezierCurveTo(-65,-35,-90,-100,-42,-137);p.bezierCurveTo(-5,-165,18,-128,-7,-112);p.bezierCurveTo(-35,-92,-16,-45,30,-32);p.closePath();},'#51414a','#342d35',9);line([[-40,-125],[-20,-145],[-2,-137]],'#b99a7c',8);ctx.restore();
 // corpo fofo e peito
 ellipse(0,72,82,94,grad(-55,0,125,170,[[0,'#e3c6a2'],[.6,'#b89477'],[1,'#80685f']]),'#453941',9);
 ellipse(5,92,48,62,'#e8d4b8','#9b7a68',4);
 // cabeça orgânica com bochechas
 ctx.save();ctx.translate(0,-40);ctx.rotate(Math.sin(t*1.7)*.025);
 path(p=>{p.moveTo(-88,4);p.lineTo(-82,-86);p.quadraticCurveTo(-78,-110,-53,-88);p.lineTo(-26,-65);p.quadraticCurveTo(0,-77,27,-65);p.lineTo(57,-94);p.quadraticCurveTo(82,-112,87,-72);p.lineTo(92,8);p.quadraticCurveTo(86,93,0,96);p.quadraticCurveTo(-86,90,-88,4);p.closePath();},grad(-80,-90,160,180,[[0,'#e5c49c'],[.55,'#c69e7e'],[1,'#9d7968']]),'#493b3b',9);
 // manchas e tufos de pelo
 for(let i=0;i<13;i++){const a=i*TAU/13;ellipse(Math.cos(a)*76,Math.sin(a)*65-4,5,9,'#a88770');}
 ellipse(-32,20,13,9,'rgba(224,139,119,.28)');ellipse(32,20,13,9,'rgba(224,139,119,.28)');
 // olhos grandes com brilho
 ellipse(-34,-2,11,16,'#302b32');ellipse(34,-2,11,16,'#302b32');ellipse(-38,-8,3,4,'#fff1d8');ellipse(30,-8,3,4,'#fff1d8');
 ellipse(0,30,10,7,'#a76564');path(p=>{p.moveTo(0,37);p.quadraticCurveTo(-8,48,-18,43);p.moveTo(0,37);p.quadraticCurveTo(8,48,18,43);},'transparent','#58434a',4);
 // bigodes
 line([[-18,35],[-72,25]],'#f0dfc8',3);line([[-18,43],[-70,50]],'#f0dfc8',3);line([[18,35],[72,25]],'#f0dfc8',3);line([[18,43],[70,50]],'#f0dfc8',3);
 // orelhas internas
 path(p=>{p.moveTo(-70,-75);p.lineTo(-58,-47);p.lineTo(-38,-64);p.closePath();},'#b97873');path(p=>{p.moveTo(70,-77);p.lineTo(57,-47);p.lineTo(39,-64);p.closePath();},'#b97873');
 // pingos no pelo
 for(let i=0;i<8;i++){ellipse(-58+i*16,-49+(i%3)*9,2.5,5,'rgba(255,246,226,.62)');}
 ctx.restore();
 // patas pequenas
 ellipse(-42,148,27,15,'#b58f75','#6b554e',5);ellipse(42,148,27,15,'#b58f75','#6b554e',5);
 ctx.restore();
}
function person(t){
 const reach=ease(t,4.4,6.6),smile=ease(t,7.1,8.3),bob=Math.sin(t*2.8)*3;
 ctx.save();ctx.translate(430,1010+bob);
 ellipse(0,620,220,34,'rgba(10,9,18,.34)');
 // calças e sapatos
 path(p=>{p.moveTo(-105,410);p.lineTo(-86,575);p.lineTo(-118,610);p.quadraticCurveTo(-70,632,-8,610);p.lineTo(0,450);p.closePath();},'#30394b','#242632',9);
 path(p=>{p.moveTo(12,445);p.lineTo(36,590);p.lineTo(10,612);p.quadraticCurveTo(65,635,130,610);p.lineTo(92,420);p.closePath();},'#30394b','#242632',9);
 ellipse(-75,615,72,25,'#342c32','#1e2029',7);ellipse(76,615,72,25,'#342c32','#1e2029',7);
 // camisa de tecido com volume
 path(p=>{p.moveTo(-145,28);p.quadraticCurveTo(-205,12,-220,105);p.lineTo(-180,440);p.quadraticCurveTo(0,495,180,440);p.lineTo(220,105);p.quadraticCurveTo(205,12,145,28);p.quadraticCurveTo(0,-15,-145,28);p.closePath();},grad(-190,0,390,470,[[0,'#8ba6b3'],[.35,'#577f91'],[.72,'#3e6478'],[1,'#263f54']]),'#283746',12);
 // mangas e dobras de tecido
 path(p=>{p.moveTo(-150,48);p.quadraticCurveTo(-205,95,-194,220);p.lineTo(-158,315);p.lineTo(-119,292);p.lineTo(-108,130);p.closePath();},'#6f95a2','#2d4555',8);
 path(p=>{p.moveTo(150,48);p.quadraticCurveTo(205,95,194,220);p.lineTo(158,315);p.lineTo(119,292);p.lineTo(108,130);p.closePath();},'#557f91','#2d4555',8);
 line([[-174,120],[-151,185],[-164,260]],'rgba(230,215,188,.28)',7);line([[174,120],[151,185],[164,260]],'rgba(230,215,188,.2)',7);
 // avental em couro/canvas, costura e bolso
 path(p=>{p.moveTo(-90,45);p.lineTo(-125,430);p.quadraticCurveTo(0,458,125,430);p.lineTo(90,45);p.closePath();},grad(-120,60,250,390,[[0,'#d7a879'],[.5,'#b98259'],[1,'#82563f']]),'#68473c',8);
 line([[-86,75],[0,126],[86,75]],'#e8c397',10);line([[-106,420],[106,420]],'rgba(75,48,40,.5)',5);
 rr(-50,235,100,78,9,'rgba(104,65,49,.24)','#e0b98e',5);line([[-32,250],[32,250]],'#edc99d',4);
 for(let i=0;i<6;i++)ellipse(0,150+i*42,4,4,'#f2d3a5');
 // braço esquerdo pendente
 path(p=>{p.moveTo(-170,100);p.quadraticCurveTo(-210,180,-194,300);p.lineTo(-170,355);p.quadraticCurveTo(-144,373,-132,342);p.lineTo(-150,220);p.lineTo(-125,130);p.closePath();},'#d99b78','#704e49',7);
 // braço direito se abaixa para oferecer a tigela
 const hx=mix(150,285,reach),hy=mix(120,365,reach);
 path(p=>{p.moveTo(150,100);p.quadraticCurveTo(205,150,220,220);p.lineTo(hx,hy);p.quadraticCurveTo(hx+15,hy+22,hx-12,hy+35);p.lineTo(hx-43,hy+10);p.lineTo(176,250);p.lineTo(125,130);p.closePath();},'#d99b78','#704e49',7);
 // pescoço
 rr(-48,-82,96,115,25,'#c98768','#714b45',6);
 // cabeça com queixo e bochechas
 ctx.save();ctx.translate(0,-176);ctx.rotate(Math.sin(t*1.5)*.018);
 path(p=>{p.moveTo(-145,-30);p.quadraticCurveTo(-150,-145,-70,-170);p.quadraticCurveTo(20,-207,112,-148);p.quadraticCurveTo(157,-105,143,-8);p.quadraticCurveTo(132,105,35,140);p.quadraticCurveTo(-35,158,-105,103);p.quadraticCurveTo(-155,65,-145,-30);p.closePath();},grad(-120,-150,260,300,[[0,'#f1c39a'],[.42,'#e2aa82'],[1,'#b9755d']]),'#604448',10);
 // orelhas
 ellipse(-143,8,22,36,'#d99b78','#704b47',6);ellipse(143,8,22,36,'#d99b78','#704b47',6);
 ellipse(-145,8,8,16,'#b97867');ellipse(145,8,8,16,'#b97867');
 // cabelo com volume e cachos individuais
 path(p=>{p.moveTo(-148,-25);p.quadraticCurveTo(-172,-155,-75,-192);p.quadraticCurveTo(10,-232,102,-181);p.quadraticCurveTo(168,-142,145,-54);p.lineTo(118,-25);p.quadraticCurveTo(65,-82,8,-73);p.quadraticCurveTo(-75,-48,-148,-25);p.closePath();},'#302a34','#4c3940',9);
 const curls=[[-119,-118],[-88,-157],[-47,-174],[-7,-181],[35,-177],[77,-157],[112,-125],[-132,-79],[-95,-103],[-54,-119],[-10,-126],[34,-120],[78,-104],[121,-78]];
 for(let i=0;i<curls.length;i++){const [x,y]=curls[i];ctx.beginPath();ctx.arc(x,y,17+(i%3)*2,.25,Math.PI*1.9);ctx.strokeStyle=i%2?'#6d5360':'#80616a';ctx.lineWidth=9;ctx.stroke();ctx.beginPath();ctx.arc(x-4,y-4,8,.2,Math.PI*1.6);ctx.strokeStyle='rgba(213,166,139,.34)';ctx.lineWidth=4;ctx.stroke();}
 // sobrancelhas e olhos com pálpebras
 line([[-80,-28],[-38,-37]],'#392d37',11);line([[38,-37],[80,-28]],'#392d37',11);
 ellipse(-56,-3,13,19,'#302c35');ellipse(56,-3,13,19,'#302c35');ellipse(-60,-10,4,5,'#fff0d8');ellipse(52,-10,4,5,'#fff0d8');
 // nariz em planos e luz
 path(p=>{p.moveTo(2,0);p.quadraticCurveTo(15,33,0,47);p.quadraticCurveTo(-9,52,-17,45);},'transparent','#a66b59',7);ellipse(5,48,11,5,'rgba(130,70,59,.45)');
 // bochechas e sorriso progressivo
 ellipse(-92,43,21,13,'rgba(220,120,105,.24)');ellipse(92,43,21,13,'rgba(220,120,105,.24)');
 ctx.beginPath();ctx.moveTo(-26,84);ctx.quadraticCurveTo(0,84+smile*23,28,84);ctx.strokeStyle='#75474a';ctx.lineWidth=8;ctx.stroke();
 if(smile>.55){ctx.beginPath();ctx.ellipse(0,89,14,4,0,0,Math.PI);ctx.fillStyle='#fff0d8';ctx.fill();}
 // brilho quente lateral
 ctx.save();ctx.globalAlpha=.42;ellipse(-90,-62,24,65,'#ffe0b1');ctx.restore();
 ctx.restore();
 // gola do avental e mangas
 line([[-65,24],[0,80],[65,24]],'#e7c89f',10);
 ctx.restore();
}
function bowlAndBlanket(t){
 // tigela de água e pequeno pano; entram com a ação da personagem.
 const a=ease(t,5.2,6.4);ctx.save();ctx.globalAlpha=a;
 ellipse(810,1490,102,27,'rgba(20,17,24,.24)');
 ctx.beginPath();ctx.moveTo(715,1430);ctx.quadraticCurveTo(810,1402,910,1430);ctx.lineTo(890,1500);ctx.quadraticCurveTo(810,1522,735,1500);ctx.closePath();ctx.fillStyle='#b9c8bd';ctx.fill();ctx.lineWidth=7;ctx.strokeStyle='#536d68';ctx.stroke();
 ellipse(812,1430,98,23,'#e5e0c9','#536d68',6);ellipse(812,1430,74,13,'#9bb9b8');
 // tecido dobrado
 ctx.save();ctx.translate(650,1500);ctx.rotate(-.12);rr(-60,-20,130,58,12,'#d7b28b','#896a5b',5);line([[-42,-6],[45,-6]],'rgba(255,239,210,.65)',5);ctx.restore();
 ctx.restore();
}
function rainAndDust(t){
 // poeira iluminada no interior e reflexos sutis
 ctx.save();ctx.globalCompositeOperation='screen';
 for(const d of dust){const y=(d.y-t*d.speed+2100)%1920;ctx.globalAlpha=.15+.25*(.5+.5*Math.sin(t*1.2+d.phase));ellipse(d.x+Math.sin(t*.7+d.phase)*9,y,d.r,d.r,'#ffe1a7');}
 ctx.restore();
 // pingos escorrendo no vidro em primeiro plano
 ctx.save();ctx.globalAlpha=.25;for(let i=0;i<22;i++){const x=710+(i*83%290),y=(i*173+t*(45+i%4*12))%720+330;line([[x,y],[x-2,y+22+(i%3)*8]],'#d4edf0',2);}ctx.restore();
}
function scene(t){
 ctx.clearRect(0,0,W,H);
 const camera=1+ease(t,0,10)*.035;
 ctx.save();ctx.translate(540,960);ctx.scale(camera,camera);ctx.translate(-540,-960);
 background(t);
 // personagem ao fundo e gatinho mais próximo da janela
 cat(830,1285,1.12,t);
 person(t);
 bowlAndBlanket(t);
 rainAndDust(t);
 // profundidade: vinheta e halo quente no ponto de encontro
 const v=ctx.createRadialGradient(540,820,350,540,900,1280);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(.7,'rgba(13,10,20,.12)');v.addColorStop(1,'rgba(10,8,17,.53)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);
 glow(670,1270,220,260,'#f0b66c',ease(t,6.5,9.8)*.13,60);
 // camada de textura aplicada à imagem toda, não aos contornos.
 ctx.globalAlpha=.11;ctx.globalCompositeOperation='soft-light';ctx.fillStyle=paperPattern;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 ctx.restore();
 if(t<3.2)text('UMA NOITE DE CHUVA',1450,58,ease(t,.4,1.0)*(1-ease(t,2.45,3.1)));
 else if(t<7.2)text('ELE NÃO TINHA PRA ONDE IR',1450,51,ease(t,3.2,3.8)*(1-ease(t,6.5,7.1)));
 else text('UM POUCO DE CALOR MUDA TUDO',1450,46,ease(t,7.1,7.7));
}
window.DUR=10;
window.render=t=>scene(clamp(t,0,10));
window.TEXTS=t=>{const s=t<3.2?'UMA NOITE DE CHUVA':t<7.2?'ELE NÃO TINHA PRA ONDE IR':'UM POUCO DE CALOR MUDA TUDO';return[{id:'caption',text:s,x0:40,y0:1380,x1:1040,y1:1515}];};
window.READY=true;
