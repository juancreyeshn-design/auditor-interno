const evalEsc=(v='')=>String(v).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]||m));
const evArr=v=>Array.isArray(v)?v:[];
function difficultyClass(d=''){return d.toLowerCase().includes('avanz')?'danger':d.toLowerCase().includes('inter')?'warn':'ok'}
function questionCard(q,i){return `<article class="eval-question" data-id="${evalEsc(q.id)}" data-domain="${evalEsc(q.domain||'')}" data-difficulty="${evalEsc((q.difficulty||'').toLowerCase())}">
  <div class="eval-q-top"><span class="badge ${difficultyClass(q.difficulty)}">${evalEsc(q.difficulty||'Pregunta')}</span><small>${evalEsc(q.id)}</small></div>
  <h3>${i+1}. ${evalEsc(q.question)}</h3>
  <div class="eval-options">${evArr(q.options).map((op,idx)=>`<button data-q="${evalEsc(q.id)}" data-option="${idx}"><span>${String.fromCharCode(65+idx)}</span>${evalEsc(op)}</button>`).join('')}</div>
  <div class="eval-feedback" id="fb-${evalEsc(q.id)}"></div>
</article>`;}
function resultTemplate(stats){return `<div class="eval-result panel"><h3>Resultado</h3><div class="eval-score"><strong>${stats.score}%</strong><span>${stats.correctas}/${stats.total} correctas</span></div><div class="progress"><span style="width:${stats.score}%"></span></div><p>${stats.score>=80?'Dominio satisfactorio del bloque evaluado.':stats.score>=60?'Resultado aceptable; conviene repasar normas con errores.':'Resultado bajo; revise fundamentos, herramientas y casos asociados.'}</p></div>`}
export function renderEvaluations({store}){
  const questions=store.all('questions');
  const domains=store.all('domains');
  return `<section class="evaluations-center panel">
    <div class="eval-hero"><div><span class="badge">Sprint 011</span><h2>Autoevaluaciones</h2><p>Banco inicial de preguntas originales para validar comprensión, aplicación práctica y criterio profesional. Cada respuesta incluye retroalimentación y referencia a normas, objetos y casos relacionados.</p></div><div class="eval-hero-stat"><strong>${questions.length}</strong><span>preguntas</span></div></div>
    <div class="eval-toolbar"><div class="eval-search"><strong>Buscar</strong><input id="evalSearch" placeholder="Mandato, estatuto, papeles, PAMC..."></div><div class="eval-filters" id="evalDomains"><button class="active" data-domain="all">Todos</button>${domains.map(d=>`<button data-domain="${evalEsc(d.id)}">${evalEsc(d.id)}</button>`).join('')}</div><div class="eval-filters" id="evalDifficulty"><button class="active" data-difficulty="all">Todas</button><button data-difficulty="básico">Básico</button><button data-difficulty="intermedio">Intermedio</button><button data-difficulty="avanzado">Avanzado</button></div></div>
    <div class="eval-layout"><main id="evalList">${questions.map(questionCard).join('')}</main><aside id="evalResult">${resultTemplate({score:0,correctas:0,total:questions.length})}<div class="eval-help panel"><h3>Uso recomendado</h3><p>Responda cada pregunta. Luego abra las normas y objetos relacionados para reforzar los temas con menor desempeño.</p><button class="primary-action" id="resetEval">Reiniciar evaluación</button></div></aside></div>
  </section>`;
}
export function bindEvaluations(root,{store,knowledge,router}){
  const answers=new Map(Object.entries(JSON.parse(localStorage.getItem('auditoria_nogai_eval_answers')||'{}')));
  const list=root.querySelector('#evalList'); const search=root.querySelector('#evalSearch'); const result=root.querySelector('#evalResult');
  let domain='all', difficulty='all';
  function save(){localStorage.setItem('auditoria_nogai_eval_answers',JSON.stringify(Object.fromEntries(answers)));}
  function paint(qid){const q=store.get(qid); const chosen=answers.get(qid); const fb=root.querySelector(`#fb-${qid}`); if(!q||chosen===undefined||!fb)return; const correct=Number(chosen)===Number(q.answer); root.querySelectorAll(`[data-q="${qid}"]`).forEach(b=>{const idx=Number(b.dataset.option); b.classList.toggle('selected',idx===Number(chosen)); b.classList.toggle('correct',idx===q.answer); b.classList.toggle('incorrect',idx===Number(chosen)&&!correct);}); const standards=evArr(q.standards).map(id=>store.get(id)).filter(Boolean); fb.innerHTML=`<div class="${correct?'eval-ok':'eval-bad'}"><strong>${correct?'Correcto':'Incorrecto'}</strong><p>${evalEsc(q.feedback||'')}</p>${q.rationale?`<p><strong>Criterio:</strong> ${evalEsc(q.rationale)}</p>`:''}<div class="eval-links">${standards.map(s=>`<button data-open="${evalEsc(s.id)}">${evalEsc(s.id)}</button>`).join('')}${evArr(q.relations).map(id=>store.get(id)).filter(Boolean).slice(0,4).map(x=>`<button data-open="${evalEsc(x.id)}">${evalEsc(x.id)}</button>`).join('')}</div></div>`; fb.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>router.go('/item/'+b.dataset.open));}
  function updateResult(){const qs=store.all('questions'); let correct=0, total=qs.length, answered=0; qs.forEach(q=>{if(answers.has(q.id)){answered++; if(Number(answers.get(q.id))===q.answer)correct++;}}); const score=answered?Math.round((correct/answered)*100):0; result.querySelector('.eval-result').outerHTML=resultTemplate({score,correctas:correct,total:answered||total});}
  function apply(){const term=(search.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); list.querySelectorAll('.eval-question').forEach(card=>{const text=card.textContent.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); const domainOk=domain==='all'||card.dataset.domain===domain; const diffOk=difficulty==='all'||card.dataset.difficulty===difficulty; card.style.display=(domainOk&&diffOk&&text.includes(term))?'':'none';});}
  list.querySelectorAll('[data-q]').forEach(btn=>btn.onclick=()=>{answers.set(btn.dataset.q,btn.dataset.option); save(); paint(btn.dataset.q); updateResult();});
  root.querySelectorAll('#evalDomains button').forEach(b=>b.onclick=()=>{domain=b.dataset.domain; root.querySelectorAll('#evalDomains button').forEach(x=>x.classList.toggle('active',x===b)); apply();});
  root.querySelectorAll('#evalDifficulty button').forEach(b=>b.onclick=()=>{difficulty=b.dataset.difficulty; root.querySelectorAll('#evalDifficulty button').forEach(x=>x.classList.toggle('active',x===b)); apply();});
  search.addEventListener('input',apply); root.querySelector('#resetEval').onclick=()=>{answers.clear(); save(); root.querySelectorAll('.eval-feedback').forEach(x=>x.innerHTML=''); root.querySelectorAll('.eval-options button').forEach(b=>b.classList.remove('selected','correct','incorrect')); updateResult();};
  store.all('questions').forEach(q=>paint(q.id)); updateResult();
}
