# Direção visual — HD-2D com personagem 2D e profundidade de cenário

- Formato: 1080x1920, vertical 9:16, 24 fps, duração 60 segundos.
- Personagens: ilustração 2D desenhada em alta resolução com curvas suaves, contorno orgânico, volumes por cel-shading, luzes e sombras pintadas. Não são modelos 3D e não precisam ser SVG.
- Cenários: ambientes 3D em miniatura, com perspectiva, materiais, objetos em primeiro plano, planos intermediários e fundo.
- Integração personagem/ambiente: billboard 2D posicionado no espaço 3D, depth test, oclusão real por objetos, sombra projetada, sombra de contato, luz ambiente e luz de recorte.
- Profundidade cinematográfica: parallax de câmera, DOF/tilt-shift moderado, foco acompanhando o personagem, bloom controlado e atmosfera volumétrica.
- Movimento: personagens permanecem 2D; câmera e ambiente 3D criam a sensação de profundidade. Evitar aparência de adesivo ou colagem plana.
- Evitar: pixel art, pixels visíveis, nearest-neighbor, dithering, CRT, scanlines, personagem 3D realista ou sprite 8/16-bit.
- Narrativa: despertar, descoberta do saldo, primeiras decisões, transformação da cidade, reflexão e pergunta final.

## Implementação
`hero.js` usa uma atlas de poses 2D em canvas de alta resolução, com formas curvas e antialiasing. O personagem é colocado como plano 2D dentro da cena Three.js; portanto participa da câmera, da profundidade, das sombras e da oclusão do ambiente 3D. Não se trata de um SVG obrigatório nem de um modelo 3D.
