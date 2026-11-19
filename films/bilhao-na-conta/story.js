// Linha do tempo única: vídeo vertical de 60s, narrativa revisada e estilo HD-2D suave.
export const DUR = 60;
export const SHOTS = [
  { id: 'quarto', a: 0, b: 13 },
  { id: 'rua', a: 13, b: 50 },
  { id: 'fim', a: 50, b: 60 },
];
export const T = {
  buzz: [[0.25, 0.85], [1.25, 1.85], [2.2, 2.6]],
  wake: 2.6,
  countA: 3.2, countB: 7.6,
  shock: 7.6, shockEnd: 9.4,
  walkA: 17, walkB: 48,
  lights: [28, 30, 32, 34, 36, 38],
  lamps: [27, 33, 39, 43],
  saveIn: 51.5,
  endCard: 54.2,
};
export const VO = [
  { id: 'v1', t: 0.2, d: 6.0, who: 'NARRADOR', sub: 'Imagine acordar numa manhã qualquer, pegar o celular e descobrir que alguém acabou de depositar um bilhão de reais na sua conta.' },
  { id: 'v2', t: 7.0, d: 6.0, who: 'NARRADOR', sub: 'Você olha uma vez. Pisca. Olha de novo. R$ 1.000.000.000. Sim, nove zeros. Você acabou de entrar para o clube dos bilionários.' },
  { id: 'v3', t: 14.0, d: 7.0, who: 'NARRADOR', sub: 'Mas você não perde tempo. Ainda de pijama, começa a fazer aquilo que todo mundo sonha: resolver todos os seus problemas financeiros.' },
  { id: 'v4', t: 22.0, d: 7.0, who: 'NARRADOR', sub: 'Paga as dívidas da família, compra casas para seus pais e ajuda pessoas que nunca tiveram uma oportunidade.' },
  { id: 'v5', t: 31.0, d: 7.0, who: 'NARRADOR', sub: 'A cidade inteira começa a mudar. Portas se abrem, casas são reformadas e muita gente ganha uma nova chance.' },
  { id: 'v6', t: 40.0, d: 7.0, who: 'NARRADOR', sub: 'Só que existe um detalhe: dinheiro pode comprar conforto, viagens e liberdade. Mas não compra tempo, saúde ou pessoas verdadeiras.' },
  { id: 'v7', t: 49.0, d: 9.0, who: 'NARRADOR', sub: 'Então me conta: se amanhã você acordasse com um bilhão na conta, qual seria a primeira coisa que faria? Pense bem!' },
];
export const shotAt = t => SHOTS.find(s => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1];
