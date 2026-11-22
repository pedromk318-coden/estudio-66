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

const shutterBuffers = new WeakMap();

// Re-render deterministic neighboring instants and blend them to simulate a camera shutter.
// Keep samples at 2 by default: 3+ can multiply software-render cost quickly.
export function renderShutter(ctx,t,draw,opts={}){
  const samples=Math.max(1,Math.min(4,opts.samples??2)),shutter=opts.shutter??.42;
  if(samples===1){draw(ctx,t);return;}
  let canvas=shutterBuffers.get(ctx.canvas);
  if(!canvas){canvas=document.createElement('canvas');canvas.width=ctx.canvas.width;canvas.height=ctx.canvas.height;shutterBuffers.set(ctx.canvas,canvas);}
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


// Soft-focus pass for distant set dressing. Keep foreground character crisp.
export function drawSoftFocus(ctx,draw,blur=2){
  const amount=clamp(blur,0,14);
  if(amount<=0){draw();return;}
  ctx.save();ctx.filter=`blur(${amount}px)`;draw();ctx.restore();
}

// Wide, animated volumetric-style beams built from gradients (software-render friendly).
export function drawLightShafts(ctx,t,opts={}){
  const {width=1080,height=1920,alpha=.16,color='#ffd59a',count=3,originX=width*.48,originY=170}=opts;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<count;i++){
    const sway=Math.sin(t*.55+i*1.7)*24;
    const spread=210+i*105, drift=sway+(i-count/2)*125;
    const g=ctx.createLinearGradient(originX+drift,originY,originX+drift-spread, height*.72);
    g.addColorStop(0,`rgba(255,225,174,${alpha*.8})`);
    g.addColorStop(.38,color);
    g.addColorStop(1,'rgba(255,210,150,0)');
    ctx.globalAlpha=.7;
    ctx.fillStyle=g;ctx.beginPath();
    ctx.moveTo(originX+drift-24,originY);
    ctx.lineTo(originX+drift+28,originY);
    ctx.lineTo(originX+drift+spread,height*.72);
    ctx.lineTo(originX+drift-spread*.55,height*.72);
    ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

// Defocused practical lights in the foreground/background to reinforce lens depth.
export function drawBokeh(ctx,field,t,opts={}){
  const {width=1080,height=1920,alpha=.28,blur=18,colors=['#ffd18a','#ff9e83','#91c8ee']}=opts;
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<Math.min(field.items.length,28);i++){
    const p=field.items[i],x=fract(p.x+p.drift*t/width*.12)*width;
    const y=fract(p.y-p.speed*t/height*.10)*height;
    const r=(9+p.size*9)*p.z;
    const pulse=.72+.28*Math.sin(t*1.8+p.phase);
    const g=ctx.createRadialGradient(x,y,0,x,y,r*2.8);
    g.addColorStop(0,colors[i%colors.length]);
    g.addColorStop(.22,colors[i%colors.length]);
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=p.alpha*alpha*pulse;
    ctx.filter=`blur(${Math.max(2,blur*p.z)}px)`;
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.8,0,TAU);ctx.fill();
  }
  ctx.restore();
}

// Short directional streaks are reserved for transitions and fast gestures.
export function drawMotionStreaks(ctx,t,opts={}){
  const {width=1080,height=1920,alpha=.22,intensity=1,seed=53}=opts;
  const r=seeded(seed);ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<22;i++){
    const x0=r()*width,y0=r()*height,phase=r()*TAU;
    const active=.5+.5*Math.sin(t*8+phase);
    const len=(35+r()*150)*intensity;
    const x=x0+Math.sin(t*2.1+phase)*26;
    const y=y0+Math.cos(t*1.7+phase)*18;
    const g=ctx.createLinearGradient(x-len,y-len*.16,x+len,y+len*.16);
    g.addColorStop(0,'rgba(255,255,255,0)');
    g.addColorStop(.5,'rgba(255,225,185,.55)');
    g.addColorStop(1,'rgba(255,255,255,0)');
    ctx.globalAlpha=alpha*active;ctx.strokeStyle=g;ctx.lineWidth=.8+r()*2;
    ctx.beginPath();ctx.moveTo(x-len,y-len*.16);ctx.lineTo(x+len,y+len*.16);ctx.stroke();
  }
  ctx.restore();
}

// Soft anamorphic flare around a practical lamp; never covers the whole frame.
export function drawLensFlare(ctx,x,y,t,opts={}){
  const {width=1080,height=1920,strength=.3,color='#ffd28a'}=opts;
  const pulse=.88+.12*Math.sin(t*2.4);
  ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=strength*pulse;
  const halo=ctx.createRadialGradient(x,y,0,x,y,150);
  halo.addColorStop(0,'rgba(255,245,215,.7)');halo.addColorStop(.12,color);halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo;ctx.fillRect(x-150,y-150,300,300);
  const beam=ctx.createLinearGradient(0,y, width,y);
  beam.addColorStop(0,'rgba(255,225,175,0)');beam.addColorStop(x/width,'rgba(255,225,175,.32)');
  beam.addColorStop(Math.min(1,x/width+.08),'rgba(255,240,210,.06)');beam.addColorStop(1,'rgba(255,225,175,0)');
  ctx.fillStyle=beam;ctx.fillRect(0,y-2,width,4);ctx.restore();
}
