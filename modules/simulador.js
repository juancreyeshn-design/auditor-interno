import { renderSimulator, bindSimulator } from '../components/simulator-view.js';

export const simuladorModule=(renderer,store,knowledge,router)=>{
  renderer.view.innerHTML=renderSimulator({store,knowledge});
  bindSimulator(renderer.view,{store,knowledge,router});
  renderer.context.innerHTML='<h3>Simulador</h3><p class="empty">Modo estudio, examen y repaso por dominio. Use las recomendaciones para volver a normas y objetos relacionados.</p>';
};
