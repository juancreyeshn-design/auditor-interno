const kvEsc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
const arr=(v)=>Array.isArray(v)?v:[];
const label={domains:'Dominio',principles:'Principio',standards:'Norma',cards:'Knowledge Card'};

function section(title,items,empty='Sin datos registrados todavía.'){
  const data=arr(items).filter(Boolean);
  return `<section class="viewer-section"><h3>${kvEsc(title)}</h3>${data.length?`<ul>${data.map(x=>`<li>${kvEsc(x)}</li>`).join('')}</ul>`:`<p class="empty">${empty}</p>`}</section>`;
}
function pillRow(items=[]){return arr(items).map(t=>`<span class="badge">${kvEsc(t)}</span>`).join('');}
function relationButton(item){return `<button class="relation-card" data-id="${kvEsc(item.id)}"><strong>${kvEsc(item.title)}</strong><small>${kvEsc(label[item.collection]||item.type||item.collection)} · ${kvEsc(item.id)}</small></button>`;}
function groupRelations(relations=[]){
  const groups={domains:[],principles:[],standards:[],cards:[],other:[]};
  relations.forEach(r=>{(groups[r.collection]||groups.other).push(r);});
  return Object.entries(groups).filter(([,items])=>items.length).map(([k,items])=>`<div class="relation-group"><h4>${kvEsc(label[k]||'Otros recursos')}</h4><div class="relation-grid">${items.map(relationButton).join('')}</div></div>`).join('')||'<p class="empty">Sin relaciones registradas.</p>';
}
function implementationBlock(item){
  const c=item.content||{};
  return `<div class="viewer-tab-panel" data-panel="implementation">
    ${section('Objetivos',c.objectives)}
    ${section('Implementación práctica',c.implementation)}
    ${section('Buenas prácticas',c.goodPractices)}
    ${section('Errores frecuentes',c.commonErrors)}
  </div>`;
}
function evidenceBlock(item){
  const c=item.content||{};
  const evid=arr(c.evidence);
  const risks=arr(c.risks);
  return `<div class="viewer-tab-panel" data-panel="evidence">
    <section class="viewer-section"><h3>Evidencias esperadas</h3>${evid.length?`<div class="evidence-list">${evid.map((x,i)=>`<label><input type="checkbox" data-check="${kvEsc(item.id)}:${i}"><span>${kvEsc(x)}</span></label>`).join('')}</div>`:`<p class="empty">Sin evidencias registradas todavía.</p>`}</section>
    ${section('Riesgos por debilidad o ausencia',risks)}
  </div>`;
}
export function renderKnowledgeViewer({item,knowledge,store}){
  const content=item.content||{};
  const standards=knowledge.standardsFor(item);
  const relations=knowledge.related(item.id);
  const children=knowledge.children(item.id).filter(x=>x.id!==item.id).slice(0,24);
  const breadcrumb=knowledge.breadcrumb(item.id).map(x=>`<button class="crumb" data-id="${kvEsc(x.id)}">${kvEsc(x.title)}</button>`).join('<span>›</span>');
  const relHtml=groupRelations(relations);
  const childrenHtml=children.length?`<section class="viewer-section"><h3>Contenido derivado</h3><div class="relation-grid">${children.map(relationButton).join('')}</div></section>`:'';
  return `<article class="knowledge-viewer pro-viewer" data-current="${kvEsc(item.id)}">
    <div class="viewer-toolbar">
      <div class="breadcrumbs">${breadcrumb}</div>
      <div class="viewer-actions"><button data-action="copy-link">Copiar ID</button><button data-action="print">Imprimir</button></div>
    </div>
    <header class="viewer-header">
      <div><span class="badge">${kvEsc(label[item.collection]||item.type||'Recurso')}</span><h2>${kvEsc(item.title)}</h2><p class="lead">${kvEsc(item.summary||'')}</p><div class="tag-row">${pillRow(item.tags)}</div></div>
      <aside class="viewer-id"><strong>${kvEsc(item.id)}</strong><small>${kvEsc(item.collection||item.type||'recurso')}</small></aside>
    </header>
    <div class="viewer-meta">
      <div><strong>Dominio</strong><span>${kvEsc(item.domain||'No aplica')}</span></div>
      <div><strong>Principio</strong><span>${kvEsc(item.principle||'No aplica')}</span></div>
      <div><strong>Normas</strong><span>${standards.map(s=>kvEsc(s.id)).join(', ')||'No aplica'}</span></div>
      <div><strong>Relaciones</strong><span>${relations.length}</span></div>
    </div>
    <nav class="viewer-tabs" role="tablist">
      <button class="active" data-tab="overview">Resumen</button>
      <button data-tab="implementation">Implementación</button>
      <button data-tab="evidence">Evidencia</button>
      <button data-tab="relations">Relaciones</button>
    </nav>
    <div class="viewer-tab-panel active" data-panel="overview">
      ${content.what?`<section class="viewer-section"><h3>Qué es</h3><p>${kvEsc(content.what)}</p></section>`:''}
      ${content.why?`<section class="viewer-section"><h3>Por qué existe</h3><p>${kvEsc(content.why)}</p></section>`:''}
      ${childrenHtml}
    </div>
    ${implementationBlock(item)}
    ${evidenceBlock(item)}
    <div class="viewer-tab-panel" data-panel="relations"><section class="viewer-section"><h3>Grafo de relaciones</h3>${relHtml}</section></div>
  </article>`;
}
export function bindKnowledgeViewer(root,{router,itemId}){
  root.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>router.go('/item/'+b.dataset.id));
  root.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{
    const tab=btn.dataset.tab;
    root.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===btn));
    root.querySelectorAll('[data-panel]').forEach(p=>p.classList.toggle('active',p.dataset.panel===tab));
  });
  root.querySelectorAll('[data-action="print"]').forEach(b=>b.onclick=()=>window.print());
  root.querySelectorAll('[data-action="copy-link"]').forEach(b=>b.onclick=()=>{try{navigator.clipboard.writeText(itemId);b.textContent='ID copiado';setTimeout(()=>b.textContent='Copiar ID',1400);}catch(_){b.textContent=itemId;}});
  try{
    const state=JSON.parse(localStorage.getItem('auditoria_nogai_checks_v1'))||{};
    root.querySelectorAll('[data-check]').forEach(ch=>{ch.checked=!!state[ch.dataset.check];ch.onchange=()=>{state[ch.dataset.check]=ch.checked;localStorage.setItem('auditoria_nogai_checks_v1',JSON.stringify(state));};});
  }catch(_){}
}
