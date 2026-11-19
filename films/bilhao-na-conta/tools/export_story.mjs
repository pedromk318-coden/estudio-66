// Exporta a linha do tempo (story.js) para JSON: o mixer de áudio e as legendas leem os mesmos números.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
import { DUR, SHOTS, T, VO } from '../story.js';
const here = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(here, '..', 'story.json'), JSON.stringify({ DUR, SHOTS, T, VO }, null, 1));
fs.writeFileSync(path.join(here, '..', 'cues.json'), JSON.stringify(VO.map(v => ({ t0: v.t, t1: v.t + v.d, text: v.sub })), null, 1));
console.log('story.json + cues.json ok');
