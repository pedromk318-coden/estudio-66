// Linha do tempo única (segundos). Tudo (imagem, legendas, som) lê estes números.
export const DUR = 37;
export const SHOTS = [
  { id: 'quarto', a: 0, b: 13.0 },
  { id: 'rua', a: 13.0, b: 26.0 },
  { id: 'fim', a: 26.0, b: 37.0 },
];
export const T = {
  buzz: [[0.25, 0.85], [1.25, 1.85], [2.2, 2.6]],   // o celular vibrando na mesinha
  wake: 2.6,            // acorda e pega o celular
  countA: 3.2, countB: 7.6,   // saldo contando de zero até o valor final
  shock: 7.6, shockEnd: 9.4,
  walkA: 13.4, walkB: 25.4,   // caminhada na rua
  lights: [14.5, 15.5, 16.5, 17.6, 18.7, 19.9],  // janelas acendendo uma a uma
  lamps: [14.1, 16.1, 18.1, 20.1],
  saveIn: 27.0,         // cristal de salvar aparece
  endCard: 33.9,
};
// Falas (caixa de diálogo, texto digitado). d = duração de exibição.
export const VO = [
  { id: 'v1', t: 0.15, d: 2.9, who: 'VOCÊ', sub: 'Você acorda. O celular vibra.' },
  { id: 'v2', t: 7.8, d: 2.4, who: 'VOCÊ', sub: 'Calma. Confere de novo.' },
  { id: 'v3', t: 10.7, d: 2.3, who: 'VOCÊ', sub: 'Não é erro. É real.' },
  { id: 'v4', t: 13.5, d: 3.0, who: 'VOCÊ', sub: 'Primeira missão: pijama mesmo.' },
  { id: 'v5', t: 17.0, d: 2.9, who: 'VOCÊ', sub: 'Pagar a conta de todo mundo.' },
  { id: 'v6', t: 20.4, d: 3.2, who: 'VOCÊ', sub: 'A cidade inteira acorda sorrindo.' },
  { id: 'v7', t: 26.4, d: 3.2, who: 'VOCÊ', sub: 'Mas o saldo não muda quem você é.' },
  { id: 'v8', t: 30.3, d: 3.2, who: 'VOCÊ', sub: 'E você, qual seria a primeira coisa?' },
];
export const shotAt = t => SHOTS.find(s => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1];
