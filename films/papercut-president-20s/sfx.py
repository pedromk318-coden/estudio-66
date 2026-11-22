import numpy as np, soundfile as sf, os
SR=48000; D=20.; n=int(SR*D); out=np.zeros((n,2),np.float32); rng=np.random.default_rng(2026)
def add(x,t,gain=1,pan=0):
 s=int(t*SR); a=max(0,s); b=min(n,s+len(x))
 if b>a:
  p=np.clip(pan,-1,1)
  segment=x[a-s:b-s]
  out[a:b,0]+=segment*gain*np.sqrt((1-p)/2)
  out[a:b,1]+=segment*gain*np.sqrt((1+p)/2)
def noise(d): return rng.normal(0,1,int(d*SR))
def fx(d,kind):
 t=np.arange(int(d*SR))/SR; z=noise(d)
 if kind=='swish':
  x=z*np.sin(np.pi*t/d)**1.5
  x=np.convolve(x,np.ones(80)/80,'same')
 elif kind=='fold':
  x=z*np.exp(-t/.09)+.25*np.sin(2*np.pi*(180-90*t/d)*t)*np.exp(-t/.22)
 elif kind=='stamp':
  x=.8*np.sin(2*np.pi*(85-35*t/d)*t)*np.exp(-t/.16)+.35*z*np.exp(-t/.035)
 else:
  x=np.sin(2*np.pi*(1200+2200*t/d)*t)*np.sin(np.pi*t/d)+.2*z*np.exp(-t/.15)
 x=x/(np.max(np.abs(x))+1e-8)*.7
 return x.astype(np.float32)
for t,k,d,v in [(0,'swish',1.1,.65),(1.5,'stamp',.45,.55),(3.1,'spark',.8,.32),(6.45,'swish',.85,.9),(7.0,'fold',.5,.8),(8.4,'spark',.9,.38),(10.2,'stamp',.4,.35),(13.15,'fold',.75,.95),(14.0,'swish',.8,.7),(16.3,'spark',1.0,.5),(18.05,'stamp',1.0,1.0),(19.0,'spark',.7,.3)]:
 add(fx(d,k),t,v,(-1 if int(t*10)%2 else 1)*.25)
# soft low-frequency cinematic impacts at each scene cut
for t in [6.65,13.32]: add(fx(.65,'stamp'),t,.38,0)
peak=np.max(np.abs(out)); out*=min(1,.94/(peak+1e-8))
sf.write(os.path.join(os.path.dirname(__file__),'out','papercut-sfx.wav'),out,SR)
print('SFX mix written',out.shape,'peak',round(float(np.max(np.abs(out))),3))
