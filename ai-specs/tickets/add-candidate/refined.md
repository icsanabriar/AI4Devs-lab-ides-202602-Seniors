# Historia de usuario refinada: Añadir candidato al sistema

## Historia refinada

**Como** reclutador, **quiero** registrar un nuevo candidato en el sistema ATS con sus datos y, opcionalmente, su CV **para** poder gestionar su información y sus procesos de selección de forma eficiente.

---

## Criterios de aceptación

Cada criterio es verificable de forma independiente.

### 1. Acceso a la función

- **Dado** que estoy en el dashboard del reclutador  
- **Cuando** visualizo la página principal  
- **Entonces** veo un botón o enlace claramente visible para añadir un nuevo candidato  

### 2. Formulario de datos

- **Dado** que he elegido la opción de añadir candidato  
- **Cuando** se muestra el formulario  
- **Entonces** aparecen los campos para capturar: nombre, apellido, correo electrónico, teléfono, dirección, educación y experiencia laboral, y los campos obligatorios están indicados  

### 3. Validación de datos

- **Dado** que estoy en el formulario de añadir candidato  
- **Cuando** envío el formulario con campos obligatorios vacíos o con correo electrónico en formato inválido  
- **Entonces** se muestran mensajes de error junto a los campos afectados y el formulario no se envía  

- **Dado** que he completado todos los campos obligatorios con datos válidos (incluido un correo con formato válido)  
- **Cuando** envío el formulario  
- **Entonces** la petición se envía al servidor  

### 4. Carga de documentos (CV)

- **Dado** que estoy en el formulario de añadir candidato  
- **Cuando** selecciono la opción de adjuntar un archivo  
- **Entonces** puedo subir un archivo en formato PDF o DOCX y, al seleccionarlo, el archivo queda asociado al candidato (o se muestra como adjunto) hasta el envío  

### 5. Confirmación de éxito

- **Dado** que he enviado el formulario con datos válidos  
- **Cuando** el servidor procesa correctamente la solicitud  
- **Entonces** se muestra un mensaje de confirmación indicando que el candidato ha sido añadido al sistema con éxito  

### 6. Manejo de errores

- **Dado** que estoy en el flujo de añadir candidato  
- **Cuando** el servidor devuelve un error (por ejemplo, fallo de conexión o error del servidor)  
- **Entonces** se muestra un mensaje claro al usuario informando del problema, sin exponer detalles técnicos sensibles  

### 7. Accesibilidad y compatibilidad

- La entrada para añadir candidato (botón o enlace) y el formulario son utilizables en navegadores web habituales en escritorio y móvil.  
- El formulario permite navegación por teclado y los campos tienen etiquetas asociadas (accesibilidad básica).  

---

## Notas de refinamiento

- **Formato:** La historia se ajustó al formato estándar (Como / quiero / para) con rol claro (reclutador), acción verificable (registrar candidato con datos y CV opcional) y beneficio explícito.  
- **Criterios:** Los criterios originales se reescribieron en formato Dado/Cuando/Entonces para que sean comprobables y centrados en el comportamiento observable, no en la implementación.  
- **Alcance:** Se mantuvo una sola capacidad por historia (añadir candidato); las “tareas técnicas” y el requisito de “interfaz intuitiva” corresponden a la implementación y a la definición de hecho del equipo.  
- **Posible división:** Si el equipo considera la historia demasiado grande para una iteración, se puede dividir en: (1) Añadir candidato con datos básicos y validación, sin carga de CV; (2) Carga de CV para candidatos.  
- **Evolución:** La autocompletado de educación y experiencia a partir de datos existentes en el sistema puede tratarse como una historia o mejora posterior.  
