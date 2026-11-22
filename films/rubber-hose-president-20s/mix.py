import numpy as np, soundfile as sf, os
SR=48000; DUR=20.0; N=int(SR*DUR)
out=np.zeros((N,2),np.float32); rng=np.random.default_rng(1930)
def place(x,t,g=1.0,pan=0.0):
    s=int(t*SR); a=max(0,s); b=min(N,s+len(x))
    if b<=a:return
    q=np.clip(pan,-1,1); z=x[a-s:b-s]
    out[a:b,0]+=z*g*np.sqrt((1-q)*.5); out[a:b,1]+=z*g*np.sqrt((1+q)*.5)
def env(n,attack=.004,decay=.18):
    t=np.arange(n)/SR
    return np.minimum(1,t/max(attack,.001))*np.exp(-t/max(decay,.001))
def note(freq,dur,kind='piano',amp=.2):
    n=int(dur*SR); t=np.arange(n)/SR
    if kind=='piano':
        x=(np.sin(2*np.pi*freq*t)+.42*np.sin(2*np.pi*freq*2.01*t)+.18*np.sin(2*np.pi*freq*3.97*t)+.08*np.sin(2*np.pi*freq*6.1*t))*env(n,.002,.16)
    elif kind=='bass':
        x=(np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*freq*2*t))*env(n,.012,.24)
    elif kind=='brass':
        x=(np.sin(2*np.pi*freq*t)+.5*np.sin(2*np.pi*freq*2*t)+.24*np.sin(2*np.pi*freq*3*t))*env(n,.012,.12)
    return (x*amp).astype(np.float32)
def sweep(t0,dur,f0,f1,amp=.16):
    n=int(dur*SR); t=np.arange(n)/SR
    phase=2*np.pi*(f0*t+(f1-f0)*t*t/(2*dur))
    x=np.sin(phase)*np.sin(np.pi*np.minimum(1,t/dur))*amp
    place(x.astype(np.float32),t0,.7,0)
# Original bright ragtime groove, 160 BPM, 4/4
bpm=160; beat=60/bpm; eighth=beat/2
# F major -> C -> Gm -> C, repeated
chords=[[174.61,220.00,261.63],[130.81,164.81,196.00],[146.83,174.61,220.00],[130.81,164.81,196.00]]
mel=[349.23,392.00,440.00,523.25,440.00,392.00,349.23,293.66,
     329.63,392.00,493.88,523.25,493.88,392.00,329.63,293.66]
for beat_i in range(int(DUR/beat)+2):
    t=beat_i*beat; bar=(beat_i//4)%4; chord=chords[bar]
    # oom-pah bass and chord stabs
    root=chord[0]/2
    place(note(root,.24,'bass',.23),t,.95,-.15)
    if beat_i%2==1:
        for f in chord: place(note(f*2,.13,'piano',.075),t,.8,.12)
    # jaunty syncopated melody
    mi=(beat_i*2)%len(mel)
    place(note(mel[mi],.20,'piano',.105),t,.9,.18)
    if beat_i%4 in (1,3):
        place(note(mel[(mi+2)%len(mel)],.12,'brass',.055),t+eighth*.45,.7,-.2)
# brush/snare and woodblock accents
for k in range(int(DUR/beat*2)):
    t=k*eighth
    if k%4 in (1,3):
        n=int(.09*SR); z=rng.normal(0,1,n)*np.exp(-np.arange(n)/SR/.025)
        place((z*.018).astype(np.float32),t,.65,.05)
    if k%2==0:
        place(note(1150 if k%4==0 else 880,.035,'piano',.055),t,.7,-.1)
# transition whooshes, spring boings and final stamp
for t in [2.25,4.55,6.85,9.15,11.45,13.75,16.05]:
    sweep(t,.24,180,1050,.11)
for t,f in [(1.15,520),(3.55,620),(5.85,460),(8.15,700),(10.45,390),(12.75,560),(15.05,740),(18.2,300)]:
    n=int(.32*SR); tt=np.arange(n)/SR
    x=(np.sin(2*np.pi*(f-170*tt/.32)*tt)*np.exp(-tt/.11)+.15*rng.normal(0,1,n)*np.exp(-tt/.025))*.13
    place(x.astype(np.float32),t,.9,(-1 if int(t*2)%2 else 1)*.2)
# film projector texture, quiet
h=rng.normal(0,1,N)*.0015
out[:,0]+=h; out[:,1]+=h*.96
peak=np.max(np.abs(out)); out*=min(1,.92/(peak+1e-9))
path=os.path.join(os.path.dirname(__file__),'out','rubber-hose-president.wav')
sf.write(path,out,SR)
print('Original ragtime + Foley mix:',round(DUR,2),'s',out.shape,'peak',round(float(np.max(np.abs(out))),3))
