# Regras de Reels do Estúdio 66

Valem por cima dos guias da biblioteca, que foram escritos para filmes horizontais.

## 1. Formato

- **1080×1920, 24 fps.** Passe `--size 1080x1920` para `still.mjs`, `video.mjs` e `readcheck.mjs`.
- **15 a 30 s** por padrão; o gancho vive no primeiro segundo.
- Tela cheia; adapte molduras e composições horizontais para o formato vertical sem perder a linguagem do estilo.

## 2. Adaptar um motor para o vertical

Os motores das demos assumem 1920×1080. Copie o motor para o projeto e adapte as constantes para 1080×1920. Exemplos de referência estão em `exemplos/`. Para estilos sem exemplo, leia a demo depois de escrever o tratamento e adapte o motor sem copiar a história da demo.

## 3. Área segura

- **x:** 80 a 940 (a coluna de botões fica à direita).
- **y:** 250 a 1480 (topo e rodapé recebem elementos da interface).

O assunto pode ocupar a tela toda; textos importantes e legendas ficam dentro da área segura.

## 4. Gancho e ritmo

- O quadro 0 nunca é vazio; comece com parte da ação já acontecendo.
- Algo muda a cada 1 a 1,5 s: corte, movimento, informação ou efeito sonoro.
- Legenda grande (60–90 px), poucas palavras por vez, sincronizada com a voz.
- Termine com tela final de 1,5–2 s e CTA/@ quando fornecido.

## 5. Voz, sons e trilha no modo nuvem

- O runner GitHub Actions instala as dependências básicas do kit. `LIB` aponta para a pasta `biblioteca` e o ambiente Python fica em `LIB/.venv/`.
- Use voz Kokoro offline somente quando as dependências **e os modelos** estiverem disponíveis no runner. Caso contrário, use gravação enviada pelo usuário, entregue sem voz ou peça autorização explícita para serviço externo.
- Não presuma que o celular pode executar TTS ou renderização. Não peça instalação local.
- Efeitos: `core/audio/sfx.py`; sampler e bibliotecas de instrumentos podem exigir downloads adicionais. Só baixe o que o estilo realmente precisa e documente em `CREDITS`.
- Mixagem: termine com `core/render/mux.sh` (alvo de −14 LUFS e pico ≤ −1,2 dB, conforme o pipeline).

## 6. Legenda do post (`legenda.txt`)

1. Primeira linha: gancho em até 125 caracteres.
2. Corpo curto, em frases diretas.
3. Uma chamada para ação.
4. 3 a 5 hashtags do nicho.
