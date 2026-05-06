# Plan de Implementación: Portal de Carga y Revisión de Archivos de Diseño

El objetivo de este proyecto es crear un portal web de captación (tipo `diseno.sismode.com`) donde los clientes puedan subir sus archivos de diseño (como `.ai`), y el sistema realice una validación automática previa antes de enviarlo a los departamentos de Diseño e Ingeniería de Producto. Esto agilizará el flujo de trabajo y evitará cuellos de botella por archivos incorrectos.

## Arquitectura y Stack Tecnológico

1. **Frontend (Portal de Cliente)**:
   - Framework: **Next.js** (React). Ideal para crear una interfaz rápida, moderna y responsiva.
   - Estilos: **Vanilla CSS** con un diseño corporativo enfocado en Blanco con acentos en Rojo, diseño premium y dinámico.
   - Componentes principales: Formulario de datos (Nombre/Orden de Venta), Zona de Drag & Drop para múltiples archivos, Modal de "Contacto con Asesor", y Panel de Resultados (Aceptado/Rechazado con motivos).
2. **Backend & Validaciones (V1 Funcional)**:
   - Utilizaremos las API Routes de Next.js (o un backend local en Python/Node) para recibir y procesar los archivos realmente.
   - Validaciones para `.ai`: Tipo de archivo incorrecto, validación de fuentes tipográficas, modo de color (RGB vs CMYK), e imágenes sin incrustar/links rotos.
3. **Almacenamiento Centralizado (SharePoint / Odoo)**:
   - Se definirá la integración vía API (ej. Microsoft Graph API para SharePoint o API XML-RPC para Odoo Documents).
   - En la primera etapa construiremos el flujo funcional localmente, y como segundo paso conectaremos el envío de archivos aceptados al repositorio centralizado para que Diseño e Ingeniería tengan acceso bajo la "Referencia/Orden".

> [!NOTE]
> **Feedback Recibido**
> La Fase 1 (Desarrollo Piloto Local) se ha completado con éxito. Ahora el plan se enfoca en la Fase 2: la integración de almacenamiento en la nube (SharePoint / Odoo).

## Decisiones Tomadas (Fase 2)
1. **Destino de Almacenamiento:** Microsoft SharePoint.
2. **Estructura de Carpetas:** Estructura doble: `[Nombre del Cliente]/[Orden de Venta]`.
3. **Archivos Rechazados:** No se guardará el archivo físico en caso de fallo, pero se guardará un log (registro) de la validación fallida para mantener trazabilidad.
4. **Autenticación:** Se utilizarán credenciales de aplicación de Azure (Client ID, Tenant ID, Client Secret) mediante Microsoft Graph API.

## Cambios Propuestos

### Fase 1: Desarrollo Local (Frontend + Backend Next.js)
Crearemos el proyecto Next.js en la carpeta actual y desarrollaremos la interfaz completa.

#### [NEW] `index.css`
Estilos globales, variables corporativas y utilidades de diseño premium.

#### [NEW] `pages/index.js` (o `app/page.js`)
Página principal del portal con el branding de Sismode.

#### [NEW] `components/FileUpload.js`
Componente para arrastrar y soltar (Drag & Drop) múltiples archivos `.ai`.

#### [NEW] `components/ValidationResults.js`
Panel de resultados mostrando el "check" verde de aceptado o el "error" rojo con los motivos legibles para el cliente.

#### [NEW] `components/ContactAdvisor.js`
Formulario/modal para enviar un mensaje directo al asesor.

#### [NEW] `pages/api/upload.js` (o `app/api/upload/route.js`)
Backend local que reciba los archivos, ejecute validaciones en el archivo `.ai` y responda con los errores o éxito.

### Fase 2: Integración con la Nube (SharePoint o Odoo)
El objetivo es reemplazar el guardado temporal del archivo por un envío directo al sistema corporativo.

#### 1. Preparación de Backend y Credenciales
- Instalación de librerías correspondientes (ej. `@microsoft/microsoft-graph-client` y `@azure/msal-node` para SharePoint, o un cliente `xmlrpc` para Odoo).
- Configuración de variables de entorno `.env.local` para los secretos de API.

#### 2. Actualización de `app/api/upload/route.js`
- [MODIFY] `app/api/upload/route.js`: Modificar la función que simula el procesamiento para que, si el archivo pasa las validaciones, inicie la transferencia por API a la nube.
- Creación de lógica para crear carpetas dinámicamente basadas en los metadatos del formulario (Orden de Venta).

#### 3. Confirmación al Cliente
- El portal frontend mostrará el "Check verde" no solo cuando esté validado, sino cuando el archivo haya sido transferido exitosamente al sistema interno.

## Plan de Verificación

### Verificación Manual
- Ejecutar el servidor de desarrollo (`npm run dev`).
- Probar el flujo completo subiendo uno o varios archivos `.ai` (o simulados).
- Verificar que el formulario capture la Orden de Venta / Cliente.
- Comprobar que los mensajes de error/éxito se vean modernos y legibles.
- Interactuar con el botón de "Contactar Asesor".

---

# [NUEVO] Fase 3: Refinamiento UX y Asignación de Asesores

## Acta del Consejo Directivo (Consenso Estratégico)

A raíz de los últimos comentarios, se convocó a un consejo multidisciplinario para evaluar las modificaciones solicitadas bajo principios empresariales y administrativos:

1. **Dirección de Operaciones y Ventas (Sobre la Orden de Venta):** 
   - *Postura:* Hacer obligatoria la Orden de Venta genera "fricción". Muchos clientes envían artes antes de que la orden sea procesada formalmente en el sistema ERP.
   - *Consenso:* **Reducir la fricción.** La Orden de Venta será **Opcional**. Sin embargo, a nivel de diseño, se colocará una etiqueta visual (ej. *"Sugerido para mayor rapidez"*) para incentivar al cliente a colocarla si la tiene.

2. **Dirección de Experiencia de Usuario (UX/UI) (Sobre las Alertas):**
   - *Postura:* Las alertas nativas del navegador (`alert()`) son disruptivas, parecen mensajes de error del sistema operativo y no transmiten una imagen corporativa *Premium*.
   - *Consenso:* **Alertas integradas al DOM.** Se eliminarán las alertas del navegador. Si el usuario intenta enviar y falta el "Nombre del Cliente", el botón de envío mostrará una micro-animación de error (un *shake*) y un texto rojo estilizado aparecerá debajo del campo faltante.

3. **Dirección Comercial y RRHH (Sobre los Asesores):**
   - *Postura:* Tenemos múltiples asesores. Si un cliente pide ayuda desde el portal, el requerimiento no puede ir a un "buzón ciego", debe dirigirse a la persona que maneja esa cuenta.
   - *Consenso:* **Selector de Asignación en el Modal.** En el modal de "Contactar Asesor", se agregará un menú desplegable (Dropdown) con estilo moderno donde el cliente seleccione a su asesor asignado de una lista de nombres. A futuro, este dropdown permitirá enrutar el email/notificación directamente al correo de ese asesor específico.

## User Review Required

Revisa el consenso del Consejo Directivo. Si estás de acuerdo con la estrategia propuesta, autoriza la ejecución de los siguientes cambios:

### Cambios Propuestos para la Fase 3

#### [MODIFY] `portal/app/page.js`
- **Formulario:** Eliminar el atributo `required` del campo "Referencia/Orden de Venta" y añadir un texto secundario que diga *"Opcional, pero sugerido"*.
- **Validación del Botón:** Actualizar el estado `disabled` del botón "Revisar Archivos" para que se active siempre que haya al menos un archivo y el "Nombre del Cliente".
- **Alertas UX:** Reemplazar el `alert()` por un estado en React (ej. `[errorMessage, setErrorMessage]`) que renderice un componente visual de error estilizado dentro de la tarjeta del formulario si el usuario intenta enviarlo sin llenar el Cliente.
- **Modal de Contacto:** Añadir un elemento `<select>` o un Dropdown personalizado dentro del modal de contacto para elegir el "Asesor Asignado" (Ej. "María Pérez", "Carlos G.", etc.).

#### [MODIFY] `portal/lib/sharepoint.js` (Opcional por ahora)
- Dado que la Orden de Venta es opcional, modificar la creación de carpetas para que si el cliente no pone orden, el archivo se guarde en la carpeta raíz del `[Cliente]`, o en una subcarpeta llamada `[Sin Orden]`.

## Open Questions

> [!IMPORTANT]
> **Preguntas para el CEO (Tú)**
> 1. **Lista de Asesores:** ¿Podrías darme 2 o 3 nombres de asesores para ponerlos de ejemplo en el menú desplegable del contacto?
> 2. **Carpetas sin Orden:** Si un cliente sube un archivo pero NO pone Orden de Venta, ¿quieres que se guarde directo en la carpeta de su nombre, o que se cree una subcarpeta llamada "Sin Orden"?
