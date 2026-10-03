const NS='http://www.w3.org/2000/svg';
const azules=['#3a4fd6','#5b8def','#7aa7ff','#2c3ea8','#9cc0ff','#4a6fe0'];
const rnd=(a,b)=>a+Math.random()*(b-a);
const svg=document.getElementById('ramo');
function el(n,a,p){const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}

function mezcla(hex,t){
  const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const o=t>0?255:0,k=Math.abs(t);
  return '#'+c.map(v=>Math.round(v+(o-v)*k).toString(16).padStart(2,'0')).join('');
}

function flor(parent,x,y,r,col,d){
  const h=el('g',{class:'head'},parent);
  const b=el('g',{class:'bloom',style:`--d:${d}s`},h);
  const f=el('g',{transform:`translate(${x} ${y}) rotate(${rnd(0,360).toFixed(0)})`},b);
  const borde=mezcla(col,-.4);
  el('circle',{r:r*.98,fill:mezcla(col,-.3)},f);
  // capas de pétalos, de fuera hacia dentro
  [{n:6,d:.6,p:.45,t:-.1,o:0},{n:5,d:.4,p:.38,t:.05,o:30},{n:4,d:.22,p:.3,t:.15,o:12}].forEach(c=>{
    for(let i=0;i<c.n;i++){
      const a=(c.o+i*360/c.n)*Math.PI/180;
      el('circle',{cx:(Math.sin(a)*c.d*r).toFixed(1),cy:(-Math.cos(a)*c.d*r).toFixed(1),r:(c.p*r).toFixed(1),
        fill:mezcla(col,c.t),stroke:borde,'stroke-width':1},f);
    }
  });
  // espiral del centro
  el('circle',{r:r*.17,fill:mezcla(col,.25),stroke:borde,'stroke-width':1},f);
  el('path',{d:`M${-r*.1} ${r*.02} A${r*.1} ${r*.1} 0 1 1 ${r*.1} ${r*.02}`,fill:'none',stroke:borde,'stroke-width':1.2,'stroke-linecap':'round'},f);
  h.addEventListener('click',()=>h.classList.toggle('turn'));
}

function ramo(){
  svg.innerHTML='';
  const bx=300,by=470,N=11,tallos=[];
  for(let i=0;i<N;i++){
    const ang=((i/(N-1))-.5)*1.5+rnd(-.08,.08);
    const len=rnd(230,330);
    tallos.push({ang,x:bx+Math.sin(ang)*len,y:by-Math.cos(ang)*len*.85});
  }
  tallos.sort((a,b)=>a.y-b.y);
  const sway=el('g',{class:'sway'},svg);
  tallos.forEach((t,i)=>{
    const s=.4+i*.13; // cuándo empieza a crecer el tallo
    const g=el('g',{},sway);
    const cx=(bx+t.x)/2+rnd(-25,25),cy=(by+t.y)/2;
    el('path',{d:`M${bx} ${by} Q${cx} ${cy} ${t.x} ${t.y}`,pathLength:1,class:'stem',style:`--d:${s}s`,fill:'none',stroke:'var(--stem)','stroke-width':4,'stroke-linecap':'round'},g);
    el('ellipse',{class:'leaf',style:`--d:${s+.4}s`,cx:cx,cy:cy+20,rx:7,ry:18,fill:'var(--stem)',transform:`rotate(${t.ang>0?-50:50} ${cx} ${cy+20})`},g);
    flor(g,t.x,t.y,rnd(34,50),azules[i%azules.length],s+.65);
  });
  for(let i=0;i<7;i++){
    const s=1.9+i*.1;
    const a=rnd(-.8,.8),l=rnd(150,215);
    const g=el('g',{},sway);
    const x=bx+Math.sin(a)*l,y=by-Math.cos(a)*l*.8;
    el('path',{d:`M${bx} ${by} L${x} ${y}`,pathLength:1,class:'stem',style:`--d:${s-.5}s`,stroke:'var(--stem)','stroke-width':2.5,fill:'none'},g);
    flor(g,x,y,rnd(13,18),'#8fb4ff',s);
  }
  const p=el('g',{class:'paper'},svg);
  el('path',{d:'M165 378 Q300 425 435 378 L332 522 L268 522 Z',fill:'var(--paper)'},p);
  el('path',{d:'M165 378 L300 440 L268 522 Z',fill:'var(--paper2)'},p);
  el('path',{d:'M238 452 Q300 472 362 452 L357 474 Q300 494 243 474 Z',fill:'var(--ribbon)'},p);
  el('ellipse',{cx:272,cy:486,rx:26,ry:11,fill:'var(--ribbon)',transform:'rotate(25 272 486)'},p);
  el('ellipse',{cx:328,cy:486,rx:26,ry:11,fill:'var(--ribbon)',transform:'rotate(-25 328 486)'},p);
}
ramo();