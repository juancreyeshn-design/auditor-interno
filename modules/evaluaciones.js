import { renderEvaluations, bindEvaluations } from '../components/evaluations-view.js';

export const evaluacionesModule=(renderer,store,knowledge,router)=>{
  renderer.view.innerHTML=renderEvaluations({store,knowledge});
  bindEvaluations(renderer.view,{store,knowledge,router});
  renderer.context.innerHTML='<h3>Autoevaluaciones</h3><p class="empty">Banco inicial de preguntas con retroalimentación y vínculos a normas y objetos de conocimiento.</p>';
};
