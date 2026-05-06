import { NextResponse } from 'next/server';
import { uploadToSharepoint, logFailedValidation } from '../../../lib/sharepoint';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const clientName = formData.get('clientName');
    const reference = formData.get('reference');
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron archivos en la solicitud.' },
        { status: 400 }
      );
    }

    const results = [];

    // Simulate processing for each file
    for (const file of files) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      
      let isValid = true;
      const errors = [];

      // Check file extension
      if (fileExtension !== 'ai' && fileExtension !== 'pdf') {
        isValid = false;
        errors.push(`El formato del archivo (.${fileExtension}) no es correcto. Solo se aceptan archivos .ai`);
      } else {
        // Here we simulate the internal checks of the .ai file
        // In a real application, we would use a Python script with PyPDF2 or similar,
        // or a Node.js library to parse the PDF compatibility stream of the .ai file
        
        // Let's create some deterministic mock logic based on file size or name
        // For demonstration, if the file name contains "error", we force an error
        if (fileName.toLowerCase().includes('error')) {
          isValid = false;
          errors.push('Faltan fuentes tipográficas: "Helvetica-Bold" y "Arial". Por favor, convierta los textos a contornos o adjunte las fuentes.');
          errors.push('El documento tiene el modo de color RGB. Por favor, cambie a CMYK para impresión.');
          errors.push('Hay imágenes sin incrustar (links rotos): "logo.png".');
        } else if (file.size < 50000) { // arbitrary size check for demo
          // Just another mock condition
          if (Math.random() > 0.5) {
             isValid = false;
             errors.push('El documento tiene el modo de color RGB. Por favor, cambie a CMYK para impresión.');
          }
        }
      }

      results.push({
        filename: fileName,
        isValid,
        errors
      });
      
      // Integración con SharePoint:
      try {
        if (isValid) {
          // Convert File to ArrayBuffer then to Buffer for the Graph API
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await uploadToSharepoint(buffer, fileName, clientName, reference);
        } else {
          // Si falló, guardamos solo un log
          await logFailedValidation(fileName, clientName, reference, errors);
        }
      } catch (spError) {
        console.error("Failed to sync with SharePoint:", spError);
        // We log it but don't stop the flow so the user still sees validation results
        errors.push("Nota: Falló la sincronización con SharePoint en la nube.");
      }
    }

    // Delay to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({ 
      message: 'Archivos procesados correctamente',
      reference,
      results 
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
