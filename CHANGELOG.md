# Changelog

## Sprint 014 — Empaquetado GitHub Pages
- Se generó paquete específico para GitHub Pages.
- Se creó versión offline sprint014.
- Se agregó documentación de publicación estática.
- Se validaron rutas relativas para despliegue web.


## Sprint 012 — Simulador Profesional

### Agregado
- Módulo de Simulador Profesional.
- Modo estudio, modo examen y repaso por dominio.
- Puntaje del intento y recomendaciones por dominio.
- Enlaces desde retroalimentación hacia normas.


## Sprint 009 — Biblioteca Inteligente

- Agregado componente `library-view.js`.
- Sustituida la biblioteca plana por centros de conocimiento conectados.
- Incorporados filtros por categoría y perfil profesional.
- Integrada la vista de detalle con normas, principios, objetos, dominios, implementación y evidencias.
- Actualizado build offline a `auditoria_nogai_sprint009_offline.html`.


## Sprint 007 — Centro Profesional
- Agregado módulo funcional de Centro Profesional.
- Agregado componente `professional-center-view.js`.
- Agregados filtros por categoría y búsqueda local.
- Integración con Knowledge Viewer y relaciones del Knowledge Engine.
- Generado HTML offline `auditoria_nogai_sprint007_offline.html`.

# CHANGELOG

## Sprint 006 — Design System

- Se incorpora módulo de Sistema de Diseño en la ruta `/design`.
- Se agregan tokens visuales, principios de diseño y catálogo de componentes.
- Se incorporan estilos base para botones, badges, superficies, foco visible y showcase.
- Se actualiza navegación lateral y estado de versión a Sprint 006.
- Se actualiza el generador offline para producir `auditoria_nogai_sprint006_offline.html`.

## Sprint 005 — Search Engine

- Se incorporó búsqueda transversal por recursos y relaciones.

## Sprint 004 — Knowledge Viewer

- Se incorporó visor unificado de conocimiento.

## Sprint 003 — Dashboard Profesional

- Se incorporó Dashboard profesional conectado al Core.

## Sprint 002 — Knowledge Engine + Base NOGAI

- Se incorporó base NOGAI con dominios, principios y normas.

## Sprint 001 — Core Foundation

- Se creó el repositorio base, Core, Router, DataStore y builder offline.

## Sprint 008 — Implementador NOGAI

### Agregado
- Módulo operativo `Implementador NOGAI` conectado al DataStore y Knowledge Engine.
- Rutas de implementación por Gobierno, Planeación, Ejecución, Comunicación y Calidad.
- Ruta guiada por objeto profesional con diagnóstico, normativa, responsables, contenido, evidencia y validación.
- Registro de avance local mediante `localStorage`.
- Checklist operativo, evidencias esperadas y relación con normas NOGAI.
- Vista imprimible por ruta de implementación.

### Modificado
- `src/modules/implementar.js` ahora usa componente dedicado.
- `src/core/app.js` pasa Knowledge Engine y Router al módulo Implementar.
- `scripts/build-offline.js` genera el artefacto offline Sprint 008.


## Sprint 010 — Casos Profesionales
- Agregado Centro de Casos Profesionales.
- Agregada colección `cases` al DataStore.
- Agregados seis casos originales conectados con normas y objetos.
- Agregados filtros por dominio y perfil.

## Sprint 011 — Autoevaluaciones
- Se incorpora el módulo de Autoevaluaciones.
- Se añade banco inicial de 12 preguntas originales.
- Se habilita retroalimentación inmediata, filtros, búsqueda y persistencia local.
- Se conectan preguntas con normas, casos y objetos de conocimiento.

## Sprint 013 — Revisión funcional y hardening

- Agregado módulo de Salud del Sistema.
- Agregado motor `HealthCheck` para verificar integridad de la base NOGAI.
- Agregado script `validate-release.js` y evidencia `release-health-sprint013.json`.
- Mejoras menores de accesibilidad en navegación, búsqueda y tema.
- Generado HTML offline Sprint 013.
## Sprint 015 — QA final y publicación asistida

- Regenerado HTML offline final de Release 1.
- Generado reporte QA `qa-report-sprint015.json`.
- Preparado paquete GitHub Pages con instrucciones de publicación.
- Actualizada documentación de cierre de Release 1.
