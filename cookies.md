# 🍪 Manejo de Cookies en Next.js

Las cookies son pequeños fragmentos de texto que el sitio web almacena en el navegador del usuario. Su función principal es la **persistencia**: permitir que los datos sobrevivan a recargas de página o cierres de navegador.

## 🏢 Cookies del Lado del Servidor (Server-Side)

En Next.js, estas se gestionan principalmente en los **Server Components** y **Server Actions**.

* **Cómo funcionan:** Se envían en las cabeceras (headers) de las peticiones HTTP.
* **Seguridad:** Son más seguras porque puedes marcarlas como `httpOnly`, lo que impide que código malicioso de JavaScript (XSS) las lea en el navegador.
* **Uso en Next.js:** Se utiliza la función `cookies()` de `next/headers` para leerlas o modificarlas directamente en el servidor.
* **Ideal para:** Autenticación, tokens de sesión y configuraciones que afectan el renderizado inicial de la página.

## 💻 Cookies del Lado del Cliente (Client-Side)

Estas se gestionan directamente en el navegador mediante JavaScript dentro de tus **Client Components**.

* **Cómo funcionan:** Se accede a ellas mediante `document.cookie` o librerías como `cookies-next`.
* **Interactividad:** Son útiles cuando necesitas actualizar algo en la interfaz inmediatamente sin esperar una respuesta del servidor.
* **Uso en Next.js:** Se suelen usar para temas visuales o datos que no son sensibles.
* **Ideal para:** Preferencias de modo oscuro/claro, banners de consentimiento o estados temporales de la UI.

## 🛒 El Carrito de Compras con Cookies

¿Por qué usar cookies para un carrito y no una base de datos?

1. **Velocidad:** Leer una cookie es casi instantáneo; no hay que esperar a que Prisma consulte a Postgres.
2. **Usuarios Anónimos:** Puedes permitir que alguien agregue productos al carrito sin estar logueado. Si cierran el navegador y vuelven mañana, el carrito sigue ahí gracias a la cookie.
3. **Sincronización:** Next.js permite que el servidor lea la cookie del carrito y renderice el total exacto de productos antes de que la página llegue al cliente.

## ⚠️ Puntos Importantes a Considerar

| Característica | Cookies | LocalStorage |
| --- | --- | --- |
| **Acceso Servidor** | ✅ Sí (via Headers) | ❌ No |
| **Capacidad** | 📉 Limitada (~4KB) | 📈 Mayor (~5MB) |
| **Seguridad** | 🛡️ Alta (con httpOnly) | ⚠️ Baja (accesible vía JS) |
