export const el=(tag,attrs={},html='')=>{const n=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>{if(k==='class')n.className=v;else if(k.startsWith('on'))n.addEventListener(k.slice(2),v);else n.setAttribute(k,v)}); if(html)n.innerHTML=html; return n;};
export const card=(item,onClick)=>el('article',{class:'card',onclick:onClick},`<span class="badge">${item.type||'recurso'}</span><h3>${item.title}</h3><p>${item.summary||''}</p>`);
export const progress=(pct)=>`<div class="progress"><span style="width:${pct}%"></span></div>`;
