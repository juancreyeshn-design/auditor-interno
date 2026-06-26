const esc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]||m));

export function renderSearchView({query='',payload,searchEngine,store}){
  const results=payload?.results||[]; const grouped=searchEngine.grouped(results);
  const collections=Object.keys(grouped);
  const domains=store.all('domains');
  const terms=(payload?.terms||[]).slice(0,8);
  return `<div class="panel search-page"><div class="search-head"><div><span class="badge">Sprint 005 · Search Engine</span><h2>Buscador inteligente</h2><p class="lead-sm">Busca por conceptos, normas, relaciones y etiquetas. El resultado se agrupa por tipo de conocimiento y mantiene conexión con el Knowledge Viewer.</p></div><div class="search-large"><input id="searchPageInput" value="${esc(query)}" placeholder="Ej.: independencia, mandato, plan anual, evidencias..."/><button id="searchPageBtn">Buscar</button></div></div>${terms.length?`<div class="tag-row"><strong>Términos usados:</strong> ${terms.map(t=>`<span class="badge">${esc(t)}</span>`).join('')}</div>`:''}<div class="search-summary"><div><strong>${results.length}</strong><span>resultados</span></div><div><strong>${collections.length}</strong><span>grupos</span></div><div><strong>${Object.keys(payload?.facets?.domains||{}).length}</strong><span>dominios vinculados</span></div></div>${!results.length?`<p class="empty">No hay resultados. Pruebe con mandato, independencia, calidad, informe, seguimiento o evidencia.</p>`:''}<div class="search-results">${collections.map(collection=>renderGroup(collection,grouped[collection],searchEngine)).join('')}</div></div>`;
}
function renderGroup(collection,items,searchEngine){return `<section class="result-group"><div class="section-title"><h3>${esc(searchEngine.label(collection))}</h3><span class="badge">${items.length}</span></div><div class="result-list">${items.map(({item,score,reasons})=>`<button class="result-card" data-id="${esc(item.id)}"><span class="result-type">${esc(searchEngine.label(item.collection))} · ${esc(item.id)}</span><strong>${esc(item.title)}</strong><p>${esc(item.summary||'Recurso relacionado con la búsqueda.')}</p><small>${reasons?.length?esc(reasons.join(' · ')):`Puntaje ${score}`}</small></button>`).join('')}</div></section>`;}
export function bindSearchView(root,{router,onSearch}){
  root.querySelectorAll('.result-card').forEach(btn=>btn.onclick=()=>router.go('/item/'+btn.dataset.id));
  const input=root.querySelector('#searchPageInput'); const button=root.querySelector('#searchPageBtn');
  const run=()=>onSearch(input.value||'');
  if(button)button.onclick=run;
  if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')run();});
}
