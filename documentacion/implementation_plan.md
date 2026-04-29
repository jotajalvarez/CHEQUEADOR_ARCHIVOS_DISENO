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
> El plan ha sido ajustado para incluir la funcionalidad completa en la primera versión y definir la integración con SharePoint/Odoo.

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

### Fase 2: Integración con SharePoint / Odoo Documents
- Definir la lógica en el backend para enviar el archivo al servicio en la nube corporativo en lugar de guardarlo localmente.

## Plan de Verificación

### Verificación Manual
- Ejecutar el servidor de desarrollo (`npm run dev`).
- Probar el flujo completo subiendo uno o varios archivos `.ai` (o simulados).
- Verificar que el formulario capture la Orden de Venta / Cliente.
- Comprobar que los mensajes de error/éxito se vean modernos y legibles.
- Interactuar con el botón de "Contactar Asesor".
