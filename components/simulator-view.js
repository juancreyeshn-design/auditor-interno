const simEsc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]||m));
const simArr=v=>Array.isArray(v)?v:[];
function sampleQuestions(questions, count=8){
  const seed=[...questions].sort((a,b)=>a.id.localeCompare(b.id));
  return seed.slice(0, Math.min(count, seed.length));
}
function domainOptions(store){return store.all('domains').map(d=>`<option value="${simEsc(d.id)}">${simEsc(d.title)}</option>`).join('');}
function examShell(questions){return questions.map((q,i)=>`<article class="sim-question" data-q="${simEsc(q.id)}">
  <div class="sim-q-head"><span class="badge">${simEsc(q.difficulty||'Pregunta')}</span><small>${simEsc(q.id)}</small></div>
  <h3>${i+1}. ${simEsc(q.question)}</h3>
  <div class="sim-options">${simArr(q.options).map((op,idx)=>`<button data-q="${simEsc(q.id)}" data-option="${idx}"><span>${String.fromCharCode(65+idx)}</span>${simEsc(op)}</button>`).join('')}</div>
  <div class="sim-feedback" id="simfb-${simEsc(q.id)}"></div>
</article>`).join('');}
function scoreBlock({answered=0,correct=0,total=0}){const score=answered?Math.round((correct/answered)*100):0;return `<div class="sim-score-card"><strong>${score}%</strong><span>${correct}/${answered||total} correctas</span><div class="progress"><span style="width:${score}%"></span></div></div>`;}
export function renderSimulator({store}){
  const questions=store.all('questions');
  const initial=sampleQuestions(questions,8);
  return `<section class="simulator-center panel">
    <div class="sim-hero"><div><span class="badge">Sprint 012</span><h2>Simulador Profesional</h2><p>Entorno de práctica con preguntas originales tipo certificación. Permite trabajar en modo estudio, modo examen y repaso por dominio, conservando resultados en el navegador.</p></div><div class="sim-hero-stat"><strong>${questions.length}</strong><span>preguntas base</span></div></div>
    <div class="sim-toolbar">
      <div class="sim-mode"><button class="active" data-mode="study">Modo estudio</button><button data-mode="exam">Modo examen</button><button data-mode="domain">Por dominio</button></div>
      <div class="sim-config"><label>Dominio<select id="simDomain"><option value="all">Todos los dominios</option>${domainOptions(store)}</select></label><label>Preguntas<select id="simCount"><option>5</option><option selected>8</option><option>10</option><option>12</option></select></label><button class="primary-action" id="startSim">Iniciar intento</button></div>
    </div>
    <div class="sim-layout"><main id="simQuestions">${examShell(initial)}</main><aside class="sim-side"><div id="simScore">${scoreBlock({total:initial.length})}</div><div class="panel sim-rules"><h3>Reglas</h3><ul><li>Modo estudio muestra retroalimentación inmediata.</li><li>Modo examen retiene retroalimentación hasta finalizar.</li><li>Los resultados se agrupan por dominio y dificultad.</li></ul><button class="primary-action" id="finishSim">Finalizar intento</button></div><div class="panel sim-review" id="simReview"><h3>Recomendaciones</h3><p class="empty">Responda preguntas para obtener recomendaciones de repaso.</p></div></aside></div>
  </section>`;
}
export function bindSimulator(root,{store,router}){
  let mode='study'; let selected=[]; let answers=new Map();
  const qContainer=root.querySelector('#simQuestions'); const score=root.querySelector('#simScore'); const review=root.querySelector('#simReview');
  const domainSel=root.querySelector('#simDomain'); const countSel=root.querySelector('#simCount');
  function pick(){let pool=store.all('questions'); if(domainSel.value!=='all')pool=pool.filter(q=>q.domain===domainSel.value); selected=sampleQuestions(pool,Number(countSel.value||8)); answers=new Map(); qContainer.innerHTML=examShell(selected); bindOptions(); updateScore(false); review.innerHTML='<h3>Recomendaciones</h3><p class="empty">Nuevo intento iniciado.</p>';}
  function updateScore(showReview=true){let correct=0, answered=0; selected.forEach(q=>{if(answers.has(q.id)){answered++; if(Number(answers.get(q.id))===q.answer)correct++;}}); score.innerHTML=scoreBlock({answered,correct,total:selected.length}); if(showReview)renderRecommendations();}
  function feedback(qid,force=false){const q=store.get(qid); if(!q)return; const chosen=answers.get(qid); const fb=root.querySelector(`#simfb-${qid}`); if(!fb||chosen===undefined)return; const correct=Number(chosen)===Number(q.answer); root.querySelectorAll(`[data-q="${qid}"][data-option]`).forEach(b=>{const idx=Number(b.dataset.option); b.classList.toggle('selected',idx===Number(chosen)); b.classList.toggle('correct',(mode==='study'||force)&&idx===q.answer); b.classList.toggle('incorrect',(mode==='study'||force)&&idx===Number(chosen)&&!correct);}); if(mode==='study'||force){const links=simArr(q.standards).map(id=>store.get(id)).filter(Boolean).map(x=>`<button data-open="${simEsc(x.id)}">${simEsc(x.id)}</button>`).join(''); fb.innerHTML=`<div class="${correct?'sim-ok':'sim-bad'}"><strong>${correct?'Correcto':'Incorrecto'}</strong><p>${simEsc(q.feedback||'')}</p><p><strong>Criterio:</strong> ${simEsc(q.rationale||'Revise el objeto relacionado.')}</p><div class="sim-links">${links}</div></div>`; fb.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>router.go('/item/'+b.dataset.open)); } else {fb.innerHTML='<p class="empty">Respuesta registrada. La retroalimentación se mostrará al finalizar.</p>';}}
  function renderRecommendations(){const missed=selected.filter(q=>answers.has(q.id)&&Number(answers.get(q.id))!==q.answer); const byDomain={}; missed.forEach(q=>{byDomain[q.domain]=(byDomain[q.domain]||0)+1}); const rows=Object.entries(byDomain).map(([d,n])=>{const obj=store.get(d); return `<li><strong>${simEsc(obj?.title||d)}</strong>: ${n} respuesta(s) a reforzar.</li>`;}).join(''); review.innerHTML=`<h3>Recomendaciones</h3>${missed.length?`<ul>${rows}</ul><p>Abra las normas asociadas desde cada retroalimentación y repita el intento en modo estudio.</p>`:'<p>Sin errores registrados en el intento actual.</p>'}`;}
  function bindOptions(){qContainer.querySelectorAll('[data-option]').forEach(btn=>btn.onclick=()=>{answers.set(btn.dataset.q,btn.dataset.option); feedback(btn.dataset.q); updateScore();});}
  root.querySelectorAll('.sim-mode button').forEach(b=>b.onclick=()=>{mode=b.dataset.mode; root.querySelectorAll('.sim-mode button').forEach(x=>x.classList.toggle('active',x===b)); if(mode==='domain'&&domainSel.value==='all')domainSel.value='D3'; pick();});
  root.querySelector('#startSim').onclick=pick;
  root.querySelector('#finishSim').onclick=()=>{selected.forEach(q=>feedback(q.id,true)); updateScore(true); try{const state=JSON.parse(localStorage.getItem('auditoria_nogai_simulator')||'[]'); state.push({date:new Date().toISOString(),total:selected.length,answered:answers.size}); localStorage.setItem('auditoria_nogai_simulator',JSON.stringify(state.slice(-20)));}catch(_){}};
  bindOptions(); updateScore(false);
}
