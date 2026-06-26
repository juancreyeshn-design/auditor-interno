export const aprenderModule=(renderer,store)=>renderer.list('Aprender — Dominios y principios NOGAI', [...store.all('domains'),...store.all('principles')]);
