# Prototipo de Gestión de Adopciones

Este es un prototipo de una aplicación web para la gestión de avisos de adopción de mascotas.  
Fue desarrollado utilizando HTML5, CSS y JavaScript.

---

## Estructura del proyecto

```

desarrollo_web_Victor_Peters/flask-app
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

# Prototipo de Valoración de Publicaciones

Este es un prototipo de una página web que permite evaluar las publicaciones de la página construida con flask, en esta nueva página cuenta con una única vista principal llamada listado.html, en la cual se presentan publicaciones guardadas en la base de datos y se pueden evaluar con una clificación de 1 a 7, mostrando la calificación promedio de cada aviso.

# Estructura Aplicación con Spring Boot

desarrollo_web_Victor_Peters/spring-app
└──src/main/
   ├──java/tarea_4/tarea_4/ 
   │   ├── controllers/
   │   │   ├──AvisoController.java
   │   │   └──NotaController.java
   │   ├── models/
   │   │   ├──AvisoAdopcion.java
   │   │   ├──Comentario.java
   │   │   ├──Comuna.java
   │   │   ├──Foto.java
   │   │   ├──Nota.java
   │   │   └──Region.java
   │   ├── services/NotaService.java
   │   ├──  repository/
   │   │   ├──AvisoRepository.java
   │   │   └──notaRepository.java
   │   └── Tarea4Aplication.java
   └── resources/
       ├── templates/listado.html
       ├── static/
       │    ├── css/style.css
       │    └── js/evaluar.js
       └── application.properties

# Tecnologías utilizadas
- Java 25
- Spring Data JPA
- Thymeleaf
- Spring Web
- MySQL Driver
- Validation
- Spring Boot DevTools


