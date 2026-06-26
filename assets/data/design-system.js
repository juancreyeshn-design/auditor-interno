export const designSystem = {
  version: 'Sprint 006',
  principles: [
    'Claridad profesional antes que decoración.',
    'Componentes reutilizables antes que pantallas aisladas.',
    'Lectura confortable en escritorio, tablet y móvil.',
    'Accesibilidad mínima: contraste, foco visible y controles táctiles de al menos 48px.',
    'Compatibilidad completa con GitHub Pages y HTML offline.'
  ],
  tokens: [
    { group:'Color', name:'--brand', value:'#123b63', usage:'Identidad institucional, encabezados y elementos primarios.' },
    { group:'Color', name:'--brand2', value:'#0d6b8c', usage:'Acciones, enlaces, estados activos y navegación contextual.' },
    { group:'Color', name:'--gold', value:'#f4a811', usage:'Énfasis, llamadas a la acción y señalización de avance.' },
    { group:'Color', name:'--bg', value:'#f5f7fb', usage:'Fondo general de la aplicación.' },
    { group:'Color', name:'--surface', value:'#ffffff', usage:'Paneles, tarjetas y superficies de lectura.' },
    { group:'Tipografía', name:'Base', value:'16px', usage:'Tamaño mínimo de lectura para contenido profesional.' },
    { group:'Espaciado', name:'Control mínimo', value:'48px', usage:'Altura mínima para botones y controles táctiles.' },
    { group:'Forma', name:'--radius', value:'18px', usage:'Radio estándar de tarjetas y paneles.' },
    { group:'Elevación', name:'--shadow', value:'0 14px 36px rgba(17,32,51,.10)', usage:'Sombra estándar de superficies relevantes.' }
  ],
  components: [
    { id:'button', title:'Botón', purpose:'Ejecutar acciones primarias, secundarias o de navegación.', states:['default','hover','focus','disabled'] },
    { id:'card', title:'Tarjeta', purpose:'Representar dominios, principios, normas, herramientas, casos o recursos.', states:['default','hover','selected'] },
    { id:'widget', title:'Dashboard Widget', purpose:'Mostrar indicadores, progreso, accesos rápidos o recomendaciones.', states:['default','interactive'] },
    { id:'viewer', title:'Knowledge Viewer', purpose:'Mostrar cualquier objeto de conocimiento con la misma estructura visual.', states:['summary','implementation','evidence','relations'] },
    { id:'search', title:'Search View', purpose:'Presentar resultados agrupados por relaciones del Knowledge Engine.', states:['empty','results','no-results'] },
    { id:'progress', title:'Progress Bar', purpose:'Mostrar avance de aprendizaje, implementación, madurez o cobertura.', states:['low','medium','high'] },
    { id:'badge', title:'Badge', purpose:'Clasificar tipo, estado, dominio, principio o norma.', states:['neutral','info','success','warning'] },
    { id:'context', title:'Panel contextual', purpose:'Mostrar relaciones activas sin abandonar el recurso consultado.', states:['empty','related'] }
  ]
};
