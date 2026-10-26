(async function(){
const {get,post}=window.AYC_API;
const here=location.pathname.split('/').pop()||'index.html';
document.querySelector('[data-header]').innerHTML=`<a class="skip" href="#main">Skip to content</a>
`;
if(here!=='index.html'){const ph=document.querySelector('.page-head .wrap');if(ph)ph.insertAdjacentHTML('afterbegin','<p class="crumb"><a href="index.html">← Home</a></p>')}
document.querySelector('[data-footer]').innerHTML=`<footer class="site"><div class="wrap grid">
<div><strong>Armdale Yacht Club</strong><br>75 Burgee Run, Halifax, NS B3P 0C9<br>Melville Island, Northwest Arm</div>
<div>Office: <a href="tel:+19024774617">(902) 477-4617 ext. 1</a><br>Marine Services: <a href="tel:+19024762064">(902) 476-2064</a><br>VHF Channel 68</div>
<div><a href="mailto:office@armdaleyachtclub.ns.ca">office@armdaleyachtclub.ns.ca</a><br><a href="https://www.facebook.com/armdaleyachtclub/">Facebook</a> · <a href="https://aycsailing.ca/">AYC Sailing School</a><br><a href="https://melvilleislandheritage.ca/">Melville Island Heritage</a> — the island's 250-year story</div>
</div><div class="wrap"><p><a href="contact.html">Contact &amp; hours</a> · <a href="membership.html">Membership</a> · <a href="visiting-yachts.html">Visiting yachts</a> · <a href="facilities.html">Facilities</a> · <a href="member-resources.html">Members</a></p><p>Prototype — content sourced from armdaleyachtclub.ns.ca and aycsailing.ca (Oct 2026). Items marked “needs human review” must be confirmed by the club.</p></div></footer>`;
const fmt=d=>new Date(d);const mon=d=>fmt(d).toLocaleString('en-CA',{month:'short'});
function eventHTML(e){return `<article class="card event">${e.start?`<div class="date">${mon(e.start)}<b>${fmt(e.start).getDate()}</b></div>`:`<div class="date">Series</div>`}
<div><h3 style="margin:.1rem 0">${e.title}</h3><span class="tag">${e.category}</span> ${e.audience==='members'?'<span class="tag">Members only</span>':''}
${e.start?`<p>${fmt(e.start).toLocaleString('en-CA',{weekday:'long',hour:'numeric',minute:'2-digit'})}</p>`:''}
${e.registration.required?`<p><a class="btn" href="${e.registration.url}">Register / results</a> <small>(currently via Clubspot)</small></p>`:`<p><a href="${e.sourceUrl}">Details</a></p>`}</div></article>`}
const up=document.querySelector('[data-upcoming]');
if(up){const ev=(await get('events')).filter(e=>e.start&&e.category!=='Club Business').slice(0,4);up.innerHTML=ev.map(eventHTML).join('')}
const list=document.querySelector('[data-events]');
if(list){const all=await get('events');const q=document.getElementById('q'),c=document.getElementById('cat');
 const draw=()=>{const s=q.value.toLowerCase(),k=c.value;const r=all.filter(e=>(!k||e.category===k)&&e.title.toLowerCase().includes(s));list.innerHTML=r.map(eventHTML).join('')||'<p>No matching events.</p>';document.getElementById('count').textContent=`${r.length} events`};
 [...new Set(all.map(e=>e.category))].forEach(x=>c.add(new Option(x,x)));q.oninput=c.onchange=draw;draw()}
const docs=document.querySelector('[data-docs]');
if(docs){const d=await get('documents');const q=document.getElementById('dq');const draw=()=>{const s=q.value.toLowerCase();docs.innerHTML=d.filter(x=>(x.title+x.category).toLowerCase().includes(s)).map(x=>`<tr><td><a href="${x.file}">${x.title}</a></td><td>${x.category}</td><td><span class="review">needs human review</span></td></tr>`).join('')};q.oninput=draw;draw()}
document.querySelectorAll('form[data-post]').forEach(f=>f.addEventListener('submit',async ev=>{ev.preventDefault();if(!f.reportValidity())return;
 const rec=await post(f.dataset.post,Object.fromEntries(new FormData(f)));const o=f.querySelector('[role=status]');o.textContent=`Thanks — request ${rec.id} saved locally (mock). In production this goes to the club-management API and the Marine Services Manager.`;f.reset()}));

const rr=document.querySelector('[data-racing]');
if(rr){const R=await get('racing');const seasons=[...new Set(R.map(r=>r.season))];
 rr.innerHTML=seasons.map(se=>`<h2>${se}</h2><div class="grid">${R.filter(r=>r.season===se).map(r=>`<article class="card"><h3>${r.name}</h3>
 ${r.resultsPublished?`<p><a class="btn" href="${r.resultsUrl}">View results</a></p><p><small>Results as of ${r.asOf} (on Clubspot)</small></p>`:`<p><strong>Results not yet published</strong></p>`}
 <p><a href="${r.regattaUrl}">Race page, notice of race &amp; sailing instructions</a></p></article>`).join('')}</div>`).join('')}
})();
