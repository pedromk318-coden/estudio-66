#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
LIB="${LIB:-$(CDPATH= cd -- "$HERE/../../biblioteca" && pwd)}"
SRC="$LIB/styles/lowpoly-island/demo"
D="$LIB/styles/lowpoly-island/demo-test15"
OUT="$HERE/out"
mkdir -p "$OUT"
rm -rf "$D"
cp -R "$SRC" "$D"

# Make an isolated 15-second portrait cut without changing the master style demo.
"$LIB/.venv/bin/python" - "$D" <<'PY'
import pathlib, sys, json, re
d = pathlib.Path(sys.argv[1])
p = d / "story.js"
s = p.read_text()
s = s.replace("export const DUR = 53.0;", "export const DUR = 15.0;")
s = s.replace("end: bar(17),", "end: 14.2,")
s = re.sub(r"export const VO = \[.*?\n\];", """export const VO = [
  { id: 'v1', t: 3.4, text: 'Do fundo do oceano, uma nova ilha começa a nascer.' },
];""", s, flags=re.S)
p.write_text(s)
(d / "lines.json").write_text(json.dumps([
  {"id":"v1","text":"Do fundo do oceano, uma nova ilha começa a nascer.","voice":"af_sky","speed":0.9}
], ensure_ascii=False, indent=2) + "\n")

p = d / "main.js"
s = p.read_text().replace("const W = 1920, H = 1080,", "const W = 1080, H = 1920,")
p.write_text(s)
p = d / "index.html"
s = p.read_text().replace('width="1920" height="1080"', 'width="1080" height="1920"')
p.write_text(s)
# Keep the ambience interpolation keyframes ordered for the shorter cut.
p = d / "mix.py"
s = p.read_text().replace(
"wl = np.interp(tt, [0, 6, 21, 31, 36.25, 41, 48.75, DUR], [1.0, .8, .55, .9, .75, .6, .7, .5])",
"wl = np.interp(tt, [0, 3, 6, 9, 12, DUR], [1.0, .8, .65, .9, .7, .5])"
)
p.write_text(s)
PY

# Voice, timeline, original score, foley/ambience, subtitles and final portrait render.
"$LIB/.venv/bin/python" "$LIB/core/tts/tts.py" "$D/lines.json" "$D/voices"
"$LIB/.venv/bin/python" "$LIB/core/tts/asr_check.py" "$D/lines.json" "$D/voices"
node "$LIB/core/render/events.mjs" "$D"
"$LIB/.venv/bin/python" "$D/music/score.py"
"$LIB/.venv/bin/python" "$D/music/check.py"
"$LIB/.venv/bin/python" "$D/mix.py"
"$LIB/.venv/bin/python" "$D/subs.py"
"$LIB/.venv/bin/python" "$LIB/core/render/srt.py" "$D/out/cues.json" "$D/lowpoly-island.srt"
node "$LIB/core/render/video.mjs" "$D" --fps 24 --workers 1 --size 1080x1920 --out "$OUT/lowpoly-island-test-15s-picture.mp4"
sh "$LIB/core/render/mux.sh" "$OUT/lowpoly-island-test-15s-picture.mp4" "$D/mix.wav" "$HERE/lowpoly-island-test-15s.mp4" 24 0
cp "$D/lowpoly-island.srt" "$HERE/lowpoly-island-test-15s.srt"
echo "Created $HERE/lowpoly-island-test-15s.mp4"
