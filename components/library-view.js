const libEsc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]||m));
const libArr=v=>Array.isArray(v)?v:[];
const libCategoryMap={
  gobierno:['KC0001','KC0002','KC0003','KC0004','KC0005','KC0006'],
  planeacion:['KC0007','KC0008','KC0010','KC0011'],
  ejecucion:['KC0013','KC0014','KC0015','KC0016','KC0017','KC0018'],
  comunicacion:['KC0019','KC0020','KC0021'],
  calidad:['KC0022','KC0023','KC0024','KC0025']
};
const libCategoryTitle={gobierno:'Gobierno',planeacion:'Planeación',ejecucion:'Ejecución',comunicacion:'Comunicación',calidad:'Calidad',normas:'Normas NOGAI'};
const libProfiles={
  dea:['KC0001','KC0002','KC0006','KC0007','KC0010','KC0011','KC0022','KC0025','S6.1','S6.2','S9.2','S9.4','S10.2','S12.2'],
  comite:['KC0001','KC0004','KC0005','KC0006','KC0010','KC0022','KC0024','S6.1','S6.3','S8.1','S8.2','S8.3','S8.4'],
  auditor:['KC0013','KC0014','KC0015','KC0016','KC0017','KC0018','KC0019','KC0020','S13.6','S14.1','S14.6','S15.1','S15.2'],
  estudiante:['KC0001','KC0002','KC0003','KC0008','KC0013','KC0014','KC0016','KC0019','KC0022','S1.1','S6.1','S9.4','S14.6']
};
function itemType(item){return item.collection==='standards'||item.type==='standard'?'Norma':item.collection==='principles'||item.type==='principle'?'Principio':item.collection==='domains'||item.type==='domain'?'Dominio':'Objeto';}
function categoryOf(item){
  if(item.collection==='standards'||item.type==='standard')return 'normas';
  return Object.entries(libCategoryMap).find(([,ids])=>ids.includes(item.id))?.[0]||'otros';
}
function profileOf(item){return Object.entries(libProfiles).filter(([,ids])=>ids.includes(item.id)).map(([k])=>k);}
function relationCount(item,knowledge){return knowledge.related(item.id).length;}
function resourceCard(item,knowledge){
  const cat=categoryOf(item); const profiles=profileOf(item);
  return `<article class="lib-card" data-id="${libEsc(item.id)}" data-cat="${libEsc(cat)}" data-type="${libEsc(itemType(item).toLowerCase())}" data-profile="${profiles.join(' ')}">
    <div class="lib-card-top"><span class="badge">${libEsc(itemType(item))}</span><small>${libEsc(item.id)}</small></div>
    <h3>${libEsc(item.title)}</h3>
    <p>${libEsc(item.summary||'Recurso de conocimiento conectado al ecosistema AuditorIA NOGAI.')}</p>
    <div class="lib-tags">${libArr(item.tags).slice(0,5).map(t=>`<span>${libEsc(t)}</span>`).join('')}</div>
    <div class="lib-foot"><small>${libEsc(libCategoryTitle[cat]||'Otros')}</small><small>${relationCount(item,knowledge)} relaciones</small></div>
  </article>`;
}
function pill(item){return `<button class="lib-pill" data-open="${libEsc(item.id)}"><strong>${libEsc(item.id)}</strong><span>${libEsc(item.title)}</span></button>`;}
function resourceDetail(item,store,knowledge){
  const c=item.content||{};
  const related=knowledge.related(item.id);
  const standards=libArr(item.standards).map(id=>store.get(id)).filter(Boolean);
  const principles=related.filter(x=>x.collection==='principles'||x.type==='principle');
  const objects=related.filter(x=>x.collection==='cards'||x.type==='object');
  const domains=related.filter(x=>x.collection==='domains'||x.type==='domain');
  const implementation=libArr(c.implementation);
  const evidence=libArr(c.evidence);
  const risks=libArr(c.risks);
  const practices=libArr(c.goodPractices);
  const errors=libArr(c.commonErrors);
  const list=(title,items,empty='Pendiente de ampliación.')=>`<section class="lib-section"><h4>${libEsc(title)}</h4>${items.length?`<ul>${items.map(x=>`<li>${libEsc(x)}</li>`).join('')}</ul>`:`<p class="empty">${libEsc(empty)}</p>`}</section>`;
  return `<article class="lib-detail">
    <header class="lib-detail-head">
      <div><span class="badge">${libEsc(itemType(item))}</span><h2>${libEsc(item.title)}</h2><p>${libEsc(item.summary||'')}</p><div class="lib-tags">${libArr(item.tags).map(t=>`<span>${libEsc(t)}</span>`).join('')}</div></div>
      <div class="lib-actions"><button class="btn btn-primary" data-open="${libEsc(item.id)}">Abrir visor</button><button class="btn btn-secondary" data-print>Imprimir</button></div>
    </header>
    <div class="lib-map">
      <section><h4>Normas</h4>${standards.length?standards.map(pill).join(''):'<p class="empty">Sin normas vinculadas.</p>'}</section>
      <section><h4>Principios</h4>${principles.length?principles.slice(0,8).map(pill).join(''):'<p class="empty">Sin principios relacionados.</p>'}</section>
      <section><h4>Objetos conectados</h4>${objects.length?objects.slice(0,10).map(pill).join(''):'<p class="empty">Sin objetos relacionados.</p>'}</section>
      <section><h4>Dominios</h4>${domains.length?domains.map(pill).join(''):'<p class="empty">Sin dominios relacionados directos.</p>'}</section>
    </div>
    <div class="lib-detail-grid">
      <section class="lib-section"><h4>Qué es</h4><p>${libEsc(c.what||'Centro de conocimiento que consolida definición, fundamento, relaciones, implementación y evidencia disponible para este recurso.')}</p></section>
      <section class="lib-section"><h4>Por qué importa</h4><p>${libEsc(c.why||'Permite conectar la consulta normativa con acciones profesionales, documentación, evidencias y decisiones de implementación.')}</p></section>
      ${list('Implementación',implementation)}
      ${list('Evidencias esperadas',evidence)}
      ${list('Riesgos o debilidades',risks)}
      ${list('Buenas prácticas',practices)}
      ${list('Errores frecuentes',errors)}
    </div>
    <section class="lib-section lib-cross"><h4>Lectura profesional sugerida</h4><p>Revise primero el visor del recurso, luego las normas relacionadas y finalmente los objetos conectados. Este orden permite pasar de la comprensión normativa a la implementación documentada.</p></section>
  </article>`;
}
export function renderLibrary({store,knowledge}){
  const standards=store.all('standards');
  const cards=store.all('cards');
  const items=[...cards,...standards];
  const first=cards.find(x=>x.id==='KC0001')||items[0];
  const cats=[['all','Todos',items.length],['gobierno','Gobierno',items.filter(x=>categoryOf(x)==='gobierno').length],['planeacion','Planeación',items.filter(x=>categoryOf(x)==='planeacion').length],['ejecucion','Ejecución',items.filter(x=>categoryOf(x)==='ejecucion').length],['comunicacion','Comunicación',items.filter(x=>categoryOf(x)==='comunicacion').length],['calidad','Calidad',items.filter(x=>categoryOf(x)==='calidad').length],['normas','Normas',standards.length]];
  return `<section class="library-center panel">
    <div class="lib-hero"><div><span class="badge">Sprint 009</span><h2>Biblioteca Inteligente</h2><p>Centros de conocimiento conectados por normas, principios, objetos profesionales, evidencias y rutas de implementación. No lista PDFs; organiza relaciones para trabajar con NOGAI.</p></div><div class="lib-hero-stats"><strong>${items.length}</strong><span>recursos conectados</span></div></div>
    <div class="lib-tools"><div class="lib-search"><strong>Buscar biblioteca</strong><input id="libSearch" placeholder="Mandato, evidencia, independencia, informe..."></div><div class="lib-filters" id="libFilters">${cats.map(([id,title,count],i)=>`<button class="${i===0?'active':''}" data-cat="${id}">${title} <small>${count}</small></button>`).join('')}</div><div class="lib-profiles" id="libProfiles"><button class="active" data-profile="all">Todos los perfiles</button><button data-profile="dea">DEA</button><button data-profile="comite">Comité</button><button data-profile="auditor">Auditor</button><button data-profile="estudiante">Estudiante</button></div></div>
    <div class="lib-layout"><aside class="lib-list" id="libList">${items.map(i=>resourceCard(i,knowledge)).join('')}</aside><main>${resourceDetail(first,store,knowledge)}</main></div>
  </section>`;
}
export function bindLibrary(root,{store,knowledge,router}){
  const list=root.querySelector('#libList'); const input=root.querySelector('#libSearch'); const filterBtns=[...root.querySelectorAll('#libFilters button')]; const profileBtns=[...root.querySelectorAll('#libProfiles button')];
  let currentCat='all',currentProfile='all';
  function showDetail(id){const item=store.get(id); if(!item)return; root.querySelector('.lib-layout main').innerHTML=resourceDetail(item,store,knowledge); bindDetail(); [...list.querySelectorAll('.lib-card')].forEach(c=>c.classList.toggle('selected',c.dataset.id===id)); try{localStorage.setItem('auditoria_nogai_library_v1',JSON.stringify({lastLibrary:id,updatedAt:new Date().toISOString()}));}catch(_){}}
  function bindDetail(){root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>router.go('/item/'+b.dataset.open)); root.querySelectorAll('[data-print]').forEach(b=>b.onclick=()=>window.print());}
  function apply(){const term=(input.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); [...list.querySelectorAll('.lib-card')].forEach(c=>{const text=c.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); const catOk=currentCat==='all'||c.dataset.cat===currentCat; const profileOk=currentProfile==='all'||(c.dataset.profile||'').includes(currentProfile); c.style.display=(catOk&&profileOk&&text.includes(term))?'':'none';});}
  list.querySelectorAll('.lib-card').forEach(c=>c.onclick=()=>showDetail(c.dataset.id));
  filterBtns.forEach(b=>b.onclick=()=>{currentCat=b.dataset.cat;filterBtns.forEach(x=>x.classList.toggle('active',x===b));apply();});
  profileBtns.forEach(b=>b.onclick=()=>{currentProfile=b.dataset.profile;profileBtns.forEach(x=>x.classList.toggle('active',x===b));apply();});
  input.addEventListener('input',apply); bindDetail(); const saved=(()=>{try{return JSON.parse(localStorage.getItem('auditoria_nogai_library_v1'))?.lastLibrary}catch(_){return null}})(); if(saved&&store.get(saved))showDetail(saved); else showDetail('KC0001');
}
