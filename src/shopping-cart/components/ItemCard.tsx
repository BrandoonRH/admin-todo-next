'use client'; // Client Component para manejar eventos y router

import Image from "next/image";
import { IoAddCircleOutline, IoRemove } from "react-icons/io5";
import { addProductToCart, removeSingleItemFromCart } from "../actions/actions";
import { useRouter } from "next/navigation";
import type { Product } from "@/src/data/products";

interface Props {
  product: Product;   // Información completa del producto
  quantity: number;   // Cantidad actual en el carrito
}

export const ItemCard = ({ product, quantity }: Props) => {
  
  const router = useRouter();

  // Incrementa la cantidad del producto en 1
  function onAddToCart() {
    addProductToCart(product.id);
    router.refresh(); // Refresca para ver el cambio
  }

  // Reduce la cantidad en 1 (o elimina si llega a 0)
  function onRemoveItem() {
    removeSingleItemFromCart(product.id);
    router.refresh();
  }

  return (
    <div className="flex items-center shadow rounded-lg w-full bg-gray-800 border-gray-100">
      
      {/* Imagen del producto */}
      <div className="p-2">
        <Image
            width={200}
            height={200}
            className="rounded" 
            src={product.image}
            alt={product.name} 
        />
      </div>
      
      {/* Información del producto */}
      <div className="px-5 pb-5 w-full flex flex-col mt-2">
        <a href="#">
          <h3 className="font-semibold text-xl tracking-tight text-white">
            {/* Nombre y precio unitario */}
            {product.name} - <small className="text-sm">${product.price.toFixed(2)}</small>
          </h3>
        </a>      

        <div className="flex flex-col items-start justify-between">
          {/* Cantidad de items de este producto */}
          <span className="text-gray-900 dark:text-white">
            Cantidad: {quantity}
          </span>
          
          {/* Subtotal: precio × cantidad */}
          <span className="font-bold text-white">
            Total: ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Controles para modificar cantidad */}
      <div className="flex p-5 items-center justify-center">
        {/* Botón para agregar más unidades */}
        <button
          onClick={onAddToCart}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <IoAddCircleOutline size={25} />
        </button>
        
        {/* Muestra la cantidad actual */}
        <span className="text-2xl text-white mx-10">{quantity}</span>
        
        {/* Botón para reducir unidades */}
        <button
          onClick={onRemoveItem}
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
            <IoRemove size={25} />
        </button>
      </div>
    </div>
  )
}