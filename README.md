# AuditorIA NOGAI

Plataforma profesional para aprendizaje, consulta e implementación práctica de las Normas Globales de Auditoría Interna.

## Estado actual

**Sprint 015 — QA final y publicación asistida**

Artefactos principales:

- HTML offline: `build/auditoria_nogai_sprint015_offline.html`
- Reporte QA: `build/qa-report-sprint015.json`
- Paquete GitHub Pages: `AuditorIA-NOGAI_sprint015_github_pages.zip`

## Ejecución local

Abrir `src/index.html` en un navegador moderno o servir la carpeta `src` con un servidor estático.

## Generar HTML offline

```bash
node scripts/build-offline.js
```

Salida:

```text
build/auditoria_nogai_sprint006_offline.html
```

## Estructura principal

```text
src/
  assets/
    css/
    data/
  components/
  core/
  modules/
scripts/
docs/
build/
```

## Próximo sprint

Sprint 007 — Centro Profesional.


## Estado actual

- Sprint 008 — Implementador NOGAI: módulo operativo con rutas guiadas, avance local, evidencias, checklist y relaciones normativas.


## Sprint 010 — Casos Profesionales.

Biblioteca convertida en centro de conocimiento conectado, con filtros por categoría, perfil, búsqueda interna y vista de recurso vinculada al Knowledge Engine.


## Sprint 012
Incluye módulo de Autoevaluaciones con banco inicial de preguntas, retroalimentación, filtros, búsqueda y persistencia local.


## Sprint 012 — Simulador Profesional

Se incorpora el módulo de simulador con modo estudio, modo examen, repaso por dominio, retroalimentación y recomendaciones de refuerzo.

## Estado actual

Último incremento real: **Sprint 013 — Revisión funcional y hardening de Release 1**.

Artefactos generados:

- `build/auditoria_nogai_sprint013_offline.html`
- `build/release-health-sprint013.json`
- `AuditorIA-NOGAI_sprint013_source.zip`

Próximo sprint: **Sprint 014 — Empaquetado GitHub Pages y documentación de publicación**.

## Publicación en GitHub Pages

Para publicar AuditorIA NOGAI:

1. Descomprimir `AuditorIA-NOGAI_sprint014_github_pages.zip`.
2. Copiar su contenido al repositorio `juancreyeshn-design.github.io` o a la carpeta configurada para GitHub Pages.
3. Confirmar que `index.html` quede en la raíz publicada.
4. Hacer commit y push a GitHub.
5. Abrir el sitio desde GitHub Pages.

La versión offline se conserva en `offline/auditoria_nogai_sprint014_offline.html`.
