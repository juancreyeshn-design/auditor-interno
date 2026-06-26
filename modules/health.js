import { renderHealthView } from '../components/health-view.js';
import { HealthCheck } from '../core/health-check.js';
export function healthModule(renderer,store,knowledge,search){
  const report=new HealthCheck(store,knowledge,search).run();
  renderer.view.innerHTML=renderHealthView(report);
  renderer.context.innerHTML=`<h3>Release 1</h3><p class="empty">Sprint 013 consolida la revisión funcional previa al cierre de la plataforma base.</p><div class="list"><button><strong>Estado</strong><br><small>${report.summary.failed===0?'Sin fallas críticas':'Con fallas críticas'}</small></button><button><strong>Puntaje</strong><br><small>${report.summary.score}% de controles aprobados</small></button></div>`;
}
