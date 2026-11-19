# Mixagem: trilha original (celesta + pad), ambiente por cena e efeitos sincronizados com story.json -> out/mix.wav
import sys, os, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or os.path.join(HERE, '..', '..', 'biblioteca')
sys.path.insert(0, os.path.join(LIB, 'core', 'audio'))
from sfx import *

S = json.load(open(os.path.join(HERE, 'story.json')))
DUR, T, VO = S['DUR'], S['T'], S['VO']
N = int(DUR * SR); tt = np.arange(N) / SR
rng = np.random.default_rng(7)
def curve(keys): k = np.array(keys, float); return np.interp(tt, k[:, 0], k[:, 1])
def stereo(x, pan=0.0): l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); return np.stack([x * l * 1.414, x * r * 1.414], 1)

# —— Ambiente: quarto (passarinhos, zumbido suave) → rua (vento leve, passarinhos) ——
C1, C2 = S['SHOTS'][1]['a'], S['SHOTS'][2]['a']
room_g = curve([(0, 1), (C1 - .3, 1), (C1 + .3, 0), (DUR, 0)])
street_g = curve([(0, 0), (C1 - .3, 0), (C1 + .4, 1), (DUR - 4, .9), (DUR, .5)])
room = lp(brown(DUR), 260) * .10 * room_g
wind = bp(noise(DUR), 200, 1400) * (.45 + .55 * np.sin(2 * np.pi * .21 * tt) ** 2) * .07 * street_g
amb = stereo(room, -.1) + stereo(wind, -.4) + stereo(np.roll(wind, 7919), .4)
def chirp(f0=3400, d=.14):
    x = t_(d); f = f0 + 1600 * np.sin(2 * np.pi * 9 * x); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * x / d) ** 2
for _ in range(34):
    t0 = rng.uniform(.5, DUR - 1.0); amb_p = rng.uniform(-.8, .8)
    for k in range(int(rng.integers(2, 5))):
        add(amb, chirp(rng.uniform(2800, 4200)), t0 + k * .17, .05 * (room_g[int(t0 * SR)] * .7 + street_g[int(t0 * SR)]), amb_p)

# —— Trilha: celesta em arpejo + pad, andamento 84 bpm ——
BPM = 84; beat = 60 / BPM; bar = beat * 4
def bell_note(f, d=2.2):
    x = t_(d); return sum(a * np.sin(2 * np.pi * f * m * x) * np.exp(-x / tau) for m, a, tau in [(1, 1, .9), (2, .4, .5), (3, .18, .3), (4.01, .1, .2)])
def pad_note(f, d):
    x = t_(d); env = np.minimum(x / 1.0, 1) * np.minimum((d - x) / 1.0, 1)
    return sum(np.sin(2 * np.pi * f * (1 + dt) * x) for dt in (-.003, 0, .003)) * env / 3
CH = [([293.66, 369.99, 440.0, 587.33], 146.83), ([277.18, 329.63, 440.0, 554.37], 110.0), ([246.94, 293.66, 369.99, 493.88], 123.47), ([196.0, 246.94, 293.66, 392.0], 98.0)]
mus = np.zeros((N, 2))
mg = curve([(0, .55), (2.6, .75), (7.6, 1.0), (C1, .75), (C2, .9), (DUR - 3, .9), (DUR, .45)])
nb = int(DUR / bar) + 1
for b in range(nb):
    notes, root = CH[b % 4]; t0 = b * bar
    add(mus, pad_note(root, bar + .8) * .30, t0, 1.0, 0)
    add(mus, pad_note(notes[1] / 2, bar + .8) * .18, t0, 1.0, -.3)
    pat = [0, 1, 2, 3, 2, 1, 2, 3]
    for i, p in enumerate(pat):
        add(mus, bell_note(notes[p], 1.8) * .20, t0 + i * beat / 2, 1.0, -.5 + .15 * p)
mus *= mg[:, None]

# —— Efeitos ——
fx = np.zeros((N, 2))
def tick(f, d=.08): x = t_(d); return np.sin(2 * np.pi * f * x) * np.exp(-x / .02)
def bellp(f, d=1.2): x = t_(d); return norm(sum(a * np.sin(2 * np.pi * f * m * x) * np.exp(-x / tau) for m, a, tau in [(1, 1, .5), (2.76, .35, .25), (5.4, .12, .12)]))
# celular vibrando na mesinha
for a, b in T['buzz']:
    d = b - a; x = t_(d); bz = np.sin(2 * np.pi * 130 * x) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 36 * x))) * np.minimum(1, x / .02) * np.minimum(1, (d - x) / .03)
    add(fx, lp(bz, 1200) * .5 + hp(noise(d), 2500) * .03 * (.5 + .5 * np.sign(np.sin(2 * np.pi * 36 * x))), a, .5, .3)
# cobertor ao acordar
add(fx, lp(noise(.5), 900) * np.exp(-t_(.5) / .12) * .5, T['wake'], .5, -.3)
# chime de cada fala (caixa de diálogo)
for v in VO: add(fx, ding(1.0), v['t'], .13, 0)
# saldo contando: toques cada vez mais rápidos (acelerador) e subindo de tom
NT = 46
for k in range(NT):
    tk = T['countA'] + (T['countB'] - T['countA']) * (k / NT) ** (1 / 2.6)
    add(fx, tick(600 + 2200 * (k / NT)) * .5, tk, .22, np.sin(k) * .3)
# clímax do saldo
add(fx, bellp(1046.5, 2.2) * .8, T['countB'], .5, 0); add(fx, bellp(1568, 2.2) * .6, T['countB'] + .08, .4, .2); add(fx, thump(1.0, 60), T['countB'], .55, 0)
add(fx, hp(noise(1.2), 4000) * np.exp(-t_(1.2) / .5) * np.minimum(1, t_(1.2) / .05), T['countB'], .12, 0)
# passos na rua (cada dois quadros da caminhada)
for k in range(int(T['walkA'] * 9), int(T['walkB'] * 9)):
    if k % 2 == 0: add(fx, lp(step(1.0), 5000), k / 9, .22 + .04 * np.sin(k), np.sin(k * .7) * .2)
# janelas e postes acendendo (sininhos)
for i, t0 in enumerate(T['lights']): add(fx, bellp(1318 * (1 + .06 * i), 1.0), t0, .28, -.6 + i * .24); add(fx, pop(.6), t0, .16, -.6 + i * .24)
for i, t0 in enumerate(T['lamps']): add(fx, bellp(880 * (1 + .05 * i), 1.0), t0, .22, -.5 + i * .33)
# cortes de cena e cristal de salvar
for c in (C1, C2): add(fx, whoosh(.5, 1.0), c - .3, .18, 0)
add(fx, bellp(1318, 2.4), T['saveIn'], .38, .3); add(fx, bellp(1975, 2.4), T['saveIn'] + .12, .28, .3); add(fx, bellp(2637, 2.4), T['saveIn'] + .24, .2, .3)

mix = mus + amb + fx
for c in range(2): mix[:, c] = limit(mix[:, c], .9)
mix *= min(1.0, .85 / max(1e-9, np.abs(mix).max()))
fade = np.minimum(1, (DUR - tt) / .6)[:, None]; mix *= fade
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out', 'mix.wav')
try:
    import soundfile as sf; sf.write(out, mix.astype(np.float32), SR)
except ImportError:
    from scipy.io import wavfile; wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print('mix ok', out, round(len(mix) / SR, 2), 's', 'peak', round(float(np.abs(mix).max()), 3))
