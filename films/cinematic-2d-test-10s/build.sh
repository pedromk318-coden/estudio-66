#!/bin/sh
set -eu
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LIB=${LIB:?O runner precisa definir LIB}
[ -f "$LIB/core/render/video.mjs" ] || { echo "LIB inválido: $LIB"; exit 1; }
mkdir -p "$HERE/out" "$HERE/stills"
cd "$LIB"
# Pré-visualização de quadros antes do render completo.
node core/render/still.mjs "$HERE" 0.5 2.8 3.5 5.8 6.9 9.4 --size 1080x1920 --out "$HERE/stills"
# Motion blur em 2 amostras; manter 2 workers para não saturar o runner.
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --size 1080x1920 --out "$HERE/out/video.mp4"
"$LIB/.venv/bin/python" "$HERE/mix.py" "$HERE/out/mix.wav"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/estudio66-cinematic-test.mp4" 24 0
ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration -of default=noprint_wrappers=1 "$HERE/estudio66-cinematic-test.mp4"
echo "pronto: $HERE/estudio66-cinematic-test.mp4"
