import { card } from '../components/ui.js';
import { renderKnowledgeViewer, bindKnowledgeViewer } from '../components/knowledge-viewer.js';
import { renderSearchView, bindSearchView } from '../components/search-view.js';

const esc=(v='')=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const list=(title,items=[])=>items.length?`<h3>${title}</h3><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';

export class RenderEngine{
  constructor(store,knowledge,router,searchEngine=null){this.store=store;this.knowledge=knowledge;this.router=router;this.searchEngine=searchEngine;this.view=document.getElementById('view');this.context=document.getElementById('context');}
  markViewed(id){try{const k='auditoria_nogai_state_v1';const current=JSON.parse(localStorage.getItem(k))||{};const viewed=[...((current.viewed||[]).filter(x=>x!==id)),id].slice(-12);localStorage.setItem(k,JSON.stringify({...current,lastItem:id,viewed,updatedAt:new Date().toISOString()}));}catch(_){}}
  dashboard(){
    const s=this.knowledge.stats();
    const coverage=this.knowledge.domainCoverage();
    this.view.innerHTML=`<div class="hero"><h2>AuditorIA NOGAI</h2><p>Repositorio definitivo con Core Engine, Knowledge Engine y base NOGAI estructurada. Sprint 010 incorpora el Centro de Casos Profesionales conectado al Knowledge Engine.</p></div><div class="grid metrics" id="dashCards"></div><div class="panel"><div class="section-title"><h2>Cobertura por dominio</h2><span class="badge">Knowledge Base</span></div><div class="table-wrap"><table><thead><tr><th>Dominio</th><th>Principios</th><th>Normas</th><th>Objetos</th></tr></thead><tbody>${coverage.map(x=>`<tr><td>${esc(x.domain.title)}</td><td>${x.principles}</td><td>${x.standards}</td><td>${x.cards}</td></tr>`).join('')}</tbody></table></div></div>`;
    const items=[{title:'Dominios',summary:`${s.domains} dominios cargados`,type:'Indicador'},{title:'Principios',summary:`${s.principles} principios estructurados`,type:'Indicador'},{title:'Normas',summary:`${s.standards} normas NOGAI registradas`,type:'Indicador'},{title:'Objetos profesionales',summary:`${s.cards} Knowledge Cards iniciales`,type:'Indicador'},{title:'Casos',summary:`${s.cases||0} casos profesionales iniciales`,type:'Indicador'}];
    const g=document.getElementById('dashCards');items.forEach(x=>g.appendChild(card(x,()=>{})));this.contextDefault();
  }
  list(title,items){
    this.view.innerHTML=`<div class="panel"><div class="section-title"><h2>${esc(title)}</h2><span class="badge">${items.length} recursos</span></div><div class="grid" id="listGrid"></div></div>`;
    const g=document.getElementById('listGrid');items.forEach(item=>g.appendChild(card(item,()=>this.router.go('/item/'+item.id))));
  }
  item(id){
    const item=this.store.get(id); if(!item)return; this.markViewed(id);
    this.view.innerHTML=renderKnowledgeViewer({item,knowledge:this.knowledge,store:this.store});
    bindKnowledgeViewer(this.view,{router:this.router,itemId:id});
    this.contextFor(id);
  }
  searchResults(q){
    const query=(q||'').trim();
    if(!this.searchEngine){this.list(`Resultados de búsqueda: ${query}`,this.store.search(query));return;}
    const payload=this.searchEngine.search(query);
    this.view.innerHTML=renderSearchView({query,payload,searchEngine:this.searchEngine,store:this.store});
    bindSearchView(this.view,{router:this.router,onSearch:(value)=>this.router.go('/buscar/'+encodeURIComponent(value||''))});
    this.context.innerHTML=`<h3>Búsqueda</h3><p class="empty">${payload.results.length} resultados para <strong>${esc(query)}</strong>.</p><div class="list">${payload.results.slice(0,8).map(r=>`<button data-id="${esc(r.item.id)}"><strong>${esc(r.item.title)}</strong><br><small>${esc(this.searchEngine.label(r.item.collection))} · ${esc(r.item.id)}</small></button>`).join('')}</div>`;
    this.context.querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>this.router.go('/item/'+b.dataset.id));
  }
  contextDefault(){this.context.innerHTML='<h3>Panel contextual</h3><p class="empty">Seleccione un recurso para ver relaciones, dependencias y navegación cruzada.</p>';}
  contextFor(id){
    const rel=this.knowledge.related(id);
    this.context.innerHTML=`<h3>Relaciones</h3><p class="empty">${esc(id)}</p><div class="list" id="relList"></div>`;
    const l=document.getElementById('relList');if(!rel.length)l.innerHTML='<p class="empty">Sin relaciones registradas.</p>';
    rel.slice(0,30).forEach(r=>{const b=document.createElement('button');b.innerHTML=`<strong>${esc(r.title)}</strong><br><small>${esc(r.type||r.collection)} · ${esc(r.id)}</small>`;b.onclick=()=>this.router.go('/item/'+r.id);l.appendChild(b);});
  }
}
