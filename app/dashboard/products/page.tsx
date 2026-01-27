// Importamos el componente que muestra cada producto individual
import { ProductCard } from "@/src/components/products/ProductCard";
// Importamos el array con los datos de los productos
import { products } from "@/src/data/products";

export default function ProductsPage() {
  return (
    // Grid responsivo: 1 columna en móvil, 3 en pantallas pequeñas y superiores
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {
        // Recorremos el array de productos y creamos una tarjeta por cada uno
        products.map((product) => (
          // El "key" es obligatorio en listas para que React identifique cada elemento
          // El spread operator {...product} pasa todas las propiedades como props individuales
          <ProductCard key={product.id} {...product} />
        ))
      }
    </div>
  );
}