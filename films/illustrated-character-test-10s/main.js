const stage=document.getElementById('stage'),caption=document.getElementById('caption');
window.DUR=10;window.EV=[];
const SVG_URL='/films/illustrated-character-test-10s/assets/president-character.svg';
let svg,parts={};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const pivot=(id)=>{const p=parts[id]?.dataset.pivot;if(!p)return[0,0];return p.split(',').map(Number)};
function rotate(id,deg){const el=parts[id];if(!el)return;const [x,y]=pivot(id);el.setAttribute('transform',`translate(${x} ${y}) rotate(${deg}) translate(${-x} ${-y})`)}
function composite(id,chain){const el=parts[id];if(!el)return;el.setAttribute('transform',chain)}
function around(x,y,a){return `translate(${x} ${y}) rotate(${a}) translate(${-x} ${-y})`}
function setOpacity(id,v){if(parts[id])parts[id].style.opacity=String(v)}
async function load(){
 const res=await fetch(SVG_URL);if(!res.ok)throw new Error('Não foi possível carregar o SVG do personagem: '+res.status);
 const source=await res.text(),doc=new DOMParser().parseFromString(source,'image/svg+xml');
 if(doc.querySelector('parsererror'))throw new Error('SVG inválido');
 svg=document.importNode(doc.documentElement,true);
 svg.setAttribute('width','800');svg.setAttribute('height','1200');
 svg.style.width='min(100vw,66.6667vh)';svg.style.height='min(100vh,150vw)';
 svg.style.overflow='visible';stage.appendChild(svg);
 svg.querySelectorAll('[data-part]').forEach(el=>parts[el.dataset.part]=el);
 if(Object.keys(parts).length<20)throw new Error('Rig incompleto: poucas partes encontradas');
}
window.render=t=>{
 if(!svg)return;
 const bob=Math.sin(t*4.8)*5,breath=Math.sin(t*2.7)*2.2;
 // torso and head have independent, subtle acting
 rotate('torso',Math.sin(t*1.7)*1.8);
 rotate('head',Math.sin(t*2.2)*3.4);
 for(const id of ['eye_left','eye_right','brow_left','brow_right','nose','mouth','hair_back','hair_front','ear_left','ear_right']){
  composite(id,around(400,315,Math.sin(t*2.2)*3.4));
 }
 // blink: briefly compress eye groups vertically
 const blink=Math.pow(Math.max(0,Math.sin(t*3.4+1.1)),40);
 for(const id of ['eye_left','eye_right']){const [x,y]=pivot(id);const sy=1-.88*blink;parts[id].setAttribute('transform',`translate(${x} ${y}) scale(1 ${sy}) translate(${-x} ${-y}) `+around(400,315,Math.sin(t*2.2)*3.4))}
 // arms: shoulder + elbow motion, with hand following the upper arm
 const wave=ease((t-5.5)/1.2),armL=-8+Math.sin(t*2.6)*5,armR=wave*(-42)+Math.sin(t*3)*3;
 rotate('arm_back_upper',armL);rotate('arm_front_upper',armR);
 composite('arm_back_lower',around(300,575,armL)+around(232,735,Math.sin(t*2.4)*8));
 composite('hand_back',around(300,575,armL)+around(232,735,Math.sin(t*2.4)*8)+around(195,865,Math.sin(t*2.4)*5));
 composite('arm_front_lower',around(500,575,armR)+around(575,735,Math.sin(t*3)*9));
 composite('hand_front',around(500,575,armR)+around(575,735,Math.sin(t*3)*9)+around(615,865,Math.sin(t*3)*5));
 // walk-in-place ending: articulated hip/knee/feet oscillation
 const walk=ease((t-7)/1.1),step=Math.sin(t*8)*13*walk;
 rotate('leg_back_upper',step*.45);rotate('leg_front_upper',-step*.45);
 rotate('leg_back_lower',Math.max(0,-step)*.65);rotate('leg_front_lower',Math.max(0,step)*.65);
 rotate('shoe_back',step*.12);rotate('shoe_front',-step*.12);
 // subtle vertical breathing/bob on the complete SVG, not on individual parts
 svg.style.transform=`translateY(${bob}px)`;
 if(t<3)caption.textContent='PERSONAGEM VETORIAL EM CAMADAS';
 else if(t<6)caption.textContent='ROSTO, OLHOS E EXPRESSÕES ARTICULADOS';
 else caption.textContent='OMBROS • COTOVELOS • PULSOS • JOELHOS';
};
load().then(()=>{window.READY=true;window.render(0)}).catch(e=>{console.error(e);caption.textContent=e.message;throw e});
