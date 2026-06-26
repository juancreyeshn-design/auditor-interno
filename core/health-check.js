export class HealthCheck{
  constructor(store,knowledge,search){
    this.store=store;
    this.knowledge=knowledge;
    this.search=search;
  }
  run(){
    const checks=[];
    const add=(id,title,ok,detail='',severity='error')=>checks.push({id,title,ok:Boolean(ok),detail,severity});
    const domains=this.store.all('domains');
    const principles=this.store.all('principles');
    const standards=this.store.all('standards');
    const cards=this.store.all('cards');
    add('D-COUNT','Dominios cargados',domains.length===5,`${domains.length}/5 dominios`);
    add('P-COUNT','Principios cargados',principles.length===15,`${principles.length}/15 principios`);
    add('S-COUNT','Normas cargadas',standards.length===52,`${standards.length}/52 normas`);
    add('IDX-UNIQUE','Índice sin duplicados',this.store.allItems().length===this.store.index.size,`${this.store.index.size} recursos indexados`);
    const orphanPrinciples=principles.filter(p=>p.domain&&!this.store.get(p.domain));
    add('REL-PRINCIPLES','Principios enlazados a dominio',orphanPrinciples.length===0,orphanPrinciples.length?`${orphanPrinciples.length} principios huérfanos`:'Sin huérfanos');
    const orphanStandards=standards.filter(s=>(s.domain&&!this.store.get(s.domain))||(s.principle&&!this.store.get(s.principle)));
    add('REL-STANDARDS','Normas enlazadas a dominio/principio',orphanStandards.length===0,orphanStandards.length?`${orphanStandards.length} normas con enlace inválido`:'Sin huérfanos');
    const orphanCards=cards.filter(c=>(c.domain&&!this.store.get(c.domain))||(c.principle&&!this.store.get(c.principle))||((c.standards||[]).some(s=>!this.store.get(s))));
    add('REL-CARDS','Knowledge Cards con relaciones válidas',orphanCards.length===0,orphanCards.length?`${orphanCards.length} cards con relación inválida`:'Relaciones válidas', 'warn');
    const mandatorySearches=['mandato','estatuto','independencia','plan anual','calidad'];
    const failedSearches=mandatorySearches.filter(q=>!this.search.search(q).results.length);
    add('SEARCH-BASIC','Búsquedas críticas responden',failedSearches.length===0,failedSearches.length?`Sin resultados: ${failedSearches.join(', ')}`:'Búsquedas críticas OK');
    const coverage=this.knowledge.domainCoverage();
    const uncovered=coverage.filter(x=>x.standards===0 && x.domain.id!=='D1');
    add('COVERAGE-DOMAINS','Cobertura por dominio consistente',uncovered.length===0,uncovered.length?`Sin normas: ${uncovered.map(x=>x.domain.id).join(', ')}`:'Cobertura consistente');
    const passed=checks.filter(x=>x.ok).length;
    const failed=checks.filter(x=>!x.ok&&x.severity==='error').length;
    const warnings=checks.filter(x=>!x.ok&&x.severity==='warn').length;
    return {generatedAt:new Date().toISOString(),summary:{total:checks.length,passed,failed,warnings,score:Math.round((passed/checks.length)*100)},checks};
  }
}
