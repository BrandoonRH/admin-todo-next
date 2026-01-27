import { WidgetItemDos } from "@/src/components/WidgetItemDos";
import { Product, products } from "@/src/data/products";
import { ItemCard } from "@/src/shopping-cart/components/ItemCard";
import { cookies } from "next/headers";

// Metadata para SEO (aparece en la pestaña del navegador y buscadores)
export const metadata = {
    title: 'Carrito de compras',
    description: 'SEO Title',
};

// Interfaz que combina el producto completo con su cantidad en el carrito
interface ProductInCart {
    product: Product;
    quantity: number;
}

/**
 * Convierte el objeto del carrito en un array de productos con sus cantidades.
 * 
 * @param cart - Objeto con IDs como keys y cantidades como values
 * @returns Array de productos completos con sus cantidades
 */
const getProductsInCart = (cart: { [id: string]: number }): ProductInCart[] => {
    const productsInCart: ProductInCart[] = [];

    // Recorre cada ID del carrito
    for (const id of Object.keys(cart)) {
        // Busca el producto completo en el array de productos
        const product = products.find(prod => prod.id === id);
        
        if (product) {
            // Agrega el producto con su cantidad al array resultado
            productsInCart.push({ product: product, quantity: cart[id] })
        }
    }

    return productsInCart;
}

export default function CartPage() {
    // Obtiene las cookies del servidor (Server Component)
    const cookiesStore = cookies();
    
    // Lee y parsea la cookie 'cart', si no existe usa un objeto vacío
    const cart = JSON.parse(cookiesStore.get('cart')?.value ?? '{}') as { [id: string]: number };
    
    // Convierte los IDs del carrito en productos completos
    const productsInCart = getProductsInCart(cart);

    // Calcula el total sumando (precio × cantidad) de cada producto
    // reduce va acumulando el total: empieza en 0 y suma cada subtotal
    const totalToPay = productsInCart.reduce(
        (prev, current) => (current.product.price * current.quantity) + prev, 0);

    return (
        <div>
            <h1 className="text-5xl">Productos en el carrito</h1>
            <hr className="mb-2" />

            {/* Layout responsive: columna en móvil, fila en pantallas sm+ */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">

                {/* Columna izquierda: Lista de productos (8/12 del ancho) */}
                <div className="flex flex-col gap-2 w-full sm:w-8/12">
                    {
                        // Renderiza una tarjeta por cada producto en el carrito
                        productsInCart.map(({ product, quantity }) => (
                            <ItemCard key={product.id} product={product} quantity={quantity} />
                        ))
                    }
                </div>

                {/* Columna derecha: Resumen de pago (4/12 del ancho) */}
                <div className="flex flex-col w-full sm:w-4/12">
                    <WidgetItemDos title="Total a pagar">
                        <div className="mt-2 flex justify-center gap-4">
                            {/* Total con impuestos (15%) incluidos */}
                            <h3 className="text-3xl font-bold text-gray-700">
                                ${(totalToPay * 1.15).toFixed(2)}
                            </h3>
                        </div>
                        {/* Muestra cuánto corresponde solo a impuestos */}
                        <span className="font-bold text-center text-gray-500">
                            Impuestos 15%: ${(totalToPay * 0.15).toFixed(2)}
                        </span>
                    </WidgetItemDos>
                </div>
            </div>
        </div>
    );
}