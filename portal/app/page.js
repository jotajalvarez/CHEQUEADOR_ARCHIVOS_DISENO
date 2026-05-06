'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ValidationResults from '@/components/ValidationResults';

const ASESORES = [
  "Gustavo Mena", "Gabriel Cabrera", "Maria Fernanda Castro", "Nestor Ramirez",
  "Marco Amores", "Fernando Villavicencio", "Valeria Rodriguez", "Jorge Cabello",
  "Gary Quilligana", "Juan Jose Herrero", "Gabriela Avila", "Daniela Avila",
  "Omar Rivera", "Renan Acosta"
];

export default function Home() {
  const [clientName, setClientName] = useState('');
  const [reference, setReference] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedAsesor, setSelectedAsesor] = useState('');

  const handleFilesSelected = (selectedFiles) => {
    // Only add files that aren't already added (based on name)
    const newFiles = selectedFiles.filter(
      (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
    );
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName || files.length === 0) {
      setErrorMessage("Por favor, ingrese el Nombre del Cliente y seleccione al menos un archivo.");
      return;
    }

    setIsSubmitting(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('clientName', clientName);
    formData.append('reference', reference);
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error al subir los archivos:", error);
      setErrorMessage("Ocurrió un error al procesar los archivos. Por favor, intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Subir Archivos de Diseño</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Sistema de revisión automática para asegurar la calidad de pre-prensa.
        </p>
      </div>

      <div className="card">
        {errorMessage && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #f87171', animation: 'shake 0.5s' }}>
            <strong>Error: </strong> {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" htmlFor="clientName">
                Nombre del Cliente
              </label>
              <input 
                id="clientName"
                type="text" 
                className="form-input" 
                placeholder="Ej: Sismode SA"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="reference">
                Orden de Venta / Proyecto
              </label>
              <input 
                id="reference"
                type="text" 
                className="form-input" 
                placeholder="Ej: ORD-2023-001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <small style={{ color: 'var(--text-light)', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                Opcional, pero sugerido para mayor rapidez.
              </small>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Archivos (.ai)
            </label>
            <FileUpload onFilesSelected={handleFilesSelected} />
            
            {files.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>Archivos seleccionados:</h4>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {files.map((file, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFile(index)}
                        style={{ background: 'none', border: 'none', color: 'var(--error-color)', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setShowContactModal(true)}
            >
              ✉️ Contactar a mi Asesor
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Revisar Archivos'}
            </button>
          </div>
        </form>
      </div>

      {results.length > 0 && (
        <ValidationResults results={results} />
      )}

      {/* Simple Contact Modal */}
      {showContactModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', margin: '0 1rem' }}>
            <h3>Contactar Asesor</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Envíe un mensaje a su asesor comercial para recibir ayuda con sus archivos.
            </p>
            <div className="form-group">
              <label className="form-label">Asesor Asignado</label>
              <select 
                className="form-input"
                value={selectedAsesor}
                onChange={(e) => setSelectedAsesor(e.target.value)}
              >
                <option value="" disabled>Seleccione a su Asesor</option>
                {ASESORES.map(asesor => (
                  <option key={asesor} value={asesor}>{asesor}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Mensaje</label>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Escriba su consulta aquí..."
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setShowContactModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => {
                if (!selectedAsesor) {
                  alert("Por favor, seleccione a su asesor.");
                  return;
                }
                alert(`Mensaje enviado a su asesor: ${selectedAsesor}.`);
                setShowContactModal(false);
              }}>Enviar Mensaje</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
