require('dotenv').config({ path: '.env.local' });
const { ConfidentialClientApplication } = require('@azure/msal-node');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

async function testSharePointConnection() {
  console.log("Probando conexión con las variables en .env.local...\n");

  const tenantId = process.env.SHAREPOINT_TENANT_ID;
  const clientId = process.env.SHAREPOINT_CLIENT_ID;
  const clientSecret = process.env.SHAREPOINT_CLIENT_SECRET;
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const driveId = process.env.SHAREPOINT_DRIVE_ID;

  if (!tenantId || !clientId || !clientSecret) {
    console.error("❌ Faltan credenciales (TENANT_ID, CLIENT_ID, o CLIENT_SECRET).");
    return;
  }

  const msalConfig = {
    auth: {
      clientId: clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret: clientSecret,
    }
  };

  const msalClient = new ConfidentialClientApplication(msalConfig);

  try {
    console.log("1. Autenticando con Microsoft Azure AD...");
    const response = await msalClient.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });
    console.log("✅ Autenticación exitosa. Token obtenido.\n");

    const client = Client.init({
      authProvider: (done) => {
        done(null, response.accessToken);
      },
    });

    if (siteId) {
       console.log("2. Buscando Sitio de SharePoint...");
       const site = await client.api(`/sites/${siteId}`).get();
       console.log(`✅ Sitio encontrado: ${site.displayName}`);
    } else {
       console.log("⚠️ SITE_ID no configurado. Buscando sitios disponibles en tu organización...");
       try {
           const sites = await client.api('/sites?search=').get();
           if (sites.value && sites.value.length > 0) {
               console.log("👉 Sitios Encontrados (Copia el 'id' del sitio que quieres usar en tu .env.local):");
               sites.value.forEach((s, i) => {
                   // Graph devuelve ids largos tipo: "dominio.sharepoint.com,guid1,guid2"
                   console.log(`  [${i+1}] Nombre: ${s.displayName}`);
                   console.log(`      ID: ${s.id}`);
                   console.log(`      URL: ${s.webUrl}\n`);
               });
           } else {
               console.log("  No se encontraron sitios. Asegúrate de tener permisos Sites.Read.All o de buscar con un término.");
           }
       } catch(err) {
           console.log("  Error al buscar sitios. Asegúrate de haber otorgado Sites.Read.All o Sites.ReadWrite.All", err.message);
       }
    }

    if (driveId) {
        console.log("\n3. Buscando Librería de Documentos (Drive)...");
        const drive = await client.api(`/drives/${driveId}`).get();
        console.log(`✅ Librería encontrada: ${drive.name} (${drive.driveType})`);
    } else if (siteId) {
        console.log("\n⚠️ DRIVE_ID no configurado. Buscando librerías de documentos en el sitio...");
        try {
            const drives = await client.api(`/sites/${siteId}/drives`).get();
            if (drives.value && drives.value.length > 0) {
                console.log("👉 Librerías Encontradas (Copia el 'id' en SHAREPOINT_DRIVE_ID en tu .env.local):");
                drives.value.forEach((d, i) => {
                    console.log(`  [${i+1}] Nombre: ${d.name}`);
                    console.log(`      ID: ${d.id}\n`);
                });
            } else {
                console.log("  No se encontraron librerías en este sitio.");
            }
        } catch(err) {
             console.log("  Error al buscar librerías.", err.message);
        }
    } else {
        console.log("\n⚠️ No podemos buscar librerías de documentos (DRIVE_ID) porque no has definido un SITE_ID.");
    }

    console.log("\n🚀 Las pruebas terminaron. Si te faltan IDs, revisa la lista arriba y cópialos a tu .env.local.");

  } catch (error) {
    console.error("\n❌ Error en la conexión:");
    if (error.statusCode) {
        console.error(`Status Code: ${error.statusCode}`);
        console.error(`Message: ${error.message}`);
    } else {
        console.error(error);
    }
  }
}

testSharePointConnection();
