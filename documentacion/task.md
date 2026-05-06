# Lista de Tareas: Fase 4 (Jerarquía y Múltiples Archivos)

- [x] Modificar `portal/app/api/upload/route.js`:
  - [x] Eliminar validación aleatoria (`Math.random()`) de la simulación.
  - [x] Validar que un archivo solo falle si contiene la palabra "error".
- [x] Modificar `portal/lib/sharepoint.js`:
  - [x] Modificar `uploadToSharepoint` para que cree una carpeta raíz `"Portal de Diseno"`.
  - [x] Ubicar la carpeta del cliente dentro de `"Portal de Diseno"`.
  - [x] Modificar `logFailedValidation` de la misma manera para mantener consistencia.
- [x] Compilar y validar el backend local.
