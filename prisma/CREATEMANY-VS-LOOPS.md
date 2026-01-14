
# ⚡ Optimización de Inserts: `createMany`

Cuando llenamos nuestra base de datos (Seeding) o hacemos cargas masivas, tenemos dos caminos principales en Prisma:

## 1. El bucle `for...of` con `create`

* **Cómo funciona**: Envía una petición a la base de datos por cada elemento del arreglo.
* **Cuándo usarlo**: Cuando necesitas obtener el `ID` generado de cada registro inmediatamente para usarlo en otra relación o si tu base de datos no soporta inserciones masivas.
* **Problema**: Es lento si tienes cientos o miles de registros.

### 2. El método `createMany` (Recomendado)

* **Cómo funciona**: Agrupa todos los objetos y realiza **una sola transacción SQL**.
* **Ventajas**:
* **Velocidad**: Mucho más rápido (hasta 10x o más).
* **Menos estrés**: Menos conexiones abiertas simultáneamente.
* **Atómico**: Si uno falla (dependiendo de la configuración), puedes manejar el fallo de todo el grupo.

* **Propiedad `skipDuplicates**`: Si la activas, Prisma ignorará los registros que causen un error de "llave duplicada" (como un email que ya existe), permitiendo que el resto se inserte.

---

**Tip de Next.js:** Recuerda que al usar `deleteMany()` al inicio de tu `main`, estás dejando la base de datos limpia antes de insertar. Esto es excelente para ambiente de **desarrollo**, pero ¡ten mucho cuidado de no ejecutar este seed en **producción** si no quieres borrar los datos reales de tus usuarios!
