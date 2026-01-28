/**
 * 🎬 AUTH ACTIONS - FUNCIONES DE AUTENTICACIÓN DEL SERVIDOR
 * 
 * Este archivo contiene Server Actions relacionadas con autenticación.
 * Todas estas funciones se ejecutan SOLO en el servidor, nunca en el cliente.
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 🎯 RESUMEN DE FUNCIONES                                                 │
 * ├─────────────────────────────────────────────────────────────────────────┤
 * │                                                                         │
 * │ getUserSessionServer()                                                  │
 * │ ├─ Propósito: Obtiene el usuario autenticado actual                    │
 * │ └─ Uso: Server Components, Server Actions, API Routes                  │
 * │                                                                         │
 * │ signInEmailPassword()                                                   │
 * │ ├─ Propósito: Valida credenciales (email/password)                     │
 * │ └─ Uso: Llamada automáticamente por NextAuth                           │
 * │         (NO la llames directamente desde tu código)                    │
 * │                                                                         │
 * │ createUser()                                                            │
 * │ ├─ Propósito: Crea nuevos usuarios en la BD                            │
 * │ └─ Uso: Auto-registro cuando alguien hace login por primera vez        │
 * │                                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * 🔐 PUNTO CLAVE:
 * Estas funciones trabajan en conjunto con NextAuth para proporcionar
 * autenticación segura basada en credenciales personalizadas.
 * 
 * 🔒 SEGURIDAD:
 * - Las contraseñas SIEMPRE se hashean con bcrypt antes de guardar
 * - Nunca se almacenan contraseñas en texto plano
 * - La comparación de passwords es resistente a timing attacks
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * 👤 OBTENER USUARIO DE LA SESIÓN ACTUAL
 * 
 * Esta función obtiene el usuario autenticado desde el servidor.
 * Útil en Server Components, Server Actions y API Routes.
 * 
 * @returns Usuario de la sesión o undefined si no hay sesión
 * 
 * Ejemplo de uso:
 * ```typescript
 * // En un Server Component
 * const user = await getUserSessionServer();
 * if (!user) redirect('/login');
 * ```
 */
export const getUserSessionServer = async () => {
  // getServerSession obtiene la sesión actual usando las authOptions
  // Esto verifica el JWT y retorna los datos de sesión
  const session = await getServerSession(authOptions);

  // Retorna solo el objeto user (contiene: id, email, name, roles, etc.)
  return session?.user;
};

/**
 * 🔐 AUTENTICACIÓN CON EMAIL Y CONTRASEÑA
 * 
 * Esta función se llama desde el CredentialsProvider en la configuración de NextAuth.
 * Maneja dos escenarios:
 * 1. Si el usuario existe: valida la contraseña
 * 2. Si el usuario NO existe: lo crea automáticamente (auto-registro)
 * 
 * ⚠️ IMPORTANTE: Esta función es llamada automáticamente por NextAuth.
 *    NO la llames directamente desde tu código.
 * 
 * @param email - Email del usuario
 * @param password - Contraseña en texto plano (será comparada con el hash)
 * @returns Usuario si las credenciales son válidas, null si son incorrectas
 */
export const signInEmailPassword = async (email: string, password: string) => {
  // Validación básica: ambos campos son requeridos
  if (!email || !password) return null;

  // Busca si el usuario ya existe en la base de datos
  const user = await prisma.user.findUnique({ where: { email } });

  // 🆕 ESCENARIO 1: Usuario NO existe → Auto-registro
  if (!user) {
    // Crea automáticamente un nuevo usuario
    // Esto permite registro + login en un solo paso
    const dbUser = await createUser(email, password);
    return dbUser;
  }

  // ✅ ESCENARIO 2: Usuario existe → Validar contraseña
  // bcrypt.compareSync compara la contraseña en texto plano con el hash guardado
  // Retorna true si coinciden, false si no
  if (!bcrypt.compareSync(password, user.password ?? "")) {
    // Contraseña incorrecta → login fallido
    return null;
  }

  // Contraseña correcta → retorna el usuario
  return user;
};

/**
 * 🆕 CREAR NUEVO USUARIO
 * 
 * Función privada que crea un usuario en la base de datos.
 * Se llama automáticamente cuando alguien intenta hacer login
 * con un email que no existe (auto-registro).
 * 
 * 🔒 SEGURIDAD:
 * - La contraseña se hashea con bcrypt antes de guardar
 * - Se usa un salt aleatorio (generado automáticamente por bcrypt)
 * - El hash resultante es unidireccional (no se puede revertir)
 * 
 * @param email - Email del nuevo usuario
 * @param password - Contraseña en texto plano (será hasheada)
 * @returns Usuario recién creado
 */
const createUser = async (email: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      // 🔒 bcrypt.hashSync encripta la contraseña antes de guardarla
      // El número 10 (por defecto) indica las "rounds" de hashing
      // Más rounds = más seguro pero más lento
      password: bcrypt.hashSync(password),
      // Genera un nombre usando la parte antes del @ del email
      // Ejemplo: "juan@gmail.com" → nombre: "juan"
      name: email.split("@")[0],
    },
  });

  return user;
};

/*
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 📊 FLUJO DE AUTENTICACIÓN                                               │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 *  1. Usuario envía email/password desde el formulario de login
 *     ↓
 *  2. NextAuth llama automáticamente a signInEmailPassword()
 *     ↓
 *  3. Se busca el usuario en la BD por email
 *     ↓
 *  4. ¿Usuario existe?
 *     ├─ NO  → createUser() → Hashea password → Guarda en BD → Login exitoso
 *     └─ SÍ  → bcrypt.compareSync() → ¿Password correcta?
 *                                      ├─ SÍ → Login exitoso
 *                                      └─ NO → Login fallido (return null)
 *     ↓
 *  5. Si login exitoso: NextAuth crea JWT y establece cookie de sesión
 *     ↓
 *  6. Usuario autenticado ✅
 * 
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ 🔐 NOTAS DE SEGURIDAD CON BCRYPT                                        │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 *  Ejemplo de hash:
 *  Password original: "MiPassword123"
 *  Hash guardado:     "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
 * 
 *  Características:
 *  - 🔒 Unidireccional: No se puede obtener la password original del hash
 *  - 🎲 Salt aleatorio: Mismo password genera diferentes hashes
 *  - 🐌 Lento a propósito: Dificulta ataques de fuerza bruta
 *  - ⚙️ Configurable: Rounds (10 por defecto) controla la dificultad
 */