#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
LIB="${LIB:-$(CDPATH= cd -- "$HERE/../../biblioteca" && pwd)}"
SRC="$LIB/styles/pictogram-motion/demo"
D="$LIB/styles/pictogram-motion/president-test15"
OUT="$HERE/out"
mkdir -p "$OUT"
rm -rf "$D"
cp -R "$SRC" "$D"
# Replace only the demo timeline; keep the native Pictogram Motion drawing engine.
cat > "$D/film.js" <<'JSCODE'
(function () {
  const {W,H,PAL,E,inv,clamp,lerp,rgba}=G, F=G.F, FULL=15;
  const C={green:'#087b55',green2:'#075d43',yellow:'#f2c230',blue:'#1765a5',cream:'#fff8e9',ink:'#10251f',coral:'#df654d'};
  const shots=[
    {t0:0, title:'SE EU FOSSE', sub:'PRESIDENTE DO BRASIL', tag:'30 DIAS PARA AGIR', hue:'teal', icon:'flag'},
    {t0:3, title:'EDUCAÇÃO', sub:'ESCOLA EM PRIMEIRO LUGAR', tag:'APRENDER MUDA TUDO', hue:'yellow', icon:'book'},
    {t0:6, title:'SAÚDE', sub:'ATENDIMENTO SEM DEMORA', tag:'MAIS CUIDADO, MENOS FILA', hue:'sky', icon:'health'},
    {t0:9, title:'EMPREGO', sub:'OBRAS + OPORTUNIDADES', tag:'TRABALHO E RENDA', hue:'coral', icon:'work'},
    {t0:12, title:'E NO DIA 30…', sub:'PRESTAR CONTAS DE TUDO', tag:'PROMESSA SEM TRANSPARÊNCIA NÃO VALE', hue:'teal', icon:'check'}
  ];
  const EV=shots.map(s=>({t:s.t0,type:'card'}));
  function person(ctx,x,y,s,col){
    G.disc(ctx,x,y-s*.72,s*.19,col);
    G.seg(ctx,[x,y-s*.48],[x,y+s*.12],s*.18,col);
    G.seg(ctx,[x,y-s*.3],[x-s*.28,y+s*.02],s*.13,col);
    G.seg(ctx,[x,y-s*.3],[x+s*.28,y+s*.02],s*.13,col);
    G.seg(ctx,[x,y+s*.1],[x-s*.22,y+s*.52],s*.14,col);
    G.seg(ctx,[x,y+s*.1],[x+s*.22,y+s*.52],s*.14,col);
  }
  function icon(ctx,kind,x,y,t){
    const p=1-E.oExp(inv(0.05,.55,t)), sc=.78+.22*p;
    ctx.save();ctx.translate(x,y);ctx.scale(sc,sc);
    const dark=C.ink, white=C.cream;
    G.disc(ctx,0,0,270,rgba(white,.12));
    if(kind==='flag'){
      G.seg(ctx,[-90,190],[-90,-190],24,white);
      G.poly(ctx,[[-78,-180],[170,-140],[110,-30],[-78,-65]],C.green);
      G.disc(ctx,35,-105,42,C.yellow);
      G.ring(ctx,35,-105,42,9,white);
      G.disc(ctx,0,0,0,white);
    } else if(kind==='book'){
      G.rrect(ctx,-190,-125,180,270,22,white);G.rrect(ctx,10,-125,180,270,22,white);
      G.seg(ctx,[0,-120],[0,150],12,C.green2);
      for(let j=0;j<4;j++){G.seg(ctx,[-150,-65+j*48],[-45,-65+j*48],9,C.green);G.seg(ctx,[45,-65+j*48],[150,-65+j*48],9,C.green);}
    } else if(kind==='health'){
      G.rrect(ctx,-180,-145,360,290,44,white);
      G.rrect(ctx,-45,-95,90,190,16,C.coral);G.rrect(ctx,-95,-45,190,90,16,C.coral);
      G.ring(ctx,0,0,220,13,C.cream);
    } else if(kind==='work'){
      G.rrect(ctx,-190,-70,380,230,26,white);G.rrect(ctx,-80,-135,160,70,18,white);
      G.rrect(ctx,-35,-112,70,36,8,C.coral);
      G.seg(ctx,[-145,25],[145,25],14,C.green);
      G.disc(ctx,-90,95,18,C.yellow);G.disc(ctx,90,95,18,C.yellow);
    } else {
      G.ring(ctx,0,0,190,24,white);
      G.seg(ctx,[-105,0],[-25,85],34,C.yellow);G.seg(ctx,[-25,85],[125,-100],34,C.yellow);
    }
    ctx.restore();
  }
  function draw(ctx,t){
    const i=Math.min(4,Math.floor(t/3)), s=shots[i], lt=t-s.t0, p=E.oExp(inv(0,.48,lt));
    const P=PAL[s.hue];ctx.fillStyle=P.t[1];ctx.fillRect(0,0,W,H);
    const pat=G.pattern(s.hue,31+i*7,{spread:.43,density:.42,set:i%2?'sun':'rain'});
    G.drawPattern(ctx,pat,j=>(j%2?1:-1)*(t*19)+Math.sin(j*1.7+i)*14);
    // Stage and hero pictogram.
    icon(ctx,s.icon,1470,545,lt);
    // left editorial column
    ctx.fillStyle=rgba(C.ink,.14);ctx.fillRect(92,118,940,845);
    G.typeText(ctx,'BRASIL  /  PLANO DE 30 DIAS',145,190,F.mono(25),P.fg,inv(0,.3,lt),{ls:'3px'});
    const titleSize=s.title.length>15?94:118;
    G.maskText(ctx,s.title,145,390,F.en(900,titleSize),P.fg,p,{ls:'-2px'});
    G.maskText(ctx,s.sub,148,500,F.en(800,43),P.fg,inv(.12,.58,lt),{ls:'1px'});
    ctx.fillStyle=C.yellow;ctx.fillRect(145,570,Math.min(650,40+lt*900),9);
    G.rrect(ctx,145,635,Math.min(730,730*inv(.18,.65,lt)),64,10,C.ink);
    ctx.save();ctx.beginPath();ctx.rect(145,635,Math.min(730,730*inv(.18,.65,lt)),64);ctx.clip();
    ctx.fillStyle=C.cream;ctx.font=F.mono(23);ctx.letterSpacing='1px';ctx.fillText(s.tag,168,676);ctx.restore();
    // chapter ticks
    for(let k=0;k<5;k++){ctx.fillStyle=k===i?C.yellow:rgba(P.fg,.28);ctx.fillRect(145+k*48,880,k===i?30:18,8);}
    ctx.fillStyle=rgba(P.fg,.8);ctx.font=F.mono(22);ctx.fillText('0'+(i+1)+' / 05',145,930);
    // snap transition band
    const q=inv(2.78,3.0,lt);if(i<4&&q>0){ctx.fillStyle=C.cream;ctx.fillRect(W*q-80,0,80,H);}
  }
  const Q=new URLSearchParams(location.search), A=+(Q.get('a')??0), B=+(Q.get('b')??FULL);
  const canvas=document.getElementById('c'),ctx=canvas.getContext('2d');
  window.DUR=B-A;window.EV=EV.filter(e=>e.t>=A&&e.t<B).map(e=>({...e,t:e.t-A}));
  window.render=(lt)=>{ctx.setTransform(1,0,0,1,0,0);draw(ctx,A+lt);};
  window.TEXTS=()=>[];
})();
JSCODE
# Keep the bundled fonts but remove the demo's voice dependency.
python3 - "$D/index.html" <<'PY'
import pathlib,sys
p=pathlib.Path(sys.argv[1]);s=p.read_text()
s=s.replace('<script src="voice/cues.js"></script>','')
s=s.replace("const zh = (window.CUES || []).map((c) => c.zh).join('') + '被落下的伞';","const zh = 'BRASIL EDUCACAO SAUDE EMPREGO';")
s=s.replace("'900 40px \"Noto Sans SC\"', '700 40px \"Noto Sans SC\"',","")
p.write_text(s)
PY
# Render silent video: no TTS, music, mixer, mux, or audio stream.
node "$LIB/core/render/events.mjs" "$D"
node "$LIB/core/render/video.mjs" "$D" --fps 24 --workers 1 --out "$OUT/pictogram-president-15s.mp4"
cp "$OUT/pictogram-president-15s.mp4" "$HERE/pictogram-president-15s.mp4"
echo "Created silent video: $HERE/pictogram-president-15s.mp4"
