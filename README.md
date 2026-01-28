# 🚀 Proyecto 3: Dashboard Administrativo con Next.js 14+

## 📖 Descripción del Proyecto

Tercer proyecto del curso de Next.js con **Fernando Herrera**, enfocado en construir un dashboard administrativo completo con autenticación, manejo de estado, base de datos y API RESTful.

Este proyecto integra las características más modernas de Next.js 14+ y React 18+, incluyendo Server Components, Server Actions, y el nuevo App Router.

---

## 🎯 Objetivos del Proyecto

- ✅ Construir un **RESTful API** robusto con Next.js
- ✅ Implementar **autenticación completa** con múltiples proveedores
- ✅ Manejar estado del lado del servidor y cliente
- ✅ Gestionar **cookies** para carrito de compras y sesiones
- ✅ Trabajar con **base de datos PostgreSQL** usando Prisma ORM
- ✅ Aplicar **Server Actions** y optimistic updates
- ✅ Implementar **validación** tanto en servidor como en cliente

---

## 📚 Secciones del Curso Cubiertas

### 🔷 Sección 1: RESTful API con Next.js

**Objetivo:** Crear una API robusta para manejar operaciones CRUD.

#### Temas cubiertos

- **READ**: Consultas a la base de datos
- **Paginaciones**: Manejo eficiente de grandes datasets
- **UPDATE**: Actualización de recursos
- **POST**: Creación de nuevos recursos
- **SEED**: Población inicial de base de datos
- **Docker**: Contenedorización del entorno
- **PostgreSQL**: Base de datos relacional
- **Prisma ORM**: Manejo de modelos y migraciones
- **Yup**: Validación de schemas

**Tecnologías:**

```
Next.js API Routes
PostgreSQL
Prisma
Docker
Yup Validator
```

---

### 🔷 Sección 2: Consumo de API y Rendering

**Objetivo:** Implementar consumo de API con SSR y CSR.

#### Temas cubiertos

- **Consumo de RESTful API**: Fetch de datos desde componentes
- **Client Side Rendering (CSR)**: Renderizado en el navegador
- **Server Side Rendering (SSR)**: Renderizado en el servidor
- **Router Refresh**: Actualización sin perder estado (nueva feature)
- **Prisma Pull/Push**: Sincronización de modelos con BD

**Características nuevas de Next.js 13+:**

```typescript
// Refresh sin perder estado
router.refresh();

// Server Components (por defecto)
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

---

### 🔷 Sección 3: Server Actions y Optimistic Updates

**Objetivo:** Implementar comunicación cliente-servidor moderna sin API REST tradicional.

#### Temas cubiertos

- **Server Actions**: Nueva forma de ejecutar código del servidor
- **useOptimistic Hook**: Updates optimistas del UI
- **Mutations sin API REST**: Cambios directos desde componentes

**Antes vs Después:**

```typescript
// ❌ ANTES: API Route + fetch
async function updateTodo() {
  await fetch('/api/todos/123', {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

// ✅ AHORA: Server Action
'use server';
async function updateTodo(id: string, data: UpdateData) {
  await prisma.todo.update({
    where: { id },
    data
  });
}
```

**useOptimistic en acción:**

```typescript
const [optimisticTodos, addOptimisticTodo] = useOptimistic(
  todos,
  (state, newTodo) => [...state, newTodo]
);

// UI se actualiza ANTES de la respuesta del servidor
```

---

### 🔷 Sección 4: Cookies y Carrito de Compras

**Objetivo:** Manejar estado persistente con cookies del lado del servidor y cliente.

#### Temas cubiertos

- **Cookies del lado del servidor**: Lectura y escritura en Server Components
- **Cookies del lado del cliente**: Manejo con JavaScript
- **Carrito de compras**: Sistema completo con persistencia
- **Manipulación de cookies**: CRUD de cookies

**Implementación:**

```typescript
// Server Side
import { cookies } from 'next/headers';

const cookieStore = cookies();
const cart = cookieStore.get('cart')?.value;

// Client Side
import { setCookie, getCookie } from 'cookies-next';

setCookie('cart', JSON.stringify(cartData));
```

**Características del carrito:**

- ✅ Persistencia entre sesiones
- ✅ Incrementar/decrementar cantidades
- ✅ Eliminar productos
- ✅ Cálculo de totales con impuestos

---

### 🔷 Sección 5: Autenticación con Auth.js

**Objetivo:** Sistema de autenticación completo y seguro.

#### Temas cubiertos

**1. Auth.js (NextAuth.js v5)**

- Configuración inicial
- Estrategia JWT vs Database
- Callbacks personalizados

**2. Proveedores OAuth**

- **Google OAuth**: Login con cuenta de Google
- **GitHub OAuth**: Login con cuenta de GitHub
- Configuración de aplicaciones OAuth

**3. Credenciales Personalizadas**

- Sistema de email/password
- Auto-registro en primer login
- Validación de formularios

**4. Seguridad**

- **Encriptación de contraseñas** con bcrypt
- Hashing con salt aleatorio
- Protección contra timing attacks

**5. Base de Datos**

- Modelos de Prisma para auth
- Relaciones User → Account → Session
- Tokens de verificación

**6. Gestión de Sesiones**

- JWT tokens
- HTTP-only cookies
- Server y Client side session access

**7. Validación**

- Server-side validation
- Client-side validation
- Schema validation con Zod

**8. Personalización**

- Campos adicionales: `roles`, `isActive`
- Callbacks para extender user object
- Middleware para protección de rutas

---

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 14+**: Framework React con App Router
- **React 18+**: UI library con Server Components
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **React Icons**: Iconografía

### Backend

- **Next.js API Routes**: Endpoints RESTful
- **Server Actions**: Mutations del servidor
- **Auth.js (NextAuth)**: Autenticación
- **bcryptjs**: Encriptación de contraseñas

### Base de Datos

- **PostgreSQL**: Base de datos relacional
- **Prisma ORM**: Object-Relational Mapping
- **Docker**: Contenedor de PostgreSQL

### Validación

- **Yup**: Schema validation para API
- **Zod**: Type-safe validation

### Estado y Cookies

- **cookies-next**: Manejo de cookies
- **useOptimistic**: Optimistic UI updates

---

## 📁 Estructura del Proyecto

```
proyecto-3-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # Configuración NextAuth
│   │   ├── todos/
│   │   │   ├── route.ts              # GET, POST todos
│   │   │   └── [id]/
│   │   │       └── route.ts          # PATCH, DELETE todo
│   │   └── seed/
│   │       └── route.ts              # Seed de base de datos
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx              # Página de login
│   │   └── register/
│   │       └── page.tsx              # Página de registro
│   ├── dashboard/
│   │   ├── page.tsx                  # Dashboard principal
│   │   ├── todos/
│   │   │   └── page.tsx              # Lista de todos
│   │   ├── products/
│   │   │   └── page.tsx              # Catálogo de productos
│   │   └── cart/
│   │       └── page.tsx              # Carrito de compras
│   ├── layout.tsx                    # Layout principal
│   └── page.tsx                      # Home page
├── src/
│   ├── auth/
│   │   └── actions/
│   │       └── auth-actions.ts       # Server Actions de auth
│   ├── components/
│   │   ├── products/
│   │   │   └── ProductCard.tsx       # Tarjeta de producto
│   │   ├── todos/
│   │   │   └── TodoItem.tsx          # Item de todo
│   │   └── WidgetItem.tsx            # Componente de widget
│   ├── shopping-cart/
│   │   ├── actions/
│   │   │   └── actions.ts            # CRUD del carrito
│   │   └── components/
│   │       └── ItemCard.tsx          # Item del carrito
│   ├── data/
│   │   └── products.ts               # Datos de productos
│   └── lib/
│       └── prisma.ts                 # Cliente de Prisma
├── prisma/
│   ├── schema.prisma                 # Modelos de la BD
│   └── migrations/                   # Migraciones
├── docker-compose.yml                # Configuración Docker
├── .env                              # Variables de entorno
├── next.config.js                    # Configuración Next.js
├── tailwind.config.ts                # Configuración Tailwind
└── package.json
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-3-dashboard.git
cd proyecto-3-dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dashboard_db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-aleatorio-de-32-caracteres

# GitHub OAuth
GITHUB_ID=tu-github-client-id
GITHUB_SECRET=tu-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-google-client-secret
```

### 4. Levantar PostgreSQL con Docker

```bash
docker-compose up -d
```

### 5. Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev
```

### 6. (Opcional) Seed de la base de datos

```bash
# Opción 1: Desde el navegador
# Visita: http://localhost:3000/api/seed

# Opción 2: Con Prisma
npx prisma db seed
```

### 7. Ejecutar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔐 Obtener Credenciales OAuth

### GitHub OAuth

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click en **"OAuth Apps"** → **"New OAuth App"**
3. Completa:
   - **Application name**: `Dashboard Next.js`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copia **Client ID** y **Client Secret** al `.env`

### Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita **Google+ API**
4. Ve a **"Credentials"** → **"Create Credentials"** → **"OAuth client ID"**
5. Configura:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copia **Client ID** y **Client Secret** al `.env`

---

## 📊 Modelos de Base de Datos

### User

```prisma
model User {
  id            String    @id @default(uuid())
  name          String?
  email         String    @unique
  password      String?
  roles         String[]  @default(["user"])
  isActive      Boolean   @default(true)
  accounts      Account[]
  sessions      Session[]
  todos         Todo[]
}
```

### Todo

```prisma
model Todo {
  id          String   @id @default(uuid())
  description String
  complete    Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

### Account (OAuth)

```prisma
model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  access_token      String?
  refresh_token     String?
  user              User @relation(fields: [userId], references: [id])
  
  @@id([provider, providerAccountId])
}
```

---

## 🎨 Características Principales

### 1. **Autenticación Multifacética**

- ✅ Login con Google
- ✅ Login con GitHub
- ✅ Login con Email/Password
- ✅ Auto-registro en primer login
- ✅ Protección de rutas con middleware

### 2. **Gestión de Todos**

- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Paginación
- ✅ Filtros por estado (completado/pendiente)
- ✅ Actualización optimista del UI

### 3. **Carrito de Compras**

- ✅ Persistencia con cookies
- ✅ Agregar/eliminar productos
- ✅ Incrementar/decrementar cantidades
- ✅ Cálculo de totales e impuestos
- ✅ Funciona sin autenticación

### 4. **Dashboard Administrativo**

- ✅ Widgets de estadísticas
- ✅ Navegación protegida
- ✅ Sesión persistente
- ✅ Control de roles (user/admin)

---

## 🔒 Seguridad Implementada

### Contraseñas

```typescript
// ✅ Hasheadas con bcrypt
const hashedPassword = bcrypt.hashSync(password, 10);

// ✅ Comparación segura
const isValid = bcrypt.compareSync(inputPassword, hashedPassword);
```

### Sesiones

```typescript
// ✅ JWT en HTTP-only cookies
session: {
  strategy: "jwt"
}

// ✅ Validación en cada request
const user = await getUserSessionServer();
if (!user) redirect('/login');
```

### Validación

```typescript
// ✅ Server-side validation
if (dbUser?.isActive === false) {
  throw Error("Usuario no está activo");
}

// ✅ Client-side validation
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required()
});
```

---

## 🧪 Testing

### Endpoints de la API

**GET /api/todos**

```bash
curl http://localhost:3000/api/todos
```

**POST /api/todos**

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"description":"Nueva tarea"}'
```

**PATCH /api/todos/[id]**

```bash
curl -X PATCH http://localhost:3000/api/todos/123 \
  -H "Content-Type: application/json" \
  -d '{"complete":true}'
```

**DELETE /api/todos/[id]**

```bash
curl -X DELETE http://localhost:3000/api/todos/123
```

---

## 📝 Scripts Disponibles

```json
{
  "dev": "next dev",                    // Modo desarrollo
  "build": "next build",                // Build de producción
  "start": "next start",                // Servidor de producción
  "lint": "next lint",                  // Linter
  "prisma:generate": "prisma generate", // Generar cliente Prisma
  "prisma:migrate": "prisma migrate dev", // Ejecutar migraciones
  "prisma:studio": "prisma studio"      // GUI de Prisma
}
```

---

## 🐳 Docker

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: dashboard_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Comandos útiles

```bash
# Levantar contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener contenedor
docker-compose down

# Eliminar datos (resetear BD)
docker-compose down -v
```

---

## 🚀 Deployment

### Vercel (Recomendado para Next.js)

1. **Push a GitHub**

```bash
git push origin main
```

1. **Conectar a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio
   - Configura variables de entorno

2. **Variables de entorno en Vercel**

```
DATABASE_URL=tu-postgres-url-de-produccion
NEXTAUTH_URL=https://tu-app.vercel.app
NEXTAUTH_SECRET=nuevo-secret-para-produccion
GITHUB_ID=tu-github-id
GITHUB_SECRET=tu-github-secret
GOOGLE_CLIENT_ID=tu-google-id
GOOGLE_CLIENT_SECRET=tu-google-secret
```

1. **Actualizar callbacks OAuth**
   - GitHub: `https://tu-app.vercel.app/api/auth/callback/github`
   - Google: `https://tu-app.vercel.app/api/auth/callback/google`

---

## 📚 Recursos y Documentación

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Auth.js

- [Auth.js Documentation](https://authjs.dev/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Providers](https://authjs.dev/reference/core/providers)

### Prisma

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Otros

- [Tailwind CSS](https://tailwindcss.com/docs)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- [Yup Validation](https://github.com/jquense/yup)

---

## 🤝 Contribuciones

Este es un proyecto educativo del curso de **Fernando Herrera**.

Si encuentras bugs o mejoras:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

**BRANDON RAMIREZ**

- Curso: Next.js de Fernando Herrera
- GitHub: [@BrandoonRH](https://github.com/tu-usuario)
- LinkedIn: [BrandRH](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- **Fernando Herrera** - Instructor del curso
- **Vercel** - Por Next.js y hosting
- **Prisma** - Por el increíble ORM
- **Auth.js Team** - Por simplificar la autenticación

---

## 📈 Próximos Pasos

- [ ] Implementar roles y permisos granulares
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar rate limiting
- [ ] Agregar logs y monitoreo
- [ ] Implementar notificaciones por email
- [ ] Agregar verificación de email en dos pasos
- [ ] Implementar WebAuthn/Passkeys
- [ ] Agregar modo offline con Service Workers

---

**¡Feliz Coding! 🚀**
