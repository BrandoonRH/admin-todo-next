// Definimos la estructura que debe tener cada producto
export interface Product {
  id    : string;  // Identificador único
  name  : string;  // Nombre del producto
  price : number;  // Precio en dólares
  rating: number;  // Calificación (1-5 estrellas)
  image : string;  // Ruta de la imagen
}

// Array con los datos de ejemplo de los productos disponibles
// En una app real, esto vendría de una base de datos
export const products: Product[] = [
  {
    id: 'UUID-ABC-1',
    name: 'Teslo Hoodie',
    price: 15,
    rating: 5,
    image: '/images/products/1623735-00-A_0_2000.jpg',
  },
  {
    id: 'UUID-ABC-2',
    name: 'Teslo Cap',
    price: 25,
    rating: 3,
    image: '/images/products/1657916-00-A_1.jpg',
  },
  {
    id: 'UUID-ABC-3',
    name: 'Let the sunshine',
    price: 36,
    rating: 2,
    image: '/images/products/1700280-00-A_1.jpg',
  },
  {
    id: 'UUID-ABC-4',
    name: 'Cybertruck Hoodie',
    price: 45,
    rating: 5,
    image: '/images/products/1742702-00-A_0_2000.jpg',
  },
]