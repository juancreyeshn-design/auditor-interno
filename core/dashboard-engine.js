export class DashboardEngine{
  constructor(store,knowledge){
    this.store=store;
    this.knowledge=knowledge;
    this.storageKey='auditoria_nogai_state_v1';
  }
  loadState(){
    try{return JSON.parse(localStorage.getItem(this.storageKey))||this.defaultState();}
    catch(_){return this.defaultState();}
  }
  saveState(patch={}){
    const next={...this.loadState(),...patch,updatedAt:new Date().toISOString()};
    localStorage.setItem(this.storageKey,JSON.stringify(next));
    return next;
  }
  defaultState(){
    return {
      lastItem:'S6.1',
      viewed:['D3','P6','S6.1','KC0001'],
      implementation:{KC0001:65,KC0002:30,KC0003:10,KC0007:0,KC0008:0},
      learning:{D1:20,D2:35,D3:55,D4:25,D5:15},
      professionalCenter:28,
      maturity:32
    };
  }
  metrics(){
    const s=this.knowledge.stats();
    return [
      {label:'Dominios',value:s.domains,caption:'estructura oficial'},
      {label:'Principios',value:s.principles,caption:'marco rector'},
      {label:'Normas',value:s.standards,caption:'base NOGAI'},
      {label:'Objetos',value:s.cards,caption:'centro profesional'}
    ];
  }
  progress(){
    const state=this.loadState();
    const learningValues=Object.values(state.learning||{});
    const learning=learningValues.length?Math.round(learningValues.reduce((a,b)=>a+b,0)/learningValues.length):0;
    const implementationValues=Object.values(state.implementation||{});
    const implementation=implementationValues.length?Math.round(implementationValues.reduce((a,b)=>a+b,0)/implementationValues.length):0;
    return [
      {label:'Aprendizaje',value:learning,caption:'dominios explorados'},
      {label:'Implementación',value:implementation,caption:'rutas iniciadas'},
      {label:'Centro Profesional',value:state.professionalCenter||0,caption:'objetos consultados'},
      {label:'Madurez',value:state.maturity||0,caption:'diagnóstico preliminar'}
    ];
  }
  recentItems(){
    const state=this.loadState();
    return (state.viewed||[]).map(id=>this.store.get(id)).filter(Boolean).slice(-6).reverse();
  }
  continueItem(){
    const state=this.loadState();
    return this.store.get(state.lastItem)||this.store.get('S6.1')||this.store.allItems()[0];
  }
  quickTools(){
    return ['KC0001','KC0002','KC0003','KC0007','KC0008','KC0010'].map(id=>this.store.get(id)).filter(Boolean);
  }
  coverageRows(){return this.knowledge.domainCoverage();}
  recommendations(){
    const item=this.continueItem();
    const related=this.knowledge.related(item.id).slice(0,5);
    return related.length?related:this.quickTools().slice(0,5);
  }
  criticalPendings(){
    const state=this.loadState();
    return Object.entries(state.implementation||{})
      .map(([id,value])=>({item:this.store.get(id),value}))
      .filter(x=>x.item&&x.value<70)
      .sort((a,b)=>a.value-b.value)
      .slice(0,5);
  }
  markViewed(id){
    const current=this.loadState();
    const viewed=[...(current.viewed||[]).filter(x=>x!==id),id].slice(-12);
    return this.saveState({lastItem:id,viewed});
  }
}
