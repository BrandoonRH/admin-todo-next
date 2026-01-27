/**
 * 🛒 ACCIONES DEL CARRITO DE COMPRAS
 * 
 * Estas funciones manejan el estado del carrito usando cookies del navegador.
 * Estructura del carrito: { 'producto-id': cantidad, ... }
 * Ejemplo: { 'UUID-ABC-1': 2, 'UUID-ABC-2': 1 }
 */

import { getCookie, hasCookie, setCookie } from "cookies-next";

/**
 * Obtiene el carrito actual desde las cookies.
 * 
 * @returns Objeto con productos y cantidades. Ej: { 'UUID-1': 2, 'UUID-2': 1 }
 */
export const getCookieCart = (): { [id: string]: number } => {
  // Verifica si existe la cookie 'cart'
  if (hasCookie('cart')) {
    // Las cookies guardan solo texto, por eso parseamos el JSON
    const cookieCart = JSON.parse(getCookie('cart') as string ?? '{}');
    return cookieCart;
  }
  // Si no hay cookie, retorna un objeto vacío
  return {};
}

/**
 * Agrega un producto al carrito o incrementa su cantidad en 1.
 * 
 * @param id - Identificador único del producto
 */
export const addProductToCart = (id: string) => {
  const cookieCart = getCookieCart();

  // Si el producto ya existe, incrementa su cantidad
  if (cookieCart[id]) {
    cookieCart[id] += 1;
  } else {
    // Si es nuevo, lo inicializa con cantidad 1
    cookieCart[id] = 1;
  }

  // Guarda el carrito actualizado (convertido a texto con JSON.stringify)
  setCookie('cart', JSON.stringify(cookieCart));
}

/**
 * Elimina completamente un producto del carrito.
 * No importa la cantidad que tenga, lo borra por completo.
 * 
 * @param id - Identificador del producto a eliminar
 */
export const removeProductFromCart = (id: string) => {
  const cookieCart = getCookieCart();
  
  // Elimina la propiedad del objeto
  delete cookieCart[id];
  
  // Actualiza la cookie
  setCookie('cart', JSON.stringify(cookieCart));
}

/**
 * Reduce la cantidad de un producto en 1.
 * Si la cantidad llega a 0, elimina el producto del carrito.
 * 
 * @param id - Identificador del producto
 */
export const removeSingleItemFromCart = (id: string) => {
  const cookieCart = getCookieCart();
  
  // Si el producto no existe en el carrito, no hace nada
  if (!cookieCart[id]) return;

  // Calcula la nueva cantidad
  const itemsInCart = cookieCart[id] - 1;

  // Si llega a 0 o menos, elimina el producto
  if (itemsInCart <= 0) {
    delete cookieCart[id];
  } else {
    // Si aún quedan items, actualiza la cantidad
    cookieCart[id] = itemsInCart;
  }

  // Guarda los cambios
  setCookie('cart', JSON.stringify(cookieCart));
}