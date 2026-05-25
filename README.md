# Sudoku Premium

Sudoku Premium es una aplicación web construida con React, TypeScript y Vite. Está diseñada como una PWA ligera que se puede desplegar en GitHub Pages.

## Características

- Juego de Sudoku interactivo
- Interfaz React moderna
- Configuración de PWA con `vite-plugin-pwa`
- Construcción con Vite y despliegue en GitHub Pages

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173` para ver la aplicación en el navegador.

## Build de producción

```bash
npm run build
```

## Vista previa del build

```bash
npm run preview
```

## Despliegue en GitHub Pages

Este repositorio está configurado para desplegar automáticamente en GitHub Pages mediante GitHub Actions.

Asegúrate de tener el workflow en `.github/workflows/static.yml` y empuja los cambios a la rama `main`.

## Notas

- El archivo `vite.config.ts` usa `base: './'` para que los recursos funcionen correctamente cuando se publica en GitHub Pages.
- Las rutas en `index.html` están configuradas con rutas relativas para evitar errores `404` al cargar `manifest.webmanifest` y `src/main.tsx`.

## Dependencias principales

- React
- React DOM
- Vite
- TypeScript
- `@vitejs/plugin-react`
- `vite-plugin-pwa`

## Estructura del proyecto

- `src/` — código fuente de la aplicación
- `public/` — activos estáticos adicionales
- `.github/workflows/` — configuración de GitHub Actions
- `vite.config.ts` — configuración de Vite
- `README.md` — documentación del proyecto
