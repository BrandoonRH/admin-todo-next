/**
 * 🔐 CONFIGURACIÓN DE NEXTAUTH.JS - ARCHIVO PRINCIPAL DE AUTENTICACIÓN
 * 
 * Este archivo es el corazón de la autenticación en la aplicación.
 * NextAuth requiere que esté en la ruta: /app/api/auth/[...nextauth]/route.tsx
 * El [...nextauth] es una ruta dinámica catch-all que maneja todos los endpoints de auth.
 */

import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/src/lib/prisma";
import { signInEmailPassword } from "@/src/auth/actions/auth-actions";

/**
 * Objeto de configuración principal de NextAuth
 * Aquí definimos proveedores, callbacks, sesiones y más
 */
export const authOptions: NextAuthOptions = {
  
  // 🗄️ ADAPTADOR DE BASE DE DATOS
  // Conecta NextAuth con Prisma para persistir usuarios, cuentas, sesiones y tokens
  // Esto permite que los usuarios de OAuth se guarden automáticamente en la BD
  adapter: PrismaAdapter(prisma),
  
  // 🔌 PROVEEDORES DE AUTENTICACIÓN
  // Define los métodos de login disponibles (OAuth y credenciales)
  providers: [
    
    // Provider 1: GitHub OAuth
    // Permite login con cuenta de GitHub
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    
    // Provider 2: Google OAuth
    // Permite login con cuenta de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    
    // Provider 3: Credenciales personalizadas (email/password)
    // Login tradicional con formulario
    CredentialsProvider({
      name: "Credentials",
      
      // Define los campos del formulario de login
      credentials: {
        email: {
          label: "Correo electrónico",
          type: "email",
          placeholder: "usuario@google.com",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "******",
        },
      },
      
      /**
       * Función que se ejecuta cuando el usuario intenta hacer login con credenciales
       * @param credentials - Email y password enviados desde el formulario
       * @returns Usuario si las credenciales son válidas, null si no
       */
      async authorize(credentials, req) {
        // Llama a nuestra función personalizada que valida email/password
        // Esta función está en auth-actions.ts y verifica contra la BD
        const user = await signInEmailPassword(
          credentials!.email,
          credentials!.password,
        );

        if (user) {
          // Si el usuario es válido, se guarda en el JWT
          return user;
        }

        // Si las credenciales son incorrectas, retorna null (login fallido)
        return null;
      },
    }),
  ],
  
  // 📝 ESTRATEGIA DE SESIÓN
  // "jwt" = la sesión se guarda en un token JWT (no en base de datos)
  // Ventaja: más rápido, no requiere consultas a BD en cada request
  session: {
    strategy: "jwt",
  },
  
  // 🎯 CALLBACKS - PERSONALIZACIÓN DEL FLUJO DE AUTENTICACIÓN
  callbacks: {
    
    /**
     * signIn callback
     * Se ejecuta JUSTO DESPUÉS de que el usuario se autentica exitosamente
     * Permite permitir/denegar el acceso basado en reglas personalizadas
     */
    async signIn({ user, account }) {
      // Aquí podrías agregar lógica como:
      // - Verificar si el email está en una whitelist
      // - Validar el dominio del email (@empresa.com)
      // - Revisar si el usuario está baneado
      
      return true; // Permite el login
      // return false; // Esto denegaría el acceso
    },
    
    /**
     * jwt callback
     * Se ejecuta cada vez que se crea o actualiza un JWT
     * Aquí agregamos información adicional al token (roles, id, etc.)
     */
    async jwt({ token }) {
      // Busca el usuario en la base de datos usando el email del token
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email ?? "no-email" },
      });
      
      // Validación: si el usuario está inactivo, lanza error y niega acceso
      if (dbUser?.isActive === false) {
        throw Error("Usuario no está activo");
      }

      // Agrega campos personalizados al token JWT
      // Estos datos estarán disponibles en toda la app
      token.roles = dbUser?.roles ?? ["no-roles"];
      token.id = dbUser?.id ?? "no-uuid";

      return token;
    },
    
    /**
     * session callback
     * Se ejecuta cuando se obtiene la sesión (getServerSession, useSession)
     * Aquí pasamos datos del token a la sesión para que sean accesibles
     */
    async session({ session, token, user }) {
      if (session && session.user) {
        // Agrega los datos personalizados del token a la sesión
        // Ahora session.user.roles y session.user.id están disponibles
        session.user.roles = token.roles;
        session.user.id = token.id;
      }

      return session;
    },
  },
};

// 🚀 EXPORTA EL HANDLER PARA GET Y POST
// NextAuth maneja automáticamente todas las rutas de autenticación:
// - /api/auth/signin
// - /api/auth/signout
// - /api/auth/callback/[provider]
// - /api/auth/session
// etc.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/* 
!🔑 Variables de entorno - ¿Dónde obtenerlas?
📌 GITHUB_ID y GITHUB_SECRET
Paso 1: Ve a GitHub Developer Settings
Paso 2: Click en "OAuth Apps" → "New OAuth App"
Paso 3: Completa el formulario:

Application name: Mi App Next.js
Homepage URL: http://localhost:3000 (desarrollo) o https://tudominio.com (producción)
Authorization callback URL: http://localhost:3000/api/auth/callback/github

Paso 4: Después de crear la app:

Client ID → copia a GITHUB_ID
Click en "Generate a new client secret" → copia a GITHUB_SECRET
GITHUB_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_SECRET=1234567890abcdef1234567890abcdef12345678
 */


/* 
!📌 GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET
Paso 1: Ve a Google Cloud Console
Paso 2: Crea un nuevo proyecto o selecciona uno existente
Paso 3: Habilita la Google+ API:

Menú lateral → "APIs & Services" → "Library"
Busca "Google+ API" → Enable

Paso 4: Crea credenciales OAuth:

"APIs & Services" → "Credentials"
Click "Create Credentials" → "OAuth client ID"
Application type: Web application

Paso 5: Configura URLs autorizadas:

Authorized JavaScript origins: http://localhost:3000
Authorized redirect URIs: http://localhost:3000/api/auth/callback/google

Paso 6: Obtén las credenciales:

Client ID → copia a GOOGLE_CLIENT_ID
Client secret → copia a GOOGLE_CLIENT_SECRET

GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcd1234efgh5678ijkl
*/

/* 📌 NEXTAUTH_SECRET
Esta es una clave secreta para firmar los tokens JWT. Debe ser única y aleatoria.
Generar en terminal: 

# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: NextAuth CLI
npx auth secret
NEXTAUTH_SECRET=tu-string-super-secreto-y-aleatorio-de-32-caracteres
*/

/* 
*⚠️ IMPORTANTE:
Nunca compartas este secreto
Nunca lo subas a GitHub
Usa uno diferente para desarrollo y producción */