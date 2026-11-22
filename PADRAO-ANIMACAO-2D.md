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
