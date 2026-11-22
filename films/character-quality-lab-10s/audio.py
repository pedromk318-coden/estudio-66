#!/usr/bin/env python3
import math, sys
import numpy as np
import soundfile as sf
from pathlib import Path
SR=48000; D=10.0; n=int(SR*D); t=np.arange(n)/SR
rng=np.random.default_rng(66)
mix=np.zeros((n,2),dtype=np.float32)
def add(x,at,gain=1,pan=0):
    s=max(0,int(at*SR)); e=min(n,s+len(x))
    if e<=s:return
    x=x[:e-s]*gain
    l=math.cos((pan+1)*math.pi/4)*1.414; r=math.sin((pan+1)*math.pi/4)*1.414
    mix[s:e,0]+=x*l; mix[s:e,1]+=x*r
def tone(freq,dur,at,gain=.1,decay=2):
    tt=np.arange(int(SR*dur))/SR
    env=np.exp(-tt*decay)*np.minimum(1,tt/.012)
    add(np.sin(2*np.pi*freq*tt)*env,at,gain)
# Intimate bar-room air: filtered noise + distant crowd-like murmur.
noise=rng.normal(0,1,n)
kernel=np.ones(480)/480
room=np.convolve(noise,kernel,mode='same')
mix[:,0]+=room*.012; mix[:,1]+=np.roll(room,700)*.011
# Original minimal soul groove: warm bass pulse, brushed snare, muted electric-piano chords.
for beat in np.arange(.25,10,.5):
    tone(55 if int(beat*2)%4 in (0,2) else 73,.38,beat,.15,3.2)
    if int(beat*2)%4 in (1,3):
        burst=rng.normal(0,1,int(.13*SR))*np.exp(-np.arange(int(.13*SR))/(SR*.035))
        add(burst,beat,.045,.25 if int(beat*2)%2 else -.25)
for at,root in [(0.1,220),(2.1,261.63),(4.1,293.66),(6.1,246.94),(8.1,220)]:
    for f in [root,root*1.25,root*1.5]:
        tone(f,1.2,at,.025,1.8)
# Foley: mic handling, breath, spotlight electrical buzz, and a soft audience response.
for at in [1.0,4.7,8.6]:
    dur=.32; tt=np.arange(int(SR*dur))/SR
    sw=rng.normal(0,1,len(tt))*np.sin(np.pi*tt/dur)**2
    add(sw,at,.055,-.2 if at<5 else .2)
tone(60,9.8,.0,.018,.02)
for at in [4.85,8.9]:
    tone(880,.25,at,.035,9); tone(1320,.3,at+.03,.02,7)
# Final soft applause wash, deliberately restrained under the picture.
ap=rng.normal(0,1,int(1.1*SR)); ap=np.convolve(ap,np.ones(180)/180,mode='same')
add(ap,8.8,.028,0)
peak=np.max(np.abs(mix))
if peak>0: mix*=.82/peak
out=Path(sys.argv[1]); out.parent.mkdir(parents=True,exist_ok=True); sf.write(out,mix,SR,subtype='PCM_16')
print(f'Wrote {out} ({D:.1f}s, {SR} Hz)')
