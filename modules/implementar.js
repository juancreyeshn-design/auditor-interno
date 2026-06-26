import { renderImplementationCenter, bindImplementationCenter } from '../components/implementation-center-view.js';

export const implementarModule=(renderer,store,knowledge,router)=>{
  renderer.view.innerHTML=renderImplementationCenter({store,knowledge});
  bindImplementationCenter(renderer.view,{store,knowledge,router});
  renderer.context.innerHTML='<h3>Implementador NOGAI</h3><p class="empty">Seleccione una ruta y complete pasos. El avance se conserva localmente en este navegador.</p>';
};
