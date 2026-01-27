'use client'; // Marca este componente como Client Component (necesario para hooks y eventos)

import Image from "next/image"
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import { Star } from "./Star";
import { useRouter } from "next/navigation";
// Importamos las funciones que manejan las cookies del carrito
import { addProductToCart, removeProductFromCart } from "@/src/shopping-cart/actions/actions";

// Definimos las propiedades que espera recibir este componente
interface Props {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}

export const ProductCard = ({ id, name, price, rating, image }: Props) => {

  // Hook de Next.js para refrescar la página y mostrar cambios
  const router = useRouter();

  // Agrega el producto al carrito y refresca para ver el cambio
  const onAddToCart = () => {
    addProductToCart(id);
    router.refresh(); // Refresca los Server Components para mostrar el carrito actualizado
  }

  // Elimina completamente el producto del carrito
  const onRemoveFromCart = () => {
    removeProductFromCart(id);
    router.refresh();
  }

  return (
    <div className="shadow rounded-lg max-w-sm bg-gray-800 border-gray-100">
      
      {/* Imagen del producto usando el componente optimizado de Next.js */}
      <div className="p-2">
        <Image
          width={500}
          height={500}
          className="rounded"
          src={image}
          alt="product image" 
        />
      </div>

      <div className="px-5 pb-5">
        {/* Nombre del producto */}
        <a href="#">
          <h3 className="font-semibold text-xl tracking-tight text-white">
            {name}
          </h3>
        </a>

        <div className="flex items-center mt-2.5 mb-5">
          {/* Genera N estrellas según el rating del producto */}
          {
            // Array(5) crea un array de 5 posiciones, fill(0) lo rellena con ceros
            // map recorre cada elemento para renderizar una estrella por cada uno
            Array(rating).fill(0).map((x, i) => (
              <Star key={i} />
            ))
          }

          {/* Badge con el número de rating */}
          <span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-blue-200 text-blue-800 ml-3">
            {rating.toFixed(2)}
          </span>
        </div>

        {/* Precio y botones de acción */}
        <div className="flex items-center justify-between">
          <span className="text-xl text-white font-bold">${price.toFixed(2)}</span>

          <div className="flex">
            {/* Botón para agregar al carrito */}
            <button
              onClick={onAddToCart}
              className="text-white mr-2 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
              <IoAddCircleOutline size={25} />
            </button>

            {/* Botón para eliminar del carrito */}
            <button
              onClick={onRemoveFromCart}
              className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 hover:bg-red-700 focus:ring-red-800">
              <IoTrashOutline size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}