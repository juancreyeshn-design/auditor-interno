const caseEsc=(v='')=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]||m));
const arr=v=>Array.isArray(v)?v:[];
function profileLabel(p){return {dea:'DEA',comite:'Comité',auditor:'Auditor',estudiante:'Estudiante'}[p]||p;}
function caseCard(c){
  return `<article class="case-card" data-id="${caseEsc(c.id)}" data-domain="${caseEsc(c.domain||'')}" data-profile="${arr(c.profile).join(' ')}" data-difficulty="${caseEsc((c.difficulty||'').toLowerCase())}">
    <div class="case-card-top"><span class="badge">${caseEsc(c.difficulty||'Caso')}</span><small>${caseEsc(c.id)}</small></div>
    <h3>${caseEsc(c.title)}</h3>
    <p>${caseEsc(c.summary||'Caso profesional relacionado con la implementación de NOGAI.')}</p>
    <div class="case-tags">${arr(c.tags).slice(0,5).map(t=>`<span>${caseEsc(t)}</span>`).join('')}</div>
    <div class="case-foot"><small>${caseEsc(c.sector||'General')}</small><small>${arr(c.standards).length} normas</small></div>
  </article>`;
}
function section(title,items){return `<section class="case-section"><h4>${caseEsc(title)}</h4>${items.length?`<ul>${items.map(x=>`<li>${caseEsc(x)}</li>`).join('')}</ul>`:'<p class="empty">Pendiente de ampliación.</p>'}</section>`;}
function pill(item){return `<button class="case-pill" data-open="${caseEsc(item.id)}"><strong>${caseEsc(item.id)}</strong><span>${caseEsc(item.title)}</span></button>`;}
function detail(c,store,knowledge){
  const content=c.content||{};
  const standards=arr(c.standards).map(id=>store.get(id)).filter(Boolean);
  const relations=knowledge.related(c.id);
  const objects=relations.filter(x=>x.collection==='cards'||x.type==='object');
  return `<article class="case-detail">
    <header class="case-detail-head"><div><span class="badge">Caso profesional</span><h2>${caseEsc(c.title)}</h2><p>${caseEsc(c.summary||'')}</p><div class="case-tags">${arr(c.profile).map(x=>`<span>${caseEsc(profileLabel(x))}</span>`).join('')}${arr(c.tags).map(x=>`<span>${caseEsc(x)}</span>`).join('')}</div></div><div class="case-score"><strong>${caseEsc(c.difficulty||'Caso')}</strong><span>${caseEsc(c.sector||'General')}</span></div></header>
    <div class="case-detail-grid">
      <section class="case-section case-wide"><h4>Contexto</h4><p>${caseEsc(content.context||'')}</p></section>
      <section class="case-section case-wide"><h4>Situación problemática</h4><p>${caseEsc(content.problem||'')}</p></section>
      ${section('Análisis profesional',arr(content.analysis))}
      ${section('Solución propuesta',arr(content.solution))}
      ${section('Lecciones aprendidas',arr(content.lessons))}
      ${section('Preguntas de reflexión',arr(content.questions))}
    </div>
    <div class="case-map"><section><h4>Normas relacionadas</h4>${standards.length?standards.map(pill).join(''):'<p class="empty">Sin normas relacionadas.</p>'}</section><section><h4>Objetos profesionales</h4>${objects.length?objects.slice(0,10).map(pill).join(''):'<p class="empty">Sin objetos relacionados.</p>'}</section></div>
  </article>`;
}
export function renderCases({store,knowledge}){
  const cases=store.all('cases');
  const domains=store.all('domains');
  const first=cases[0];
  return `<section class="cases-center panel">
    <div class="case-hero"><div><span class="badge">Sprint 010</span><h2>Casos Profesionales</h2><p>Casos originales diseñados para convertir la norma en criterio profesional: contexto, problema, análisis, solución, lecciones y preguntas de reflexión.</p></div><div class="case-hero-stat"><strong>${cases.length}</strong><span>casos iniciales</span></div></div>
    <div class="case-tools"><div class="case-search"><strong>Buscar casos</strong><input id="caseSearch" placeholder="Mandato, papeles, seguimiento, PAMC..."></div><div class="case-filters" id="caseDomains"><button class="active" data-domain="all">Todos</button>${domains.map(d=>`<button data-domain="${caseEsc(d.id)}">${caseEsc(d.id)}</button>`).join('')}</div><div class="case-profiles" id="caseProfiles"><button class="active" data-profile="all">Todos los perfiles</button><button data-profile="dea">DEA</button><button data-profile="comite">Comité</button><button data-profile="auditor">Auditor</button><button data-profile="estudiante">Estudiante</button></div></div>
    <div class="case-layout"><aside class="case-list" id="caseList">${cases.map(caseCard).join('')}</aside><main>${first?detail(first,store,knowledge):'<p class="empty">No hay casos cargados.</p>'}</main></div>
  </section>`;
}
export function bindCases(root,{store,knowledge,router}){
  const list=root.querySelector('#caseList'); const input=root.querySelector('#caseSearch'); const domainBtns=[...root.querySelectorAll('#caseDomains button')]; const profileBtns=[...root.querySelectorAll('#caseProfiles button')];
  let currentDomain='all', currentProfile='all';
  function show(id){const c=store.get(id); if(!c)return; root.querySelector('.case-layout main').innerHTML=detail(c,store,knowledge); bindDetail(); [...list.querySelectorAll('.case-card')].forEach(card=>card.classList.toggle('selected',card.dataset.id===id)); try{localStorage.setItem('auditoria_nogai_cases_v1',JSON.stringify({lastCase:id,updatedAt:new Date().toISOString()}));}catch(_){}}
  function bindDetail(){root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>router.go('/item/'+b.dataset.open));}
  function apply(){const term=(input.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); [...list.querySelectorAll('.case-card')].forEach(c=>{const text=c.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); const domainOk=currentDomain==='all'||c.dataset.domain===currentDomain; const profileOk=currentProfile==='all'||(c.dataset.profile||'').includes(currentProfile); c.style.display=(domainOk&&profileOk&&text.includes(term))?'':'none';});}
  list.querySelectorAll('.case-card').forEach(c=>c.onclick=()=>show(c.dataset.id));
  domainBtns.forEach(b=>b.onclick=()=>{currentDomain=b.dataset.domain;domainBtns.forEach(x=>x.classList.toggle('active',x===b));apply();});
  profileBtns.forEach(b=>b.onclick=()=>{currentProfile=b.dataset.profile;profileBtns.forEach(x=>x.classList.toggle('active',x===b));apply();});
  input.addEventListener('input',apply); bindDetail(); const saved=(()=>{try{return JSON.parse(localStorage.getItem('auditoria_nogai_cases_v1'))?.lastCase}catch(_){return null}})(); if(saved&&store.get(saved))show(saved); else if(store.all('cases')[0])show(store.all('cases')[0].id);
}
