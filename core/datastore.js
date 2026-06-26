import { knowledgeBase } from '../assets/data/knowledge-base.js';

export class DataStore{
  constructor(data=knowledgeBase){
    this.data=data;
    this.index=new Map();
    this.collections=['domains','principles','standards','cards','cases','questions'];
    this.buildIndex();
  }
  buildIndex(){
    this.index.clear();
    this.collections.forEach(collection=>{
      (this.data[collection]||[]).forEach(item=>this.index.set(item.id,{...item,collection}));
    });
  }
  get(id){return this.index.get(id)||null;}
  all(type){return this.data[type]||[];}
  allItems(){return [...this.index.values()];}
  byDomain(domainId){return this.allItems().filter(item=>item.domain===domainId||item.id===domainId);}
  byPrinciple(principleId){return this.allItems().filter(item=>item.principle===principleId||item.id===principleId);}
  byStandard(standardId){return this.allItems().filter(item=>item.id===standardId||(item.standards||[]).includes(standardId)||(item.relations||[]).includes(standardId));}
  search(query){
    const term=(query||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
    if(!term)return[];
    const tokens=term.split(/\s+/).filter(Boolean);
    return this.allItems().map(item=>{
      const searchable=[item.id,item.title,item.summary,(item.tags||[]).join(' '),item.domain,item.principle,(item.standards||[]).join(' '),(item.relations||[]).join(' ')].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const score=tokens.reduce((acc,t)=>acc+(searchable.includes(t)?1:0),0)+(searchable.includes(term)?3:0);
      return {item,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title)).map(x=>x.item);
  }
}
