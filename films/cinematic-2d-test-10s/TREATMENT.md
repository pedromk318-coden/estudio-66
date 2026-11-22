# Estúdio 66 — Showcase Cinematic 2D (10 s)

## Objetivo
Teste técnico de um padrão reutilizável para curtas verticais 2D ilustrados: personagens com atuação, cenário com profundidade, câmera, motion blur, partículas, iluminação e som original sincronizado.

## Direção
Uma cantora se prepara nos bastidores de um pequeno bar numa noite chuvosa. A cena começa íntima, acompanha a entrada no palco e termina no primeiro instante da apresentação. O design é original e usa linguagem de cartoon 2D ilustrado, sem reproduzir personagens ou cenas de terceiros.

## Estrutura
- 0–3,2 s: close emocional, respiração, piscada, luz quente e poeira no facho.
- 3,2–6,7 s: movimento de entrada, passos, câmera com deslocamento e whoosh de transição.
- 6,7–10 s: plano de palco, boca em performance, luzes, partículas e acento musical.

## Pipeline
- 1080 × 1920, 24 fps, 10 segundos.
- Renderização 2D em Canvas, compatível com runner sem GPU.
- Motion blur temporal com duas amostras determinísticas por frame.
- Partículas determinísticas, chuva, bloom falso por gradientes, vinheta e grão fino.
- Mix estéreo original a 48 kHz: ambiência de chuva, música ambiente sintetizada e efeitos Foley.
- Masterização pelo mux.sh do Estúdio 66 a -14 LUFS.

## Critérios de aprovação
Conferir continuidade de rosto/roupa, leitura da silhueta, movimento perceptível, ausência de flicker, sincronismo de passos/cortes, áudio sem clipping e MP4 1080 × 1920 com 24 fps.
