# Fase 2 Completada: Integración con SharePoint (Microsoft Graph)

Hemos completado el desarrollo de la Fase 2 en base a tus instrucciones. El portal web ahora tiene la lógica necesaria para comunicarse con Microsoft SharePoint, crear la estructura de carpetas `[Cliente]/[Orden de Venta]` y registrar logs si hay errores.

## ¿Qué se implementó?

1. **Nuevo Servicio de SharePoint (`lib/sharepoint.js`)**: 
   - Utiliza `@microsoft/microsoft-graph-client` y `@azure/msal-node`.
   - Se conecta a SharePoint vía la API Graph de Microsoft usando el flujo de *Client Credentials* (comunicación Servidor-a-Servidor sin intervención del usuario final).
   - Genera automáticamente las carpetas anidadas de Cliente y Orden.
   - Sube el archivo validado, o en caso de ser rechazado por la validación técnica, sube un archivo `RECHAZADO_[nombre]_log.txt` con los errores.

2. **Actualización de Interfaz (`app/page.js`)**:
   - Se agregó un nuevo campo obligatorio en el formulario: **"Nombre del Cliente"**.
   - Esto permite construir la estructura de carpetas requerida.

3. **Backend Actualizado (`app/api/upload/route.js`)**:
   - Una vez validado localmente el archivo `.ai`, el backend toma el *Buffer* del archivo y lo inyecta a la nube de manera segura.

## Lo que falta: Credenciales de Producción

El código actual es tolerante a fallos: si no encuentra credenciales configuradas, igual permite probar el flujo local sin crashear. Para que los archivos se envíen de verdad a SharePoint, necesitas configurar las siguientes variables de entorno:

### 1. Variables de Entorno Requeridas

Crea un archivo `.env.local` en la carpeta `portal` con la siguiente estructura:

```env
SHAREPOINT_TENANT_ID=tu-tenant-id-de-azure
SHAREPOINT_CLIENT_ID=tu-client-id-de-la-app-registrada
SHAREPOINT_CLIENT_SECRET=tu-secreto-generado
SHAREPOINT_SITE_ID=id-del-sitio-sharepoint
SHAREPOINT_DRIVE_ID=id-de-la-libreria-de-documentos
```

### 2. ¿Cómo obtener estos datos?
1. **App Registration (Azure AD)**: Entra a [portal.azure.com](https://portal.azure.com) y registra una nueva aplicación.
2. Anota el `Directory (tenant) ID` y el `Application (client) ID`.
3. Crea un `Client secret` (y copia el valor).
4. Dale permisos de API a la App: `Microsoft Graph > Application Permissions > Files.ReadWrite.All` y `Sites.ReadWrite.All`. ¡Recuerda dar "Admin Consent"!
5. Los IDs de Sitio y Drive (`SHAREPOINT_SITE_ID`, `SHAREPOINT_DRIVE_ID`) los puedes sacar haciendo un llamado a Graph Explorer o mediante PowerShell.

> [!TIP]
> **Prueba el flujo actual**
> Puedes correr `npm run dev` en la carpeta `portal` y verás la interfaz actualizada con el campo de Cliente y el formulario interactivo. El sistema intentará mandar a SharePoint pero como no hay llaves, lo omitirá graciosamente e igual mostrará éxito/error en la validación local.
