# Prototipo de Gestión de Adopciones

Este es un prototipo de una aplicación web para la gestión de avisos de adopción de mascotas.  
Fue desarrollado utilizando HTML5, CSS y JavaScript.

---

## Estructura del proyecto

```

desarrollo_web_Victor_Peters/
│
├── app.py                        ← Archivo principal de Flask
│
├── static/                       ← Carpeta para archivos estáticos
│   ├── css/
│   │   └── style.css             ← Estilos del proyecto
│   ├── js/
│   │   ├── app.js                ← Lógica principal en JavaScript
│   │   └── region_comuna.js      ← Datos de regiones y comunas
│   └── uploads/                  ← Aquí se guardan las fotos subidas
│
├── templates/                    ← Plantillas HTML renderizadas por Flask
│   ├── inicio.html               ← Página principal (portada)
│   ├── agregar-aviso.html        ← Formulario para agregar un aviso
│   ├── listado.html              ← Listado de todos los avisos
│   ├── detalle.html              ← Vista de detalle de un aviso
│   ├── estadisticas.html         ← Gráficas con datos de ejemplo
│   └── navbar.html               ← menú de navegación incluido en todas
│
├──requirements.txt               ← Archivo con las versiones de cada herramienta utilizada
│
└── README.md                     ← Este archivo

```

---

## Funcionalidades

- **Portada (`inicio.html`)**
  - Muestra los últimos avisos publicados.
  - Cada aviso incluye una foto representativa.

- **Agregar aviso (`agregar-aviso.html`)**
  - Formulario con validaciones en JavaScript.
  - Se pueden subir entre 1 y 5 fotos.
  - Antes de confirmar se muestra un cuadro de confirmación.
  - Las imagenes subidas son almacenadas en static/uploads

- **Listado (`listado.html`)**
  - Tabla con todos los avisos.
  - Indica la cantidad de fotos asociadas.
  - Cada fila es clickeable y lleva al detalle.

- **Detalle (`detalle.html`)**
  - Muestra toda la información de un aviso.
  - Incluye galería de fotos ampliables en un modal.

- **Estadísticas (`estadisticas.html`)**
  - Gráficos simples de ejemplo(línea, torta y barras).

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Flask
- Jinja2
---

## Instalación y uso

1. Clona o descarga este repositorio.  
2. Abre cualquiera de los archivos `.html` en tu navegador (no se requiere servidor).  
3. Navega usando los botones del menú superior.  

---

## Notas

- Las imágenes se manejan como un arreglo en cada aviso.  
- Los datos iniciales son ficticios y se encuentran en `app.js` (`sampleNotices`).  

