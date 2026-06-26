const esc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

export function renderDesignSystemView(ds){
  return `<div class="panel design-page">
    <div class="design-hero">
      <span class="badge">${esc(ds.version)}</span>
      <h2>Sistema de Diseño AuditorIA NOGAI</h2>
      <p>Biblioteca visual y técnica para mantener consistencia entre Dashboard, Knowledge Viewer, Search Engine, Centro Profesional, Implementador y HTML offline.</p>
    </div>
    <section class="design-section">
      <h3>Principios de diseño</h3>
      <div class="design-principles">${ds.principles.map((p,i)=>`<article><strong>${String(i+1).padStart(2,'0')}</strong><p>${esc(p)}</p></article>`).join('')}</div>
    </section>
    <section class="design-section">
      <h3>Tokens principales</h3>
      <div class="table-wrap"><table><thead><tr><th>Grupo</th><th>Token</th><th>Valor</th><th>Uso</th></tr></thead><tbody>${ds.tokens.map(t=>`<tr><td>${esc(t.group)}</td><td><code>${esc(t.name)}</code></td><td>${esc(t.value)}</td><td>${esc(t.usage)}</td></tr>`).join('')}</tbody></table></div>
    </section>
    <section class="design-section">
      <h3>Componentes reutilizables</h3>
      <div class="component-grid">${ds.components.map(c=>`<article class="component-card"><span class="badge">${esc(c.id)}</span><h4>${esc(c.title)}</h4><p>${esc(c.purpose)}</p><small>Estados: ${c.states.map(esc).join(' · ')}</small></article>`).join('')}</div>
    </section>
    <section class="design-section">
      <h3>Showcase visual</h3>
      <div class="showcase-grid">
        <article class="card"><span class="badge">Norma</span><h3>Norma 6.1 — Mandato</h3><p>Ejemplo de tarjeta estándar para recursos del Knowledge Engine.</p></article>
        <article class="dash-widget"><div class="widget-head"><h3>Progreso</h3><span class="badge">82%</span></div><p class="lead-sm">Componente de avance reutilizable.</p><div class="progress"><span style="width:82%"></span></div></article>
        <article class="component-surface"><h4>Acciones</h4><button class="btn btn-primary">Primaria</button><button class="btn btn-secondary">Secundaria</button><button class="btn btn-ghost">Ligera</button></article>
        <article class="component-surface"><h4>Badges</h4><span class="badge">Dominio III</span><span class="badge badge-success">Completo</span><span class="badge badge-warn">Pendiente</span></article>
      </div>
    </section>
  </div>`;
}
