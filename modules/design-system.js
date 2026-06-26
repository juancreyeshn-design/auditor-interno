import { designSystem } from '../assets/data/design-system.js';
import { renderDesignSystemView } from '../components/design-system-view.js';

export function designSystemModule(renderer){
  renderer.view.innerHTML=renderDesignSystemView(designSystem);
  renderer.context.innerHTML=`<h3>Sistema de Diseño</h3><p class="empty">Sprint 006 establece tokens, componentes y reglas visuales para evitar interfaces improvisadas.</p><div class="list"><button><strong>Uso obligatorio</strong><br><small>Aplicar componentes reutilizables antes de crear CSS específico.</small></button><button><strong>Compatibilidad</strong><br><small>Debe funcionar en GitHub Pages y HTML offline.</small></button></div>`;
}
