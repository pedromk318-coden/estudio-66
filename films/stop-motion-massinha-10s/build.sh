#!/bin/sh
# Renderiza o curta stop-motion de massinha: 10 segundos, 1080x1920, 24 fps.
set -eu
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LIB=${LIB:?O workflow precisa definir LIB}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "LIB inválido: $LIB"; exit 1; }
cd "$LIB"
mkdir -p "$HERE/stills" "$HERE/out"
node core/render/still.mjs "$HERE" 0 2 4 6 8 --size 1080x1920 --out "$HERE/stills"
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --size 1080x1920 --out "$HERE/out/stop-motion-temp.mp4"
mv "$HERE/out/stop-motion-temp.mp4" "$HERE/stop-motion-massinha-10s.mp4"
echo "Vídeo pronto: $HERE/stop-motion-massinha-10s.mp4"
