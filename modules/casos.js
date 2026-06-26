import { renderCases, bindCases } from '../components/cases-view.js';

export const casosModule=(renderer,store,knowledge,router)=>{
  renderer.view.innerHTML=renderCases({store,knowledge});
  bindCases(renderer.view,{store,knowledge,router});
  renderer.context.innerHTML='<h3>Casos Profesionales</h3><p class="empty">Seleccione un caso para revisar contexto, análisis, solución, normas y objetos vinculados.</p>';
};
