import { renderProfessionalCenter, bindProfessionalCenter } from '../components/professional-center-view.js';

export const centroModule=(renderer,store,knowledge,router)=>{
  renderer.view.innerHTML=renderProfessionalCenter({store,knowledge});
  bindProfessionalCenter(renderer.view,{store,knowledge,router});
  renderer.context.innerHTML='<h3>Centro Profesional</h3><p class="empty">Seleccione un objeto para revisar normas, implementación, evidencia y recursos relacionados.</p>';
};
