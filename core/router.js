export class Router{
  constructor(){this.routes=new Map();window.addEventListener('hashchange',()=>this.resolve());}
  add(path,handler){this.routes.set(path,handler);return this;}
  go(path){location.hash=path;}
  resolve(){const hash=location.hash.replace('#','')||'/'; const [path,param]=hash.split('/').filter(Boolean); const key=path?`/${path}`:'/'; const fn=this.routes.get(key)||this.routes.get('/'); fn&&fn(param);}
}
