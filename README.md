# BancoLele ✳

**BancoLele** es una experiencia bancaria **100% ficticia** de una sola página, inspirada visualmente en las muñecas tradicionales Lele de México. Está diseñada con HTML5, CSS3 y JavaScript puro, en español, con ejemplos de importes en pesos mexicanos (MXN).

> **SIMULACIÓN / DEMO.** BancoLele no es una institución financiera. No realiza pagos, no emite tarjetas, no accede a cuentas reales ni envía reportes a bancos o autoridades. No ingreses información personal o financiera real.

## Estructura

```text
bancolele/
├── index.html                # Único HTML: aquí viven las cinco pestañas y los artículos
├── css/
│   └── styles.css            # Estilos, componentes, transiciones y responsive
├── js/
│   └── main.js               # Navegación, estado demo, formularios e interacciones
├── assets/
│   └── images/
│       ├── favicon.svg
│       └── lele-hero.png     # Ilustración original generada para este proyecto
└── README.md
```

No utiliza framework, bundler, base de datos ni servidor backend. Todos los archivos referenciados desde `index.html` usan **rutas relativas** aptas para GitHub Pages.

## IDs estables y enlaces directos

Estos identificadores son parte de la interfaz pública del proyecto. **No los cambies entre versiones sin autorización y sin revisar todas las integraciones**.

| Pestaña | ID exacto | URL directa de ejemplo |
|---|---|---|
| Menú principal | `main` | `https://USUARIO.github.io/bancolele/#main` |
| Tarjeta de crédito | `credit-card` | `https://USUARIO.github.io/bancolele/#credit-card` |
| Nómina | `payroll` | `https://USUARIO.github.io/bancolele/#payroll` |
| Fraude | `fraud` | `https://USUARIO.github.io/bancolele/#fraud` |
| Blog | `blog` | `https://USUARIO.github.io/bancolele/#blog` |

Sustituye **`USUARIO`** por tu nombre de usuario real de GitHub. No se proporcionó en este proyecto, por eso se conserva el marcador en la documentación.

### Dónde encontrarlos

1. **Secciones:** `index.html`, etiquetas `<section id="main">`, `<section id="credit-card">`, `<section id="payroll">`, `<section id="fraud">` y `<section id="blog">` (también incluyen otras clases/atributos).
2. **Navegación:** `index.html`, `<nav id="primary-nav">`, enlaces `href="#main"`, `href="#credit-card"`, `href="#payroll"`, `href="#fraud"`, `href="#blog"`.
3. **Contrato JavaScript:** al principio de `js/main.js`, constante `TAB_IDS`:

```js
const TAB_IDS = Object.freeze(['main', 'credit-card', 'payroll', 'fraud', 'blog']);
```

4. **Nombre visible:** constante `TAB_NAMES` en `js/main.js`.

La navegación se realiza sin recargar usando el fragmento `#` de la URL. La pestaña se restaura en cargas directas, recargas y navegación con Atrás/Adelante. Si no hay fragmento o es desconocido, se muestra `main`.

## Funciones incluidas

- **Inicio:** presentación de marca, ilustración original, tarjetas de acceso a los módulos.
- **Tarjetas:** tres productos inventados, beneficios, anualidades/tasas/CAT ilustrativos, comparador y elección simulada.
- **Nómina:** cuenta ficticia con saldo, movimientos filtrables y botón para añadir un depósito simulado de $12,450 MXN. Los cambios de nómina viven en memoria de esa visita.
- **Fraude:** formulario validado para incidentes ya ocurridos; disputa de movimientos ficticios; seguimiento con estados e historial; bloqueo/desbloqueo de tarjeta demo; guía de seguridad y asistencia simulada; consejos de prevención.
- **Blog:** seis artículos editoriales, categorías filtrables y lectura completa dentro de la misma pestaña (sin otra página HTML).
- **Reportar un problema:** botón idéntico al final del contenido de **cada una** de las cinco pestañas, generado desde `#report-button-template`. El modal detecta automáticamente pestaña, ID y fecha/hora. Es independiente del formulario de fraude y no envía nada a una entidad real.

### Datos de demostración y almacenamiento

Se incluyen importes, establecimientos, IDs y expedientes **inventados**. No hay conexión a sistemas bancarios.

`localStorage` guarda solo metadatos ficticios para ilustrar continuidad de los casos y el estado de bloqueo demo:

- `bancolele-demo-cases-v1`: folio, fecha, tipo, transacción de ejemplo, estado y línea de tiempo.
- `bancolele-demo-counter-v1`: contador local de folios ficticios.
- `bancolele-demo-card-lock-v1`: indicador de tarjeta demo bloqueada.

**No se guardan** las descripciones escritas en los formularios ni información bancaria sensible. El flujo global de problemas confirma localmente y no persiste el texto. La información de nómina se reinicia al refrescar. En Fraude, el botón **“Restablecer casos de ejemplo”** recupera los expedientes predefinidos. Para eliminar todos los datos demo, borra el almacenamiento del sitio en tu navegador.

Los formularios incluyen advertencias explícitas para no introducir datos reales. La aplicación está pensada para uso educativo y demostrativo, no para recibir reportes auténticos.

## Abrir localmente

Puedes abrir `index.html` directamente desde el explorador de archivos. Para una comprobación más representativa, sirve la carpeta con un servidor estático opcional:

```bash
cd bancolele
python3 -m http.server 8000
```

Visita `http://localhost:8000/#fraud` o cualquier otra ruta directa. El servidor es solo para visualizar archivos estáticos; la navegación y formularios no necesitan backend.

## Publicar en GitHub Pages

1. Crea un repositorio público (o con disponibilidad de Pages según tu plan) llamado exactamente **`bancolele`** en tu cuenta de GitHub.
2. Sube **el contenido de esta carpeta** a la raíz de la rama principal del repositorio. Es esencial que `index.html` quede en la raíz, no dentro de una segunda carpeta `bancolele/`.
3. En GitHub abre **Settings → Pages → Build and deployment**.
4. En **Source** selecciona **Deploy from a branch**; elige la rama **main** y carpeta **/(root)**, y guarda.
5. Espera a que GitHub Pages termine la publicación y abre `https://USUARIO.github.io/bancolele/`.
6. Prueba los cinco enlaces de la tabla con tu usuario de GitHub.

GitHub Pages no necesita reglas de redirección: todas las vistas pertenecen al mismo `index.html` y usan fragmentos (`#`).

> El proyecto está **preparado** para publicar, pero el repositorio y la URL de GitHub no se crean automáticamente desde estos archivos. La URL final depende de tu usuario real y de activar Pages.

## Lista de comprobación funcional

- [ ] Navegar entre las cinco pestañas sin recarga; menú activo correcto.
- [ ] Abrir directamente cada URL `#main`, `#credit-card`, `#payroll`, `#fraud` y `#blog`.
- [ ] Usar Atrás, Adelante y Actualizar conservando la pestaña.
- [ ] Abrir “Reportar un problema” en cada pestaña y confirmar origen/ID automáticos.
- [ ] Validar campos obligatorios, longitudes mínimas y fecha no futura en fraude.
- [ ] Crear reporte ficticio, disputar un cargo y ver el caso nuevo en Seguimiento.
- [ ] Bloquear/desbloquear la tarjeta demo; consultar prevención y asistencia.
- [ ] Comparar tarjetas y simular una elección; generar depósito y filtrar nómina.
- [ ] Filtrar artículos, leerlos y regresar a la lista dentro del blog.
- [ ] Revisar menú móvil, accesibilidad con teclado y cierre de diálogos mediante Escape.

## Personalización

- Marca y textos: `index.html`.
- Colores y disposición: variables `:root` al principio de `css/styles.css`.
- Productos: objeto `CARD_PRODUCTS` en `js/main.js` y tarjetas de producto en `index.html`.
- Transacciones/casos demo: `FRAUD_TRANSACTIONS`, `SEED_CASES`, `MOVEMENT_SEED` en `js/main.js`.
- Artículos: tarjetas y `<template id="article-*">` dentro de `index.html`.
- IDs públicos: `TAB_IDS` en JS, secciones y enlaces en HTML; cambiar solo con autorización y actualizando la documentación.

El proyecto emplea fuentes de Google Fonts con alternativas locales de sistema. Si las fuentes externas no están disponibles, el sitio conserva su funcionalidad y estilo general.

## Nota cultural

La identidad rinde homenaje visual a las muñecas Lele, ligadas a la tradición artesanal de Amealco, Querétaro. Esta obra ficticia no está afiliada a comunidades artesanas, fabricantes ni instituciones financieras. La ilustración de la portada fue generada especialmente como recurso gráfico de demostración.
