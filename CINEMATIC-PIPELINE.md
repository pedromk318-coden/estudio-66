# Pipeline Cinematográfico 2D — Estúdio 66

Este é o padrão técnico reutilizável para curtas 2D ilustrados. O helper `biblioteca/core/render/cinematic2d.js` fornece partículas determinísticas, chuva, glow, câmera, vinheta/grão e shutter temporal com múltiplas amostras. O showcase `films/cinematic-2d-test-10s/` demonstra o fluxo de 10 segundos com mix original.

## Como usar
1. Importar os utilitários de `/core/render/cinematic2d.js` no `main.js`.
2. Construir cada cenário em camadas e desenhar os personagens com anatomia, volumes, materiais e detalhes próprios.
3. Animar a ação principal e os movimentos secundários em função do tempo absoluto; todas as funções devem ser determinísticas para que o render por segmentos funcione.
4. Usar `camera()` para movimento de câmera, `drawParticles()` para atmosfera, `drawRain()` para chuva, `glow()` para fontes de luz e `drawVignetteGrain()` para acabamento.
5. Envolver a cena com `renderShutter()` apenas quando houver movimento que se beneficie de motion blur. O padrão de 2 amostras dobra aproximadamente o custo da pintura da cena; use 1 amostra em planos parados ou quando o runner estiver limitado.
6. Criar `mix.py` com diálogo, trilha, ambiência e Foley/SFX sincronizados. A música e os efeitos podem ser sintetizados proceduralmente com numpy/scipy.
7. Rodar stills antes do MP4 e finalizar com `core/render/mux.sh`, que faz normalização e mux do áudio.

## Padrões de saída
- Vertical 1080 × 1920, 24 fps para narrativa, salvo pedido diferente.
- Motion blur com shutter moderado, nunca borrão constante em todo o quadro.
- Partículas com semente fixa e posição calculada por tempo, sem aleatoriedade por frame.
- Áudio estéreo 48 kHz; master alvo -14 LUFS integrado e true peak <= -1.2 dBTP.
- Toda fonte externa deve ser licenciada e registrada em CREDITS. Não usar serviços pagos ou enviar arquivos do usuário a terceiros sem consentimento.

## Perfil de desempenho
- Canvas 2D é a rota robusta em runners sem GPU; WebGL/Three.js pode usar GPU quando disponível, mas o runner pode cair em SwiftShader.
- Cachear texturas, padrões, gradientes e geometria; evitar gerar ruído pesado em cada frame.
- Começar com 2 workers no render e ajustar conforme memória disponível.
- Motion blur temporal, DOF e partículas são opcionais por plano, não filtros globais obrigatórios.
