import { DataStore } from './datastore.js';
import { KnowledgeEngine } from './knowledge-engine.js';
import { Router } from './router.js';
import { RenderEngine } from './render-engine.js';
import { SearchEngine } from './search-engine.js';
import { renderShell,setActive } from '../components/layout.js';
import { dashboardModule } from '../modules/dashboard.js';
import { aprenderModule } from '../modules/aprender.js';
import { metodologiaModule } from '../modules/metodologia.js';
import { implementarModule } from '../modules/implementar.js';
import { centroModule } from '../modules/centro-profesional.js';
import { bibliotecaModule } from '../modules/biblioteca.js';
import { designSystemModule } from '../modules/design-system.js';
import { casosModule } from '../modules/casos.js';
import { evaluacionesModule } from '../modules/evaluaciones.js';
import { simuladorModule } from '../modules/simulador.js';
import { healthModule } from '../modules/health.js';

const root=document.getElementById('app');renderShell(root);
const store=new DataStore();const knowledge=new KnowledgeEngine(store);const search=new SearchEngine(store,knowledge);const router=new Router();const renderer=new RenderEngine(store,knowledge,router,search);
router.add('/',()=>{setActive('/');dashboardModule(renderer,store,knowledge,router);})
.add('/aprender',()=>{setActive('/aprender');aprenderModule(renderer,store);})
.add('/metodologia',()=>{setActive('/metodologia');metodologiaModule(renderer);})
.add('/implementar',()=>{setActive('/implementar');implementarModule(renderer,store,knowledge,router);})
.add('/centro',()=>{setActive('/centro');centroModule(renderer,store,knowledge,router);})
.add('/biblioteca',()=>{setActive('/biblioteca');bibliotecaModule(renderer,store,knowledge,router);})
.add('/casos',()=>{setActive('/casos');casosModule(renderer,store,knowledge,router);})
.add('/evaluaciones',()=>{setActive('/evaluaciones');evaluacionesModule(renderer,store,knowledge,router);})
.add('/simulador',()=>{setActive('/simulador');simuladorModule(renderer,store,knowledge,router);})
.add('/health',()=>{setActive('/health');healthModule(renderer,store,knowledge,search);})
.add('/buscar',(q)=>{setActive('/buscar');renderer.searchResults(decodeURIComponent(q||''));})
.add('/design',()=>{setActive('/design');designSystemModule(renderer);})
.add('/item',(id)=>renderer.item(id));
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{router.go(b.dataset.route);document.getElementById('sidebar').classList.remove('open');});
document.getElementById('searchInput').addEventListener('keydown',e=>{if(e.key==='Enter'){router.go('/buscar/'+encodeURIComponent(e.target.value||''));}});
router.resolve();
window.AuditorIANOGAI={store,knowledge,search,router,renderer};
