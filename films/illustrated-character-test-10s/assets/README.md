# Personagem em camadas — Estúdio 66

Arquivo principal: `president-character.svg`

## Contrato de leitura do motor
- SVG vetorial único, viewBox 800 × 1200.
- Cada parte animável é um grupo `<g id="..." data-part="...">`.
- `data-pivot="x,y"` indica o pivô em coordenadas do viewBox.
- O motor deve carregar o SVG via fetch, parsear com DOMParser como `image/svg+xml`, localizar grupos por `[data-part]` e animar usando transformações SVG.
- Coordenadas usam origem no canto superior esquerdo; ângulos em graus.
- Partes já estão desenhadas como vetores independentes; não dependem de recorte raster.
- Camadas da frente ficam depois das camadas de trás no SVG.

## IDs das partes
`leg_back_upper`, `leg_back_lower`, `shoe_back`, `leg_front_upper`, `leg_front_lower`, `shoe_front`, `arm_back_upper`, `arm_back_lower`, `hand_back`, `arm_front_upper`, `arm_front_lower`, `hand_front`, `torso`, `neck`, `head`, `eye_left`, `eye_right`, `brow_left`, `brow_right`, `nose`, `mouth`, `hair_back`, `hair_front`, `coat_lapel_left`, `coat_lapel_right`.

## Exemplo de animação
Para rodar um grupo em torno do pivô `(px,py)`, aplique:
`translate(px py) rotate(angle) translate(-px -py)`
A cadeia de braço pode animar ombro, cotovelo e mão em separado. Para preservar hierarquia de articulações em produção, o motor pode envolver cada grupo em um nó-pivô adicional sem redesenhar o SVG.

## Observação
Esta é uma folha de personagem vetorial por partes, pronta para o loader SVG do motor. O arquivo não é um MP4 nem contém uma animação pré-renderizada.
