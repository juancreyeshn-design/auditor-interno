import { renderLibrary, bindLibrary } from '../components/library-view.js';

export const bibliotecaModule=(renderer,store,knowledge,router)=>{
  renderer.view.innerHTML=renderLibrary({store,knowledge});
  bindLibrary(renderer.view,{store,knowledge,router});
  renderer.context.innerHTML='<h3>Biblioteca Inteligente</h3><p class="empty">Filtre por categoría, perfil o palabra clave. Cada recurso conserva relaciones con normas, objetos y rutas de implementación.</p>';
};
