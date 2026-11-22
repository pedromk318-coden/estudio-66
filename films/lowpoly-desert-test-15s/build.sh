#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
LIB="${LIB:-$(CDPATH= cd -- "$HERE/../../biblioteca" && pwd)}"
SRC="$LIB/styles/lowpoly-island/demo"
D="$LIB/styles/lowpoly-island/desert-test15"
OUT="$HERE/out"
mkdir -p "$OUT"
rm -rf "$D"
cp -R "$SRC" "$D"

"$LIB/.venv/bin/python" - "$D" <<'PY'
import pathlib, sys, re
d = pathlib.Path(sys.argv[1])

# 15-second silent cut; no narration or subtitle cues.
p = d / "story.js"
s = p.read_text()
s = s.replace("export const DUR = 53.0;", "export const DUR = 15.0;")
s = re.sub(r"export const VO = \[.*?\n\];", "export const VO = [];",
           s, flags=re.S)
p.write_text(s)
(d / "lines.json").write_text("[]\n")

# Convert the island palette into an arid desert palette.
p = d / "world.js"
s = p.read_text()
repls = {
  "sandTop: '#f3dfab', sandSide: '#e2c68e'": "sandTop: '#e9bd78', sandSide: '#bd8650'",
  "grassTop: '#93c96c', grassTop2: '#7fbd62'": "grassTop: '#d8a65f', grassTop2: '#c58d4d'",
  "earth: '#c99c6e', earth2: '#b88a5e'": "earth: '#b77b49', earth2: '#925d39'",
  "rockTop: '#b4b8bd', rockSide: '#8f949c'": "rockTop: '#b99a78', rockSide: '#806044'",
  "pine: ['#3f8a5a', '#4f9c63']": "pine: ['#777044', '#95804b']",
  "leaf: ['#7fc36a', '#9ad06f', '#6fb35e']": "leaf: ['#a58a4e', '#b59a5c', '#8d8048']",
  "trunk: '#8a5a3c'": "trunk: '#765037'",
}
for a,b in repls.items(): s=s.replace(a,b)
p.write_text(s)

# The sea plane becomes still desert ground; warm sand colours replace ocean.
p = d / "sea.js"
s = p.read_text()
s = s.replace("uDeep: { value: new THREE.Color('#3aa3b8') }, uShal: { value: new THREE.Color('#86e0d2') }",
              "uDeep: { value: new THREE.Color('#c18a52') }, uShal: { value: new THREE.Color('#e8bd78') }")
s = s.replace("uFoam: { value: new THREE.Color('#ffffff') }",
              "uFoam: { value: new THREE.Color('#f3d49a') }")
p.write_text(s)

# Static ground plane, warm desert sky and no ocean wave animation.
p = d / "main.js"
s = p.read_text()
s = s.replace("sea.U.uAmp.value = amp;", "sea.U.uAmp.value = 0;")
s = s.replace("night > .5 ? '#9fb0e0' : '#ffffff'", "'#e8bd78'")
p.write_text(s)

# Prevent stale island title/captions and ensure font loading cannot block rendering.
p = d / "main.js"
s = p.read_text()
s = s.replace("THE ISLAND THAT GREW", "THE DESERT AWAKES")
s = s.replace("a low-poly island film", "a low-poly desert film")
s = s.replace("LOW-POLY ISLAND", "LOW-POLY DESERT")
s = s.replace("await document.fonts.load('600 78px \"Josefin Sans\"'); await document.fonts.load('300 34px \"Josefin Sans\"'); await document.fonts.load('600 44px Quicksand'); await document.fonts.load('500 30px Quicksand');",
              "await Promise.allSettled([document.fonts.load('600 78px \"Josefin Sans\"'), document.fonts.load('300 34px \"Josefin Sans\"'), document.fonts.load('600 44px Quicksand'), document.fonts.load('500 30px Quicksand')]);")
p.write_text(s)
PY

# Render directly to MP4. No TTS, score, mixer, mux, or audio stream.
node "$LIB/core/render/events.mjs" "$D"
node "$LIB/core/render/video.mjs" "$D" --fps 24 --workers 1 --size 1080x1920 --out "$OUT/lowpoly-desert-test-15s.mp4"
cp "$OUT/lowpoly-desert-test-15s.mp4" "$HERE/lowpoly-desert-test-15s.mp4"
echo "Created silent video: $HERE/lowpoly-desert-test-15s.mp4"
