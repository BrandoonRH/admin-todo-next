# 🍪 Cookies en Aplicaciones Web

## ¿Qué son las Cookies?

Las **cookies** son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario. Contienen información que el servidor puede leer en cada petición HTTP.

### Características principales

- **Tamaño máximo**: ~4KB por cookie
- **Persistencia**: Pueden tener fecha de expiración o ser de sesión
- **Acceso**: Disponibles tanto en cliente como en servidor
- **Envío automático**: Se incluyen en cada petición HTTP al dominio que las creó

---

## 📋 Usos Comunes de las Cookies

### 1. **Autenticación y Sesiones**

```typescript
// Guardar token de sesión
setCookie('auth_token', 'abc123xyz', {
  maxAge: 60 * 60 * 24 * 7, // 7 días
  httpOnly: true,           // No accesible desde JavaScript
  secure: true,             // Solo HTTPS
  sameSite: 'strict'        // Protección CSRF
});
```

### 2. **Preferencias del Usuario**

- Idioma seleccionado
- Tema (claro/oscuro)
- Configuración de privacidad

### 3. **Carrito de Compras**

```typescript
// Guardar estado del carrito
const cart = { 'product-1': 2, 'product-2': 1 };
setCookie('cart', JSON.stringify(cart));
```

### 4. **Análisis y Tracking**

- Google Analytics
- Cookies de terceros (publicidad)
- Métricas de uso

---

## ⚙️ Configuración de Cookies

### Opciones importantes

| Opción | Descripción | Ejemplo |
|--------|-------------|---------|
| `maxAge` | Tiempo de vida en segundos | `maxAge: 3600` (1 hora) |
| `expires` | Fecha exacta de expiración | `expires: new Date('2026-12-31')` |
| `path` | Ruta donde aplica la cookie | `path: '/'` (todo el sitio) |
| `domain` | Dominio que puede acceder | `domain: '.ejemplo.com'` |
| `secure` | Solo funciona en HTTPS | `secure: true` |
| `httpOnly` | No accesible desde JS | `httpOnly: true` ⚠️ |
| `sameSite` | Protección contra CSRF | `sameSite: 'strict'` |

### Ejemplo completo

```typescript
setCookie('user_preferences', JSON.stringify(preferences), {
  maxAge: 60 * 60 * 24 * 365, // 1 año
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
});
```

---

## 🔒 Consideraciones de Seguridad

### ✅ Buenas Prácticas

1. **Usa `httpOnly` para datos sensibles**
   - Tokens de autenticación
   - IDs de sesión
   - Información crítica

2. **Siempre usa `secure` en producción**

```typescript
   secure: process.env.NODE_ENV === 'production'
```

1. **Configura `sameSite` apropiadamente**
   - `strict`: Máxima seguridad (no se envía en peticiones cross-site)
   - `lax`: Balance (se envía en navegación top-level)
   - `none`: Requiere `secure: true`

2. **Nunca guardes información sensible sin cifrar**

```typescript
   // ❌ MAL
   setCookie('password', '12345');
   
   // ✅ BIEN
   setCookie('auth_token', hashedToken, { httpOnly: true });
```

### ⚠️ Vulnerabilidades Comunes

- **XSS (Cross-Site Scripting)**: Mitigado con `httpOnly`
- **CSRF (Cross-Site Request Forgery)**: Mitigado con `sameSite`
- **Man-in-the-Middle**: Mitigado con `secure`

---

## 🆚 Cookies vs LocalStorage

| Característica | Cookies | LocalStorage |
|----------------|---------|--------------|
| **Tamaño máximo** | ~4KB | ~5-10MB |
| **Acceso servidor** | ✅ Sí (automático) | ❌ No |
| **Acceso cliente** | ✅ Sí | ✅ Sí |
| **Expiración** | Configurable | Nunca (manual) |
| **Envío automático** | ✅ Cada petición HTTP | ❌ No |
| **Soporte SSR** | ✅ Sí (Next.js) | ❌ No (solo cliente) |
| **Seguridad** | `httpOnly` disponible | Siempre accesible con JS |
| **Rendimiento** | Overhead en cada petición | Sin overhead |

### 🤔 ¿Cuándo usar cada uno?

#### Usa **Cookies** cuando

- ✅ Necesitas acceder al dato en el servidor (SSR)
- ✅ Manejas autenticación/sesiones
- ✅ Necesitas que expiren automáticamente
- ✅ Trabajas con Next.js y Server Components

#### Usa **LocalStorage** cuando

- ✅ Solo necesitas acceso en el cliente
- ✅ Manejas grandes cantidades de datos
- ✅ No requieres envío automático al servidor
- ✅ Guardas preferencias no críticas

### Ejemplo comparativo

```typescript
// COOKIES (Next.js con Server Components)
// ✅ Accesible en servidor y cliente
import { cookies } from 'next/headers';

export default function ServerComponent() {
  const cookiesStore = cookies();
  const cart = cookiesStore.get('cart')?.value;
  // Funciona perfectamente en Server Components
}

// LOCALSTORAGE
// ❌ Solo funciona en Client Components
'use client';

export default function ClientComponent() {
  const cart = localStorage.getItem('cart');
  // Solo disponible en el navegador
}
```

---

## 💡 Consejos y Mejores Prácticas

### 1. **Minimiza el uso de cookies**

- Solo guarda lo esencial
- Reduce el tamaño para mejorar performance
- Elimina cookies innecesarias

### 2. **Usa nombres descriptivos**

```typescript
// ❌ MAL
setCookie('d', data);

// ✅ BIEN
setCookie('user_cart_v2', data);
```

### 3. **Versiona tus cookies**

```typescript
// Si cambias la estructura, usa una nueva versión
setCookie('cart_v2', JSON.stringify(newCartFormat));
```

### 4. **Maneja errores al parsear**

```typescript
const getCookieCart = () => {
  try {
    const cartCookie = getCookie('cart');
    return cartCookie ? JSON.parse(cartCookie) : {};
  } catch (error) {
    console.error('Error parsing cart cookie:', error);
    return {}; // Retorna valor por defecto
  }
}
```

### 5. **Limpia cookies obsoletas**

```typescript
// Al cerrar sesión
deleteCookie('auth_token');
deleteCookie('user_preferences');
```

### 6. **Ten cuidado con datos grandes**

```typescript
// ❌ MAL - Cookie muy grande
setCookie('products', JSON.stringify(allProducts)); // +100KB

// ✅ BIEN - Solo IDs necesarios
setCookie('cart', JSON.stringify({ ids: [1, 2, 3] })); // <1KB
```

---

## 🧪 Testing de Cookies

### En desarrollo

```typescript
// Inspecciona cookies en DevTools
// Application → Cookies → localhost

// O mediante código
document.cookie; // Lista todas las cookies accesibles
```

### Debugging

```typescript
// Helper para ver el contenido
const debugCookie = (name: string) => {
  const value = getCookie(name);
  console.log(`Cookie "${name}":`, value);
  try {
    console.log('Parsed:', JSON.parse(value as string));
  } catch {
    console.log('Not JSON format');
  }
}

debugCookie('cart');
```

---

## 🌐 Cumplimiento Legal (GDPR, CCPA)

### Consentimiento del usuario

```typescript
// Banner de cookies
const handleAcceptCookies = () => {
  setCookie('cookies_accepted', 'true', {
    maxAge: 60 * 60 * 24 * 365 // 1 año
  });
  
  // Ahora puedes activar cookies de tracking
  initializeAnalytics();
}
```

### Categorías de cookies

1. **Estrictamente necesarias**: No requieren consentimiento
   - Autenticación
   - Carrito de compras
   - Preferencias de seguridad

2. **Funcionales**: Requieren consentimiento
   - Idioma
   - Tema
   - Preferencias de UI

3. **Analíticas**: Requieren consentimiento
   - Google Analytics
   - Hotjar
   - Métricas de uso

4. **Publicidad**: Requieren consentimiento
   - Cookies de terceros
   - Retargeting
   - Tracking cross-site

---

## 📚 Recursos Adicionales

- [MDN Web Docs - Cookies](https://developer.mozilla.org/es/docs/Web/HTTP/Cookies)
- [Next.js Cookies Documentation](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [OWASP - Secure Cookie Attribute](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [cookies-next npm package](https://www.npmjs.com/package/cookies-next)

---

## 🎯 Resumen Rápido

| ✅ Hacer | ❌ Evitar |
|---------|-----------|
| Usar `httpOnly` para tokens | Guardar contraseñas en cookies |
| Configurar `sameSite` | Cookies sin expiración definida |
| Usar `secure` en producción | Cookies excesivamente grandes |
| Versionar estructura de datos | Confiar en cookies del cliente sin validación |
| Validar y parsear con try/catch | Olvidar limpiar cookies al logout |

**Recuerda**: Las cookies son poderosas pero requieren responsabilidad. Úsalas con criterio y siempre pensando en la seguridad y privacidad del usuario. 🔐
