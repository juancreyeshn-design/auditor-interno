const esc=(v='')=>String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
export const progressBar=(value)=>`<div class="progress"><span style="width:${Math.max(0,Math.min(100,value||0))}%"></span></div>`;
export const metricCard=(m)=>`<article class="dash-metric"><strong>${esc(m.value)}</strong><span>${esc(m.label)}</span><small>${esc(m.caption)}</small></article>`;
export const progressWidget=(p)=>`<div class="progress-line"><div><strong>${esc(p.label)}</strong><small>${esc(p.caption)}</small></div><span>${p.value}%</span>${progressBar(p.value)}</div>`;
export const resourceButton=(item,action='Abrir')=>`<button class="resource-btn" data-id="${esc(item.id)}"><strong>${esc(item.title)}</strong><small>${esc(item.type||item.collection||'recurso')} · ${esc(item.id)} · ${action}</small></button>`;
export const widget=(title,body,meta='')=>`<section class="dash-widget"><div class="widget-head"><h3>${esc(title)}</h3>${meta?`<span class="badge">${esc(meta)}</span>`:''}</div>${body}</section>`;
