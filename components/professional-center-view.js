const pcEsc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]||m));
const arr=v=>Array.isArray(v)?v:[];
const categoryMap={
  gobierno:['KC0001','KC0002','KC0003','KC0004','KC0005','KC0006'],
  planeacion:['KC0007','KC0008','KC0010','KC0011'],
  ejecucion:['KC0013','KC0014','KC0015','KC0016','KC0017','KC0018'],
  comunicacion:['KC0019','KC0020','KC0021'],
  calidad:['KC0022','KC0023','KC0024','KC0025']
};
const categoryTitle={gobierno:'Gobierno',planeacion:'Planeación',ejecucion:'Ejecución',comunicacion:'Comunicación',calidad:'Calidad'};
const profileMap={
  dea:['KC0001','KC0002','KC0006','KC0007','KC0010','KC0011','KC0022','KC0025'],
  comite:['KC0001','KC0004','KC0005','KC0006','KC0010','KC0022','KC0024'],
  auditor:['KC0013','KC0014','KC0015','KC0016','KC0017','KC0018','KC0019','KC0020'],
  estudiante:['KC0001','KC0002','KC0003','KC0008','KC0013','KC0014','KC0016','KC0019','KC0022']
};
function categoryOf(id){return Object.entries(categoryMap).find(([,ids])=>ids.includes(id))?.[0]||'otros';}
function profileBadges(item){return Object.entries(profileMap).filter(([,ids])=>ids.includes(item.id)).map(([k])=>k.toUpperCase());}
function miniRelation(item,store){return [...arr(item.standards),...arr(item.relations)].map(id=>store.get(id)).filter(Boolean).slice(0,6);}
function resourceCard(item,store){
  const rels=miniRelation(item,store);
  const badges=profileBadges(item);
  return `<article class="pc-card" data-id="${pcEsc(item.id)}" data-cat="${categoryOf(item.id)}">
    <div class="pc-card-top"><span class="badge">${pcEsc(categoryTitle[categoryOf(item.id)]||'Objeto')}</span><span class="pc-id">${pcEsc(item.id)}</span></div>
    <h3>${pcEsc(item.title)}</h3>
    <p>${pcEsc(item.summary||'')}</p>
    <div class="pc-tags">${arr(item.tags).slice(0,4).map(t=>`<span>${pcEsc(t)}</span>`).join('')}</div>
    <div class="pc-profiles">${badges.map(b=>`<small>${pcEsc(b)}</small>`).join('')}</div>
    <div class="pc-relations">${rels.map(r=>`<small>${pcEsc(r.id)}</small>`).join('')}</div>
  </article>`;
}
function resourceDetail(item,store,knowledge){
  const c=item.content||{};
  const standards=arr(item.standards).map(id=>store.get(id)).filter(Boolean);
  const rel=knowledge.related(item.id).slice(0,10);
  const objectives=arr(c.objectives);
  const implementation=arr(c.implementation);
  const evidence=arr(c.evidence);
  const risks=arr(c.risks);
  const good=arr(c.goodPractices);
  const errors=arr(c.commonErrors);
  const section=(title,items,empty='Pendiente de ampliación en la base de conocimiento.')=>`<section class="pc-detail-section"><h4>${pcEsc(title)}</h4>${items.length?`<ul>${items.map(x=>`<li>${pcEsc(x)}</li>`).join('')}</ul>`:`<p class="empty">${pcEsc(empty)}</p>`}</section>`;
  return `<article class="pc-detail" id="pcDetail">
    <header class="pc-detail-head">
      <div><span class="badge">${pcEsc(categoryTitle[categoryOf(item.id)]||'Centro Profesional')}</span><h2>${pcEsc(item.title)}</h2><p>${pcEsc(item.summary||'')}</p></div>
      <div class="pc-detail-actions"><button class="btn btn-primary" data-open="${pcEsc(item.id)}">Abrir visor</button><button class="btn btn-secondary" data-print>Imprimir ficha</button></div>
    </header>
    <div class="pc-detail-grid">
      <section class="pc-slab"><h4>Qué es</h4><p>${pcEsc(c.what||'Objeto profesional de la función de auditoría interna, estructurado como recurso vivo para consulta, implementación y evidencia.')}</p></section>
      <section class="pc-slab"><h4>Por qué existe</h4><p>${pcEsc(c.why||'Permite estandarizar la práctica profesional, documentar responsabilidades y conectar la operación con las Normas Globales de Auditoría Interna.')}</p></section>
      <section class="pc-slab"><h4>Normas relacionadas</h4><div>${standards.map(s=>`<button class="mini-chip" data-open="${pcEsc(s.id)}">${pcEsc(s.id)}</button>`).join('')||'<p class="empty">Sin normas vinculadas.</p>'}</div></section>
      <section class="pc-slab"><h4>Relaciones</h4><div>${rel.map(r=>`<button class="mini-chip" data-open="${pcEsc(r.id)}">${pcEsc(r.id)}</button>`).join('')||'<p class="empty">Sin relaciones registradas.</p>'}</div></section>
    </div>
    <div class="pc-detail-two">
      ${section('Objetivos',objectives)}
      ${section('Implementación práctica',implementation)}
      ${section('Evidencias esperadas',evidence)}
      ${section('Riesgos por ausencia o debilidad',risks)}
      ${section('Buenas prácticas',good)}
      ${section('Errores frecuentes',errors)}
    </div>
    <section class="pc-template"><h4>Plantilla profesional mínima</h4><div class="template-box"><p><strong>1. Identificación:</strong> nombre del recurso, versión, responsable y fecha de aprobación.</p><p><strong>2. Fundamento:</strong> dominio, principio y normas relacionadas.</p><p><strong>3. Desarrollo:</strong> propósito, alcance, autoridad, responsabilidades, metodología y evidencia.</p><p><strong>4. Control:</strong> revisión periódica, trazabilidad, aprobación y comunicación.</p></div></section>
  </article>`;
}
export function renderProfessionalCenter({store,knowledge}){
  const cards=store.all('cards');
  const grouped=Object.entries(categoryMap).map(([cat,ids])=>({cat,title:categoryTitle[cat],count:cards.filter(c=>ids.includes(c.id)).length}));
  const first=cards.find(c=>c.id==='KC0001')||cards[0];
  return `<section class="professional-center panel">
    <div class="pc-hero"><div><span class="badge">Sprint 007</span><h2>Centro Profesional</h2><p>Micrositios profesionales para los objetos de negocio de auditoría interna. Cada recurso conecta normas, implementación, evidencias, riesgos, buenas prácticas y relaciones del Knowledge Engine.</p></div><div class="pc-hero-stats"><strong>${cards.length}</strong><span>objetos profesionales</span></div></div>
    <div class="pc-tools"><div class="pc-search"><strong>Filtrar</strong><input id="pcSearch" placeholder="Mandato, estatuto, informe, PAMC..."></div><div class="pc-filter" id="pcFilters"><button class="active" data-cat="all">Todos</button>${grouped.map(g=>`<button data-cat="${pcEsc(g.cat)}">${pcEsc(g.title)} <small>${g.count}</small></button>`).join('')}</div></div>
    <div class="pc-layout"><aside class="pc-list" id="pcList">${cards.map(c=>resourceCard(c,store)).join('')}</aside><main>${resourceDetail(first,store,knowledge)}</main></div>
  </section>`;
}
export function bindProfessionalCenter(root,{store,knowledge,router}){
  const list=root.querySelector('#pcList');
  const input=root.querySelector('#pcSearch');
  const filterBtns=[...root.querySelectorAll('#pcFilters button')];
  let currentCat='all';
  function showDetail(id){const item=store.get(id);if(!item)return;root.querySelector('.pc-layout main').innerHTML=resourceDetail(item,store,knowledge);bindDetail();[...list.querySelectorAll('.pc-card')].forEach(c=>c.classList.toggle('selected',c.dataset.id===id));try{const k='auditoria_nogai_professional_v1';const state=JSON.parse(localStorage.getItem(k))||{};localStorage.setItem(k,JSON.stringify({...state,lastProfessional:id,updatedAt:new Date().toISOString()}));}catch(_){}}
  function bindDetail(){root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>router.go('/item/'+b.dataset.open));root.querySelectorAll('[data-print]').forEach(b=>b.onclick=()=>window.print());}
  function apply(){const term=(input.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();[...list.querySelectorAll('.pc-card')].forEach(card=>{const text=card.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const byCat=currentCat==='all'||card.dataset.cat===currentCat;card.style.display=(byCat&&text.includes(term))?'':'none';});}
  list.querySelectorAll('.pc-card').forEach(c=>c.onclick=()=>showDetail(c.dataset.id));
  filterBtns.forEach(b=>b.onclick=()=>{currentCat=b.dataset.cat;filterBtns.forEach(x=>x.classList.toggle('active',x===b));apply();});
  input.addEventListener('input',apply);
  bindDetail();
  const saved=(()=>{try{return JSON.parse(localStorage.getItem('auditoria_nogai_professional_v1'))?.lastProfessional}catch(_){return null}})();
  if(saved&&store.get(saved))showDetail(saved); else showDetail('KC0001');
}
