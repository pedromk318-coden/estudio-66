#!/bin/sh
# Render na nuvem (GitHub Actions): E se você acordasse com um bilhão na conta (estilo HD-2D, 1080x1920, 24 fps)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:?O ambiente de render precisa definir LIB (pasta biblioteca)}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "LIB inválido: $LIB"; exit 1; }
SLUG=bilhao-na-conta

# 1) Fontes (licença OFL): Cinzel e Cormorant Garamond, baixadas dos pacotes públicos @fontsource
FD="$HERE/fonts"; mkdir -p "$FD"
if [ ! -f "$FD/cinzel-700.woff2" ]; then
  TMP=$(mktemp -d)
  ( cd "$TMP" && npm pack @fontsource/cinzel@5 @fontsource/cormorant-garamond@5 --silent >/dev/null 2>&1 ) || echo "AVISO: não consegui baixar as fontes; o vídeo usará a serifa do sistema"
  for p in cinzel cormorant-garamond; do
    mkdir -p "$TMP/$p"; tar xzf "$TMP"/fontsource-$p-*.tgz -C "$TMP/$p" 2>/dev/null || true
  done
  cp "$TMP/cinzel/package/files/cinzel-latin-500-normal.woff2" "$FD/cinzel-500.woff2" 2>/dev/null || true
  cp "$TMP/cinzel/package/files/cinzel-latin-700-normal.woff2" "$FD/cinzel-700.woff2" 2>/dev/null || true
  cp "$TMP/cormorant-garamond/package/files/cormorant-garamond-latin-500-italic.woff2" "$FD/cg-500i.woff2" 2>/dev/null || true
  cp "$TMP/cormorant-garamond/package/files/cormorant-garamond-latin-500-normal.woff2" "$FD/cg-500.woff2" 2>/dev/null || true
  cp "$TMP/cormorant-garamond/package/files/cormorant-garamond-latin-600-normal.woff2" "$FD/cg-600.woff2" 2>/dev/null || true
fi
cat > "$FD/fonts.css" <<'CSS'
@font-face{font-family:'Cinzel';font-style:normal;font-weight:500;font-display:block;src:url(cinzel-500.woff2) format('woff2')}
@font-face{font-family:'Cinzel';font-style:normal;font-weight:700;font-display:block;src:url(cinzel-700.woff2) format('woff2')}
@font-face{font-family:'Cormorant Garamond';font-style:italic;font-weight:500;font-display:block;src:url(cg-500i.woff2) format('woff2')}
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:500;font-display:block;src:url(cg-500.woff2) format('woff2')}
@font-face{font-family:'Cormorant Garamond';font-style:normal;font-weight:600;font-display:block;src:url(cg-600.woff2) format('woff2')}
CSS

# 2) Linha do tempo -> JSON (som e legendas leem os mesmos números)
cd "$LIB"
node "$HERE/tools/export_story.mjs"

# 3) Quadros de conferência (falham cedo se houver erro de página) e vídeo
node core/render/still.mjs "$HERE" 1 5 9 16 22 30 --size 1080x1920 --out "$HERE/stills"
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --size 1080x1920 --out "$HERE/out/video.mp4"

# 4) Áudio, legendas (.srt) e master final (-14 LUFS)
"$LIB/.venv/bin/python" "$HERE/mix.py" "$HERE/out/mix.wav"
"$LIB/.venv/bin/python" core/render/srt.py "$HERE/cues.json" "$HERE/$SLUG.srt"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$SLUG.mp4" 24 0
rm -f "$HERE/out/video.mp4"
echo "pronto: $HERE/$SLUG.mp4"
