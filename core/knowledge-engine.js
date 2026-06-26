export class KnowledgeEngine{
  constructor(store){this.store=store;}
  related(id){
    const item=this.store.get(id); if(!item)return [];
    const ids=new Set([...(item.relations||[]),...(item.standards||[]),...(item.principles||[])]);
    if(item.domain)ids.add(item.domain);
    if(item.principle)ids.add(item.principle);
    if(item.standards){item.standards.forEach(s=>ids.add(s));}
    // reverse relations
    this.store.allItems().forEach(candidate=>{
      if(candidate.id===id)return;
      if((candidate.relations||[]).includes(id)||(candidate.standards||[]).includes(id)||(candidate.principles||[]).includes(id)) ids.add(candidate.id);
      if(item.type==='domain' && candidate.domain===id) ids.add(candidate.id);
      if(item.type==='principle' && candidate.principle===id) ids.add(candidate.id);
    });
    ids.delete(id);
    return [...ids].map(x=>this.store.get(x)).filter(Boolean);
  }
  children(id){
    const item=this.store.get(id); if(!item)return [];
    if(item.collection==='domains')return this.store.allItems().filter(x=>x.domain===id||x.id===id);
    if(item.collection==='principles')return this.store.allItems().filter(x=>x.principle===id||x.id===id);
    if(item.collection==='standards')return this.store.byStandard(id);
    return this.related(id);
  }
  breadcrumb(id){
    const item=this.store.get(id); if(!item)return [];
    const trail=[];
    if(item.domain)trail.push(this.store.get(item.domain));
    if(item.principle)trail.push(this.store.get(item.principle));
    trail.push(item);
    return trail.filter(Boolean);
  }
  standardsFor(item){
    if(!item)return [];
    const ids=new Set(item.collection==='standards'?[item.id]:(item.standards||[]));
    if(item.collection==='principles')(item.standards||[]).forEach(x=>ids.add(x));
    return [...ids].map(id=>this.store.get(id)).filter(Boolean);
  }
  domainCoverage(){
    return this.store.all('domains').map(domain=>({
      domain,
      principles:this.store.all('principles').filter(p=>p.domain===domain.id).length,
      standards:this.store.all('standards').filter(s=>s.domain===domain.id).length,
      cards:this.store.all('cards').filter(c=>c.domain===domain.id).length,
      cases:this.store.all('cases').filter(c=>c.domain===domain.id).length
    }));
  }
  stats(){return {domains:this.store.all('domains').length,principles:this.store.all('principles').length,standards:this.store.all('standards').length,cards:this.store.all('cards').length,cases:this.store.all('cases').length};}
}
