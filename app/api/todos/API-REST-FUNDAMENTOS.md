# 🏗️ Construcción de Endpoints en Next.js

En el **App Router**, las APIs se definen mediante archivos `route.ts`. A diferencia de los componentes visuales, estos devuelven datos (JSON) en lugar de HTML.

## 🔑 Conceptos Clave en el Código

1. **Paginación (`take` y `skip`)**:

* `take`: Cuántos registros traer.
* `skip`: Cuántos registros saltar (útil para pasar a la página 2, 3, etc.).

1. **Validación con Yup**: Antes de tocar la base de datos, verificamos que el "cuerpo" (body) del mensaje traiga la información correcta. Esto evita que la base de datos falle por datos mal formados.
2. **Rutas Dinámicas `[id]**`: Al poner la carpeta entre corchetes, Next.js captura ese valor de la URL (ej: `/api/todos/123`) y nos lo entrega en un objeto llamado `params`.
3. **Métodos HTTP**:

* `GET`: Obtener.
* `POST`: Crear.
* `PUT`: Actualizar.
* `DELETE`: Borrar.
