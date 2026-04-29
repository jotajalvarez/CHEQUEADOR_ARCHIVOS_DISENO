export default function ValidationResults({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Resultados de la Revisión</h3>
      {results.map((result, index) => (
        <div 
          key={index} 
          className={`result-card animate-fade-in ${result.isValid ? 'result-success' : 'result-error'}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="result-icon">
            {result.isValid ? '✅' : '❌'}
          </div>
          <div className="result-content">
            <h4>{result.filename}</h4>
            {result.isValid ? (
              <p style={{ color: 'var(--success-color)' }}>El archivo cumple con todos los requisitos para pre-prensa.</p>
            ) : (
              <div>
                <p style={{ color: 'var(--error-color)', fontWeight: 'bold' }}>Se encontraron los siguientes problemas:</p>
                <ul>
                  {result.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Por favor, corrija estos errores en su diseño y vuelva a subir el archivo.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
