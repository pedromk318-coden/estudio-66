// Estúdio 66 — helpers 2D cinematográficos determinísticos.
// Sem dependências externas; compatível com Chromium headless e render por software.
const TAU = Math.PI * 2;
const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const fract = v=>v-Math.floor(v);
export const smooth = v=>{v=clamp(v);return v*v*(3-2*v);};
export const lerp = (a,b,t)=>a+(b-a)*t;

export function seeded(seed=1){
  let s=seed>>>0;
  return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};
}

export function makeParticleField(count=100,seed=7,depth=1){
  const r=seeded(seed), items=[];
  for(let i=0;i<count;i++) items.push({
    x:r(), y:r(), z:.25+r()*.75, size:.5+r()*2.4,
    speed:8+r()*34, drift:(r()-.5)*24, phase:r()*TAU,
    alpha:.12+r()*.42, hue:r()
  });
  return {items,depth};
}

export function drawParticles(ctx,field,t,opts={}){
  const {width=1080,height=1920,color='#ffd9a0',alpha=1,glow=12,drift=1,mode='screen'}=opts;
  ctx.save();ctx.globalCompositeOperation=mode;
  for(const p of field.items){
    const z=p.z*field.depth, x=fract(p.x+p.drift*t/width*drift)*width;
    const y=fract(p.y-p.speed*t/height)*height, r=p.size*z;
    ctx.globalAlpha=p.alpha*alpha;
    if(glow>0){ctx.shadowColor=color;ctx.shadowBlur=glow*z;}
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  }
  ctx.restore();
}

export function drawRain(ctx,t,opts={}){
  const {width=1080,height=1920,count=150,intensity=1,color='rgba(190,220,238,.62)',seed=19,slant=-.24}=opts;
  const r=seeded(seed);ctx.save();ctx.strokeStyle=color;ctx.lineCap='round';
  for(let i=0;i<count;i++){
    const x0=r()*width,y0=r()*height,speed=500+r()*900,len=14+r()*34;
    const y=((y0+t*speed)% (height+len))-len;
    const x=x0+slant*t*speed;
    ctx.globalAlpha=(.12+r()*.35)*intensity;
    ctx.lineWidth=.7+r()*1.4;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+len*slant,y+len);ctx.stroke();
  }
  ctx.restore();
}

export function glow(ctx,x,y,r,color,alpha=.35){
  ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation='screen';
  const g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,color);g.addColorStop(.25,color);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();
}

export function drawVignetteGrain(ctx,t,opts={}){
  const {width=1080,height=1920,vignette=.52,grain=.035,seed=31}=opts;
  const g=ctx.createRadialGradient(width*.5,height*.43,width*.12,width*.5,height*.5,width*.78);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.65,'rgba(0,0,0,.06)');g.addColorStop(1,'rgba(0,0,0,'+vignette+')');
  ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
  // Fine film grain is deterministic per frame, cheap and visually restrained.
  const r=seeded(seed+Math.floor(t*24));ctx.globalAlpha=grain;ctx.fillStyle='#fff';
  for(let i=0;i<900;i++){const x=r()*width,y=r()*height;ctx.fillRect(x,y,.7+r()*1.3,.7+r()*1.3);}
  ctx.restore();
}

// Re-render deterministic neighboring instants and blend them to simulate a camera shutter.
// Keep samples at 2 by default: 3+ can multiply software-render cost quickly.
export function renderShutter(ctx,t,draw,opts={}){
  const samples=Math.max(1,Math.min(4,opts.samples??2)),shutter=opts.shutter??.42;
  if(samples===1){draw(ctx,t);return;}
  const canvas=document.createElement('canvas');canvas.width=ctx.canvas.width;canvas.height=ctx.canvas.height;
  const c=canvas.getContext('2d',{alpha:false});
  ctx.save();ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.fillStyle='#080b13';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  for(let i=0;i<samples;i++){
    const offset=((i/(samples-1))-.5)*shutter/24;
    c.clearRect(0,0,canvas.width,canvas.height);draw(c,t+offset);
    ctx.globalAlpha=1/samples;ctx.drawImage(canvas,0,0);
  }
  ctx.restore();
}

export function camera(ctx,t,opts,draw){
  const {width=1080,height=1920,x=0,y=0,zoom=1,panX=0,panY=0,shake=0}=opts;
  const sx=Math.sin(t*31.7)*shake,sy=Math.cos(t*27.3)*shake*.7;
  ctx.save();ctx.translate(width/2+sx,height/2+sy);ctx.scale(zoom,zoom);
  ctx.translate(-width/2+x+panX,-height/2+y+panY);draw();ctx.restore();
}
