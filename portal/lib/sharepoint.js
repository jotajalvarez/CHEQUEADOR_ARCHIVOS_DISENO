import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

// The MSAL Node library is not strictly required if we use Client Credentials flow manually or use @azure/identity.
// But since we installed msal-node, we can use it to get the token.
import { ConfidentialClientApplication } from "@azure/msal-node";

const tenantId = process.env.SHAREPOINT_TENANT_ID;
const clientId = process.env.SHAREPOINT_CLIENT_ID;
const clientSecret = process.env.SHAREPOINT_CLIENT_SECRET;
const siteId = process.env.SHAREPOINT_SITE_ID; // The ID of the SharePoint site
const driveId = process.env.SHAREPOINT_DRIVE_ID; // The ID of the Document Library (Drive)

const msalConfig = {
  auth: {
    clientId: clientId || "MISSING_CLIENT_ID",
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret: clientSecret || "MISSING_CLIENT_SECRET",
  }
};

let msalClient = null;

if (clientId && tenantId && clientSecret) {
    msalClient = new ConfidentialClientApplication(msalConfig);
}

async function getGraphClient() {
  if (!msalClient) {
    throw new Error("SharePoint credentials are not configured in environment variables.");
  }

  const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  const response = await msalClient.acquireTokenByClientCredential(tokenRequest);

  return Client.init({
    authProvider: (done) => {
      done(null, response.accessToken);
    },
  });
}

/**
 * Ensures a folder exists at the specified path. Returns the folder ID.
 */
async function ensureFolder(client, parentPath, folderName) {
  try {
    // Try to get the folder
    const folderPath = parentPath === "root" ? folderName : `${parentPath}/${folderName}`;
    const response = await client.api(`/drives/${driveId}/root:/${folderPath}`).get();
    return { id: response.id, path: folderPath };
  } catch (error) {
    if (error.statusCode === 404) {
      // Folder doesn't exist, create it
      const parentEndpoint = parentPath === "root" 
        ? `/drives/${driveId}/root/children`
        : `/drives/${driveId}/root:/${parentPath}:/children`;
        
      const response = await client.api(parentEndpoint).post({
        name: folderName,
        folder: {},
        "@microsoft.graph.conflictBehavior": "rename"
      });
      return { id: response.id, path: parentPath === "root" ? folderName : `${parentPath}/${folderName}` };
    }
    throw error;
  }
}

/**
 * Uploads a file to a specific path in SharePoint
 */
export async function uploadToSharepoint(fileBuffer, fileName, clientName, orderReference) {
  try {
    if (!driveId) {
      console.warn("SHAREPOINT_DRIVE_ID is not set. Skipping actual upload, but returning success for testing.");
      return true;
    }

    const client = await getGraphClient();
    
    // 1. Ensure Client Folder exists
    const sanitizedClient = clientName.replace(/[^a-zA-Z0-9-_\s]/g, '').trim() || "Cliente Desconocido";
    const clientFolder = await ensureFolder(client, "root", sanitizedClient);
    
    // 2. Ensure Order Folder exists inside Client Folder
    const cleanOrder = orderReference ? orderReference.replace(/[^a-zA-Z0-9-_\s]/g, '').trim() : "";
    const sanitizedOrder = cleanOrder || "Sin Orden";
    const orderFolder = await ensureFolder(client, clientFolder.path, sanitizedOrder);
    
    // 3. Upload File
    const filePath = `${orderFolder.path}/${fileName}`;
    
    // For large files ( > 4MB), we should use createUploadSession, but for now we use simple PUT
    await client.api(`/drives/${driveId}/root:/${filePath}:/content`)
      .put(fileBuffer);
      
    return true;
  } catch (error) {
    console.error("Error uploading to SharePoint:", error);
    throw error;
  }
}

/**
 * Uploads a log file to the folder when validation fails
 */
export async function logFailedValidation(fileName, clientName, orderReference, errors) {
    try {
        if (!driveId) {
            console.warn("SHAREPOINT_DRIVE_ID is not set. Skipping log creation.");
            return true;
        }

        const client = await getGraphClient();
        const sanitizedClient = clientName.replace(/[^a-zA-Z0-9-_\s]/g, '').trim() || "Cliente Desconocido";
        const clientFolder = await ensureFolder(client, "root", sanitizedClient);
        
        const cleanOrder = orderReference ? orderReference.replace(/[^a-zA-Z0-9-_\s]/g, '').trim() : "";
        const sanitizedOrder = cleanOrder || "Sin Orden";
        const orderFolder = await ensureFolder(client, clientFolder.path, sanitizedOrder);

        const logFileName = `RECHAZADO_${fileName}_log.txt`;
        const filePath = `${orderFolder.path}/${logFileName}`;
        
        const timestamp = new Date().toISOString();
        const logContent = `LOG DE VALIDACION FALLIDA\n-----------------------\nArchivo: ${fileName}\nFecha: ${timestamp}\nErrores Encontrados:\n${errors.map(e => "- " + e).join("\n")}\n\nNota: El archivo físico no fue guardado.\n`;
        const buffer = Buffer.from(logContent, 'utf-8');

        await client.api(`/drives/${driveId}/root:/${filePath}:/content`)
            .put(buffer);

        return true;
    } catch (error) {
        console.error("Error creating log in SharePoint:", error);
        throw error;
    }
}
