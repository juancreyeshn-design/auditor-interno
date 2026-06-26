const esc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
export function renderHealthView(report){
  const status=report.summary.failed===0?'Aprobado':'Requiere atención';
  const statusClass=report.summary.failed===0?'ok':'danger';
  return `<div class="panel health-center">
    <div class="health-hero">
      <div>
        <span class="badge">Sprint 013</span>
        <h2>Hardening funcional</h2>
        <p>Verificación de integridad del Core Engine, DataStore, Knowledge Engine, Search Engine y relaciones principales de la base NOGAI.</p>
      </div>
      <div class="health-score ${statusClass}"><strong>${report.summary.score}%</strong><span>${status}</span></div>
    </div>
    <div class="health-metrics">
      <div><strong>${report.summary.total}</strong><span>Pruebas</span></div>
      <div><strong>${report.summary.passed}</strong><span>Aprobadas</span></div>
      <div><strong>${report.summary.failed}</strong><span>Fallidas</span></div>
      <div><strong>${report.summary.warnings}</strong><span>Advertencias</span></div>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Control</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>
      ${report.checks.map(c=>`<tr><td><strong>${esc(c.id)}</strong><br><small>${esc(c.title)}</small></td><td><span class="badge ${c.ok?'ok':c.severity==='warn'?'warn':'danger'}">${c.ok?'OK':c.severity==='warn'?'Advertencia':'Falla'}</span></td><td>${esc(c.detail)}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="health-note"><strong>Resultado:</strong> ${report.summary.failed===0?'La Release 1 supera las verificaciones mínimas para continuar con estabilización y empaquetado.':'Debe corregirse toda falla crítica antes de cerrar Release 1.'}</div>
  </div>`;
}
