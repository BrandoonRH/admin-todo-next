# Resumen de Prisma CLI Reference

## Comandos Básicos

### `version` (-v)

Muestra información sobre la versión de Prisma, plataforma y binarios del motor.

**Opciones:**

- `--json`: Salida en formato JSON

**Ejemplo:**

```bash
prisma version
```

---

### `init`

Inicializa un nuevo proyecto de Prisma en el directorio actual. Crea una carpeta `prisma` con un archivo básico `schema.prisma`.

**Argumentos principales:**

- `--datasource-provider`: Especifica el proveedor de base de datos (`postgresql`, `mysql`, `sqlite`, `mongodb`, `sqlserver`, `cockroachdb`)
- `--db`: Atajo para crear una instancia de Prisma Postgres
- `--url`: Define una URL personalizada de base de datos
- `--with-model`: Agrega un modelo `User` de ejemplo
- `--preview-feature`: Habilita funcionalidades en preview

**Ejemplo:**

```bash
prisma init --datasource-provider postgresql
```

**Archivos generados:**

- `prisma/schema.prisma`: Schema de base de datos
- `prisma.config.ts`: Configuración TypeScript
- `.env`: Variables de entorno
- `.gitignore`: Exclusiones para git

---

### `generate`

Genera assets como Prisma Client basándose en el schema definido.

**Opciones:**

- `--no-engine`: Genera el cliente sin motor (para Prisma Accelerate)
- `--watch`: Observa cambios en el schema y regenera automáticamente
- `--generator`: Especifica qué generador usar

**Ejemplo:**

```bash
prisma generate
```

---

### `validate`

Valida la sintaxis del archivo schema.prisma.

**Ejemplo:**

```bash
prisma validate
```

---

### `format`

Formatea y valida el archivo schema.prisma.

**Opciones:**

- `--check`: Verifica si hay archivos sin formatear (útil en CI)

**Ejemplo:**

```bash
prisma format
```

---

### `debug`

Imprime información para debugging y reportes de bugs (desde v5.6.0).

**Ejemplo:**

```bash
prisma debug
```

---

## Comandos de Base de Datos (`db`)

### `db pull`

Introspección de base de datos: conecta a tu BD y genera modelos de Prisma reflejando el schema actual.

**⚠️ Advertencia:** Sobrescribe el schema.prisma actual.

**Opciones:**

- `--force`: Fuerza sobrescritura de cambios manuales
- `--print`: Muestra el schema en pantalla sin escribirlo

**Ejemplo:**

```bash
prisma db pull
```

---

### `db push`

Envía el estado del schema de Prisma a la base de datos sin usar migraciones. Ideal para prototipado.

**Opciones:**

- `--force-reset`: Reinicia la BD antes de actualizar
- `--accept-data-loss`: Ignora advertencias de pérdida de datos

**Ejemplo:**

```bash
prisma db push
```

---

### `db seed`

Ejecuta scripts de semillas (seeding) para poblar la base de datos.

**Ejemplo:**

```bash
prisma db seed
```

---

### `db execute`

Ejecuta un script SQL directamente en la base de datos sin interactuar con la tabla de migraciones.

**Opciones:**

- `--file`: Ruta al archivo SQL
- `--stdin`: Usa entrada estándar
- `--config`: Ruta personalizada al archivo de configuración

**Ejemplo:**

```bash
prisma db execute --file ./script.sql
```

---

## Comandos de Migraciones (`migrate`)

**⚠️ No soportado en MongoDB** - usar `db push` en su lugar.

### `migrate dev`

**Solo para desarrollo** - Requiere shadow database.

Acciones:

1. Re-ejecuta historial de migraciones en shadow database
2. Aplica migraciones pendientes
3. Genera nueva migración de cambios en el schema
4. Aplica migraciones a la BD de desarrollo

**Opciones:**

- `--create-only`: Crea migración sin aplicarla
- `--name` / `-n`: Nombra la migración

**Ejemplo:**

```bash
prisma migrate dev --name add_user_table
```

---

### `migrate deploy`

Aplica todas las migraciones pendientes. Usado principalmente en producción.

**Características:**

- No detecta drift en BD
- No resetea la BD
- No requiere shadow database

**Ejemplo:**

```bash
prisma migrate deploy
```

---

### `migrate reset`

**Solo para desarrollo**

Acciones:

1. Elimina la base de datos
2. Crea nueva BD con el mismo nombre
3. Aplica todas las migraciones
4. Ejecuta scripts de seed

**Opciones:**

- `--force`: Omite confirmación
- `--skip-generate`: No genera Prisma Client
- `--skip-seed`: No ejecuta seeds

**Ejemplo:**

```bash
prisma migrate reset
```

**Protección IA:** Prisma detecta cuando es ejecutado por agentes de IA (Claude Code, Cursor, etc.) y bloquea comandos destructivos sin consentimiento explícito del usuario.

---

### `migrate status`

Muestra el estado de las migraciones comparando archivos locales con la tabla `_prisma_migrations`.

**Ejemplo:**

```bash
prisma migrate status
```

---

### `migrate resolve`

Resuelve problemas en el historial de migraciones marcando una migración fallida como aplicada o revertida.

**Argumentos:**

- `--applied`: Marca migración como aplicada
- `--rolled-back`: Marca migración como revertida

**Ejemplo:**

```bash
prisma migrate resolve --applied 20201231000000_add_users
```

---

### `migrate diff`

Compara dos fuentes de schema de BD y genera un script de migración.

**Opciones de origen (`--from-...`):**

- `--from-empty`: Schema vacío
- `--from-schema`: Archivo schema.prisma
- `--from-migrations`: Directorio de migraciones
- `--from-config-datasource`: Datasource del config

**Opciones de destino (`--to-...`):**

- `--to-empty`
- `--to-schema`
- `--to-migrations`
- `--to-config-datasource`

**Otras opciones:**

- `--script`: Genera script SQL ejecutable
- `--exit-code`: Cambia comportamiento del código de salida

**Ejemplo:**

```bash
prisma migrate diff \
  --from-config-datasource \
  --to-schema=schema.prisma \
  --script
```

---

## Comando de Desarrollo Local

### `dev`

Inicia una base de datos local de Prisma Postgres para desarrollo y testing.

**Argumentos:**

- `--name` / `-n`: Nombre de la instancia (default: `default`)
- `--port` / `-p`: Puerto HTTP (default: `51213`)
- `--db-port` / `-P`: Puerto de BD (default: `51214`)
- `--detach` / `-d`: Ejecutar en segundo plano

**Subcomandos:**

- `dev start <glob>`: Inicia instancias existentes
- `dev ls`: Lista todas las instancias
- `dev stop <glob>`: Detiene instancias
- `dev rm <glob>`: Elimina datos de instancias

**Ejemplo:**

```bash
prisma dev
prisma dev start mydb*
prisma dev ls
prisma dev stop mydb
```

---

## Studio

### `studio`

Inicia Prisma Studio, una interfaz web para visualizar y editar datos.

**Opciones:**

- `-p` / `--port`: Puerto (default: 5555)
- `-b` / `--browser`: Navegador a usar
- `--config`: Ruta al archivo de configuración
- `--url`: URL de conexión directa a BD

**Ejemplo:**

```bash
prisma studio
prisma studio --port 7777 --browser firefox
```

**Bases de datos soportadas:** PostgreSQL, MySQL, SQLite

---

## Prisma Data Platform

### `platform`

Gestiona recursos en Prisma Data Platform (Early Access desde v5.10.0).

**Categorías de comandos:**

- **Auth:** `login`, `logout`, `show`
- **Workspace:** `show`
- **Project:** `show`, `create`, `delete`
- **Environment:** `show`, `create`, `delete`
- **API Key:** `show`, `create`, `delete`
- **Accelerate:** `enable`, `disable`

**Ejemplo:**

```bash
prisma platform auth login
prisma platform project create
```

---

### `mcp`

Inicia el servidor MCP de Prisma para integración con herramientas.

---

## Utilidad Externa

### `npx create-db`

Provisiona una base de datos temporal de Prisma Postgres.

**Variantes:**

- `npx create-db@latest`
- `npx create-pg@latest`
- `npx create-postgres@latest`

**Características:**

- Disponible por 24 horas
- Se puede reclamar gratuitamente para hacerla permanente

**Ejemplo:**

```bash
npx create-db@latest
```

---

## Proxy HTTP

Prisma CLI soporta proxies HTTP mediante variables de entorno:

- `HTTP_PROXY` / `http_proxy`: Para tráfico HTTP
- `HTTPS_PROXY` / `https_proxy`: Para tráfico HTTPS

**Ejemplo:**

```bash
export HTTP_PROXY=http://localhost:8080
```

---

## Notas Importantes

1. **Prisma 7 Breaking Changes:**
   - `migrate dev` ya no ejecuta `prisma generate` automáticamente
   - Opciones `--from-url`, `--to-url` eliminadas (usar `--from-config-datasource`)
   - `--skip-generate` y `--skip-seed` eliminados

2. **MongoDB:** Muchos comandos de migración no están soportados. Usar `db push` en su lugar.

3. **Argumentos comunes:**
   - `--schema`: Ruta personalizada al schema.prisma
   - `--help` / `-h`: Muestra ayuda

4. **Seguridad:** Prisma incluye protecciones contra comandos destructivos ejecutados por agentes de IA.
