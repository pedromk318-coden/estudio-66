#!/usr/bin/env python3
"""Mixagem original para o showcase cinematográfico de 10 s. 48 kHz estéreo, sem samples de terceiros."""
import os, sys
import numpy as np
from scipy.signal import butter, sosfilt
SR=48000; DUR=10.0; N=int(SR*DUR); rng=np.random.default_rng(660)
tt=np.arange(N)/SR
def noise(n): return rng.standard_normal(n)
def filt(x,lo=None,hi=None):
    if lo and hi: s=butter(3,[lo,hi],btype='bandpass',fs=SR,output='sos')
    elif lo: s=butter(3,lo,btype='highpass',fs=SR,output='sos')
    else: s=butter(3,hi,btype='lowpass',fs=SR,output='sos')
    return sosfilt(s,x)
def env(d,decay): return np.exp(-np.arange(int(SR*d))/SR/decay)
def add(buf,x,at,gain=1,pan=0):
    s=int(at*SR)
    if s>=N or s+len(x)<=0:return
    if s<0:x=x[-s:];s=0
    e=min(N,s+len(x));l=np.cos((pan+1)*np.pi/4);r=np.sin((pan+1)*np.pi/4)
    buf[s:e,0]+=x[:e-s]*gain*l*1.414
    buf[s:e,1]+=x[:e-s]*gain*r*1.414
def norm(x):
    m=np.max(np.abs(x))+1e-9
    return x/m
def whoosh(d=.55):
    n=int(SR*d);x=noise(n);y=np.zeros(n)
    for k in range(0,n,480):
        e=min(n,k+480);f=450+2600*np.sin(np.pi*k/n)
        y[k:e]=filt(x[k:e],max(100,f*.7),min(12000,f*1.35))
    return norm(y)*np.sin(np.pi*np.arange(n)/n)**1.7
def thump(d=.42):
    x=np.arange(int(SR*d))/SR
    return norm(np.sin(2*np.pi*(78-34*x)*x)*np.exp(-x/.11)+filt(noise(len(x)),hi=180)*np.exp(-x/.055))
def bell(d=1.5,f=880):
    x=np.arange(int(SR*d))/SR
    return norm(sum(a*np.sin(2*np.pi*f*k*x)*np.exp(-x/tau) for k,a,tau in [(1,1,.8),(2.01,.42,.48),(3.98,.16,.28)]))
def footstep():
    d=.24;x=np.arange(int(SR*d))/SR
    body=filt(noise(len(x)),hi=170)*np.exp(-x/.055)
    grit=filt(noise(len(x)),lo=1300)*np.exp(-x/.018)
    return norm(body*.8+grit*.22)
# Ambiência: chuva contínua filtrada, estéreo com movimento suave.
amb=np.zeros((N,2))
rain=filt(noise(N),lo=500,hi=9000)
rain*=.055*(.85+.15*np.sin(2*np.pi*.17*tt))
amb[:,0]+=rain*.92;amb[:,1]+=np.roll(rain,137)*.88
# Ruído de sala, ventilação e leve crepitar de amplificador.
room=filt(noise(N),hi=280)*.022
amb[:,0]+=room;amb[:,1]+=np.roll(room,71)
# Música original: pad harmônico + piano/metalofone macio em tonalidade menor.
music=np.zeros((N,2))
chords=[[146.83,220.0,293.66,369.99],[130.81,196.0,261.63,329.63],[110.0,164.81,220.0,293.66],[123.47,185.0,246.94,311.13]]
beat=60/82;bar=beat*4
for b in range(3):
    start=b*bar; notes=chords[b%len(chords)]
    for j,f in enumerate(notes):
        dur=min(4.2,DUR-start)
        if dur<=0:continue
        x=np.arange(int(SR*dur))/SR
        e=np.minimum(1,x/.55)*np.minimum(1,(dur-x)/.65)
        pad=sum(np.sin(2*np.pi*f*(1+d)*x) for d in (-.003,0,.003))/3
        add(music,pad*e,start,.095,-.45+j*.3)
# Motivo delicado de notas curtas.
for k,(at,f) in enumerate([(0.65,587.33),(1.55,739.99),(2.45,880),(3.35,739.99),(4.35,659.25),(5.15,783.99),(6.0,987.77),(7.0,880),(8.0,1046.5),(9.0,783.99)]):
    add(music,bell(.95,f),at,.12,-.3+(k%4)*.2)
# Foley sincronizado: passos, tecido, movimento de microfone, whooshes nos cortes.
fx=np.zeros((N,2))
for at,pan in [(3.45,-.35),(3.88,-.18),(4.31,.05),(4.74,.2),(5.17,.3)]:
    add(fx,footstep(),at,.17,pan)
for at,pan in [(2.92,0),(6.43,0)]:
    add(fx,whoosh(.48),at,.16,pan)
# Respiração/tecido antes da entrada e pequenos movimentos de palco.
cloth=filt(noise(int(SR*.8)),lo=500)*env(.8,.22)
add(fx,cloth,1.05,.055,-.2)
add(fx,thump(),3.18,.18,0)
# Aplauso distante e reverberação ambiente muito discreta.
for i in range(34):
    at=7.1+rng.random()*2.5
    clap=filt(noise(int(SR*.12)),lo=900)*env(.12,.035)
    add(fx,clap,at,.018,rng.uniform(-.9,.9))
# Impacto musical sutil na entrada da cantora e finalização em brilho.
add(fx,thump(),6.72,.20,0)
add(fx,bell(2.0,1318.5),8.35,.18,.2)
mix=amb+music+fx
# Sidechain simples para manter a música abaixo dos eventos principais.
peak=np.max(np.abs(mix),axis=1)
mix=np.tanh(mix*1.45)*.78
fadein=np.minimum(1,tt/.6);fadeout=np.minimum(1,(DUR-tt)/.8)
mix*=np.maximum(0,fadein*fadeout)[:,None]
mix*=min(1,.88/(np.max(np.abs(mix))+1e-9))
out=sys.argv[1] if len(sys.argv)>1 else 'mix.wav'
try:
    import soundfile as sf
    sf.write(out,mix.astype(np.float32),SR)
except ImportError:
    from scipy.io import wavfile
    wavfile.write(out,SR,(mix*32767).astype(np.int16))
print(f'Audio original: {out} | {DUR:.1f}s | {SR}Hz | pico {np.max(np.abs(mix)):.3f}')
