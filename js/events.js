(async function(){
const all=(await window.AYC_API.get('events'));
const dated=all.filter(e=>e.start).sort((a,b)=>a.start.localeCompare(b.start));
const CATS={Racing:'c-racing',Events:'c-events','Club Business':'c-business'};
const LABEL={Racing:'Racing',Events:'Social & events','Club Business':'Club business'};
const cls=c=>CATS[c]||'c-other';
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const LOC='Armdale Yacht Club, 75 Burgee Run, Halifax, NS';
const D=s=>new Date(s), key=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const tfmt=e=>{const s=D(e.start),o={hour:'numeric',minute:'2-digit'};return s.toLocaleDateString('en-CA',{weekday:'long',month:'long',day:'numeric',year:'numeric'})+', '+s.toLocaleTimeString('en-CA',o)+(e.end?'–'+D(e.end).toLocaleTimeString('en-CA',o):'')};
let active=new Set(Object.keys(CATS).filter(c=>dated.some(e=>e.category===c)));
const q=document.getElementById('q');
const shown=()=>dated.filter(e=>active.has(e.category)&&e.title.toLowerCase().includes(q.value.toLowerCase()));
// chips
const chips=document.querySelector('[data-chips]');
chips.innerHTML=[...active].map(c=>`<button type="button" class="${cls(c)}" data-cat="${esc(c)}" aria-pressed="true"><span class="sw" style="background:var(--c)"></span>${LABEL[c]||c}</button>`).join('');
chips.onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const c=b.dataset.cat;active.has(c)?active.delete(c):active.add(c);b.setAttribute('aria-pressed',active.has(c));draw()};
q.oninput=()=>draw();
// view
const mobile=matchMedia('(max-width:700px)').matches;let view=mobile?'list':'grid';
const vb=document.querySelectorAll('[data-view]');vb.forEach(b=>b.onclick=()=>{view=b.dataset.view;draw()});
const now=new Date();const first=dated.find(e=>D(e.end||e.start)>=now)||dated[0];
let cur=first?new Date(D(first.start).getFullYear(),D(first.start).getMonth(),1):new Date(now.getFullYear(),now.getMonth(),1);
const box=document.querySelector('[data-cal]'),det=document.getElementById('detail');
function evDetail(e){return `<div class="ev ${cls(e.category)}"><h3 style="margin:.1rem 0">${esc(e.title)}</h3><p><span class="tag">${esc(LABEL[e.category]||e.category)}</span>${e.audience==='members'?' <span class="tag">Members only</span>':''}</p><p><strong>When:</strong> ${tfmt(e)}<br><strong>Where:</strong> ${LOC} <span class="review">needs human review</span></p><p>Details to come — see the event page for the full description.</p><div class="ev-actions">${e.registration&&e.registration.required?`<a href="${esc(e.registration.url)}">Register / results</a>`:''}<a href="${esc(e.sourceUrl)}">Event details<span class="sr-only"> for ${esc(e.title)}</span></a><button type="button" data-ics="${esc(e.id)}">Add to calendar</button></div></div>`}
function showDay(k,label){const ev=shown().filter(e=>key(D(e.start))===k);det.innerHTML=`<h2 style="margin-top:0">${label}</h2>`+(ev.map(evDetail).join('')||'<p>No events this day.</p>');det.focus()}
function showEv(id){const e=dated.find(x=>x.id===id);det.innerHTML=evDetail(e);det.focus()}
function grid(){const y=cur.getFullYear(),m=cur.getMonth(),start=new Date(y,m,1-new Date(y,m,1).getDay());const list=shown();
 const by={};list.forEach(e=>(by[key(D(e.start))]=by[key(D(e.start))]||[]).push(e));
 let h=`<div class="cal-nav"><button type="button" data-nav="-1" aria-label="Previous month">‹ Prev</button><h2 aria-live="polite">${cur.toLocaleDateString('en-CA',{month:'long',year:'numeric'})}</h2><button type="button" data-nav="1" aria-label="Next month">Next ›</button></div><div class="cal-grid" role="grid">`;
 h+=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="dow" role="columnheader">${d}</div>`).join('');
 for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const k=key(d),evs=by[k]||[];const lab=d.toLocaleDateString('en-CA',{weekday:'long',month:'long',day:'numeric'});
  h+=`<div class="cal-day${d.getMonth()!==m?' out':''}${k===key(now)?' today':''}" role="gridcell"><button type="button" class="n" data-day="${k}" data-label="${lab}" aria-label="${lab}, ${evs.length} event${evs.length===1?'':'s'}" style="border:0;background:none;font:inherit;font-weight:700;cursor:pointer;min-width:32px;min-height:32px">${d.getDate()}</button>${evs.map(e=>`<button type="button" class="ev-pill ${cls(e.category)}" data-ev="${e.id}" title="${esc(e.title)}">${esc(e.title)}</button>`).join('')}</div>`;if(i===34&&new Date(start.getTime()+35*864e5).getMonth()!==m)break}
 return h+'</div>'}
function agenda(){const list=shown().filter(e=>D(e.end||e.start)>=new Date(now.getFullYear(),now.getMonth(),now.getDate()));const g={};list.forEach(e=>{const k=D(e.start).toLocaleDateString('en-CA',{month:'long',year:'numeric'});(g[k]=g[k]||[]).push(e)});
 return `<div class="agenda">`+(Object.entries(g).map(([k,evs])=>`<h3 class="m">${k}</h3>`+evs.map(e=>`<article class="row ${cls(e.category)}"><div class="d">${D(e.start).toLocaleDateString('en-CA',{weekday:'short'})}<b>${D(e.start).getDate()}</b></div><div><h4>${esc(e.title)}</h4><p style="margin:0">${D(e.start).toLocaleTimeString('en-CA',{hour:'numeric',minute:'2-digit'})} · ${esc(LABEL[e.category]||e.category)}${e.audience==='members'?' · Members only':''}</p><div class="ev-actions">${e.registration&&e.registration.required?`<a href="${esc(e.registration.url)}">Register / results</a>`:''}<a href="${esc(e.sourceUrl)}">Details<span class="sr-only"> for ${esc(e.title)}</span></a><button type="button" data-ics="${e.id}">Add to calendar<span class="sr-only"> for ${esc(e.title)}</span></button></div></div></article>`).join('')).join('')||'<p>No upcoming events match.</p>')+'</div>'}
function draw(){vb.forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===view));box.innerHTML=view==='grid'?grid():agenda();if(view==='list')det.innerHTML='';document.getElementById('count').textContent=`${shown().length} events shown`}
box.onclick=ev=>{const n=ev.target.closest('[data-nav]'),p=ev.target.closest('[data-ev]'),d=ev.target.closest('[data-day]');
 if(n){cur=new Date(cur.getFullYear(),cur.getMonth()+ +n.dataset.nav,1);det.innerHTML='';draw();box.querySelector(`[data-nav="${n.dataset.nav}"]`).focus()}else if(p)showEv(p.dataset.ev);else if(d)showDay(d.dataset.day,d.dataset.label)};
const ics=e=>{const f=s=>s.replace(/[-:]/g,'').slice(0,15);const t=s=>s.replace(/[,;\\]/g,m=>'\\'+m);return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AYC//Prototype//EN','BEGIN:VEVENT','UID:'+e.id+'@armdaleyachtclub.ns.ca','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z','DTSTART;TZID=America/Halifax:'+f(e.start),'DTEND;TZID=America/Halifax:'+f(e.end||e.start),'SUMMARY:'+t(e.title),'LOCATION:'+t(LOC),'URL:'+e.sourceUrl,'END:VEVENT','END:VCALENDAR'].join('\r\n')};
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-ics]');if(!b)return;const e=dated.find(x=>x.id===b.dataset.ics);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics(e)],{type:'text/calendar'}));a.download=e.title.replace(/[^\w]+/g,'-')+'.ics';document.body.append(a);a.click();a.remove()});
draw();
})();
