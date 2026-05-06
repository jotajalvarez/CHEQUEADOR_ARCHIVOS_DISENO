# Lista de Tareas: Fase 3 (Refinamiento UX y Asignación de Asesores)

- [ ] Modificar `portal/app/page.js`:
  - [ ] Quitar la propiedad `required` del input de "Orden de Venta / Proyecto".
  - [ ] Añadir etiqueta de "Opcional, pero sugerido para mayor rapidez".
  - [ ] Actualizar la condición de `disabled` del botón "Revisar Archivos" para no requerir la Orden de Venta.
  - [ ] Implementar un estado `errorMessage` para reemplazar las alertas del navegador por alertas integradas en el DOM y darle estilo de UX/UI moderno.
  - [ ] En el Modal de Contacto, agregar un dropdown o elemento `<select>` con la lista de los 14 asesores comerciales.
- [ ] Modificar `portal/lib/sharepoint.js`:
  - [ ] Actualizar la lógica para que, si no se envía la Orden de Venta, se asigne automáticamente el valor `"Sin Orden"` a la subcarpeta.
- [x] Ejecutar compilación de Next.js para validar sintaxis.
