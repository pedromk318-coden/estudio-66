const W=1080,H=1920,cv=document.getElementById('c'),g=cv.getContext('2d');
window.DUR=10;window.EV=[];
const TAU=Math.PI*2,clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),mix=(a,b,t)=>a+(b-a)*t;
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const ink='#211c20',skin='#e9ad83',skinShade='#bd795d',cream='#f3e8d3',navy='#28394a',navyHi='#3b5263',gold='#d7ad68';
function path(draw,fill,stroke=ink,lw=9){g.beginPath();draw(g);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.lineJoin='round';g.lineCap='round';g.stroke()}}
function line(draw,color=ink,w=7){g.beginPath();draw(g);g.strokeStyle=color;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.stroke()}
function ellipse(x,y,rx,ry,fill,stroke=null,lw=5){g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke()}}
function grad(x0,y0,x1,y1,a,b){const z=g.createLinearGradient(x0,y0,x1,y1);z.addColorStop(0,a);z.addColorStop(1,b);return z}
function text(s,x,y,size,color,weight='700',align='center'){g.font=weight+' '+size+'px Georgia';g.textAlign=align;g.textBaseline='middle';g.fillStyle=color;g.fillText(s,x,y)}
function room(t){
 const bg=grad(0,0,0,H,'#25364a','#111a28');g.fillStyle=bg;g.fillRect(0,0,W,H);
 // warm light spilling from the window
 const glow=g.createRadialGradient(250,430,20,250,520,900);glow.addColorStop(0,'rgba(255,211,147,.48)');glow.addColorStop(1,'rgba(255,211,147,0)');g.fillStyle=glow;g.fillRect(0,0,W,H);
 // window, curtains and distant city
 g.save();g.filter='blur(3px)';
 path(p=>{p.moveTo(70,170);p.quadraticCurveTo(65,140,100,140);p.lineTo(480,140);p.quadraticCurveTo(515,145,510,180);p.lineTo(510,860);p.lineTo(70,860);p.closePath()},'#d9b98d','#171d27',18);
 g.fillStyle='#71899a';g.fillRect(90,165,400,665);
 for(let i=0;i<8;i++){g.fillStyle=i%2?'#4d6578':'#8093a0';g.fillRect(105+i*51,390+(i%3)*45,36,420-(i%3)*45)}
 g.fillStyle='rgba(250,220,173,.55)';g.fillRect(285,165,10,665);g.fillRect(90,490,400,12);
 path(p=>{p.moveTo(45,110);p.bezierCurveTo(120,190,90,650,125,900);p.quadraticCurveTo(70,860,35,910);p.closePath()},'#6d4541','#211c20',12);
 path(p=>{p.moveTo(520,110);p.bezierCurveTo(450,240,490,690,455,900);p.quadraticCurveTo(520,860,545,910);p.closePath()},'#6d4541','#211c20',12);
 // bookcase silhouette and books
 path(p=>{p.moveTo(700,230);p.quadraticCurveTo(700,200,730,200);p.lineTo(1030,200);p.lineTo(1030,1310);p.lineTo(690,1310);p.closePath()},'#493b35','#171d27',14);
 for(let y=430;y<1240;y+=260){g.fillStyle='#b08a60';g.fillRect(710,y,300,13);for(let i=0;i<8;i++){let x=725+i*35,h=90+(i*31%100);g.save();g.translate(x,y-h);g.rotate((i%3-1)*.04);path(p=>{p.moveTo(0,0);p.quadraticCurveTo(5,-8,12,0);p.lineTo(28,0);p.lineTo(28,h);p.lineTo(0,h);p.closePath()},['#8a5145','#4f6871','#b68c54','#d4c4a4'][i%4],'#251f20',3);g.restore()}}
 g.restore();
 // wall molding and flag
 line(p=>{p.moveTo(0,1330);p.bezierCurveTo(300,1305,720,1350,1080,1315)},'rgba(230,204,165,.5)',9);
 g.save();g.translate(870,300);path(p=>{p.moveTo(0,0);p.lineTo(0,300);p.quadraticCurveTo(-5,330,-18,338)},'#8b8b83','#211c20',9);
 path(p=>{p.moveTo(8,22);p.bezierCurveTo(85,0,150,55,220,28);p.lineTo(220,180);p.bezierCurveTo(145,205,80,145,8,175);p.closePath()},'#315d48','#1b2927',7);
 path(p=>{p.moveTo(28,52);p.lineTo(110,42);p.lineTo(190,94);p.lineTo(108,145);p.closePath()},'#d6bd74',null);
 ellipse(110,94,25,25,'#e7dfc7');g.restore();
 // desk foreground
 g.save();g.filter='blur(2px)';
 path(p=>{p.moveTo(0,1510);p.bezierCurveTo(260,1450,790,1485,1080,1435);p.lineTo(1080,1920);p.lineTo(0,1920);p.closePath()},grad(0,1500,0,1920,'#74513c','#2d2928'),'#211c20',16);
 path(p=>{p.moveTo(80,1530);p.bezierCurveTo(350,1470,790,1510,1030,1460)},'none','#b9875b',10);
 // desk lamp
 path(p=>{p.moveTo(870,1470);p.bezierCurveTo(890,1350,920,1260,960,1210);p.lineTo(1000,1225);p.bezierCurveTo(970,1320,945,1400,940,1480)},'#31343a','#1c2026',13);
 path(p=>{p.moveTo(915,1230);p.quadraticCurveTo(905,1160,985,1130);p.quadraticCurveTo(1060,1180,1010,1245);p.closePath()},'#d2a763','#2a2220',10);
 g.restore();
 // cinematic vignette
 const v=g.createRadialGradient(540,850,300,540,960,1200);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.58)');g.fillStyle=v;g.fillRect(0,0,W,H);
}
function limb(a,b,width,color,elbow=null){
 path(p=>{p.moveTo(a[0],a[1]);if(elbow)p.quadraticCurveTo(elbow[0],elbow[1],b[0],b[1]);else p.quadraticCurveTo((a[0]+b[0])/2-18,(a[1]+b[1])/2,(a[0]+b[0])/2,(a[1]+b[1])/2);p.lineTo(b[0],b[1]);p.quadraticCurveTo(b[0]+width*.55,b[1]+width*.2,b[0]+width*.3,b[1]+width*.7);p.quadraticCurveTo((a[0]+b[0])/2+width*.2,(a[1]+b[1])/2+width*.5,a[0]-width*.35,a[1]+width*.5);p.closePath()},color,ink,8);
}
function hand(x,y,rot=0){
 g.save();g.translate(x,y);g.rotate(rot);
 path(p=>{p.moveTo(-5,4);p.bezierCurveTo(-28,-4,-34,-28,-20,-35);p.bezierCurveTo(-7,-40,0,-22,3,-12);p.bezierCurveTo(4,-34,13,-50,24,-43);p.bezierCurveTo(36,-34,22,-14,20,-5);p.bezierCurveTo(34,-30,49,-26,50,-12);p.bezierCurveTo(51,0,34,12,29,19);p.bezierCurveTo(45,10,58,20,49,34);p.bezierCurveTo(34,57,2,53,-15,37);p.bezierCurveTo(-28,26,-22,12,-5,4);p.closePath()},cream,ink,7);
 line(p=>{p.moveTo(3,0);p.quadraticCurveTo(16,4,19,17);p.moveTo(24,1);p.quadraticCurveTo(34,5,34,16)},'#b9b1a4',3);g.restore();
}
function character(t,mode='full'){
 const close=mode==='close',scale=close?1.42:1, bob=Math.sin(t*5.2)*7;
 const cx=close?545:530, base=close?1540:1580;
 g.save();g.translate(cx,base+bob);g.scale(scale,scale);
 // shadow and back leg silhouettes
 g.save();g.filter='blur(25px)';ellipse(0,5,235,48,'rgba(0,0,0,.55)');g.restore();
 const walk=mode==='walk'?Math.sin(t*8):0;
 // legs, trousers and polished shoes
 limb([-68,-310],[-93+walk*20,-75],42,'#283746',[-95,-205]);
 limb([68,-310],[88-walk*20,-78],42,'#34495a',[105,-205]);
 path(p=>{p.moveTo(-132+walk*20,-83);p.bezierCurveTo(-180,-65,-200,-36,-183,-15);p.bezierCurveTo(-165,8,-75,8,-54,-16);p.bezierCurveTo(-40,-40,-74,-82,-132+walk*20,-83);p.closePath()},'#1b2229',ink,10);
 path(p=>{p.moveTo(50-walk*20,-80);p.bezierCurveTo(8,-60,5,-28,27,-9);p.bezierCurveTo(54,11,148,7,165,-16);p.bezierCurveTo(180,-42,130,-80,50-walk*20,-80);p.closePath()},'#1b2229',ink,10);
 line(p=>{p.moveTo(-165,-28);p.quadraticCurveTo(-115,-45,-67,-28);p.moveTo(35,-27);p.quadraticCurveTo(95,-44,147,-24)},'#c7bda9',5);
 // coat silhouette, waistcoat, shoulders
 path(p=>{p.moveTo(-105,-650);p.bezierCurveTo(-160,-630,-182,-570,-173,-480);p.bezierCurveTo(-165,-390,-148,-300,-116,-255);p.bezierCurveTo(-65,-220,75,-220,128,-255);p.bezierCurveTo(160,-320,176,-435,171,-520);p.bezierCurveTo(166,-610,130,-650,93,-665);p.bezierCurveTo(38,-690,-54,-685,-105,-650);p.closePath()},grad(-170,-650,170,-240,'#41586a','#202d3a'),ink,12);
 path(p=>{p.moveTo(-65,-650);p.bezierCurveTo(-50,-580,-48,-450,-58,-270);p.quadraticCurveTo(0,-245,65,-270);p.bezierCurveTo(50,-450,55,-580,70,-650);p.bezierCurveTo(22,-672,-18,-672,-65,-650);p.closePath()},'#d9cdb6',ink,7);
 // lapels, collar and tie
 path(p=>{p.moveTo(-96,-650);p.bezierCurveTo(-72,-620,-42,-588,0,-566);p.lineTo(-48,-490);p.bezierCurveTo(-102,-535,-125,-585,-96,-650);p.closePath()},'#243341',ink,7);
 path(p=>{p.moveTo(95,-650);p.bezierCurveTo(67,-610,36,-588,0,-566);p.lineTo(49,-490);p.bezierCurveTo(99,-540,122,-602,95,-650);p.closePath()},'#344a5b',ink,7);
 path(p=>{p.moveTo(-30,-665);p.quadraticCurveTo(0,-637,30,-665);p.lineTo(18,-620);p.lineTo(0,-596);p.lineTo(-18,-620);p.closePath()},cream,ink,5);
 path(p=>{p.moveTo(-13,-606);p.quadraticCurveTo(0,-620,13,-606);p.lineTo(27,-480);p.quadraticCurveTo(0,-455,-27,-480);p.closePath()},'#9a5148',ink,6);
 path(p=>{p.moveTo(-24,-478);p.lineTo(0,-452);p.lineTo(24,-478);p.lineTo(0,-430);p.closePath()},'#9a5148',ink,5);
 for(let i=0;i<3;i++)ellipse(0,-385+i*45,5,5,gold);
 // arms with elbows, slight gesture
 const gesture=mode==='walk'?Math.sin(t*8)*28:Math.sin(t*2.3)*10;
 limb([-145,-605],[-205+gesture,-420],39,'#354b5b',[-205,-525]);
 limb([145,-605],[205-gesture,-425],39,'#2b3d4d',[208,-520]);
 hand(-210+gesture,-414,-.55);hand(208-gesture,-420,.5);
 // neck
 path(p=>{p.moveTo(-43,-735);p.bezierCurveTo(-50,-700,-44,-665,-28,-648);p.quadraticCurveTo(0,-625,31,-650);p.bezierCurveTo(48,-680,44,-715,39,-744);p.closePath()},skin,ink,8);
 // ears behind head
 ellipse(-119,-820,34,49,skin,ink,8);ellipse(119,-820,34,49,skin,ink,8);
 ellipse(-119,-821,13,23,skinShade);ellipse(119,-821,13,23,skinShade);
 // head shape: sculpted jaw, cheek and forehead
 path(p=>{p.moveTo(-112,-900);p.bezierCurveTo(-111,-1000,-62,-1065,12,-1067);p.bezierCurveTo(96,-1067,130,-1000,119,-908);p.bezierCurveTo(116,-850,96,-788,55,-755);p.bezierCurveTo(27,-730,-28,-733,-58,-758);p.bezierCurveTo(-98,-790,-120,-847,-112,-900);p.closePath()},grad(-100,-1050,130,-740,'#f5c49b','#d9916c'),ink,10);
 // cheek warm tones
 g.save();g.globalAlpha=.24;ellipse(-73,-837,28,15,'#bd6258');ellipse(75,-837,28,15,'#bd6258');g.restore();
 // hair silhouette with sculpted locks
 path(p=>{p.moveTo(-118,-913);p.bezierCurveTo(-148,-1000,-103,-1085,-25,-1092);p.bezierCurveTo(2,-1145,94,-1116,116,-1054);p.bezierCurveTo(146,-1015,134,-955,111,-930);p.bezierCurveTo(85,-963,65,-982,38,-984);p.bezierCurveTo(9,-951,-33,-945,-66,-957);p.bezierCurveTo(-80,-935,-99,-920,-118,-913);p.closePath()},'#30272a',ink,10);
 path(p=>{p.moveTo(-91,-1010);p.bezierCurveTo(-63,-1084,-2,-1084,20,-1061);p.bezierCurveTo(47,-1093,93,-1071,103,-1035);p.bezierCurveTo(70,-1050,47,-1038,29,-1017);p.bezierCurveTo(-3,-986,-53,-989,-91,-1010);p.closePath()},'#4c3734',null);
 line(p=>{p.moveTo(-92,-1005);p.bezierCurveTo(-76,-1044,-52,-1058,-30,-1061);p.moveTo(30,-1064);p.quadraticCurveTo(70,-1081,92,-1046)},'#795044',7);
 // brows and eyes with expressive animation
 const blink=(Math.sin(t*3.4+1.2)>.985)?1:0,look=Math.sin(t*1.7)*5;
 path(p=>{p.moveTo(-82,-914);p.quadraticCurveTo(-55,-933,-29,-915);p.quadraticCurveTo(-54,-900,-82,-914)},'#30272a',ink,5);
 path(p=>{p.moveTo(28,-915);p.quadraticCurveTo(55,-936,83,-914);p.quadraticCurveTo(55,-899,28,-915)},'#30272a',ink,5);
 for(const x of [-53,53]){
  path(p=>{p.moveTo(x-22,-888);p.bezierCurveTo(x-20,-910,x+19,-910,x+23,-887);p.bezierCurveTo(x+17,-862,x-17,-861,x-22,-888);p.closePath()},'#fff8e9',ink,5);
  if(!blink)ellipse(x+look,-887,9,15,'#49372f',ink,2);
  else line(p=>{p.moveTo(x-18,-887);p.quadraticCurveTo(x,-879,x+18,-887)},ink,5);
  ellipse(x+look-3,-893,3,4,'#fff');
 }
 // nose with bridge and nostril
 path(p=>{p.moveTo(-4,-880);p.bezierCurveTo(-8,-858,-19,-839,-11,-828);p.quadraticCurveTo(4,-817,24,-833);p.quadraticCurveTo(29,-840,17,-845)},'none',skinShade,7);
 line(p=>{p.moveTo(-9,-827);p.quadraticCurveTo(3,-819,15,-829)},'#925d4d',5);
 // mouth changes between smile and speaking
 const talk=Math.sin(t*8)>.25, mouthY=-790;
 path(p=>{p.moveTo(-34,mouthY);p.quadraticCurveTo(0,mouthY+(talk?15:25),36,mouthY);p.quadraticCurveTo(20,mouthY+(talk?45:37),0,mouthY+(talk?42:34));p.quadraticCurveTo(-22,mouthY+36,-34,mouthY);p.closePath()},'#6d3033',ink,5);
 if(!talk){path(p=>{p.moveTo(-26,-789);p.quadraticCurveTo(0,-777,28,-789);p.lineTo(21,-781);p.quadraticCurveTo(0,-772,-21,-781);p.closePath()},'#fff0d9',null)}
 line(p=>{p.moveTo(-20,-748);p.quadraticCurveTo(0,-740,18,-749)},'rgba(119,69,57,.7)',3);
 // fine face accents
 line(p=>{p.moveTo(-82,-850);p.quadraticCurveTo(-72,-842,-62,-848);p.moveTo(62,-848);p.quadraticCurveTo(73,-842,83,-850)},'rgba(151,91,70,.7)',3);
 g.restore();
}
function grain(t){
 // subtle moving film grain and paper flecks, deterministic
 g.save();g.globalAlpha=.08;for(let i=0;i<150;i++){const x=(i*197+Math.floor(t*24)*43)%W,y=(i*317+Math.floor(t*24)*71)%H;g.fillStyle=i%2?'#fff0d8':'#09090d';g.fillRect(x,y,2+(i%3),2+(i%2));}g.restore();
}
window.render=t=>{
 g.clearRect(0,0,W,H);
 const close=t>=3.2&&t<6.2,walk=t>=6.2;
 room(t);
 if(close){
  // tighter cinematic framing, focus falls away behind the face
  g.save();g.fillStyle='rgba(8,12,18,.13)';g.fillRect(0,0,W,H);g.restore();
  character(t,'close');
 }else character(t,walk?'walk':'full');
 // foreground title card, editorial rather than covering the character
 if(t<2.8){g.save();g.globalAlpha=1-ease((t-2.1)/.65);g.fillStyle='rgba(18,25,33,.82)';g.fillRect(72,180,600,112);text('UM PERSONAGEM, DE VERDADE',372,236,30,'#f2dfbd','700');g.restore();}
 if(t>7.1){const a=ease((t-7.1)/.5);g.save();g.globalAlpha=a;g.fillStyle='rgba(20,27,34,.78)';g.fillRect(95,1700,890,105);text('ILUSTRAÇÃO 2D  •  ANIMAÇÃO ARTICULADA',540,1752,27,'#f1dfbd','700');g.restore();}
 grain(t);
};window.READY=true;