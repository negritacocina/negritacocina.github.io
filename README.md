# Negrita Cocina - Documentación de Uso y Carga de Datos

## Descripción

Este proyecto es una web para mostrar el menú de Negrita Cocina y permitir a los usuarios armar su pedido de forma visual y enviarlo por WhatsApp. Los platos se cargan dinámicamente desde una hoja de Google Sheets.

---

## Uso de la Web

1. **Visualización de platos:**
   - Los platos se muestran en tarjetas con imagen, nombre, descripción y precio.
   - Puedes sumar/restar cantidad y agregar al pedido.
2. **Ver pedido:**
   - Haz clic en "Ver pedido" para abrir el modal con tu carrito.
   - Puedes modificar cantidades, eliminar platos y guardar cambios.
3. **Enviar pedido:**
   - Haz clic en "Hacer pedido" para enviar el resumen por WhatsApp.
4. **Alertas:**
   - El sistema muestra notificaciones visuales para acciones importantes.

---

## Carga de Datos en Google Sheets

La web obtiene los datos de los platos desde una hoja de Google Sheets pública. Cada fila representa un plato.

### Estructura de la hoja

| Columna | Descripción                       | Ejemplo                                  |
|---------|-----------------------------------|-------------------------------------------|
| A       | URL de la imagen                  | https://imgur.com/abc123.jpg              |
| B       | Nombre del plato                  | Milanesa                                 |
| C       | Descripción                       | Milanesa de carne con papas               |
| D       | Precio                            | 1200                                     |
| E       | Público ("si" para mostrar)       | si                                       |

- **Solo los platos con "si" en la columna E se mostrarán en la web.**
- La URL de la imagen puede ser de Imgur, Dropbox, GitHub Pages, etc. Si usas Google Drive, debe ser pública y el sistema la convierte automáticamente.
Recomendamos Imgur: https://imgur.com/
Es gratuito, podés copiar el link una vez subida la imagen y pegarla en el Excel

### Recomendaciones para imágenes
- Usa enlaces directos a imágenes (JPG, PNG, WEBP).
<!-- - Si usas Google Drive, pon el enlace tipo `https://drive.google.com/file/d/ID/view?usp=sharing` y el sistema lo convertirá. -->
- Verifica que la imagen sea pública.

---

## Cómo actualizar el menú

1. Abre la hoja de Google Sheets vinculada.
2. Agrega, edita o elimina filas según los platos que quieras mostrar.
3. Pon "si" en la columna E para mostrar el plato.
4. Guarda los cambios. La web se actualizará automáticamente.

---

## Seguridad y buenas prácticas
- No compartas la hoja con permisos de edición a usuarios desconocidos.
- Restringe la API key de Google solo a "Google Sheets API" y a tu dominio.
- No pongas datos sensibles en la hoja.

---

## Contacto y soporte

Si tienes dudas sobre la carga de datos, imágenes o el funcionamiento de la web, contacta al desarrollador o revisa la documentación técnica del proyecto.

---

**¡Disfruta de Negrita Cocina y haz tu pedido fácilmente!**
