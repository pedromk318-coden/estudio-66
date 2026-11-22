# Padrão visual — animação 2D ilustrada do Estúdio 66

Este padrão deve ser aplicado aos curtas 2D narrativos quando o usuário pedir cartoon ilustrado/cinematográfico. Não substitui os estilos fixos da biblioteca quando o usuário escolhe outro estilo.

## Não entregar
- Personagens compostos apenas por círculos, ovais, linhas e retângulos sem acabamento.
- Cenários vazios com uma parede lisa e poucos objetos simbólicos.
- Uma única cor chapada por peça, membros como tubos uniformes ou rostos sem nariz, orelhas e volume.
- Chamar uma renderização 1080p de "alta qualidade" se o desenho continuar simples.

## Design de personagens
- Silhueta própria e assimétrica, anatomia coerente, mãos e pés desenhados.
- Cabeça com maxilar, bochechas, orelhas, nariz em planos, pálpebras, íris/pupilas e boca com expressão.
- Cabelo em mechas/cachos ou massas desenhadas com variação; pelo com tufos, marcas e bigodes quando necessário.
- Roupas com gola, costuras, dobras, bolsos, botões e sombras de contato.
- Pelo menos três níveis de valor por material: luz, meio-tom e sombra; highlights localizados.
- Criar uma folha de modelo por personagem e preservar proporções, roupa e paleta entre planos.

## Cenários e composição
- Construir pelo menos 3 planos de profundidade (fundo, meio e primeiro plano).
- Preencher o espaço com objetos coerentes com a história, não decoração aleatória.
- Paredes, madeira, tecido, metal, vidro e pele precisam ter texturas distintas.
- Usar luz motivada por fontes visíveis; sombras de contato e reflexos para assentar os objetos.
- Compor com profundidade de campo simulada, bokeh e parallax apenas quando ajudarem a leitura.

## Movimento e efeitos
- Atuação com antecipação, ação e reação; respiração, piscadas, olhar, cabelo/roupa e objetos secundários.
- Câmera com push-in, pan ou parallax suave; não mover tudo na mesma velocidade.
- Partículas, chuva, poeira, fumaça, brilho e reflexos com moderação e coerência física.
- Shaders/WebGL só quando disponíveis e estáveis. Em runners sem GPU, preferir efeitos 2D cacheados e passes pré-computados para não tornar o render impraticável.
- Texturas estáticas devem ser geradas uma vez e reutilizadas; evitar loops pesados de ruído por frame.

## Pipeline e qualidade
- Manter a saída vertical 1080 × 1920 e 24 fps por padrão para narrativa.
- Fazer render de stills em vários tempos antes do vídeo completo.
- Validar duração, resolução, fps e existência do MP4 com ffprobe.
- Não confundir resolução com qualidade de arte: a direção de arte e os assets são o principal.

## Padrão cinematográfico obrigatório para o modo 2D ilustrado

O projeto deve parecer um trecho de uma série animada, não um slideshow de ilustrações. A qualidade vem de direção de arte, atuação, movimento, som e composição em conjunto.

### Atuação e animação
- Planejar cada plano com intenção: antecipação, ação, reação e settle; evitar personagem parado no centro enquanto só partículas se mexem.
- Animar em camadas independentes: cabeça/olhos/boca, tronco, braços/mãos, pernas/pés, cabelo, roupa e objetos tocados.
- Incluir microatuação (piscar, respiração, olhar, transferência de peso) e ação principal legível.
- Usar curvas de aceleração/desaceleração, arcos, overshoot e follow-through; variar ritmo e amplitude.
- Criar ao menos dois movimentos de câmera por sequência curta (push-in, pan, truck, tilt ou handheld discreto), além de cortes motivados quando a história pedir.

### Fotografia e composição
- Três ou mais planos de profundidade, com parallax em velocidades diferentes.
- Luz principal motivada, preenchimento, recorte/rim light e luzes práticas visíveis quando coerentes.
- Profundidade de campo seletiva, bokeh, bloom/halation, vinheta e grão fino; nunca usar blur global indiscriminado.
- Motion blur temporal seletivo ou por shutter em movimentos rápidos. Em runner sem GPU, limitar amostras a 2 por frame por padrão e permitir desligar/baixar para cenas estáticas.
- Efeitos devem reforçar a ação: chuva, poeira, fumaça, faíscas, folhas, gotas no vidro, reflexos, flare e distorção de calor quando fizer sentido. Evitar partículas aleatórias sem relação com a cena.

### Som é parte da animação
- Cada vídeo com som deve ter camadas separadas: diálogo/voz, música, ambiência e Foley/SFX.
- Sincronizar passos, tecido, objetos, impactos, transições, luzes e movimentos com o quadro.
- Criar paisagem estéreo e perspectiva sonora; usar reverberação curta/longa conforme o espaço.
- Mixar com headroom, compressor/limiter e master em torno de -14 LUFS integrado, true peak máximo -1.2 dBTP.
- Não inserir música ou efeitos protegidos sem licença. Priorizar gravação do usuário ou áudio procedural original; documentar fontes em CREDITS.

### Render e validação
- Renderizar primeiro stills em vários tempos e conferir composição, desenho e continuidade.
- Fazer teste de 10 segundos com áudio completo antes de aprovar um estilo para vídeos longos.
- Validar duração, 1080 × 1920, fps, faixa de áudio, clipping, loudness e arquivo final com ffprobe.
- Otimizar com texturas cacheadas, partículas determinísticas e efeitos pré-computados; não trocar qualidade por efeitos em excesso.
- Nunca declarar "pronto" antes do workflow terminar e o MP4 final existir como artefato.
