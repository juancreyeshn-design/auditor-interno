import { DashboardEngine } from '../core/dashboard-engine.js';
import { metricCard,progressWidget,resourceButton,widget,progressBar } from '../components/dashboard-widgets.js';

const esc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));

export const dashboardModule=(renderer,store,knowledge,router)=>{
  const engine=new DashboardEngine(store,knowledge);
  const current=engine.continueItem();
  const metrics=engine.metrics().map(metricCard).join('');
  const progress=engine.progress().map(progressWidget).join('');
  const tools=engine.quickTools().map(x=>resourceButton(x)).join('');
  const recent=engine.recentItems().map(x=>resourceButton(x,'Continuar')).join('')||'<p class="empty">Sin actividad registrada.</p>';
  const recommendations=engine.recommendations().map(x=>resourceButton(x,'Revisar')).join('');
  const pendings=engine.criticalPendings().map(x=>`<button class="resource-btn" data-id="${esc(x.item.id)}"><strong>${esc(x.item.title)}</strong><small>Avance ${x.value}%</small>${progressBar(x.value)}</button>`).join('')||'<p class="empty">Sin pendientes críticos.</p>';
  const coverage=engine.coverageRows().map(x=>`<tr><td>${esc(x.domain.title)}</td><td>${x.principles}</td><td>${x.standards}</td><td>${x.cards}</td></tr>`).join('');

  renderer.view.innerHTML=`
    <div class="dashboard-hero">
      <div>
        <span class="badge">Sprint 003 · Dashboard Profesional</span>
        <h2>Centro de operaciones AuditorIA NOGAI</h2>
        <p>Panel ejecutivo conectado al Core Engine, DataStore y Knowledge Engine. Desde aquí se accede al aprendizaje, implementación, centro profesional y relaciones críticas de las NOGAI.</p>
      </div>
      <button class="primary-action" data-id="${esc(current.id)}">Continuar: ${esc(current.id)}</button>
    </div>
    <div class="dash-metrics">${metrics}</div>
    <div class="dashboard-grid">
      ${widget('Continuar aprendizaje',`<p class="lead-sm">Último recurso activo</p>${resourceButton(current,'Continuar')}`,'Core')}
      ${widget('Mi progreso',progress,'Local')}
      ${widget('Implementaciones pendientes',pendings,'Implementador')}
      ${widget('Centro Profesional',tools,'Accesos rápidos')}
      ${widget('Actividad reciente',recent,'Historial')}
      ${widget('Recomendaciones',recommendations,'Knowledge Graph')}
    </div>
    <section class="panel dashboard-coverage">
      <div class="section-title"><h2>Cobertura de la Base NOGAI</h2><span class="badge">DataStore</span></div>
      <div class="table-wrap"><table><thead><tr><th>Dominio</th><th>Principios</th><th>Normas</th><th>Objetos</th></tr></thead><tbody>${coverage}</tbody></table></div>
    </section>`;
  renderer.view.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{engine.markViewed(btn.dataset.id);router.go('/item/'+btn.dataset.id);});
  renderer.context.innerHTML=`<h3>Panel contextual</h3><p class="empty">Dashboard conectado al Knowledge Engine.</p><div class="list">${recommendations}</div>`;
  renderer.context.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{engine.markViewed(btn.dataset.id);router.go('/item/'+btn.dataset.id);});
};
