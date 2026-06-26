const normalize=(value='')=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

const TYPE_LABELS={
  domains:'Dominio',
  principles:'Principio',
  standards:'Norma',
  cards:'Objeto profesional'
};

const SYNONYMS={
  independencia:['objetividad','consejo','estatuto','mandato','posicionamiento'],
  estatuto:['mandato','autoridad','responsabilidad','consejo','deai'],
  mandato:['estatuto','consejo','autoridad','funcion de auditoria interna'],
  riesgo:['plan anual','universo auditable','aseguramiento','control','gobierno'],
  calidad:['pamc','evaluacion interna','evaluacion externa','desempeno','mejora'],
  informe:['comunicacion','hallazgos','conclusiones','seguimiento'],
  seguimiento:['planes de accion','recomendaciones','implementacion','monitoreo'],
  evidencias:['conformidad','documentacion','papeles de trabajo','soporte'],
  recursos:['financieros','humanos','tecnologicos','plan anual'],
  fraude:['riesgo','control','hallazgos','debido cuidado','escepticismo'],
  programa:['trabajo','alcance','objetivos','criterios','recursos']
};

export class SearchEngine{
  constructor(store,knowledge){this.store=store;this.knowledge=knowledge;}
  expand(query){
    const base=normalize(query); if(!base)return [];
    const tokens=base.split(/\s+/).filter(Boolean);
    const expanded=new Set([base,...tokens]);
    Object.entries(SYNONYMS).forEach(([key,values])=>{
      if(base.includes(key)||tokens.includes(key)){values.forEach(v=>expanded.add(normalize(v)));}
      values.forEach(v=>{if(base.includes(normalize(v)))expanded.add(key);});
    });
    return [...expanded].filter(Boolean);
  }
  document(item){
    const rel=(item.relations||[]).map(id=>this.store.get(id)?.title||id).join(' ');
    const standards=(item.standards||[]).map(id=>this.store.get(id)?.title||id).join(' ');
    const domain=this.store.get(item.domain)?.title||item.domain||'';
    const principle=this.store.get(item.principle)?.title||item.principle||'';
    return normalize([
      item.id,item.title,item.summary,item.type,item.collection,domain,principle,standards,rel,(item.tags||[]).join(' '),
      (item.content?.purpose||''),(item.content?.implementation||''),(item.content?.evidence||[]).join(' ')
    ].join(' '));
  }
  score(item,queryTerms){
    const doc=this.document(item); const title=normalize(item.title); const tags=normalize((item.tags||[]).join(' ')); const id=normalize(item.id);
    let score=0; const reasons=[];
    queryTerms.forEach(term=>{
      if(!term)return;
      if(id===term){score+=100;reasons.push('Coincidencia exacta por código');}
      if(title===term){score+=90;reasons.push('Coincidencia exacta por título');}
      if(title.includes(term)){score+=35;reasons.push('Título relacionado');}
      if(tags.includes(term)){score+=22;reasons.push('Etiqueta relacionada');}
      if(doc.includes(term)){score+=8;}
    });
    if(item.collection==='standards')score+=6;
    if(item.collection==='cards')score+=5;
    if(item.collection==='principles')score+=3;
    const relationHits=(item.relations||[]).filter(id=>queryTerms.some(t=>normalize(`${id} ${this.store.get(id)?.title||''}`).includes(t))).length;
    if(relationHits){score+=relationHits*12;reasons.push('Relación del grafo de conocimiento');}
    return {score,reasons:[...new Set(reasons)].slice(0,3)};
  }
  search(query,options={}){
    const queryTerms=this.expand(query); if(!queryTerms.length)return {query,terms:[],results:[],facets:{collections:{},domains:{}}};
    const collectionFilter=options.collection||'all'; const domainFilter=options.domain||'all';
    let results=this.store.allItems().map(item=>({item,...this.score(item,queryTerms)})).filter(x=>x.score>0);
    if(collectionFilter!=='all')results=results.filter(x=>x.item.collection===collectionFilter);
    if(domainFilter!=='all')results=results.filter(x=>x.item.domain===domainFilter||x.item.id===domainFilter);
    results.sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title));
    return {query,terms:queryTerms,results,facets:this.facets(results)};
  }
  facets(results){
    const collections={}; const domains={};
    results.forEach(({item})=>{
      collections[item.collection]=(collections[item.collection]||0)+1;
      const d=item.domain||item.id;
      if(d)domains[d]=(domains[d]||0)+1;
    });
    return {collections,domains};
  }
  grouped(results){
    return results.reduce((acc,result)=>{const key=result.item.collection||'otros';(acc[key]||(acc[key]=[])).push(result);return acc;},{});
  }
  label(collection){return TYPE_LABELS[collection]||collection||'Recurso';}
}
