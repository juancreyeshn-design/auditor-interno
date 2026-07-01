export function metodologiaModule(renderer){
  const view=document.getElementById('view');
  view.innerHTML=`
    <div style="padding:0;height:calc(100vh - 120px);display:flex;flex-direction:column;">
      <div style="padding:16px 20px 8px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #e2e8f0;">
        <span style="font-size:1.4rem;">&#128203;</span>
        <div>
          <h2 style="margin:0;font-size:1.1rem;color:#1a3a5c;">Metodologia de Auditoria Interna</h2>
          <p style="margin:0;font-size:.82rem;color:#64748b;">5 fases · Basada en NOGAI IIA 2024 · Interactivo offline</p>
        </div>
        <a href="auditoria_nogai_metodologia_interactivo.html" target="_blank" style="margin-left:auto;padding:6px 14px;background:#f0a500;color:#1a3a5c;border-radius:8px;font-size:.82rem;font-weight:700;text-decoration:none;">Abrir completo</a>
      </div>
      <iframe src="auditoria_nogai_metodologia_interactivo.html" style="flex:1;width:100%;border:none;background:#f4f6fa;" title="Metodologia Auditoria Interna NOGAI" loading="lazy"></iframe>
    </div>
  `;
}
